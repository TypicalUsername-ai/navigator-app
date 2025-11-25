import TransportRouteForm from "~/components/transportRouteForm";
import RoutesQuickAccess from "~/components/routesQuickAccess";
import TicketsQuickAccess from "~/components/ticketsQuickAccess";

export default function TransportPlanningPage({
  city,
  recentRoutes,
  onRouteClick,
  onRoutesExpand,
}: TransportPlanningPageParams) {
  return (
    <div className="flex flex-col gap-3 align-center space-between">
      <TransportRouteForm city={city} />
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
  city: String;
  recentRoutes: String[];
  onRouteClick: (route: String) => void;
  onRoutesExpand: () => void;
};
