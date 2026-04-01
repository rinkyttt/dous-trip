"use client";

import { useRef, useState, useEffect } from "react";
import type { Store, TripStop } from "@/lib/mockData";
import { getStoreById } from "@/lib/mockData";

interface StoreVisitListProps {
  tripStops: TripStop[];
  onUpdateStops: (stops: TripStop[]) => void;
  selectedDay: number;
  visitedIds: Set<string>;
  savedIds: Set<string>;
  onToggleVisited: (storeId: string) => void;
  onToggleSaved: (storeId: string) => void;
  availableStores: Store[];
  onAddCustomStore: (store: Store) => void;
  userCoords?: { lat: number; lng: number } | null;
  onLocated?: (coords: { lat: number; lng: number }) => void;
}

interface Prediction {
  place_id: string;
  main_text: string;
  secondary_text: string;
  distance_meters: number | null;
}

function formatDistance(meters: number | null): string | null {
  if (meters == null) return null;
  const miles = meters / 1609.34;
  return miles < 0.1 ? `${Math.round(meters * 3.281)} ft` : `${miles.toFixed(1)} mi`;
}

export function StoreVisitList({ tripStops, onUpdateStops, selectedDay, visitedIds, savedIds, onToggleVisited, onToggleSaved, availableStores, onAddCustomStore, userCoords, onLocated }: StoreVisitListProps) {
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [inputText, setInputText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [localCoords, setLocalCoords] = useState<{ lat: number; lng: number } | null>(userCoords ?? null);
  const [locating, setLocating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync prop → local when parent resolves location
  useEffect(() => {
    if (userCoords && !localCoords) setLocalCoords(userCoords);
  }, [userCoords, localCoords]);

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocalCoords(coords);
        setLocating(false);
        onLocated?.(coords);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

  const findStore = (id: string): Store | undefined =>
    availableStores.find((s) => s.id === id) ?? getStoreById(id);

  const addStore = (store: Store) => {
    if (tripStops.some((s) => s.storeId === store.id)) return;
    const hours = ["9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM", "7:00 PM"];
    const timeSlot = hours[tripStops.length % hours.length];
    onUpdateStops([...tripStops, { storeId: store.id, timeSlot }]);
    setInputText("");
    setIsOpen(false);
    setPredictions([]);
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) { setPredictions([]); setIsOpen(false); return; }
    setIsOpen(true);
    debounceRef.current = setTimeout(async () => {
      try {
        // Only pass coords when we have the user's real location
        const coordsParam = localCoords ? `&lat=${localCoords.lat}&lng=${localCoords.lng}` : "";
        const res = await fetch(`/api/autocomplete?input=${encodeURIComponent(text)}${coordsParam}`);
        const data = await res.json();
        // Strip distance if no real location
        const preds: Prediction[] = (data.predictions ?? []).map((p: Prediction) => ({
          ...p,
          distance_meters: localCoords ? p.distance_meters : null,
        }));
        setPredictions(preds);
      } catch { /* ignore */ }
    }, 300);
  };

  const handleSelectPrediction = async (prediction: Prediction) => {
    setLoadingId(prediction.place_id);
    try {
      const res = await fetch(`/api/place-details?place_id=${prediction.place_id}`);
      const store: Store = await res.json();
      onAddCustomStore(store);
      addStore(store);
    } catch { /* ignore */ } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        inputRef.current && !inputRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const remove = (index: number) => {
    onUpdateStops(tripStops.filter((_, i) => i !== index));
  };

  const onDragStart = (i: number) => {
    dragIndexRef.current = i;
  };

  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    setDragOverIndex(i);
  };

  const onDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = dragIndexRef.current;
    if (fromIndex === null || fromIndex === toIndex) {
      dragIndexRef.current = null;
      setDragOverIndex(null);
      return;
    }
    const next = [...tripStops];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onUpdateStops(next);
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const onDragEnd = () => {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3D3229" strokeWidth="1.5" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <div>
          <h3 className="text-sm font-semibold text-[#3D3229]">Today&apos;s Plan</h3>
          <p className="text-[10px] text-[#8C7E6E]">March {selectedDay}, 2026</p>
        </div>
      </div>

      {tripStops.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-[#8C7E6E]">No stops planned yet.</p>
          <p className="text-xs text-[#A89888] mt-1">Add stores from the Discover section.</p>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {tripStops.length > 1 && (
          <div
            className="absolute left-[19px] top-[36px] w-px border-l border-dashed border-[#D4C8B8]"
            style={{ height: `calc(100% - 72px)` }}
          />
        )}

        <div className="space-y-3">
          {tripStops.map((stop, i) => {
            const store = findStore(stop.storeId);
            if (!store) return null;

            const isVisited = visitedIds.has(stop.storeId);
            const isSaved = savedIds.has(stop.storeId);
            const isDragOver = dragOverIndex === i;

            return (
              <div
                key={`${stop.storeId}-${i}`}
                className="relative flex gap-3"
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={(e) => onDragOver(e, i)}
                onDrop={(e) => onDrop(e, i)}
                onDragEnd={onDragEnd}
                style={{ opacity: dragIndexRef.current === i ? 0.4 : 1 }}
              >
                {/* Drop indicator */}
                {isDragOver && dragIndexRef.current !== i && (
                  <div className="absolute -top-1.5 left-0 right-0 h-0.5 bg-[#3D3229] rounded-full z-20" />
                )}

                {/* Number circle */}
                <div className={`shrink-0 w-[38px] h-[38px] rounded-full border-2 flex items-center justify-center z-10 transition-colors ${
                  isVisited ? "bg-[#3D3229] border-[#3D3229]" : "bg-[#FBF5EC] border-[#3D3229]"
                }`}>
                  {isVisited ? (
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="white">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-sm font-bold text-[#3D3229]">{i + 1}</span>
                  )}
                </div>

                {/* Card */}
                <div className={`flex-1 rounded-xl border p-3.5 group transition-all ${
                  isVisited
                    ? "bg-[#EEE5D8] border-[#D4C8B8] opacity-70"
                    : "bg-[#FBF5EC] border-[#E0D4C4] shadow-[0_1px_3px_rgba(61,50,41,0.05)] hover:shadow-[0_4px_16px_rgba(61,50,41,0.08)]"
                }`}>
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {/* Drag handle */}
                      <div className="shrink-0 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-40 transition-opacity">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="#3D3229">
                          <circle cx="5" cy="4" r="1.2"/><circle cx="11" cy="4" r="1.2"/>
                          <circle cx="5" cy="8" r="1.2"/><circle cx="11" cy="8" r="1.2"/>
                          <circle cx="5" cy="12" r="1.2"/><circle cx="11" cy="12" r="1.2"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h4 className={`text-sm font-semibold truncate ${isVisited ? "line-through text-[#8C7E6E]" : "text-[#3D3229]"}`}>{store.name}</h4>
                        <p className="text-[10px] uppercase tracking-wider text-[#A89888] font-medium">{store.category}</p>
                      </div>
                    </div>
                    {/* Action buttons */}
                    <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onToggleSaved(stop.storeId)} className="p-1 rounded-lg hover:bg-[#EEE5D8] cursor-pointer transition-colors" title={isSaved ? "Remove from saved" : "Save"}>
                        <svg width="13" height="13" viewBox="0 0 20 20" fill={isSaved ? "#C4846C" : "none"} stroke="#C4846C" strokeWidth="1.5">
                          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button onClick={() => onToggleVisited(stop.storeId)} className="p-1 rounded-lg hover:bg-[#EEE5D8] cursor-pointer transition-colors" title={isVisited ? "Unmark visited" : "Mark visited"}>
                        <svg width="13" height="13" viewBox="0 0 20 20" fill={isVisited ? "#3D3229" : "none"} stroke="#3D3229" strokeWidth="1.5">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button onClick={() => remove(i)} className="p-1 rounded-lg hover:bg-red-50 cursor-pointer transition-colors" title="Remove">
                        <svg width="13" height="13" viewBox="0 0 20 20" fill="#C4846C">
                          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Time + rating */}
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="#A89888">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium text-[#6B5E50]">{stop.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 20 20" fill="#E8A838">
                        <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.45.91-5.33L2.27 6.62l5.34-.78L10 1z" />
                      </svg>
                      <span className="text-xs text-[#8C7E6E]">{store.rating}</span>
                    </div>
                    <span className="text-xs text-[#A89888]">{store.priceLevel}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add store input */}
      <div className="relative mt-4">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-[#CBBFB0] bg-[#FBF5EC] focus-within:border-[#3D3229] transition-colors">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#A89888" strokeWidth="2" strokeLinecap="round">
            <line x1="10" y1="4" x2="10" y2="16" /><line x1="4" y1="10" x2="16" y2="10" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => { if (predictions.length > 0) setIsOpen(true); }}
            placeholder="Add a place..."
            className="flex-1 text-sm bg-transparent outline-none text-[#3D3229] placeholder-[#C4B8A8]"
          />
          {/* Locate button */}
          <button
            onClick={handleLocate}
            disabled={locating}
            title={localCoords ? "Location active" : "Locate me for distances"}
            className="shrink-0 cursor-pointer transition-colors disabled:opacity-50"
          >
            {locating ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A89888" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0110 10" />
              </svg>
            ) : localCoords ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5a9e6e" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
                <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A89888" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
                <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
              </svg>
            )}
          </button>
          {inputText && (
            <button onClick={() => { setInputText(""); setPredictions([]); setIsOpen(false); }} className="text-[#A89888] hover:text-[#3D3229] cursor-pointer transition-colors">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          )}
        </div>
        {isOpen && predictions.length > 0 && (
          <div ref={dropdownRef} className="absolute z-20 left-0 right-0 mt-1 bg-[#FBF5EC] border border-[#D4C8B8] rounded-xl shadow-lg overflow-hidden">
            {predictions.map((p) => {
              const isLoading = loadingId === p.place_id;
              return (
                <button
                  key={p.place_id}
                  onClick={() => handleSelectPrediction(p)}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#EEE5D8] transition-colors text-left cursor-pointer disabled:opacity-60"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-[#3D3229] truncate">{p.main_text}</div>
                    <div className="text-xs text-[#A89888] truncate">{p.secondary_text}</div>
                  </div>
                  {formatDistance(p.distance_meters) && (
                    <span className="text-xs text-[#A89888] shrink-0 ml-3">{formatDistance(p.distance_meters)}</span>
                  )}
                  {isLoading && (
                    <svg className="animate-spin ml-2 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A89888" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0110 10" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
