import TransportRouteForm, {
  type RouteSearchFn,
} from "~/components/transportRouteForm";
import RoutesQuickAccess from "~/components/routesQuickAccess";
import TicketsQuickAccess from "~/components/ticketsQuickAccess";
import TransportConnectionCard from "~/components/transportConnectionCard";
import TransportRouteOverview from "~/components/transportRouteOverview";

export default function TransportSearchPage({
  city,
  from,
  to,
  time,
}: TransportSearchPageParams) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-start gap-6 p-3">
      <TransportRouteOverview city={city} from={from} to={to} time={time} />
      <div className="max-w-full">
        <TransportConnectionCard />
      </div>
    </div>
  );
}

export type TransportSearchPageParams = {
  city: string;
  from: string;
  to: string;
  time: string;
};
