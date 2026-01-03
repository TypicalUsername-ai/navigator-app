import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export default function CitySelector({
  cities,
  onCitySelect,
}: CitySelectorProps) {
  return (
    <Carousel
      className="m-2 max-h-96 w-full"
      orientation="vertical"
      opts={{ align: "start", loop: true }}
    >
      <CarouselPrevious />
      <CarouselNext />
      <Tooltip>
        <TooltipTrigger asChild>
          <CarouselContent className="h-2/5 max-h-96">
            {cities.map((name, index) => (
              <CarouselItem
                className="flex basis-1/6 flex-col items-center pl-1"
                key={index}
              >
                <Button
                  onClick={() => onCitySelect(name)}
                  className="w-3/5 max-w-96 p-1"
                  size="lg"
                >
                  {name}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </TooltipTrigger>
        <TooltipContent>
          Select a city you would like to search parking & public transport in
        </TooltipContent>
      </Tooltip>
    </Carousel>
  );
}

export type CitySelectorProps = {
  /** list of cities to display in the selector **/
  cities: string[];
  onCitySelect: (city: string) => void;
};
