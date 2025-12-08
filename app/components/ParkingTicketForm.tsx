import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
  CardFooter,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { MapPin, DollarSign } from "lucide-react";

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
}

export default function ParkingTicketForm({
  selectedParking,
}: ParkingTicketFormProps) {
  const [plateNumber, setPlateNumber] = useState<string | null>("");
  const [parkingHours, setParkingHours] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

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
  };

  return (
    <Card
      className={`flex w-full flex-col gap-3 border-t border-l border-gray-200 bg-white p-2 lg:border-t-0 lg:p-6 ${selectedParking ? "" : "max-lg:hidden"}`}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Buy Parking Ticket</CardTitle>
        <CardDescription className="text-gray-600">
          Enter your vehicle details and select duration
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedParking ? (
          <Card className="border-gray-200 bg-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                {selectedParking.name}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {selectedParking.address}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Available Spots:</span>
                <span className="font-semibold">
                  {selectedParking.available}/{selectedParking.total}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price per Hour:</span>
                <span className="font-semibold">
                  ${selectedParking.price.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-200 bg-gray-100 text-center">
            <p className="text-gray-500">
              Select a parking location from the map
            </p>
          </Card>
        )}

        <div className="flex-1">
          <div>
            <label className="block text-sm font-semibold text-black">
              Vehicle Plate Number
            </label>
            <Input
              placeholder="e.g., ABC-1234"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
              className="h-10 border-gray-300 focus:ring-black"
            />
            <p className="text-xs text-gray-500">
              Enter your vehicle license plate
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black">
              Parking Duration (Hours)
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 bg-transparent"
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
                    Math.max(1, Number.parseInt(e.target.value) || 1),
                  )
                }
                className="h-10 flex-1 border-gray-300 text-center focus:ring-black"
              />
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 bg-transparent"
                onClick={() => setParkingHours(Math.min(24, parkingHours + 1))}
              >
                +
              </Button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Choose between 1-24 hours
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{parkingHours} hour(s)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Rate:</span>
              <span className="font-medium">
                ${selectedParking?.price.toFixed(2) || "0.00"}/hr
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-300 pt-2">
              <span className="flex items-center gap-1 font-semibold text-black">
                <DollarSign className="h-4 w-4" />
                Total Cost:
              </span>
              <span className="text-xl font-bold text-black">
                ${totalCost.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <CardAction className="flex h-11 flex-row items-center justify-between gap-2">
          <Button
            onClick={handleParkButtonClick}
            disabled={!selectedParking || isBooking}
            className="bg-black text-base font-semibold text-white hover:bg-gray-800"
          >
            {isBooking ? "Processing..." : "Buy Parking Ticket"}
          </Button>
          <Button variant="destructive" className="w-1/5">
            clear
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
