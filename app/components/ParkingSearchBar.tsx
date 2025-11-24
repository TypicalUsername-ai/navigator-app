"use client"

import { Input } from "~/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search by parking name or address..."
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="pl-10 h-11 text-base border-gray-300 focus:ring-black"
                    />
                </div>
            </div>
        </div>
    )
}
