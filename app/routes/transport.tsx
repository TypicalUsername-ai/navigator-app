import TransportPlanningPage from "~/pages/transport/transportPlanningPage";
import { useParams, useNavigate, createSearchParams } from "react-router";

export default function TransportRoute() {
  const encodeSearch = (from, to, time) => {
    let ps = createSearchParams({
      from: from,
      to: to,
      time: time,
    });
    return ps.toString();
  };
  const params = useParams();
  const navigate = useNavigate();
  const recentRoutes = ["107", "125", "A"];
  return (
    <TransportPlanningPage
      city={params.city}
      recentRoutes={recentRoutes}
      onRouteClick={(route) => navigate("/routes/" + route)}
      onRoutesExpand={() => navigate("routes")}
      onSearch={(start, end, time) =>
        navigate({ pathname: "search", search: encodeSearch(start, end, time) })
      }
    />
  );
}
