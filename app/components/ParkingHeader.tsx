export default function ParkingHeader() {
    return (
        <header className="bg-black text-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-black font-bold text-lg">P</span>
                    </div>
                    <h1 className="text-2xl font-bold">ParkFinder</h1>
                </div>
                <p className="text-gray-300 text-sm mt-1">Find and reserve your parking spot</p>
            </div>
        </header>
    )
}
