import CitySelector from "~/components/citySelector";

export default function CitySelectionPage() {
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
      <CitySelector cities={cities} />
    </div>
  );
}
