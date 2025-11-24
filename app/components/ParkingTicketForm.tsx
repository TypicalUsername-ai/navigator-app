"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { MapPin, DollarSign } from "lucide-react"

interface Parking {
    id: number
    name: string
    address: string
    available: number
    total: number
    price: number
}

interface ParkingTicketFormProps {
    selectedParking: Parking | null
}

export default function ParkingTicketForm({ selectedParking }: ParkingTicketFormProps) {
    const [plateNumber, setPlateNumber] = useState("")
    const [parkingHours, setParkingHours] = useState(1)
    const [isBooking, setIsBooking] = useState(false)

    const totalCost = selectedParking ? selectedParking.price * parkingHours : 0

    const handleParkButtonClick = async () => {
        if (!plateNumber.trim() || !selectedParking) {
            alert("Please select a parking location and enter your vehicle plate number")
            return
        }

        setIsBooking(true)
        // Simulate booking process
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsBooking(false)

        alert(
            `Ticket booked!\nVehicle: ${plateNumber}\nLocation: ${selectedParking.name}\nDuration: ${parkingHours} hour(s)\nTotal: $${totalCost.toFixed(2)}`,
        )

        // Reset form
        setPlateNumber("")
        setParkingHours(1)
    }

    return (
        <div className="w-full bg-white border-l border-gray-200 border-t lg:border-t-0 p-4 lg:p-6 flex flex-col h-full">
            {/* Header */}
            <h2 className="text-2xl font-bold text-black mb-2">Buy Parking Ticket</h2>
            <p className="text-gray-600 mb-6">Enter your vehicle details and select duration</p>

            {/* Selected Parking Info */}
            {selectedParking ? (
                <Card className="mb-6 border-gray-200 bg-gray-50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            {selectedParking.name}
                        </CardTitle>
                        <CardDescription className="text-gray-600">{selectedParking.address}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Available Spots:</span>
                            <span className="font-semibold">
                {selectedParking.available}/{selectedParking.total}
              </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Price per Hour:</span>
                            <span className="font-semibold">${selectedParking.price.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="mb-6 border-gray-200 bg-gray-100 p-4 text-center">
                    <p className="text-gray-500">Select a parking location from the map</p>
                </Card>
            )}

            {/* Form Inputs */}
            <div className="space-y-6 flex-1">
                {/* Vehicle Plate Number */}
                <div>
                    <label className="block text-sm font-semibold text-black mb-2">Vehicle Plate Number</label>
                    <Input
                        placeholder="e.g., ABC-1234"
                        value={plateNumber}
                        onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                        className="border-gray-300 focus:ring-black h-10"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter your vehicle license plate</p>
                </div>

                {/* Parking Duration */}
                <div>
                    <label className="block text-sm font-semibold text-black mb-2">Parking Duration (Hours)</label>
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
                            onChange={(e) => setParkingHours(Math.max(1, Number.parseInt(e.target.value) || 1))}
                            className="border-gray-300 focus:ring-black text-center h-10 flex-1"
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
                    <p className="text-xs text-gray-500 mt-1">Choose between 1-24 hours</p>
                </div>

                {/* Cost Summary */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{parkingHours} hour(s)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rate:</span>
                        <span className="font-medium">${selectedParking?.price.toFixed(2) || "0.00"}/hr</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 flex justify-between items-center">
            <span className="font-semibold text-black flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              Total Cost:
            </span>
                        <span className="text-xl font-bold text-black">${totalCost.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Park Button */}
            <Button
                onClick={handleParkButtonClick}
                disabled={!selectedParking || isBooking}
                className="w-full bg-black text-white hover:bg-gray-800 h-11 text-base font-semibold mt-6"
            >
                {isBooking ? "Processing..." : "Buy Parking Ticket"}
            </Button>
        </div>
    )
}
