import TransportRouteForm, {
  type RouteSearchFn,
} from "~/components/transportRouteForm";
import RoutesQuickAccess from "~/components/routesQuickAccess";
import TicketsQuickAccess from "~/components/ticketsQuickAccess";
import TrainConnectionCard from "~/components/trainConnectionCard";
import TrainRouteOverview from "~/components/trainRouteOverview";

export default function TrainSearchPage({
  city,
  from,
  to,
  time,
}: TrainSearchPageParams) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-start gap-6 p-3">
      <TrainRouteOverview city={city} from={from} to={to} time={time} />
      <div className="max-w-full">
        <TrainConnectionCard />
      </div>
    </div>
  );
}

export type TrainSearchPageParams = {
  city: string;
  from: string;
  to: string;
  time: string;
};
