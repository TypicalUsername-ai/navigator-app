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
      title: "All Lines (Zone A)",
      description: "aaaaa",
      badges: ["30 days", "student"],
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
              <p>See you active & periodic tickets</p>
            </DrawerDescription>
          </DrawerHeader>
          <Carousel>
            <CarouselContent>
              {tickets.map((ticket, index) => (
                <CarouselItem>
                  <TicketCard {...ticket} />
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
