import { Card } from "~/components/ui/card";
import { useState, useEffect } from "react";

interface ParkingTicket {
  id: string;
  address: string;
  boughtAt: string; // ISO timestamp
  expiresAt: number; // timestamp in ms
  vehiclePlateNumber: string;
  status: "paid" | "expired";
}

const PARKING_TICKETS: ParkingTicket[] = [
  {
    id: "T001",
    address: "123 Main St, Downtown",
    boughtAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: Date.now() + 2 * 24 * 60 * 60 * 1000,
    vehiclePlateNumber: "ABA7281",
    status: "paid",
  },
  {
    id: "T002",
    address: "456 Park Ave, Midtown",
    boughtAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: Date.now() + 5 * 24 * 60 * 60 * 1000,
    vehiclePlateNumber: "CDE4320", // changed from price: 50
    status: "paid",
  },
  {
    id: "T003",
    address: "789 Harbor St, Waterfront",
    boughtAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    vehiclePlateNumber: "FGH9987", // changed from price: 75
    status: "expired",
  },
];

function TimeLeft({
  expiresAt,
  status,
}: {
  expiresAt: number;
  status: "paid" | "expired";
}) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = expiresAt - now;

      if (difference <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setTimeLeft(`${minutes}m left`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <span
      className={
        status === "paid"
          ? "font-semibold text-green-600"
          : "font-semibold text-red-600"
      }
    >
      {timeLeft}
    </span>
  );
}

export default function ParkingTicketPage() {
  const [filter, setFilter] = useState<"all" | "paid" | "expired">("all");

  const filteredTickets =
    filter === "all"
      ? PARKING_TICKETS
      : PARKING_TICKETS.filter((ticket) => ticket.status === filter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <h2 className="mb-1 text-2xl font-bold sm:mb-2 sm:text-3xl">
          Your Parking Tickets
        </h2>
        <p className="text-sm text-gray-600 sm:text-base">
          View your paid (active) and expired parking permits
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "paid", "expired"] as const).map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === filterOption
                ? filterOption === "paid"
                  ? "bg-green-600 text-white"
                  : filterOption === "expired"
                    ? "bg-red-600 text-white"
                    : "bg-gray-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {filterOption === "paid"
              ? "Paid"
              : filterOption === "expired"
                ? "Expired"
                : "All"}{" "}
            (
            {
              PARKING_TICKETS.filter(
                (t) => filterOption === "all" || t.status === filterOption,
              ).length
            }
            )
          </button>
        ))}
      </div>

      <div className="space-y-3 sm:space-y-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="p-4 transition-shadow hover:shadow-lg sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold sm:text-base">
                    {ticket.address}
                  </p>
                  <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                    Bought at: {new Date(ticket.boughtAt).toLocaleDateString()}{" "}
                    {new Date(ticket.boughtAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                    Expires at:{" "}
                    {new Date(ticket.expiresAt).toLocaleDateString()}{" "}
                    {new Date(ticket.expiresAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                  <div className="text-sm">
                    <TimeLeft
                      expiresAt={ticket.expiresAt}
                      status={ticket.status}
                    />
                  </div>
                  <div className="text-base font-bold sm:text-lg">
                    {ticket.vehiclePlateNumber}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-8 text-center sm:py-12">
            <p className="text-sm text-gray-600 sm:text-base">
              No {filter !== "all" ? filter : ""} tickets found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
