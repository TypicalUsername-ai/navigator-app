import {Button} from "~/components/ui/button";

interface ParkingHeaderProps {
    isViewingTickets: boolean
    onToggleView: () => void
    title: string
    subtitle: string
}

export default function ParkingHeader({ isViewingTickets, onToggleView, title, subtitle}: ParkingHeaderProps) {
    return (
        <header className="bg-black text-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <span className="text-black font-bold text-lg">P</span>
                        </div>
                        <h1 className="text-2xl font-bold">{title}</h1>
                    </div>
                    <Button className="bg-white text-black hover:bg-white/90" onClick={onToggleView}>{isViewingTickets ? "View Parking Map" : "View All Parking Tickets"}</Button>
                </div>
                <p className="text-gray-300 text-sm mt-1">{subtitle}</p>
            </div>
        </header>
    )
}
