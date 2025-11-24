import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

export default function TicketCard() {
  return (
    <Card className="w-full max-w-sm relative-z-0 bg-linear-to-r from-purple-200 to-purple-400">
      <CardHeader>
        <CardTitle className="text-start text-lg">All Lines (Zone A)</CardTitle>
        <CardDescription className="text-start text-md">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row-reverse flex-wrap">
        <Badge className="z-2">30 Days</Badge>
      </CardContent>
      <CardFooter className="flex-col gap-2"></CardFooter>
    </Card>
  );
}
