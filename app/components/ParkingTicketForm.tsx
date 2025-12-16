import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
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
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (!selectedParking) {
      setPlateNumber("");
      setParkingHours(1);
    }
  }, [selectedParking]);

  const totalCost = selectedParking ? selectedParking.price * parkingHours : 0;

  const handleParkButtonClick = () => {
    if (!plateNumber.trim() || !selectedParking) {
      alert(
        "Please select a parking location and enter your vehicle plate number",
      );
      return;
    }

    const ticketData = {
      type: "parking" as const,
      name: selectedParking.name,
      total: totalCost,
      details: [
        { label: "Location", value: selectedParking.name },
        { label: "Address", value: selectedParking.address },
        { label: "Plate Number", value: plateNumber },
        { label: "Duration", value: `${parkingHours} hour(s)` },
        { label: "Rate", value: `$${selectedParking.price.toFixed(2)}/hr` },
      ],
    };

    navigate(`/${params.city}/payment`, { state: ticketData });
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
    <Card className="relative flex w-full flex-col gap-2 border border-gray-200 bg-white p-2 shadow-lg sm:gap-3 sm:p-3 md:p-4 lg:p-6">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute right-1 top-1 z-10 rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:right-2 sm:top-2 sm:p-1.5 md:right-3 md:top-3"
        aria-label="Close form"
      >
        <X className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      <CardHeader className="pr-6 sm:pr-8">
        <CardTitle className="text-base font-bold sm:text-xl md:text-2xl">
          Buy Parking Ticket
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 sm:gap-3 md:gap-4">
        {/* Parking location info */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 sm:p-3 md:p-4">
          <div className="mb-1 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
            <MapPin className="h-3 w-3 text-gray-600 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            <CardTitle className="text-sm font-semibold sm:text-base md:text-lg">
              {selectedParking.name}
            </CardTitle>
          </div>
          <p className="mb-2 text-[10px] text-gray-600 sm:mb-3 sm:text-xs md:text-sm">
            {selectedParking.address}
          </p>
          <div className="flex flex-wrap gap-2 text-[10px] sm:gap-3 sm:text-xs md:text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-gray-600">Capacity:</span>
              <span className="font-semibold">
                {selectedParking.available}
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
        <div className="flex flex-row gap-2 sm:gap-3 md:gap-4">
          <div className="flex-1">
            <Input
              placeholder="Plate number"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
              className="h-9 border-gray-300 text-sm focus:ring-black sm:h-10 md:h-11"
            />
          </div>

          <div className="flex items-center gap-2">
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
              className="h-9 w-16 border-gray-300 text-center text-sm focus:ring-black sm:h-10 sm:w-20 md:h-11"
            />
            <span className="text-xs text-gray-600 sm:text-sm">hour</span>
          </div>
        </div>

        {/* Cost summary */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 sm:p-3 md:p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs font-semibold text-black sm:text-sm md:text-base">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
              Total:
            </span>
            <span className="text-base font-bold text-black sm:text-lg md:text-xl">
              ${totalCost.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={handleParkButtonClick}
          disabled={!plateNumber.trim()}
          className="h-9 w-full bg-black text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 sm:h-10 sm:text-base md:h-11"
        >
          Buy Parking Ticket
        </Button>
      </CardFooter>
    </Card>
  );
}
