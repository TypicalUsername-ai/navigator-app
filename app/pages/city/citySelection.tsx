import CitySelector from "~/components/citySelector";
import { useNavigate } from "react-router";

export default function CitySelectionPage() {
  const navigate = useNavigate();
  let cities = [
    "Warszawa",
    "Kraków",
    "Wrocław",
    "Łódź",
    "Poznań",
    "Gdańsk",
    "Szczecin",
    "Lublin",
    "Bydgoszcz",
    "Białystok",
    "Katowice",
    "Gdynia",
    "Częstochowa",
    "Radom",
    "Rzeszów",
    "Toruń",
    "Sosnowiec",
    "Kielce",
    "Gliwice",
    "Olsztyn",
    "Zabrze",
    "Bielsko-Biała",
    "Bytom",
    "Zielona Góra",
    "Rybnik",
  ];

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center overflow-scroll">
      <h1 className="h-24 p-2 m-2 font-semibold text-2xl">
        please select you city
      </h1>
      <CitySelector
        cities={cities}
        onCitySelect={(city) => navigate(`/${city}`)}
      />
    </div>
  );
}
