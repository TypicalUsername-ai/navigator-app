import { useEffect, useRef } from "react";
import L, { LatLngExpression, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

type Marker = { position: LatLngExpression; label?: string };

export default function TrainMap({
  center = [52.2297, 21.0122],
  markers = [],
  path = [],
}: {
  center?: LatLngExpression;
  markers?: Marker[];
  path?: LatLngExpression[];
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<{ markers: L.LayerGroup; path: L.Polyline } | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!instanceRef.current) {
      const map = L.map(mapRef.current).setView(center, 6);
      instanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      const pathLayer = L.polyline([], { color: "#2563eb", weight: 4 }).addTo(map);
      layerRef.current = { markers: markersLayer, path: pathLayer };
    }
  }, [center]);

  useEffect(() => {
    if (!instanceRef.current || !layerRef.current) return;
    const { markers: markersLayer, path: pathLayer } = layerRef.current;

    markersLayer.clearLayers();

    const icon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    markers.forEach((m) => {
      const marker = L.marker(m.position, { icon });
      if (m.label) marker.bindPopup(m.label);
      markersLayer.addLayer(marker);
    });

    pathLayer.setLatLngs(path);
    if (path.length) {
      instanceRef.current.fitBounds(L.latLngBounds(path), { padding: [20, 20] });
    }
  }, [markers, path]);

  return <div ref={mapRef} className="w-full h-80 rounded-md overflow-hidden border" />;
}
