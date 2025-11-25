import { TrainSearch, type TrainSearchParams, TrainMap } from "@/components/train";
import { useEffect, useMemo, useState } from "react";
import { fetchPassengers, fetchTickets, type Passenger, type TrainTicket } from "@/lib/mock";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const CITY_COORDS: Record<string, [number, number]> = {
  Warszawa: [52.2297, 21.0122],
  Kraków: [50.0647, 19.945],
  Wrocław: [51.1079, 17.0385],
  Gdańsk: [54.352, 18.6466],
  Poznań: [52.4064, 16.9252],
};

export default function TrainsPage() {
  const [query, setQuery] = useState<TrainSearchParams | null>(null);
  const [tickets, setTickets] = useState<TrainTicket[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);

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
    const poly = Array.from({ length: steps + 1 }, (_, i) => [from[0] + latDelta * i, from[1] + lngDelta * i]) as [
      number,
      number
    ][];

    return {
      markers: [
        { position: from as [number, number], label: `Start: ${query.from}` },
        { position: to as [number, number], label: `Cel: ${query.to}` },
      ],
      path: poly,
    };
  }, [query]);

  return (
    <div className="container mx-auto p-4 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Pociągi</h1>

      <TrainSearch onSearch={setQuery} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TrainMap center={markers[0]?.position as [number, number] ?? CITY_COORDS.Warszawa} markers={markers} path={path} />
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>zakupione bilety</CardTitle>
            </CardHeader>
            <CardContent>
              {tickets.length === 0 ? (
                <p className="text-sm text-muted-foreground">Brak danych</p>
              ) : (
                <ul className="space-y-2">
                  {tickets.map((t) => (
                    <li key={t.id} className="text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{t.from} → {t.to}</span>
                        <span className="text-muted-foreground">{t.time}</span>
                      </div>
                      <div className="text-muted-foreground">
                        {t.seat} • {t.price.toFixed(2)} PLN • {t.status}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>zapisane dane pasażerów</CardTitle>
            </CardHeader>
            <CardContent>
              {passengers.length === 0 ? (
                <p className="text-sm text-muted-foreground">Brak danych</p>
              ) : (
                <ul className="space-y-2">
                  {passengers.map((p) => (
                    <li key={p.id} className="text-sm">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-muted-foreground">{p.email ?? "—"} {p.phone ? `• ${p.phone}` : ""}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
