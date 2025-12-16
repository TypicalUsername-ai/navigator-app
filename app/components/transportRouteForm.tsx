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
import { useState, useMemo, useRef, useEffect } from "react";

interface StopInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  stops: string[];
  icon: React.ReactNode;
}

function StopInput({ placeholder, value, onChange, stops, icon }: StopInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!value.trim()) return [];
    const query = value.toLowerCase();
    return stops.filter((stop) => stop.toLowerCase().startsWith(query));
  }, [value, stops]);

  const showSuggestions = isFocused && suggestions.length > 0;

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);

  const handleSelect = (stop: string) => {
    onChange(stop);
    setIsFocused(false);
  };

  return (
    <div ref={containerRef} className="relative">
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
          {suggestions.map((stop, index) => (
            <button
              key={stop}
              type="button"
              className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                index === highlightedIndex ? "bg-gray-100" : ""
              }`}
              onMouseDown={() => handleSelect(stop)}
            >
              {stop}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TransportRouteForm({
  city,
  onSearch,
  stops = [],
}: TransportRouteFormParams) {
  const now = new Date();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
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
        <StopInput
          placeholder="start point"
          value={from}
          onChange={setFrom}
          stops={stops}
          icon={<ArrowRightFromLine />}
        />
        <StopInput
          placeholder="destination"
          value={to}
          onChange={setTo}
          stops={stops}
          icon={<ArrowRightToLine />}
        />
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
  stops?: string[];
};

export type RouteSearchFn = (from: string, to: string, time: string) => void;
