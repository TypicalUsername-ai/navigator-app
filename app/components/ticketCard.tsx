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

export default function TicketCard({
  title,
  description,
  badges,
}: TicketCardProps) {
  const color = "purple";
  return (
    <Card
      className={`w-full max-w-sm relative-z-0 bg-linear-to-r from-${color}-200 to-${color}-400`}
    >
      <CardHeader>
        <CardTitle className="text-start text-lg">{title}</CardTitle>
        <CardDescription className="text-start text-md">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row-reverse flex-wrap">
        {badges.map((badge, index) => (
          <Badge index={index}>{badge}</Badge>
        ))}
      </CardContent>
      <CardFooter className="flex-col gap-2"></CardFooter>
    </Card>
  );
}

export type TicketCardProps = {
  title: String;
  description: String;
  badges: String[];
};
