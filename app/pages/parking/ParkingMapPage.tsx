import { useState } from "react";
import ParkingMap from "~/components/ParkingMap";
import ParkingTicketForm from "~/components/ParkingTicketForm";
import ParkingSearchBar from "~/components/parkingSearchBar";

interface ParkingLocation {
  id: number;
  name: string;
  address: string;
  available: number;
  total: number;
  price: number;
  lat: number;
  lng: number;
}
const PARKING_LOCATIONS: ParkingLocation[] = [
  {
    id: 1,
    name: "Downtown Garage",
    address: "123 Main St",
    available: 45,
    total: 150,
    price: 5,
    lat: 40.758,
    lng: -73.9855,
  },
  {
    id: 2,
    name: "Central Park Lot",
    address: "456 Park Ave",
    available: 12,
    total: 80,
    price: 8,
    lat: 40.7849,
    lng: -73.9681,
  },
  {
    id: 3,
    name: "Market Street Parking",
    address: "789 Market St",
    available: 67,
    total: 200,
    price: 3,
    lat: 40.7505,
    lng: -74.0055,
  },
  {
    id: 4,
    name: "River View Garage",
    address: "321 River Rd",
    available: 28,
    total: 120,
    price: 6,
    lat: 40.7614,
    lng: -73.9776,
  },
  {
    id: 5,
    name: "East Side Lot",
    address: "654 East Ave",
    available: 5,
    total: 60,
    price: 4,
    lat: 40.7489,
    lng: -73.968,
  },
  {
    id: 6,
    name: "West End Parking",
    address: "987 West St",
    available: 89,
    total: 250,
    price: 4.5,
    lat: 40.7505,
    lng: -74.0055,
  },
];

export default function ParkingMapPage() {
  const [selectedParking, setSelectedParking] = useState<
    (typeof PARKING_LOCATIONS)[0] | null
  >(null);

  return (
    <div className="relative-z-0 flex h-screen w-screen flex-col items-center justify-center gap-1">
      <div className="z-0 h-full w-full">
        <ParkingMap
          parkings={PARKING_LOCATIONS}
          selectedParking={selectedParking}
          onSelectParking={setSelectedParking}
        />
      </div>

      {selectedParking && (
        <div className="absolute z-10 flex flex-col justify-center overflow-y-auto p-2 max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:max-h-[50vh] lg:right-4 lg:top-4 lg:w-96 lg:max-h-[calc(100vh-2rem)]">
          <ParkingTicketForm
            selectedParking={selectedParking}
            onClose={() => setSelectedParking(null)}
          />
        </div>
      )}

      <div className="absolute top-3 z-10">
        <ParkingSearchBar />
      </div>
    </div>
  );
}
