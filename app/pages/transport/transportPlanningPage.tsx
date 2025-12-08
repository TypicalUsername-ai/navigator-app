import TransportRouteForm, {
  type RouteSearchFn,
} from "~/components/transportRouteForm";
import RoutesQuickAccess from "~/components/routesQuickAccess";
import TicketsQuickAccess from "~/components/ticketsQuickAccess";
import { useNavigate, useParams } from "react-router";
import BackButton from "~/components/BackButton";

export default function TransportPlanningPage({
  city,
  recentRoutes,
  onRouteClick,
  onRoutesExpand,
  onSearch,
}: TransportPlanningPageParams) {
  const navigate = useNavigate();
  const params = useParams();

  return (
    <div className="flex flex-col gap-6 p-3 h-screen w-screen items-center justify-start relative">
      <div className="absolute top-3 left-3 z-10 sm:top-4 sm:left-4">
        <BackButton onClick={() => navigate(`/${params.city}`)} />
      </div>
      <h1 className="text-2xl font-bold">City transport</h1>
      <TransportRouteForm city={city} onSearch={onSearch} />
      <RoutesQuickAccess
        routes={recentRoutes}
        onRouteClick={onRouteClick}
        onRoutesExpand={onRoutesExpand}
      />
      <TicketsQuickAccess />
    </div>
  );
}

export type TransportPlanningPageParams = {
  city: string;
  recentRoutes: string[];
  onRouteClick: (route: string) => void;
  onRoutesExpand: () => void;
  onSearch: RouteSearchFn;
};
