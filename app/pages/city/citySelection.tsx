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
    <div className="flex flex-col items-center">
      <h1> please select you city </h1>
      <CitySelector
        cities={cities}
        onCitySelect={(city) => navigate(`/${city}`)}
      />
    </div>
  );
}
