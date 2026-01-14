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

export default function TransportRouteOverview({
  city,
  from,
  to,
  time,
}: TransportRouteOverviewParams) {
  return (
    <Card className="w-full max-w-96 border-3 border-dashed border-zinc-400">
      <CardHeader>
        <CardTitle className="text-start text-xl">{city}</CardTitle>
        <CardDescription className="m-0 p-0 text-end text-start text-sm">
          <div className="flex flex-row gap-2">
            <ArrowRightFromLine />
            {from}
          </div>
          <div className="flex flex-row gap-2">
            <ArrowRightToLine />
            {to}
          </div>
          {time}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export type TransportRouteOverviewParams = {
  city: string;
  from: string;
  to: string;
  time: string;
};
