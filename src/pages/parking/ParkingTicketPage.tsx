"use client"

import { Card } from "@/components/ui"
import { useState, useEffect } from "react"

interface ParkingTicket {
    id: string
    address: string
    boughtAt: string 
    expiresAt: number 
    vehiclePlateNumber: string
    status: "paid" | "expired"
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
        vehiclePlateNumber: "CDE4320", 
        status: "paid",
    },
    {
        id: "T003",
        address: "789 Harbor St, Waterfront",
        boughtAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
        vehiclePlateNumber: "FGH9987", 
        status: "expired",
    },
]

function TimeLeft({ expiresAt, status }: { expiresAt: number; status: "paid" | "expired" }) {
    const [timeLeft, setTimeLeft] = useState("")

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = Date.now()
            const difference = expiresAt - now

            if (difference <= 0) {
                setTimeLeft("Expired")
                return
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24))
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
            const minutes = Math.floor((difference / 1000 / 60) % 60)

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h left`)
            } else if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m left`)
            } else {
                setTimeLeft(`${minutes}m left`)
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 60000)
        return () => clearInterval(timer)
    }, [expiresAt])

    return (
        <span className={status === "paid" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
      {timeLeft}
    </span>
    )
}

export default function ParkingTicketPage() {
    const [filter, setFilter] = useState<"all" | "paid" | "expired">("all")

    const filteredTickets = filter === "all" ? PARKING_TICKETS: PARKING_TICKETS.filter((ticket) => ticket.status === filter)

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Your Parking Tickets</h2>
                <p className="text-sm sm:text-base text-gray-600">View your paid (active) and expired parking permits</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {(["all", "paid", "expired"] as const).map((filterOption) => (
                    <button
                        key={filterOption}
                        onClick={() => setFilter(filterOption)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            filter === filterOption
                                ? filterOption === "paid"
                                    ? "bg-green-600 text-white"
                                    : filterOption === "expired"
                                        ? "bg-red-600 text-white"
                                        : "bg-gray-600 text-white"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                    >
                        {filterOption === "paid" ? "Paid" : filterOption === "expired" ? "Expired" : "All"} (
                        {PARKING_TICKETS.filter((t) => filterOption === "all" || t.status === filterOption).length})
                    </button>
                ))}
            </div>

            <div className="space-y-3 sm:space-y-4">
                {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                        <Card key={ticket.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm sm:text-base font-semibold truncate">{ticket.address}</p>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                        Bought at: {new Date(ticket.boughtAt).toLocaleDateString()}{" "}
                                        {new Date(ticket.boughtAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                        Expires at: {new Date(ticket.expiresAt).toLocaleDateString()}{" "}
                                        {new Date(ticket.expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                                    <div className="text-sm">
                                        <TimeLeft expiresAt={ticket.expiresAt} status={ticket.status} />
                                    </div>
                                    <div className="text-base sm:text-lg font-bold">
                                        {ticket.vehiclePlateNumber}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-8 sm:py-12">
                        <p className="text-gray-600 text-sm sm:text-base">No {filter !== "all" ? filter : ""} tickets found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
