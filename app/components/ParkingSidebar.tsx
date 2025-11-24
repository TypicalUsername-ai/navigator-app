"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { MapPin, DollarSign, Car } from "lucide-react"
import { useState } from "react"

interface Parking {
    id: number
    name: string
    address: string
    lat: number
    lng: number
    available: number
    total: number
    price: number
}

interface ParkingSidebarProps {
    parkings: Parking[]
    selectedParking: Parking | null
    onSelectParking: (parking: Parking) => void
}

export default function ParkingSidebar({ parkings, selectedParking, onSelectParking }: ParkingSidebarProps) {
    const [reservedId, setReservedId] = useState<number | null>(null)

    const getAvailabilityColor = (available: number, total: number) => {
        const percent = available / total
        if (percent > 0.5) return "bg-gray-100 text-gray-800 border-gray-300"
        if (percent > 0.3) return "bg-gray-200 text-gray-900 border-gray-400"
        return "bg-gray-800 text-white border-gray-900"
    }

    return (
        <div className="w-full bg-white border-l border-gray-200 border-t lg:border-t-0 overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="bg-black text-white px-4 lg:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                    <h2 className="font-semibold text-lg">Parking Locations</h2>
                    <p className="text-sm text-gray-300">{parkings.length} available</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {parkings.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                        <p>No parking locations found</p>
                    </div>
                ) : (
                    <div className="space-y-2 p-4">
                        {parkings.map((parking) => (
                            <Card
                                key={parking.id}
                                className={`cursor-pointer transition-all hover:shadow-md border-gray-200 ${
                                    selectedParking?.id === parking.id ? "ring-2 ring-black bg-gray-50" : "hover:bg-gray-50"
                                }`}
                                onClick={() => onSelectParking(parking)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <CardTitle className="text-base">{parking.name}</CardTitle>
                                            <CardDescription className="flex items-center gap-1 mt-1 text-gray-600">
                                                <MapPin className="w-3 h-3" />
                                                {parking.address}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline" className={getAvailabilityColor(parking.available, parking.total)}>
                                            {parking.available}/{parking.total}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Car className="w-4 h-4" />
                                            <span>Availability</span>
                                        </div>
                                        <div className="font-semibold text-black">
                                            {Math.round((parking.available / parking.total) * 100)}%
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <DollarSign className="w-4 h-4" />
                                            <span>Price/Hour</span>
                                        </div>
                                        <div className="font-semibold text-black">${parking.price.toFixed(2)}</div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${
                                                parking.available / parking.total > 0.5
                                                    ? "bg-gray-500"
                                                    : parking.available / parking.total > 0.3
                                                        ? "bg-gray-600"
                                                        : "bg-black"
                                            }`}
                                            style={{ width: `${(parking.available / parking.total) * 100}%` }}
                                        />
                                    </div>

                                    {selectedParking?.id === parking.id && (
                                        <Button
                                            className="w-full bg-black text-white hover:bg-gray-800"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setReservedId(parking.id)
                                                setTimeout(() => setReservedId(null), 2000)
                                            }}
                                        >
                                            {reservedId === parking.id ? "✓ Reserved!" : "Reserve Spot"}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
