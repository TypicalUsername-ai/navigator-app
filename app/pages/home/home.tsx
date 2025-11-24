import { NavLink } from "react-router";
import EmptyCity from "~/components/emptyCity";

export default function Index() {
  return (
    <div>
      <h1> Choose your city </h1>

      <NavLink to="wroclaw"> Wroclaw </NavLink>
      <EmptyCity />
    </div>
  );
}
