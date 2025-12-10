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
            .filter(Boolean)
            .slice(0, 20),
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
      <TransportRouteForm city={city} onSearch={onSearch} />
      <RoutesQuickAccess
        routes={recentRoutes}
        onRouteClick={onRouteClick}
        onRoutesExpand={onRoutesExpand}
      />
      <div className="w-full max-w-96">
        <h2 className="mb-2 text-lg font-semibold">City stops</h2>
        {loadingStops && (
          <p className="text-sm text-gray-600">Loading stops for {city}…</p>
        )}
        {stopsError && (
          <p className="text-sm text-red-700">Could not load stops: {stopsError}</p>
        )}
        {!loadingStops && !stopsError && stopNames.length === 0 && (
          <p className="text-sm text-gray-600">No stops found.</p>
        )}
        {!loadingStops && !stopsError && stopNames.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {stopNames.map((name) => (
              <span
                key={name}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-800"
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>
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
