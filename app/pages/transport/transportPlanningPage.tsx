import TransportRouteForm from "~/components/transportRouteForm";
import RoutesQuickAccess from "~/components/routesQuickAccess";
import TicketsQuickAccess from "~/components/ticketsQuickAccess";

export default function TransportPlanningPage({
  city,
  recentRoutes,
  onRouteClick,
  onRoutesExpand,
  onSearch,
}: TransportPlanningPageParams) {
  return (
    <div className="flex flex-col gap-6 p-3 h-screen w-screen items-center justify-start">
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
  city: String;
  recentRoutes: String[];
  onRouteClick: (route: String) => void;
  onRoutesExpand: () => void;
  onSearch: (from, to, time) => void;
};
