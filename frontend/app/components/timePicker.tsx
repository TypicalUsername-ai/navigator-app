import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useState } from "react";

export default function TimePicker({
  onChange,
  initHour,
  initMinute,
}: TimePickerProps) {
  const hours = [...Array(24).keys()];
  const minutes = [...Array(60).keys()];
  const [hour, setHour] = useState<number>(initHour);
  const [minute, setMinute] = useState<number>(initMinute);

  return (
    <div className="flex flex-row">
      <Select
        defaultValue={initHour}
        onValueChange={(e) => {
          onChange(e, minute);
          setHour(e);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={initHour} />
        </SelectTrigger>
        <SelectContent className="h-[200px]">
          <SelectGroup>
            {hours.map((val) => (
              <SelectItem key={val} value={val}>
                {val.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        defaultValue={initMinute}
        onValueChange={(e) => {
          onChange(hour, e);
          setMinute(e);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={initMinute} />
        </SelectTrigger>
        <SelectContent className="h-[200px]">
          <SelectGroup>
            {minutes.map((val) => (
              <SelectItem key={val} value={val}>
                {val.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
export type TimePickerProps = {
  initHour: number;
  initMinute: number;
  onChange: (hour: number, minute: number) => void;
};
