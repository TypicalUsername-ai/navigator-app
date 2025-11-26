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
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [time, setTime] = useState(now.toLocaleTimeString());
  return (
    <Card className="border-3 border-dashed border-zinc-400 w-full max-w-96">
      <CardHeader>
        <CardTitle className="text-start text-xl">Where to?</CardTitle>
        <CardDescription className="text-start text-sm text-end p-0 m-0">
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
        <div className="flex flex-row gap-2 items-center justify-between">
          <Input
            type="time"
            id="time-picker"
            step="1"
            defaultValue={now.toLocaleTimeString()}
            onChange={(e) => setTime(e.target.value)}
            className="bg-background w-3/8 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
          <Button onClick={() => onSearch(from, to, time)}>Search</Button>
        </div>
      </CardContent>
      <CardFooter className=""></CardFooter>
    </Card>
  );
}

export type TransportRouteFormParams = {
  city: String;
  onSearch: (from, to, time) => void;
};
