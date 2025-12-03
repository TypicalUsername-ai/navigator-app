import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import { ArrowRightFromLine, ArrowRightToLine } from "lucide-react";
import { useState } from "react";

export default function TrainRouteForm({
  city,
  onSearch,
}: TransportRouteFormParams) {
  const now = new Date();
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();
  const [time, setTime] = useState(now.toLocaleTimeString());
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
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
        <div className="flex flex-row items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="date-picker" className="px-1 text-xs">
              Date
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date-picker"
                  className="w-32 justify-between font-normal"
                >
                  {date ? date.toLocaleDateString() : "Select date"}
                  <CalendarIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="z-1000 w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="time-picker" className="px-1 text-xs">
              Date
            </Label>
            <Input
              type="time"
              id="time-picker"
              step="1"
              defaultValue={now.toLocaleTimeString()}
              onChange={(e) => setTime(e.target.value)}
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
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
