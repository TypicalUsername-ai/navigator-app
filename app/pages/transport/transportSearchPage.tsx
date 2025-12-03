import TransportRouteForm, {
  type RouteSearchFn,
} from "~/components/transportRouteForm";
import RoutesQuickAccess from "~/components/routesQuickAccess";
import TicketsQuickAccess from "~/components/ticketsQuickAccess";

export default function TransportSearchPage({
  city,
}: TransportSearchPageParams) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-start gap-6 p-3">
      AAAA
    </div>
  );
}

export type TransportSearchPageParams = {
  city: string;
};
