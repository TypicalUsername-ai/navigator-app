import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Parking {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  available: number;
  total: number;
  price: number;
}

interface ParkingMapProps {
  parkings: Parking[];
  selectedParking: Parking | null;
  onSelectParking: (parking: Parking) => void;
}

export default function ParkingMap({
  parkings,
  selectedParking,
  onSelectParking,
}: ParkingMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      zoomControl: false, // Disable default zoom control
    }).setView([40.7648, -73.9776], 14);

    // Add zoom control to top-right corner
    L.control.zoom({ position: "topright" }).addTo(mapRef.current);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    parkings.forEach((parking) => {
      const availabilityPercent = parking.available / parking.total;

      const markerColor =
        selectedParking?.id === parking.id
          ? "black"
          : availabilityPercent > 0.3
            ? "#6b7280"
            : "#1f2937";

      const html = `
        <div style="
          width: 32px;
          height: 32px;
          background-color: ${markerColor};
          border: ${selectedParking?.id === parking.id ? "3px solid white" : "none"};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          ${parking.available}
        </div>
      `;

      const marker = L.marker([parking.lat, parking.lng], {
        icon: L.divIcon({
          html,
          iconSize: [32, 32],
          className: "",
        }),
      })
        .addTo(mapRef.current!)
        .on("click", () => onSelectParking(parking));

      markersRef.current.set(parking.id, marker);
    });
  }, [parkings, selectedParking, onSelectParking]);

  useEffect(() => {
    if (selectedParking && mapRef.current) {
      mapRef.current.panTo([selectedParking.lat, selectedParking.lng]);
    }
  }, [selectedParking]);

  return (
    <div className="flex h-full w-full flex-col">
      <div
        ref={containerRef}
        className="flex-1 rounded-lg bg-white shadow-sm"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
}
