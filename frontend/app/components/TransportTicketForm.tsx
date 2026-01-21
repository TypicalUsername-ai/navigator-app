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
import { DollarSign, X, BusFront, TramFront } from "lucide-react";
import type { LineConnection } from "~/pages/transport/transportSearchPage";

interface TransportTicketFormProps {
  routeConnections: LineConnection[] | null;
  routeIndex: number | null;
  from: string;
  to: string;
  onClose: () => void;
}

type TicketType = "student-15" | "student-30" | "regular-15" | "regular-30";

interface TicketOption {
  id: TicketType;
  name: string;
  duration: string;
  price: number;
  badge: string;
  badgeColor: string;
}

const TICKET_OPTIONS: TicketOption[] = [
  {
    id: "regular-15",
    name: "Regular 15 minutes",
    duration: "15 minutes",
    price: 4.0,
    badge: "Regular",
    badgeColor: "bg-blue-600",
  },
  {
    id: "regular-30",
    name: "Regular 30 minutes",
    duration: "30 minutes",
    price: 7.0,
    badge: "Regular",
    badgeColor: "bg-blue-600",
  },
  {
    id: "student-15",
    name: "Student 15 minutes",
    duration: "15 minutes",
    price: 2.0,
    badge: "Student",
    badgeColor: "bg-teal-600",
  },
  {
    id: "student-30",
    name: "Student 30 minutes",
    duration: "30 minutes",
    price: 3.5,
    badge: "Student",
    badgeColor: "bg-teal-600",
  },
];

export default function TransportTicketForm({
  routeConnections,
  routeIndex,
  from,
  to,
  onClose,
}: TransportTicketFormProps) {
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const navigate = useNavigate();
  const params = useParams();

  if (!routeConnections) {
    return null;
  }

  const handleBuyTicket = () => {
    if (!selectedTicket) {
      alert("Please select a ticket type");
      return;
    }

    const ticket = TICKET_OPTIONS.find((t) => t.id === selectedTicket);
    if (!ticket) return;

    const lines = routeConnections
      .map((conn) => `${conn.transportType} ${conn.lineNo}`)
      .join(", ");

    const ticketData = {
      type: "transport" as const,
      name: `${from} → ${to}`,
      total: ticket.price,
      details: [
        { label: "From", value: from },
        { label: "To", value: to },
        { label: "Lines", value: lines },
        { label: "Ticket Type", value: ticket.name },
        { label: "Valid For", value: ticket.duration },
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
          Buy Transport Ticket
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

          {/* Transport lines */}
          <div className="flex flex-wrap gap-2 mt-2">
            {routeConnections.map((connection, index) => (
              <div key={index} className="flex items-center gap-1">
                {connection.transportType === "tram" ? (
                  <TramFront size={20} />
                ) : (
                  <BusFront size={20} />
                )}
                <Badge variant="outline" className="text-xs">
                  {connection.lineNo}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket options */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Select Ticket Type:</span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {TICKET_OPTIONS.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket.id)}
                className={`rounded-lg border-2 p-3 text-left transition-all ${
                  selectedTicket === ticket.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={ticket.badgeColor}>
                        {ticket.badge}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold">{ticket.duration}</p>
                  </div>
                  <span className="text-lg font-bold">
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
                {TICKET_OPTIONS.find((t) => t.id === selectedTicket)?.price.toFixed(2)} zł
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
