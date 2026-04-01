"use client";

import { useEffect, useRef, useState } from "react";
import type { Store } from "@/lib/mockData";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

const FONT = "'Caveat', cursive";

const MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#f2ebe0" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b5e50" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f2ebe0" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#d4c8b8" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#ede3d4" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#e8dfd0" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#8c7e6e" }] },
  { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#d8ead0" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#a89888" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#f5ede0" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#8c7e6e" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#b8a898" }] },
  { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#d4c8b8" }] },
  { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#c8d8e8" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#8c9eae" }] },
];

let optionsSet = false;
function ensureOptions() {
  if (optionsSet) return;
  setOptions({ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!, v: "weekly" });
  optionsSet = true;
}

function nearestNeighborOrder(stores: Store[]): Store[] {
  if (stores.length <= 2) return stores;
  const remaining = [...stores];
  const ordered: Store[] = [remaining.shift()!];
  while (remaining.length > 0) {
    const last = ordered[ordered.length - 1];
    let bestIdx = 0, bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const dx = remaining[i].lng - last.lng;
      const dy = remaining[i].lat - last.lat;
      const d = dx * dx + dy * dy;
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    }
    ordered.push(remaining.splice(bestIdx, 1)[0]);
  }
  return ordered;
}

interface RouteMapProps {
  stores: Store[];
  visitedIds: Set<string>;
  externalUserLocation?: { lat: number; lng: number } | null;
  onLocated?: (coords: { lat: number; lng: number }) => void;
}

export function RouteMap({ stores, visitedIds, externalUserLocation, onLocated }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const overlaysRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const infoWindowRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userMarkerRef = useRef<any>(null);
  const userLocatedRef = useRef(false);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    (async () => {
      ensureOptions();
      const { Map } = await importLibrary("maps") as google.maps.MapsLibrary;
      if (!containerRef.current) return;

      const map = new Map(containerRef.current, {
        center: { lat: 41.895, lng: -87.665 },
        zoom: 13,
        disableDefaultUI: true,
        zoomControl: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        zoomControlOptions: { position: 9 }, // RIGHT_BOTTOM = 9
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        styles: MAP_STYLES as any,
        gestureHandling: "greedy",
      });

      mapRef.current = map;
      setMapReady(true);
    })();
  }, []);

  // Update markers + route when stores or visited state changes
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    (async () => {
      ensureOptions();
      // Load needed libraries
      const mapsLib = await importLibrary("maps") as google.maps.MapsLibrary;
      const coreLib = await importLibrary("core") as google.maps.CoreLibrary;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { LatLngBounds } = coreLib as any;

      // Clear old overlays
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      overlaysRef.current.forEach((o: any) => o.setMap(null));
      overlaysRef.current = [];

      if (stores.length === 0) return;
      const ordered = nearestNeighborOrder(stores);


      // Dashed polyline
      const polyline = new mapsLib.Polyline({
        path: ordered.map((s) => ({ lat: s.lat, lng: s.lng })),
        map: mapRef.current,
        strokeColor: "#3D3229",
        strokeWeight: 2,
        strokeOpacity: 0,
        icons: [{
          icon: { path: "M 0,-1 0,1", strokeOpacity: 0.7, strokeColor: "#3D3229", scale: 3 },
          offset: "0",
          repeat: "14px",
        }],
      });
      overlaysRef.current.push(polyline);

      // Shared InfoWindow
      if (!infoWindowRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const g = (window as any).google.maps;
        infoWindowRef.current = new g.InfoWindow();
      }

      // Numbered markers (legacy Marker — no mapId needed)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g = (window as any).google.maps;
      ordered.forEach((store, i) => {
        const visited = visitedIds.has(store.id);
        const marker = new g.Marker({
          map: mapRef.current,
          position: { lat: store.lat, lng: store.lng },
          title: store.name,
          icon: {
            path: coreLib.SymbolPath.CIRCLE,
            scale: 14,
            fillColor: visited ? "#3D3229" : "white",
            fillOpacity: visited ? 0.6 : 1,
            strokeColor: "#3D3229",
            strokeWeight: 1.5,
          },
          label: visited
            ? undefined
            : { text: `${i + 1}`, color: "#3D3229", fontFamily: FONT, fontSize: "13px", fontWeight: "700" },
          opacity: visited ? 0.6 : 1,
        });

        marker.addListener("click", () => {
          const stars = "★".repeat(Math.floor(store.rating)) + (store.rating % 1 >= 0.5 ? "½" : "");
          infoWindowRef.current.setContent(`
            <div style="font-family: system-ui, sans-serif; min-width: 200px; max-width: 240px; padding: 4px 2px;">
              <div style="font-weight: 700; font-size: 14px; color: #3D3229; margin-bottom: 2px;">${store.name}</div>
              <div style="font-size: 11px; color: #A89888; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">${store.category} · ${store.neighborhood}</div>
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                <span style="color: #E8A838; font-size: 12px;">${stars}</span>
                <span style="font-size: 12px; color: #6B5E50; font-weight: 600;">${store.rating}</span>
                <span style="font-size: 11px; color: #A89888;">(${store.reviewCount.toLocaleString()})</span>
                <span style="font-size: 11px; color: #8C7E6E; margin-left: auto;">${store.priceLevel}</span>
              </div>
              <div style="font-size: 11px; color: #8C7E6E; margin-bottom: 2px;">📍 ${store.address}</div>
              <div style="font-size: 11px; color: #5a9e6e; font-weight: 500;">🕐 ${store.hours}</div>
            </div>
          `);
          infoWindowRef.current.open({ map: mapRef.current, anchor: marker });
        });

        overlaysRef.current.push(marker);
      });

      // Only fit bounds if user hasn't manually located
      if (!userLocatedRef.current) {
        const bounds = new LatLngBounds();
        ordered.forEach((s) => bounds.extend({ lat: s.lat, lng: s.lng }));
        mapRef.current.fitBounds(bounds, 48);
        // Prevent over-zooming on a single marker
        const listener = mapRef.current.addListener("idle", () => {
          if (mapRef.current.getZoom() > 15) mapRef.current.setZoom(15);
          listener.remove();
        });
      }
    })();
  }, [stores, mapReady, visitedIds]);

  // User location marker
  useEffect(() => {
    if (!mapReady || !mapRef.current || !userLocation) return;

    (async () => {
      ensureOptions();
      const coreLib = await importLibrary("core") as google.maps.CoreLibrary;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g = (window as any).google.maps;
      if (userMarkerRef.current) { userMarkerRef.current.setMap(null); userMarkerRef.current = null; }

      userMarkerRef.current = new g.Marker({
        map: mapRef.current,
        position: { lat: userLocation.lat, lng: userLocation.lng },
        title: "You",
        icon: {
          path: coreLib.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#3B82F6",
          fillOpacity: 1,
          strokeColor: "white",
          strokeWeight: 2,
        },
      });
    })();
  }, [userLocation, mapReady]);

  // Sync external location (from the add-place input) into the map
  useEffect(() => {
    if (!externalUserLocation) return;
    setUserLocation(externalUserLocation);
    userLocatedRef.current = true;
    if (mapRef.current) {
      mapRef.current.panTo(externalUserLocation);
      mapRef.current.setZoom(15);
    }
  }, [externalUserLocation]);

  const handleLocate = () => {
    if (!navigator.geolocation) { setLocError("Geolocation not supported"); return; }
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        userLocatedRef.current = true;
        setUserLocation(loc);
        setLocating(false);
        if (mapRef.current) {
          mapRef.current.panTo(loc);
          mapRef.current.setZoom(15);
        }
        onLocated?.(loc);
      },
      () => { setLocError("Could not get location"); setLocating(false); },
      { timeout: 8000 }
    );
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#E0D4C4]" style={{ height: "380px" }}>
      {stores.length === 0 && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#FBF5EC]/90 backdrop-blur-sm">
          <p className="text-[#8C7E6E] text-sm font-medium" style={{ fontFamily: FONT }}>No stops planned yet</p>
          <p className="text-[#A89888] text-xs mt-1">Add stores to see your route</p>
        </div>
      )}

      <div ref={containerRef} className="w-full h-full" />

      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleLocate}
          disabled={locating}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 border border-[#D4C8B8] rounded-full shadow-sm hover:bg-[#FBF5EC] transition-colors cursor-pointer disabled:opacity-50 text-xs text-[#3D3229]"
          style={{ fontFamily: FONT, fontSize: "13px" }}
        >
          {locating ? (
            <>
              <svg className="animate-spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8C7E6E" strokeWidth="2">
                <circle cx="12" cy="12" r="9" strokeDasharray="28 8" />
              </svg>
              locating...
            </>
          ) : userLocation ? (
            <><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />located</>
          ) : (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3D3229" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
                <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
              </svg>
              locate me
            </>
          )}
        </button>
        {locError && (
          <p className="mt-1 text-[10px] text-red-400 bg-white/90 px-2 py-0.5 rounded-full text-center">{locError}</p>
        )}
      </div>
    </div>
  );
}
