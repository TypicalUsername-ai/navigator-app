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
  id,
  title,
  description,
  badges,
}: TicketCardProps) {
  const color = "red";
  return (
    <Card className="w-full max-w-sm relative-z-0 bg-linear-to-r from-purple-200 to-purple-400">
      <CardHeader>
        <CardTitle className="text-start text-lg">{title}</CardTitle>
        <CardDescription className="text-start text-md">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row-reverse gap-1 flex-wrap">
        {badges.map((badge, index) => {
          return <Badge key={index}>{badge.text}</Badge>;
        })}
      </CardContent>
      <CardFooter className="flex-col gap-2"></CardFooter>
    </Card>
  );
}

export type TicketCardProps = {
  id: String;
  title: String;
  description: String;
  badges: BadgeData[];
};

export type BadgeData = {
  text: String;
  color: String;
};
