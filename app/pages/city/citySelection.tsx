import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CitySelector from "~/components/citySelector";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3333";

export default function CitySelectionPage() {
  const navigate = useNavigate();
  const [cities, setCities] = useState<string[]>([
    "Warszawa",
    "Kraków",
    "Wrocław",
    "Łódź",
    "Opole",
  ]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abort = new AbortController();

    const loadCities = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/city/list`, { signal: abort.signal });
        if (!res.ok) {
          throw new Error(`Failed to load cities (${res.status})`);
        }
        const data = await res.json();
        const names =
          Array.isArray(data?.cities) && data.cities.length > 0
            ? Array.from(
                new Set(
                  data.cities
                    .map((city: { name?: string; Name?: string }) => city.name ?? city.Name)
                    .filter(Boolean),
                ),
              )
            : null;

        if (names && names.length > 0) {
          setCities(names as string[]);
          setError(null);
        }
      } catch (err) {
        if (abort.signal.aborted) return;
        setError("Unable to load supported cities from the server.");
      }
    };

    loadCities();

    return () => abort.abort();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center overflow-scroll">
      <h1 className="h-24 p-2 m-2 font-semibold text-2xl">
        please select you city
      </h1>
      {error && (
        <div className="mb-2 rounded-md bg-red-100 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}
      <CitySelector
        cities={cities}
        onCitySelect={(city) => navigate(`/${city}`)}
      />
    </div>
  );
}