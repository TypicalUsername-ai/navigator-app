import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Button } from "~/components/ui/button";

export default function CitySelector({ cities }: CitySelectorProps) {
  return (
    <Carousel className="w-full max-w-xs" orientation="vertical">
      <CarouselContent>
        {cities.map((name, index) => (
          <CarouselItem key={index}>
            <Button size="lg" className="p-1 w-full">
              {name}
            </Button>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export type CitySelectorProps = {
  /** list of cities to display in the selector **/
  cities: String[];
};
