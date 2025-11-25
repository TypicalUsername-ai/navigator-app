import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function TicketsQuickAccess() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-start text-lg"></CardTitle>
        <CardDescription className="text-start text-md"></CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row-reverse gap-1 flex-wrap"></CardContent>
      <CardAction></CardAction>
    </Card>
  );
}
