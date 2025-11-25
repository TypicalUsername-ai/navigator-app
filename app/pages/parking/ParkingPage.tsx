import { useState } from "react";
import ParkingMapPage from "~/pages/parking/ParkingMapPage";
import ParkingTicketPage from "~/pages/parking/ParkingTicketPage";
import ParkingHeader from "~/components/ParkingHeader";

export default function ParkingPage() {
    const [viewAllTickets, setViewAllTickets] = useState(false)
    const title = viewAllTickets ? "All Parking Tickets" : "Parking Map"
    const subtitle = viewAllTickets
        ? "Browse and manage all available parking tickets"
        : "Find and reserve your parking spot"

    return (
        <div className="min-h-screen bg-gray-50">
            <ParkingHeader isViewingTickets={viewAllTickets} onToggleView={() => setViewAllTickets(!viewAllTickets)} title={title} subtitle={subtitle} />
            {viewAllTickets ? <ParkingTicketPage /> : <ParkingMapPage />}
        </div>
    )
}