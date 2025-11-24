import { NavLink, useParams } from "react-router";
import CitySelector from "~/components/citySelector";

export default function CityRoute() {
  const params = useParams();
  return params.city === "city" ? (
    <CitySelector />
  ) : (
    <div>
      <NavLink to="parking"> Parking </NavLink>
      <NavLink to="transport"> City transport </NavLink>
      <NavLink to="trains"> Trains </NavLink>
    </div>
  );
}
