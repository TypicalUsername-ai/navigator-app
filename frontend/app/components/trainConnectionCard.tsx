import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardAction,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Footprints,
  BusFront,
  TramFront,
  TrainFront,
  Route,
  SquareM,
  SquareArrowDownRight,
  MoveRight,
  Repeat,
} from "lucide-react";
import type { LineConnection } from "~/pages/trains/trainSearchPage";

export default function TrainConnectionCard({
  connections,
  onClick,
}: {
  connections: LineConnection[];
  onClick?: () => void;
}) {
  return (
    <Card
      className={`gap-1 p-2 ${onClick ? "cursor-pointer transition-all hover:shadow-md hover:border-blue-300" : ""}`}
      onClick={onClick}
    >
      <CardContent className="items-between flex h-full w-full flex-row p-0">
        <div className="flex flex-row items-center gap-2 flex-wrap">
          {connections.map((connection, index) => (
            <TrainLine key={index} nr={connection.lineNo} />
          ))}
        </div>
      </CardContent>
      <CardFooter className="items-between flex flex-row gap-1 overflow-scroll">
        {connections.map((connection, connectionIndex) => (
          <div key={connectionIndex} className="flex flex-row gap-1 items-center">
            <Stop name={connection.from} />
            {connection.viaStops && connection.viaStops.length > 0 && (
              <Stops stops={connection.viaStops.length} />
            )}
            {connectionIndex === connections.length - 1 && (
              <Stop name={connection.to} />
            )}
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}

function Stop({ name }: { name: string }) {
  return <Badge className="overflow-hidden px-1 text-ellipsis">{name}</Badge>;
}

function Walk({ distance }: { distance: number }) {
  return (
    <div className="flex flex-col items-center">
      <Footprints size={16} />
      <p className="text-light text-xs">{distance}m</p>
    </div>
  );
}

function Stops({ stops }: { stops: number }) {
  return (
    <div className="flex flex-col items-center">
      <Route size={24} />
      <p className="text-light truncate text-xs">{stops} stops</p>
    </div>
  );
}

function TrainLine({ nr }: { nr: string }) {
  return (
    <div className="flex flex-row gap-1 items-center">
      <TrainFront size={32} />
      <Badge variant="outline" className="border-primary rounded-sm border-1">
        {nr}
      </Badge>
    </div>
  );
}

function BusLine({ nr }: { nr: number }) {
  return (
    <div className="flex flex-row gap-1">
      <BusFront size={32} />
      <Badge variant="outline" className="border-primary rounded-sm border-1">
        {nr}
      </Badge>
    </div>
  );
}

function TramLine({ nr }: { nr: number }) {
  return (
    <div className="flex flex-row gap-1">
      <TramFront size={32} />
      <Badge variant="outline" className="border-primary rounded-sm border-1">
        {nr}
      </Badge>
    </div>
  );
}
