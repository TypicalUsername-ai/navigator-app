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

import TicketCard from "~/components/ticketCard";

export default function TicketDrawer() {
  const tickets: TicketCardProps[] = [
    {
      id: "88888-88-88-88-888888",
      title: "All Lines (Zone A)",
      description: "aaaaa",
      badges: [
        { text: "30 days", color: "bg-teal-500" },
        { text: "student", color: "bg-blue-500" },
      ],
    },
  ];
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Your Tickets</DrawerTitle>
            <DrawerDescription>
              See you active & periodic tickets
            </DrawerDescription>
          </DrawerHeader>
          <Carousel>
            <CarouselContent>
              {tickets.map((ticket, index) => (
                <CarouselItem key={index}>
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
