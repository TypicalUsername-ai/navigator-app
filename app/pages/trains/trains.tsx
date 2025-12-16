import TrainSearch, { type TrainSearchParams } from "~/components/TrainSearch";
import TrainRouteForm, {
  type RouteSearchFn,
} from "~/components/trainRouteForm";
import TrainMap from "~/components/TrainMap";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import BackButton from "~/components/BackButton";
import {
  fetchPassengers,
  fetchTickets,
  type Passenger,
  type TrainTicket,
} from "~/lib/mock";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3333";

const CITY_COORDS: Record<string, [number, number]> = {
  Warszawa: [52.2297, 21.0122],
  Kraków: [50.0647, 19.945],
  Wrocław: [51.1079, 17.0385],
  Gdańsk: [54.352, 18.6466],
  Poznań: [52.4064, 16.9252],
};

type RailwayStop = {
  OsmID: number;
  Lat: number;
  Lon: number;
  Name: string;
};

export default function TrainsPage({ city, onSearch }: TrainsPageParams) {
  const [query, setQuery] = useState<TrainSearchParams | null>(null);
  const [tickets, setTickets] = useState<TrainTicket[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [stations, setStations] = useState<string[]>([]);
  const [loadingStations, setLoadingStations] = useState(false);
  const [stationsError, setStationsError] = useState<string | null>(null);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    void (async () => {
      const [t, p] = await Promise.all([fetchTickets(), fetchPassengers()]);
      setTickets(t);
      setPassengers(p);
    })();
  }, []);

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

  const { markers, path } = useMemo(() => {
    if (!query) return { markers: [], path: [] };
    const from = CITY_COORDS[query.from] ?? CITY_COORDS.Warszawa;
    const to = CITY_COORDS[query.to] ?? CITY_COORDS.Kraków;

    const steps = 20;
    const latDelta = (to[0] - from[0]) / steps;
    const lngDelta = (to[1] - from[1]) / steps;
    const poly = Array.from({ length: steps + 1 }, (_, i) => [
      from[0] + latDelta * i,
      from[1] + lngDelta * i,
    ]) as [number, number][];

    return {
      markers: [
        { position: from as [number, number], label: `Start: ${query.from}` },
        { position: to as [number, number], label: `Cel: ${query.to}` },
      ],
      path: poly,
    };
  }, [query]);

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

      <div className="w-96">
        <TrainMap
          center={
            (markers[0]?.position as [number, number]) ?? CITY_COORDS.Warszawa
          }
          markers={markers}
          path={path}
        />
      </div>
    </div>
  );
}

export type TrainsPageParams = {
  city: string;
  onSearch: RouteSearchFn;
};
