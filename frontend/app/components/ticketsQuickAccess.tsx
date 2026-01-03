import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import TicketStoreCard from "~/components/ticketStoreCard";

export default function TicketsQuickAccess() {
  return (
    <Card className="w-full max-w-96 h-full">
      <CardHeader>
        <CardTitle className="text-start text-lg">Tickets</CardTitle>
        <CardDescription className="text-start text-md"></CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col w-full p-2">
        <TicketStoreCard />
      </CardContent>
      <CardAction></CardAction>
    </Card>
  );
}
