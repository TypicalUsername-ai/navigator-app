import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ParkingMap from "~/components/ParkingMap";
import ParkingTicketForm from "~/components/ParkingTicketForm";
import ParkingSearchBar from "~/components/parkingSearchBar";
import BackButton from "~/components/BackButton";

interface ParkingLocation {
  id: number;
  name: string;
  address: string;
  available: number;
  total: number;
  price: number;
  lat: number;
  lng: number;
}

type ApiParkingSpot = {
  OsmID?: number;
  osmID?: number;
  id?: number;
  Lat?: number;
  lat?: number;
  Lon?: number;
  lon?: number;
  lng?: number;
  Capacity?: number;
  capacity?: number;
  Fee?: string;
  fee?: string;
};

type ApiCity = { name?: string; Name?: string; lat?: number; Lat?: number; lon?: number; Lon?: number };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3333";

export default function ParkingMapPage() {
  const [selectedParking, setSelectedParking] = useState<ParkingLocation | null>(null);
  const [parkings, setParkings] = useState<ParkingLocation[]>([]);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (
      selectedParking &&
      !parkings.some((parking) => parking.id === selectedParking.id)
    ) {
      setSelectedParking(null);
    }
  }, [parkings, selectedParking]);

  useEffect(() => {
    if (!params.city) return;

    const abort = new AbortController();
    const cityName = params.city;

    const normalizeParking = (spot: ApiParkingSpot, fallbackIndex: number): ParkingLocation | null => {
      const lat = Number(spot.Lat ?? spot.lat);
      const lng = Number(spot.Lon ?? spot.lon ?? spot.lng);

      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return null;
      }

      const capacity = Number(spot.Capacity ?? spot.capacity) || 0;
      const fee = spot.Fee ?? spot.fee;
      const id = spot.OsmID ?? spot.osmID ?? spot.id ?? fallbackIndex;

      return {
        id,
        name: `Parking ${id}`,
        address: fee ? `Fee: ${fee}` : "No fee information",
        available: capacity,
        total: capacity,
        price: fee && fee !== "no" ? 5 : 0,
        lat,
        lng,
      };
    };

    const normalizeCity = (city: ApiCity) => {
      const lat = Number(city.lat ?? city.Lat);
      const lng = Number(city.lon ?? city.Lon);
      if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
      return { lat, lng, name: city.name ?? city.Name };
    };

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [citiesRes, parkingsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/city/list`, { signal: abort.signal }),
          fetch(`${API_BASE_URL}/city/${encodeURIComponent(cityName)}/parking/all`, { signal: abort.signal }),
        ]);

        if (!citiesRes.ok) {
          throw new Error(`Failed to load cities (${citiesRes.status})`);
        }
        if (!parkingsRes.ok) {
          throw new Error(`Failed to load parkings (${parkingsRes.status})`);
        }

        const citiesJson = await citiesRes.json();
        const parkingJson = await parkingsRes.json();

        const availableCities = Array.isArray(citiesJson?.cities) ? citiesJson.cities : [];
        const normalizedCities = availableCities
          .map(normalizeCity)
          .filter(Boolean) as Array<{ lat: number; lng: number; name?: string }>;

        const currentCity = normalizedCities.find((city) => city.name === cityName);
        if (currentCity) {
          setMapCenter({ lat: currentCity.lat, lng: currentCity.lng });
        }

        const spots = Array.isArray(parkingJson?.stops) ? parkingJson.stops : [];
        const normalizedParkings = spots
          .map((spot: ApiParkingSpot, index: number) => normalizeParking(spot, index))
          .filter(Boolean) as ParkingLocation[];

        setParkings(normalizedParkings);

        if (!currentCity && normalizedParkings.length > 0) {
          const first = normalizedParkings[0];
          setMapCenter({ lat: first.lat, lng: first.lng });
        }
      } catch (err) {
        if (abort.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Failed to load parking data");
      } finally {
        if (!abort.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => abort.abort();
  }, [params.city]);

  return (
    <div className="relative-z-0 flex h-screen w-screen flex-col items-center justify-center gap-1">
      <div className="absolute top-3 left-3 z-20 sm:top-4 sm:left-4">
        <BackButton onClick={() => navigate(`/${params.city}`)} />
      </div>
      <div className="z-0 h-full w-full">
        <ParkingMap
          parkings={parkings}
          selectedParking={selectedParking}
          onSelectParking={setSelectedParking}
          mapCenter={mapCenter ?? undefined}
        />
      </div>

      {!loading && !error && parkings.length === 0 && (
        <div className="absolute top-4 left-1/2 z-20 -translate-x-1/2 rounded-md bg-white/90 px-3 py-2 text-sm shadow">
          No parking spots found for {params.city}.
        </div>
      )}

      {loading && (
        <div className="absolute top-4 left-1/2 z-20 -translate-x-1/2 rounded-md bg-white/90 px-3 py-2 text-sm shadow">
          Loading parking data...
        </div>
      )}

      {error && (
        <div className="absolute top-4 left-1/2 z-20 -translate-x-1/2 rounded-md bg-red-100 px-3 py-2 text-sm text-red-800 shadow">
          {error}
        </div>
      )}

      {selectedParking && (
        <div className="absolute z-10 flex flex-col p-1 max-md:bottom-0 max-md:left-0 max-md:right-0 sm:p-2 md:right-4 md:bottom-4 md:w-96">
          <ParkingTicketForm
            selectedParking={selectedParking}
            onClose={() => setSelectedParking(null)}
          />
        </div>
      )}

      <div className="absolute top-3 z-10">
        <ParkingSearchBar />
      </div>
    </div>
  );
}
