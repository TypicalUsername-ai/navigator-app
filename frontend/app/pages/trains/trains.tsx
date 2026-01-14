import TrainRouteForm, {
  type RouteSearchFn,
} from "~/components/trainRouteForm";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import BackButton from "~/components/BackButton";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3333";

type RailwayStop = {
  OsmID: number;
  Lat: number;
  Lon: number;
  Name: string;
};

export default function TrainsPage({ city, onSearch }: TrainsPageParams) {
  const [stations, setStations] = useState<string[]>([]);
  const [loadingStations, setLoadingStations] = useState(false);
  const [stationsError, setStationsError] = useState<string | null>(null);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const abort = new AbortController();

    const fetchStations = async () => {
      try {
        setLoadingStations(true);
        setStationsError(null);
        const res = await fetch(`${API_BASE_URL}/city/${encodeURIComponent(city)}/trains/stops`, {
          signal: abort.signal,
        });
        if (!res.ok) {
          throw new Error(`Failed to load stations (${res.status})`);
        }
        const data = await res.json();
        const items: RailwayStop[] = Array.isArray(data?.stops) ? data.stops : [];
        const names = Array.from(
          new Set(
            items.map((s) => s.Name).filter(Boolean)
          )
        );
        setStations(names);
      } catch (err) {
        if (abort.signal.aborted) return;
        setStationsError(err instanceof Error ? err.message : "Failed to load stations");
      } finally {
        if (!abort.signal.aborted) {
          setLoadingStations(false);
        }
      }
    };

    fetchStations();
    return () => abort.abort();
  }, [city]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-start gap-6 p-3 relative">
      <div className="absolute top-3 left-3 z-10 sm:top-4 sm:left-4">
        <BackButton onClick={() => navigate(`/${params.city}`)} />
      </div>
      <h1 className="text-2xl font-bold">Trains</h1>

      {loadingStations && (
        <p className="text-sm text-gray-500">Loading stations...</p>
      )}
      {stationsError && (
        <p className="text-sm text-red-600">{stationsError}</p>
      )}

      <TrainRouteForm city={city} onSearch={onSearch} stations={stations} />
    </div>
  );
}

export type TrainsPageParams = {
  city: string;
  onSearch: RouteSearchFn;
};
