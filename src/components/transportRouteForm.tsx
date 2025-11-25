import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRightFromLine, ArrowRightToLine } from "lucide-react";

export default function TransportRouteForm({ city }: TransportRouteFormParams) {
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
          <InputGroupInput placeholder="start point" />
          <InputGroupAddon>
            <ArrowRightFromLine />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="destination" />
          <InputGroupAddon>
            <ArrowRightToLine />
          </InputGroupAddon>
        </InputGroup>
        <div className="flex flex-row gap-2 items-center justify-between">
          <p> time </p>
          <Button>Search</Button>
        </div>
      </CardContent>
      <CardFooter className=""></CardFooter>
    </Card>
  );
}

export type TransportRouteFormParams = {
  city: string;
};
