import { Button } from "~/components/ui/button";
import { BusFront } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export default function EmptyCity({ onLogin, onCitySelect }: EmptyCityProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BusFront />
        </EmptyMedia>
        <EmptyTitle>Looks like you're new here</EmptyTitle>
        <EmptyDescription>
          If you have an account then Log In, or select a city to start
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onCitySelect}>Select City</Button>
            </TooltipTrigger>
            <TooltipContent>
              pick a city and start using the application right away
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onLogin} variant="outline">
                Log In
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              click if you already have an existing account and want to log in
            </TooltipContent>
          </Tooltip>
        </div>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="#"></a>
      </Button>
    </Empty>
  );
}

export type EmptyCityProps = {
  onLogin: () => void;
  onCitySelect: () => void;
};
