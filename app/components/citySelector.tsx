import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Button } from "~/components/ui/button";

export default function CitySelector({
  cities,
  onCitySelect,
}: CitySelectorProps) {
  return (
    <Carousel className="w-full p-2 m-2" orientation="vertical">
      <CarouselContent>
        {cities.map((name, index) => (
          <CarouselItem key={index}>
            <Button
              onClick={() => onCitySelect(name)}
              size="lg"
              className="p-1 w-full"
            >
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
  onCitySelect: (city: String) => void;
};
