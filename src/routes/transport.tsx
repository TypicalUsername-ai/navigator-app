import { TransportPlanningPage } from "@/pages";
import { useParams, useNavigate } from "react-router-dom";

export default function TransportRoute() {
  const params = useParams();
  const navigate = useNavigate();
  const recentRoutes = ["107", "125", "A"];
  return (
    <TransportPlanningPage
      city={params.city || ""}
      recentRoutes={recentRoutes}
      onRouteClick={(route) => navigate(String(route))}
      onRoutesExpand={() => navigate("routes")}
    />
  );
}
