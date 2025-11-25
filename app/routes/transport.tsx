import TransportPlanningPage from "~/pages/transport/transportPlanningPage";
import { useParams, useNavigate } from "react-router";

export default function TransportRoute() {
  const params = useParams();
  const navigate = useNavigate();
  const recentRoutes = ["107", "125", "A"];
  return (
    <div className="flex flex-col p-1">
      <TransportPlanningPage
        city={params.city}
        recentRoutes={recentRoutes}
        onRouteClick={(route) => navigate(route)}
        onRoutesExpand={() => navigate("routes")}
      />
    </div>
  );
}
