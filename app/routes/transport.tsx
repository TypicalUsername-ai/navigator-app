import TransportPlanningPage from "~/pages/transport/transportPlanningPage";
import { useParams } from "react-router";

export default function TransportRoute() {
  const params = useParams();
  return (
    <div className="flex flex-col p-1">
      <TransportPlanningPage city={params.city} />
    </div>
  );
}
