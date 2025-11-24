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

export default function EmptyCity() {
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
          <Button>Select City</Button>
          <Button variant="outline">Log In</Button>
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
