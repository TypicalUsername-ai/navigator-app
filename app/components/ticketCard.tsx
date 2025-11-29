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
import { SquareParking, TrainFront, BusFront } from "lucide-react";

export default function TicketCard({
  id,
  title,
  line,
  type,
  description,
  validThrough,
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
    <Card className="w-full h-full max-w-sm relative-z-0 bg-linear-to-tr from-blue-200 via-purple-200 to-blue-400 gap-1">
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-start text-lg">{title}</CardTitle>
          <TicketData type={type} line={line} validThrough={validThrough} />
        </div>
      </CardHeader>
      <CardContent className="text-start text-md">{description}</CardContent>
      <CardFooter className="flex flex-row-reverse gap-1 flex-wrap">
        {badges.map((badge, index) => {
          return (
            <Badge className={colors[badge.color]} key={index}>
              {badge.text}
            </Badge>
          );
        })}
      </CardFooter>
    </Card>
  );
}

export type TicketType = "transport" | "train" | "parking";

export type TicketCardProps = {
  id: string;
  title: string;
  line: string;
  validThrough: Date;
  type: TicketType;
  description: string;
  badges: BadgeData[];
};

export type BadgeData = {
  text: string;
  color: "red" | "blue" | "teal" | "yellow" | "lime" | "zinc" | "fuchsia";
};

type TicketDataProps = {
  type: TicketType;
  line: string;
  validThrough: Date;
};

function TicketData({ type, line, validThrough }: TicketDataProps) {
  const timeLeft = validThrough.getTime() - Date.now();
  if (type == "transport") {
    return (
      <div className="flex flex-row gap-2">
        <Badge> {timeLeft.toString()} </Badge>
        <Badge> {line} </Badge>
        <BusFront />
      </div>
    );
  } else if (type == "train") {
    return (
      <div className="flex flex-row gap-1">
        <Badge> {timeLeft.toString()} </Badge>
        <Badge>{line}</Badge>
        <TrainFront />
      </div>
    );
  } else {
    return (
      <div className="flex flex-row gap-2">
        <Badge> {timeLeft.toString()} </Badge>
        <Badge> {line} </Badge>
        <SquareParking />
      </div>
    );
  }
}
