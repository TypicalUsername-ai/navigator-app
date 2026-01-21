import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { DollarSign, X, TrainFront } from "lucide-react";
import type { LineConnection } from "~/pages/trains/trainSearchPage";

interface TrainTicketFormProps {
  routeConnections: LineConnection[] | null;
  routeIndex: number | null;
  from: string;
  to: string;
  onClose: () => void;
}

type TicketType = "student" | "regular";

interface TicketOption {
  id: TicketType;
  name: string;
  price: number;
  badge: string;
  badgeColor: string;
}

// Generate random price in specified range
function generateTrainPrice(isStudent: boolean): number {
  if (isStudent) {
    // Student range: 20-80 zł
    const price = 20 + Math.random() * 60;
    return Math.round(price * 2) / 2; // Round to nearest 0.50 zł
  } else {
    // Regular range: 50-160 zł
    const price = 50 + Math.random() * 110;
    return Math.round(price * 2) / 2; // Round to nearest 0.50 zł
  }
}

export default function TrainTicketForm({
  routeConnections,
  routeIndex,
  from,
  to,
  onClose,
}: TrainTicketFormProps) {
  const navigate = useNavigate();
  const params = useParams();
  
  if (!routeConnections) {
    return null;
  }

  // Count total stops for display
  const totalStops = routeConnections.reduce(
    (sum, conn) => sum + (conn.viaStops?.length || 0) + 1,
    0
  );

  // Generate ticket options with prices only once
  const [ticketOptions] = useState<TicketOption[]>(() => [
    {
      id: "regular",
      name: "Regular Ticket",
      price: generateTrainPrice(false),
      badge: "Regular",
      badgeColor: "bg-blue-600",
    },
    {
      id: "student",
      name: "Student Ticket",
      price: generateTrainPrice(true),
      badge: "Student",
      badgeColor: "bg-teal-600",
    },
  ]);

  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

  const handleBuyTicket = () => {
    if (!selectedTicket) {
      alert("Please select a ticket type");
      return;
    }

    const ticket = ticketOptions.find((t) => t.id === selectedTicket);
    if (!ticket) return;

    const lines = routeConnections
      .map((conn) => `${conn.transportType} ${conn.lineNo}`)
      .join(", ");

    const ticketData = {
      type: "train" as const,
      name: `${from} → ${to}`,
      total: ticket.price,
      details: [
        { label: "From", value: from },
        { label: "To", value: to },
        { label: "Train Lines", value: lines },
        { label: "Ticket Type", value: ticket.name },
        { label: "Total Stops", value: `${totalStops} stops` },
      ],
    };

    navigate(`/${params.city}/payment`, { state: ticketData });
  };

  return (
    <Card className="relative flex w-full flex-col gap-2 border border-gray-200 bg-white p-2 shadow-lg sm:gap-3 sm:p-3 md:p-4 lg:p-6">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-1 top-1 z-10 rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:right-2 sm:top-2 sm:p-1.5 md:right-3 md:top-3"
        aria-label="Close form"
      >
        <X className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      <CardHeader className="pr-6 sm:pr-8">
        <CardTitle className="text-base font-bold sm:text-xl md:text-2xl">
          Buy Train Ticket
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 sm:gap-3 md:gap-4">
        {/* Route info */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 sm:p-3 md:p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold sm:text-base md:text-lg">
                {from} → {to}
              </span>
              <span className="text-xs text-gray-600 sm:text-sm">
                Route option {(routeIndex ?? 0) + 1}
              </span>
            </div>
          </div>

          {/* Train lines */}
          <div className="flex flex-wrap gap-2 mt-2">
            {routeConnections.map((connection, index) => (
              <div key={index} className="flex items-center gap-1">
                <TrainFront size={20} />
                <Badge variant="outline" className="text-xs">
                  {connection.lineNo}
                </Badge>
                {connection.viaStops && connection.viaStops.length > 0 && (
                  <span className="text-xs text-gray-500">
                    ({connection.viaStops.length} stops)
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ticket options */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Select Ticket Type:</span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ticketOptions.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket.id)}
                className={`rounded-lg border-2 p-4 text-left transition-all ${
                  selectedTicket === ticket.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col gap-2">
                  <Badge className={ticket.badgeColor}>
                    {ticket.badge}
                  </Badge>
                  <span className="text-xl font-bold">
                    {ticket.price.toFixed(2)} zł
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cost summary */}
        {selectedTicket && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 sm:p-3 md:p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs font-semibold text-black sm:text-sm md:text-base">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                Total:
              </span>
              <span className="text-base font-bold text-black sm:text-lg md:text-xl">
                {ticketOptions.find((t) => t.id === selectedTicket)?.price.toFixed(2)} zł
              </span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={handleBuyTicket}
          disabled={!selectedTicket}
          className="h-9 w-full bg-black text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 sm:h-10 sm:text-base md:h-11"
        >
          Buy Ticket
        </Button>
      </CardFooter>
    </Card>
  );
}
