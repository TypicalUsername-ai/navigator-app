import { NavLink, useParams } from "react-router";
import CitySelectionPage from "~/pages/city/citySelection";
import ModeSelectionPage from "~/pages/city/modeSelection";

export default function CityRoute() {
  const params = useParams();
  return params.city === "city" ? <CitySelectionPage /> : <ModeSelectionPage />;
}
