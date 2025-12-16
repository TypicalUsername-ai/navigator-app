import TransportRouteForm, {
  type RouteSearchFn,
} from "~/components/transportRouteForm";
import RoutesQuickAccess from "~/components/routesQuickAccess";
import TicketsQuickAccess from "~/components/ticketsQuickAccess";
import { useNavigate, useParams } from "react-router";
import BackButton from "~/components/BackButton";
import { useEffect, useMemo, useState } from "react";

export default function TransportPlanningPage({
  city,
  recentRoutes,
  onRouteClick,
  onRoutesExpand,
  onSearch,
}: TransportPlanningPageParams) {
  const navigate = useNavigate();
  const params = useParams();
  const [stops, setStops] = useState<TransportStop[]>([]);
  const [stopsError, setStopsError] = useState<string | null>(null);
  const [loadingStops, setLoadingStops] = useState(false);

  const API_BASE_URL =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ??
    "http://localhost:3333";

  useEffect(() => {
    if (!city) return;
    const abort = new AbortController();
    const fetchStops = async () => {
      try {
        setLoadingStops(true);
        setStopsError(null);
        const res = await fetch(
          `${API_BASE_URL}/city/${encodeURIComponent(city)}/transport/stops`,
          { signal: abort.signal },
        );
        if (!res.ok) {
          throw new Error(`Failed to load stops (${res.status})`);
        }
        const data = await res.json();
        const items: TransportStop[] = Array.isArray(data?.stops) ? data.stops : [];
        const deduped = Array.from(
          new Map(
            items.map((stop) => [
              stop.osmID ?? stop.OsmID ?? stop.id ?? `${stop.lat}-${stop.lon}`,
              stop,
            ]),
          ).values(),
        );
        setStops(deduped);
      } catch (err) {
        if (abort.signal.aborted) return;
        setStopsError(err instanceof Error ? err.message : "Failed to load stops");
      } finally {
        if (!abort.signal.aborted) {
          setLoadingStops(false);
        }
      }
    };
    fetchStops();
    return () => abort.abort();
  }, [city]);

  const stopNames = useMemo(
    () =>
      Array.from(
        new Set(
          stops
            .map((s) => s.name ?? s.Name ?? "")
            .filter(Boolean),
        ),
      ),
    [stops],
  );

  return (
    <div className="flex flex-col gap-6 p-3 h-screen w-screen items-center justify-start relative">
      <div className="absolute top-3 left-3 z-10 sm:top-4 sm:left-4">
        <BackButton onClick={() => navigate(`/${params.city}`)} />
      </div>
      <h1 className="text-2xl font-bold">City transport</h1>
      <TransportRouteForm city={city} onSearch={onSearch} stops={stopNames} />
      {loadingStops && (
        <p className="text-sm text-gray-500">Loading stops...</p>
      )}
      {stopsError && (
        <p className="text-sm text-red-600">{stopsError}</p>
      )}
      <RoutesQuickAccess
        routes={recentRoutes}
        onRouteClick={onRouteClick}
        onRoutesExpand={onRoutesExpand}
      />
      <TicketsQuickAccess />
    </div>
  );
}

export type TransportPlanningPageParams = {
  city: string;
  recentRoutes: string[];
  onRouteClick: (route: string) => void;
  onRoutesExpand: () => void;
  onSearch: RouteSearchFn;
};

type TransportStop = {
  OsmID?: number;
  osmID?: number;
  id?: number;
  lat?: number;
  Lon?: number;
  lon?: number;
  Name?: string;
  name?: string;
  tram?: boolean;
  Tram?: boolean;
  bus?: boolean;
  Bus?: boolean;
};
