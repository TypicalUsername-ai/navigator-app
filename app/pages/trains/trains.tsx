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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";

const CITY_COORDS: Record<string, [number, number]> = {
  Warszawa: [52.2297, 21.0122],
  Kraków: [50.0647, 19.945],
  Wrocław: [51.1079, 17.0385],
  Gdańsk: [54.352, 18.6466],
  Poznań: [52.4064, 16.9252],
};

export default function TrainsPage({ city, onSearch }: TrainsPageParams) {
  const [query, setQuery] = useState<TrainSearchParams | null>(null);
  const [tickets, setTickets] = useState<TrainTicket[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    void (async () => {
      const [t, p] = await Promise.all([fetchTickets(), fetchPassengers()]);
      setTickets(t);
      setPassengers(p);
    })();
  }, []);

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

      {/* <TrainSearch onSearch={setQuery} /> */}
      <TrainRouteForm city={city} onSearch={onSearch} />

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
