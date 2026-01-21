import { useEffect, useState } from "react";
import TrainConnectionCard from "~/components/trainConnectionCard";
import TrainRouteOverview from "~/components/trainRouteOverview";
import TrainTicketForm from "~/components/TrainTicketForm";

const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ??
  "http://localhost:3333";

// Mock data for testing the frontend UI
const MOCK_ROUTE_DATA: RouteResponse = {
  Connections: [
    [
      {
        lineNo: "PR",
        from: "Wrocław Główny",
        to: "Racibórz",
        transportType: "train",
        viaStops: [
          "Wrocław Brochów",
          "Święta Katarzyna",
          "Zębice Wrocławskie",
          "Lizawice",
          "Oława",
          "Lipki",
          "Brzeg",
          "Łosiów",
          "Lewin Brzeski",
          "Przecza",
          "Dąbrowa Niemodlińska",
          "Chróścina Opolska",
          "Opole Zachodnie",
        ],
      },
      {
        lineNo: "8358",
        from: "Świnoujście",
        to: "Przemyśl Główny",
        transportType: "train",
        viaStops: [],
      },
      {
        lineNo: "62104",
        from: "Wrocław Główny",
        to: "Lublin Główny",
        transportType: "train",
        viaStops: ["Oława", "Brzeg"],
      },
    ],
  ],
};

// Set to true to use mock data and test the UI
const USE_MOCK_DATA = true;

export default function TrainSearchPage({
  city,
  from,
  to,
  time,
}: TrainSearchPageParams) {
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<{
    connections: LineConnection[];
    index: number;
  } | null>(null);

  useEffect(() => {
    if (!from || !to) return;

    // Use mock data for testing
    if (USE_MOCK_DATA) {
      setLoading(true);
      setTimeout(() => {
        console.log("Using mock train route data:", MOCK_ROUTE_DATA);
        setRouteData(MOCK_ROUTE_DATA);
        setLoading(false);
      }, 500);
      return;
    }

    const abort = new AbortController();
    const fetchRoute = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `${API_BASE_URL}/city/${encodeURIComponent(city)}/trains/route?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
          { signal: abort.signal },
        );
        if (!res.ok) {
          throw new Error(`Failed to load route (${res.status})`);
        }
        const data = await res.json();
        console.log("Train route data received:", data);
        setRouteData(data);
      } catch (err) {
        if (abort.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Failed to load route");
      } finally {
        if (!abort.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchRoute();
    return () => abort.abort();
  }, [city, from, to]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-start gap-6 p-3">
      <TrainRouteOverview city={city} from={from} to={to} time={time} />
      <div className="max-w-full w-full flex flex-col gap-3">
        {loading && <p className="text-sm text-gray-500">Loading routes...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {routeData && routeData.Connections && routeData.Connections.length > 0 ? (
          <>
            {!selectedRoute ? (
              <>
                <p className="text-sm text-gray-600">
                  Found {routeData.Connections.length} route option{routeData.Connections.length > 1 ? 's' : ''}:
                </p>
                {routeData.Connections.map((connectionGroup, index) => (
                  <div key={index} className="w-full">
                    <p className="text-xs text-gray-500 mb-1">Route option {index + 1}</p>
                    <TrainConnectionCard
                      connections={connectionGroup}
                      onClick={() =>
                        setSelectedRoute({ connections: connectionGroup, index })
                      }
                    />
                  </div>
                ))}
                <p className="text-xs text-gray-500 text-center mt-2">
                  Click on a route to buy a ticket
                </p>
              </>
            ) : (
              <TrainTicketForm
                routeConnections={selectedRoute.connections}
                routeIndex={selectedRoute.index}
                from={from}
                to={to}
                onClose={() => setSelectedRoute(null)}
              />
            )}
          </>
        ) : (
          !loading && !error && <p className="text-sm text-gray-500">No routes found</p>
        )}
      </div>
    </div>
  );
}

export type TrainSearchPageParams = {
  city: string;
  from: string;
  to: string;
  time: string;
};

export type LineConnection = {
  lineNo: string;
  from: string;
  to: string;
  transportType: string;
  viaStops: string[];
};

export type RouteResponse = {
  Connections: LineConnection[][];
};
