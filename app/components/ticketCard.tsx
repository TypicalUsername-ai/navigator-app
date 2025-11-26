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
  const colors = {
    red: "bg-red-600",
    blue: "bg-blue-600",
    teal: "bg-teal-600",
    yellow: "bg-yellow-600",
    lime: "bg-lime-600",
    zinc: "bg-zinc-600",
    fuchsia: "bg-fuchsia-600",
  };
  return (
    <Card className="w-full max-w-sm relative-z-0 bg-linear-to-tr from-blue-200 via-purple-200 to-blue-400 gap-1">
      <CardHeader>
        <CardTitle className="text-start text-lg">{title}</CardTitle>
        <CardDescription className="text-start text-md">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row-reverse gap-1 flex-wrap">
        {badges.map((badge, index) => {
          return (
            <Badge className={colors[badge.color]} key={index}>
              {badge.text}
            </Badge>
          );
        })}
      </CardContent>
      <CardFooter className="flex-col gap-2"></CardFooter>
    </Card>
  );
}

export type TicketCardProps = {
  id: string;
  title: string;
  description: string;
  badges: BadgeData[];
};

export type BadgeData = {
  text: string;
  color: "red" | "blue" | "teal" | "yellow" | "lime" | "zinc" | "fuchsia";
};
