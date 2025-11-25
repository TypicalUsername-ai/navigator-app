import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

export default function CitySelector({
  cities,
  onCitySelect,
}: CitySelectorProps) {
  return (
    <Carousel
      className="w-full m-2 max-h-96"
      orientation="vertical"
      opts={{ align: "start", loop: true }}
    >
      <CarouselPrevious />
      <CarouselNext />
      <CarouselContent className="h-2/5 max-h-96">
        {cities.map((name, index) => (
          <CarouselItem
            className="basis-1/6 pl-1 flex flex-col items-center"
            key={index}
          >
            <Button
              onClick={() => onCitySelect(name)}
              className="p-1 w-3/5 max-w-96"
              size="lg"
            >
              {name}
            </Button>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export type CitySelectorProps = {
  cities: String[];
  onCitySelect: (city: String) => void;
};
