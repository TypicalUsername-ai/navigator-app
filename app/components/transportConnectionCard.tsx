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
  Route,
  SquareM,
  SquareArrowDownRight,
  MoveRight,
  Repeat,
} from "lucide-react";
export default function TransportConnectionCard() {
  return (
    <Card className="aspect-5/1 gap-1 p-2">
      <CardContent className="items-between flex h-full w-full flex-row p-0">
        <div className="m-2 place-self-end text-lg font-bold lg:text-3xl">
          18min
        </div>
        <div className="flex flex-row items-center gap-2">
          <BusLine nr={238} />
          <TramLine nr={23} />
        </div>
      </CardContent>
      <CardFooter className="items-between flex flex-row gap-3">
        <Walk distance={400} />
        <Badge>Jordanowska</Badge>
        <Stops stops={10} />
        <Badge>Rodno Matecznego</Badge>
        <Walk distance={200} />
      </CardFooter>
    </Card>
  );
}

function Walk({ distance }: { number }) {
  return (
    <div className="flex flex-col items-center">
      <Footprints size={16} />
      <p className="text-light text-xs">{distance}m</p>
    </div>
  );
}

function Stops({ stops }: { number }) {
  return (
    <div className="flex flex-col items-center">
      <Route size={24} />
      <p className="text-light text-xs">{stops} stops</p>
    </div>
  );
}

function BusLine({ nr }: { number }) {
  return (
    <div className="flex flex-row gap-1">
      <BusFront size={32} />
      <Badge variant="ou1tline" className="border-primary rounded-sm border-1">
        {nr}
      </Badge>
    </div>
  );
}

function TramLine({ nr }: { number }) {
  return (
    <div className="flex flex-row gap-1">
      <TramFront size={32} />
      <Badge variant="ou1tline" className="border-primary rounded-sm border-1">
        {nr}
      </Badge>
    </div>
  );
}
