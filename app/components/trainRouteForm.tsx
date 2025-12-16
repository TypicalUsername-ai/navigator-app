import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import TimePicker from "~/components/timePicker";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import { ArrowRightFromLine, ArrowRightToLine } from "lucide-react";
import { useState, useMemo } from "react";

interface StationInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  stations: string[];
  icon: React.ReactNode;
}

function StationInput({ placeholder, value, onChange, stations, icon }: StationInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = useMemo(() => {
    if (!value.trim()) return [];
    const query = value.toLowerCase();
    return stations.filter((station) => station.toLowerCase().includes(query));
  }, [value, stations]);

  const showSuggestions = isFocused && suggestions.length > 0;

  const handleSelect = (station: string) => {
    onChange(station);
    setIsFocused(false);
  };

  return (
    <div className="relative">
      <InputGroup>
        <InputGroupInput
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        />
        <InputGroupAddon>{icon}</InputGroupAddon>
      </InputGroup>
      {showSuggestions && (
        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {suggestions.map((station) => (
            <button
              key={station}
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
              onMouseDown={() => handleSelect(station)}
            >
              {station}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TrainRouteForm({
  city,
  onSearch,
  stations = [],
}: TrainRouteFormParams) {
  const now = new Date();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
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
        <StationInput
          placeholder="start station"
          value={from}
          onChange={setFrom}
          stations={stations}
          icon={<ArrowRightFromLine />}
        />
        <StationInput
          placeholder="destination station"
          value={to}
          onChange={setTo}
          stations={stations}
          icon={<ArrowRightToLine />}
        />
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
          <div className="flex flex-col gap-1" id="time-picker">
            <Label htmlFor="time-picker" className="px-1 text-xs">
              Time
            </Label>
            <TimePicker
              initHour={now.getHours()}
              initMinute={now.getMinutes()}
              onChange={(hour, minute) => console.log(hour, minute)}
            />
          </div>
          <Button onClick={() => onSearch(from, to, time)}>Search</Button>
        </div>
      </CardContent>
      <CardFooter className=""></CardFooter>
    </Card>
  );
}

export type TrainRouteFormParams = {
  city: string;
  onSearch: RouteSearchFn;
  stations?: string[];
};

export type RouteSearchFn = (from: string, to: string, time: string) => void;
