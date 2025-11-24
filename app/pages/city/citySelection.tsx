import CitySelector from "~/components/citySelector";
import { useNavigate } from "react-router";

export default function CitySelectionPage() {
  const navigate = useNavigate();
  let cities = [
    "Wroclaw",
    "Krakow",
    "Warsaw",
    "Lodz",
    "Gdansk",
    "Szczecin",
    "Bydgoszcz",
  ];
  return (
    <div className="h-screen w-screen flex flex-col flex-grow items-center">
      <h1 className="w-full h-24 p-2 m-2"> please select you city </h1>
      <CitySelector
        cities={cities}
        onCitySelect={(city) => navigate(`/${city}`)}
      />
    </div>
  );
}
