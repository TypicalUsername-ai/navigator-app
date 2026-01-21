import { useEffect, useState } from "react";
import TransportConnectionCard from "~/components/transportConnectionCard";
import TransportRouteOverview from "~/components/transportRouteOverview";
import TransportTicketForm from "~/components/TransportTicketForm";

const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ??
  "http://localhost:3333";

// Mock data for testing the frontend UI
const MOCK_ROUTE_DATA: RouteResponse = {
  Connections: [
    [
      {
        lineNo: "D",
        from: "Osiedle Sobieskiego",
        to: "Giełdowa (Centrum Hurtu)",
        transportType: "bus",
        viaStops: [
          "Poczta Główna",
          "Galeria Dominikańska",
          "Renoma",
          "Arkady (Capitol)",
          "Rondo",
          "Hallera",
          "Orla",
        ],
      },
    ],
    [
      {
        lineNo: "126",
        from: "Kozanów",
        to: "Wojszycka",
        transportType: "bus",
        viaStops: ["Park Południowy", "Wyścigowa"],
      },
    ],
  ],
};

// Set to true to use mock data and test the UI
const USE_MOCK_DATA = true;

export default function TransportSearchPage({
  city,
  from,
  to,
  time,
}: TransportSearchPageParams) {
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<{
    connections: LineConnection[];
    index: number;
  } | null>(null);

  useEffect(() => {
    if (!city || !from || !to) return;

    // Use mock data for testing
    if (USE_MOCK_DATA) {
      setLoading(true);
      setTimeout(() => {
        console.log("Using mock route data:", MOCK_ROUTE_DATA);
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
          `${API_BASE_URL}/city/${encodeURIComponent(city)}/transport/route?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
          { signal: abort.signal },
        );
        if (!res.ok) {
          throw new Error(`Failed to load route (${res.status})`);
        }
        const data = await res.json();
        console.log("Route data received:", data);
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
      <TransportRouteOverview city={city} from={from} to={to} time={time} />
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
                    <TransportConnectionCard
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
              <TransportTicketForm
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

export type TransportSearchPageParams = {
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
