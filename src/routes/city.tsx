import { useParams } from "react-router-dom";
import { CitySelectionPage, ModeSelectionPage } from "@/pages";

export default function CityRoute() {
  const params = useParams();
  return params.city === "city" ? <CitySelectionPage /> : <ModeSelectionPage />;
}
