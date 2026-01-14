import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "~/components/ui/input-group";
import { Card } from "~/components/ui/card";
import { Radar } from "lucide-react";

export default function ParkingSearchBar() {
  return (
    <div>
      <InputGroup className="bg-secondary rounded-md p-2">
        <InputGroupAddon>
          <Radar />
        </InputGroupAddon>
        <InputGroupInput type="text" placeholder="location" />
        <InputGroupButton> Search </InputGroupButton>
      </InputGroup>
    </div>
  );
}
