import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

import { Button } from "~/components/ui/button";

export default function RoutesQuickAccess({
  routes,
  onRouteClick,
  onRoutesExpand,
}: RoutesQuickAccessProps) {
  return (
    <Card className="gap-1 p-2 w-full max-w-96">
      <CardHeader>
        <CardTitle className="text-start">Recent lines</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel className="" orientation="horizontal">
          <CarouselContent>
            {routes.map((route, index) => (
              <CarouselItem className="basis-1/5" key={index}>
                <Button onClick={() => onRouteClick(route)}>{route}</Button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </CardContent>
      <CardAction>
        <Button
          onClick={onRoutesExpand}
          className="text-sm m-2"
          variant="outline"
        >
          other routes
        </Button>
      </CardAction>
    </Card>
  );
}

export type RoutesQuickAccessProps = {
  routes: string[];
  onRouteClick: (route: string) => void;
  onRoutesExpand: () => void;
};
