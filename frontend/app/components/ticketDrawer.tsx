import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import TicketCard, { type TicketCardProps } from "~/components/ticketCard";

export default function TicketDrawer() {
  const tickets: TicketCardProps[] = [
    {
      id: "88888-88-88-88-888888",
      title: "All Lines (Zone A)",
      line: "107",
      type: "transport",
      validThrough: new Date(),
      description:
        "allows travel on all lines for 30 consecutive calendar days starting on the ticket-indicated date.",
      badges: [
        { text: "30 days", color: "teal" },
        { text: "student", color: "blue" },
      ],
    },
    {
      id: "11111-88-88-88-888888",
      title: "Wroclaw Gl to Krakow Gl",
      line: "IC3610",
      type: "train",
      validThrough: new Date(),
      description:
        "allows travel on validate line starting on the ticket-indicated date.",
      badges: [
        { text: "Single", color: "teal" },
        { text: "student", color: "blue" },
      ],
    },
    {
      id: "11111-88-88-88-888888",
      title: "Parking NFM",
      line: "AAA-12345",
      type: "parking",
      validThrough: new Date(),
      description:
        "allows travel on validate line starting on the ticket-indicated date.",
      badges: [
        { text: "Single", color: "teal" },
        { text: "student", color: "blue" },
      ],
    },
  ];
  return (
    <Drawer>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>
            <Button variant="outline">My tickets</Button>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent>See all your active tickets</TooltipContent>
      </Tooltip>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Your Tickets</DrawerTitle>
            <DrawerDescription>
              See you active & periodic tickets
            </DrawerDescription>
          </DrawerHeader>
          <Carousel>
            <CarouselContent className="p-2">
              {tickets.map((ticket, index) => (
                <CarouselItem className="ml-1" key={index}>
                  <TicketCard {...ticket} key={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export type TicketDrawerProps = {
  tickets: TicketCardProps[];
};
