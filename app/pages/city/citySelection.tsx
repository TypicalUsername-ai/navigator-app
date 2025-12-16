import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CitySelector from "~/components/citySelector";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3333";

export default function CitySelectionPage() {
  const navigate = useNavigate();
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const abort = new AbortController();

    const loadCities = async () => {
      try {
        setLoading(true);
        setError(null);
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
        } else {
          throw new Error("No cities found in the response");
        }
      } catch (err) {
        if (abort.signal.aborted) return;
        setError("Unable to load supported cities from the server.");
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    loadCities();

    return () => abort.abort();
  }, [mounted]);

  const showLoading = !mounted || loading;

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center overflow-scroll">
      <h1 className="h-24 p-2 m-2 font-semibold text-2xl">
        please select you city
      </h1>
      {showLoading ? (
        <div className="mb-4 flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <div className="text-sm text-gray-600">
            Loading cities...
          </div>
        </div>
      ) : null}
      {!showLoading && error && (
        <div className="mb-2 rounded-md bg-red-100 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}
      {!showLoading && cities.length > 0 && (
        <CitySelector
          cities={cities}
          onCitySelect={(city) => navigate(`/${city}`)}
        />
      )}
    </div>
  );
}