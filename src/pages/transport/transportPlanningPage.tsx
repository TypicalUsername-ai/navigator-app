import { TransportRouteForm, RoutesQuickAccess, TicketsQuickAccess } from "@/components";

export default function TransportPlanningPage({
  city,
  recentRoutes,
  onRouteClick,
  onRoutesExpand,
}: TransportPlanningPageParams) {
  return (
    <div className="flex flex-col gap-3 h-screen w-screen items-center justify-center">
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
  city: string;
  recentRoutes: string[];
  onRouteClick: (route: string) => void;
  onRoutesExpand: () => void;
};
