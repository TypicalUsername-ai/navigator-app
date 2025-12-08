import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "~/components/ui/input-group";
import { Label } from "~/components/ui/label";
import TimePicker from "~/components/timePicker";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ArrowRightFromLine, ArrowRightToLine } from "lucide-react";
import { useState } from "react";

export default function TransportRouteForm({
  city,
  onSearch,
}: TransportRouteFormParams) {
  const now = new Date();
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();
  const [time, setTime] = useState(now.toLocaleTimeString());
  return (
    <Card className="w-full max-w-96 border-3 border-dashed border-zinc-400">
      <CardHeader>
        <CardTitle className="text-start text-xl">Where to?</CardTitle>
        <CardDescription className="m-0 p-0 text-end text-start text-sm">
          {city}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <InputGroup>
          <InputGroupInput
            placeholder="start point"
            onChange={(e) => setFrom(e.target.value)}
          />
          <InputGroupAddon>
            <ArrowRightFromLine />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput
            placeholder="destination"
            onChange={(e) => setTo(e.target.value)}
          />
          <InputGroupAddon>
            <ArrowRightToLine />
          </InputGroupAddon>
        </InputGroup>
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex flex-col gap-1" id="time-picker">
            <Label htmlFor="time-picker" className="px-1 text-xs">
              Time
            </Label>
            <TimePicker
              initHour={now.getHours()}
              initMinute={now.getMinutes()}
              onChange={(e) => console.log(e)}
            />
          </div>

          <Button onClick={() => onSearch(from, to, time)}>Search</Button>
        </div>
      </CardContent>
      <CardFooter className=""></CardFooter>
    </Card>
  );
}

export type TransportRouteFormParams = {
  city: string;
  onSearch: RouteSearchFn;
};

export type RouteSearchFn = (from: string, to: string, time: string) => void;
