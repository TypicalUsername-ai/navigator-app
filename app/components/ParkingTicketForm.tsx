import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { MapPin, DollarSign, X } from "lucide-react";

interface Parking {
  id: number;
  name: string;
  address: string;
  available: number;
  total: number;
  price: number;
}

interface ParkingTicketFormProps {
  selectedParking: Parking | null;
  onClose: () => void;
}

export default function ParkingTicketForm({
  selectedParking,
  onClose,
}: ParkingTicketFormProps) {
  const [plateNumber, setPlateNumber] = useState<string>("");
  const [parkingHours, setParkingHours] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  // Reset form when parking is deselected
  useEffect(() => {
    if (!selectedParking) {
      setPlateNumber("");
      setParkingHours(1);
    }
  }, [selectedParking]);

  const totalCost = selectedParking ? selectedParking.price * parkingHours : 0;

  const handleParkButtonClick = async () => {
    if (!plateNumber.trim() || !selectedParking) {
      alert(
        "Please select a parking location and enter your vehicle plate number",
      );
      return;
    }

    setIsBooking(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsBooking(false);

    alert(
      `Ticket booked!\nVehicle: ${plateNumber}\nLocation: ${selectedParking.name}\nDuration: ${parkingHours} hour(s)\nTotal: $${totalCost.toFixed(2)}`,
    );

    setPlateNumber("");
    setParkingHours(1);
    onClose();
  };

  const handleClose = () => {
    setPlateNumber("");
    setParkingHours(1);
    onClose();
  };

  if (!selectedParking) {
    return null;
  }

  return (
    <Card className="relative flex w-full flex-col gap-3 border border-gray-200 bg-white p-3 shadow-lg md:p-4 lg:p-6">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute right-2 top-2 z-10 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 md:right-3 md:top-3"
        aria-label="Close form"
      >
        <X className="h-5 w-5" />
      </button>

      <CardHeader className="pr-8">
        <CardTitle className="text-xl font-bold md:text-2xl">
          Buy Parking Ticket
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Parking location info */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 md:p-4">
          <div className="mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-600 md:h-5 md:w-5" />
            <CardTitle className="text-base font-semibold md:text-lg">
              {selectedParking.name}
            </CardTitle>
          </div>
          <p className="mb-3 text-xs text-gray-600 md:text-sm">
            {selectedParking.address}
          </p>
          <div className="flex flex-wrap gap-3 text-xs md:text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-gray-600">Available:</span>
              <span className="font-semibold">
                {selectedParking.available}/{selectedParking.total}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-gray-600">Rate:</span>
              <span className="font-semibold">
                ${selectedParking.price.toFixed(2)}/hr
              </span>
            </div>
          </div>
        </div>

        {/* Plate number and hours on same row */}
        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          <div className="flex-1">
            <Input
              placeholder="Plate number"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
              className="h-10 border-gray-300 focus:ring-black md:h-11"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-10 border-gray-300 bg-transparent px-3 md:h-11"
              onClick={() => setParkingHours(Math.max(1, parkingHours - 1))}
            >
              −
            </Button>
            <Input
              type="number"
              min="1"
              max="24"
              value={parkingHours}
              onChange={(e) =>
                setParkingHours(
                  Math.max(1, Math.min(24, Number.parseInt(e.target.value) || 1)),
                )
              }
              className="h-10 w-20 border-gray-300 text-center focus:ring-black md:h-11"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-10 border-gray-300 bg-transparent px-3 md:h-11"
              onClick={() => setParkingHours(Math.min(24, parkingHours + 1))}
            >
              +
            </Button>
          </div>
        </div>

        {/* Cost summary */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 md:p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-sm font-semibold text-black md:text-base">
              <DollarSign className="h-4 w-4" />
              Total:
            </span>
            <span className="text-lg font-bold text-black md:text-xl">
              ${totalCost.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={handleParkButtonClick}
          disabled={!plateNumber.trim() || isBooking}
          className="h-11 w-full bg-black text-base font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {isBooking ? "Processing..." : "Buy Parking Ticket"}
        </Button>
      </CardFooter>
    </Card>
  );
}
