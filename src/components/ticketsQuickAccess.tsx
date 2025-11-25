import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TicketsQuickAccess() {
  return (
    <Card className="w-full max-w-96">
      <CardHeader>
        <CardTitle className="text-start text-lg"></CardTitle>
        <CardDescription className="text-start text-md"></CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row-reverse gap-1 flex-wrap"></CardContent>
      <CardAction></CardAction>
    </Card>
  );
}
