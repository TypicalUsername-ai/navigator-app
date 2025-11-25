import TransportRouteForm from "~/components/transportRouteForm";

export default function TransportPlanningPage({
  city,
}: TransportPlanningPageParams) {
  return (
    <div>
      <TransportRouteForm city={city} />
    </div>
  );
}

export type TransportPlanningPageParams = {
  city: String;
};
