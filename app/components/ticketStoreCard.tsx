import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardAction,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { HandCoins } from "lucide-react";

export default function TicketStoreCard() {
  const description =
    "ticket-indicated person is entitled to travel on all lines for 7 consecutive calendar days starting on the ticket-indicated date.";
  return (
    <div className="flex flex-row gap-0">
      <Card className="gap-1 w-4/5 justify-between">
        <CardHeader>
          <CardTitle className="text-start">ticket A</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
      <Button variant="outline" asChild>
        <div className="w-1/5 h-full bg-gradient-to-tr from-teal-200 via-purple-200 to-teal-400">
          <HandCoins />
        </div>
      </Button>
    </div>
  );
}
