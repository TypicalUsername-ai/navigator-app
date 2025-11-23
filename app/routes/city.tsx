import { NavLink } from "react-router";

export default function CitySelector() {
  return (
    <div>
      <NavLink to="parking"> Parking </NavLink>
      <NavLink to="transport"> City transport </NavLink>
      <NavLink to="trains"> Trains </NavLink>
    </div>
  );
}
