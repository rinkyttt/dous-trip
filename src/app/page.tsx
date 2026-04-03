"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { defaultTripData, getAllStores, getStoreById, type Store, type TripStop } from "@/lib/mockData";
import { SearchChat } from "@/components/SearchChat";
import { StoreCard } from "@/components/StoreCard";
import { TripPlanner } from "@/components/TripPlanner";
import { DayPickerModal } from "@/components/DayPickerModal";
import { SavedStoreCard } from "@/components/SavedStoreCard";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type Tab = "trip" | "saved";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("trip");
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDate());
  const [allTripData, setAllTripData] = useState<Record<number, TripStop[]>>(defaultTripData);
  const [stores, setStores] = useState<Store[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [pendingStore, setPendingStore] = useState<Store | null>(null);
  const [customStores, setCustomStores] = useState<Store[]>([]);

  // Saved: storeId → note
  const [savedStores, setSavedStores] = useState<Record<string, string>>({});
  // Visited: set of storeIds
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set());

  const savedIds = new Set(Object.keys(savedStores));

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  // Load persisted data on mount, then enable auto-save
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    fetch("/api/load")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          if (data.allTripData) setAllTripData(data.allTripData);
          if (data.savedStores) setSavedStores(data.savedStores);
          if (data.visitedIds) setVisitedIds(new Set(data.visitedIds));
          if (data.customStores) setCustomStores(data.customStores);
        }
      })
      .catch(() => {})
      .finally(() => setDataLoaded(true));
  }, []);

  // Save whenever data changes (debounced 1s, only after initial load)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!dataLoaded) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          allTripData,
          savedStores,
          visitedIds: Array.from(visitedIds),
          customStores,
        }),
      }).catch(() => {});
    }, 1000);
  }, [allTripData, savedStores, visitedIds, customStores, dataLoaded]);

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, ...(userCoords ?? {}) }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.summary }]);
      setStores(data.stores ?? []);
      setHasSearched(true);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Search failed. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  }, [userCoords]);

  const handleUpdateStops = useCallback((day: number, stops: TripStop[]) => {
    setAllTripData((prev) => ({ ...prev, [day]: stops }));
  }, []);

  const handleAddToTrip = useCallback((store: Store) => {
    setPendingStore(store);
  }, []);

  const handleConfirmDay = useCallback((day: number) => {
    if (!pendingStore) return;
    const currentStops = allTripData[day] ?? [];
    if (!currentStops.some((s) => s.storeId === pendingStore.id)) {
      const hours = ["9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM", "7:00 PM"];
      const timeSlot = hours[currentStops.length % hours.length];
      handleUpdateStops(day, [...currentStops, { storeId: pendingStore.id, timeSlot }]);
    }
    setPendingStore(null);
  }, [pendingStore, allTripData, handleUpdateStops]);

  const handleToggleVisited = useCallback((storeId: string) => {
    setVisitedIds((prev) => {
      const next = new Set(prev);
      if (next.has(storeId)) next.delete(storeId); else next.add(storeId);
      return next;
    });
  }, []);

  const handleToggleSaved = useCallback((storeId: string) => {
    setSavedStores((prev) => {
      if (storeId in prev) {
        const next = { ...prev };
        delete next[storeId];
        return next;
      }
      return { ...prev, [storeId]: "" };
    });
  }, []);

  const handleNoteChange = useCallback((storeId: string, note: string) => {
    setSavedStores((prev) => ({ ...prev, [storeId]: note }));
  }, []);

  const handleAddCustomStore = useCallback((store: Store) => {
    setCustomStores((prev) => prev.some((s) => s.id === store.id) ? prev : [...prev, store]);
  }, []);

  const addedStoreIds = Object.values(allTripData).flat().map((s) => s.storeId);
  const displayedStores = hasSearched ? stores : getAllStores().sort((a, b) => b.rating - a.rating);
  const mockStores = getAllStores();
  const allAvailableStores = [
    ...mockStores,
    ...stores.filter((s) => !mockStores.some((m) => m.id === s.id)),
    ...customStores.filter((s) => !mockStores.some((m) => m.id === s.id) && !stores.some((r) => r.id === s.id)),
  ];
  const savedStoreList = Object.keys(savedStores).map((id) => getStoreById(id)).filter((s): s is Store => !!s);

  const savedLabel = "Saved";

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F2EBE0]">
      {pendingStore && (
        <DayPickerModal
          storeName={pendingStore.name}
          allTripData={allTripData}
          onConfirm={handleConfirmDay}
          onClose={() => setPendingStore(null)}
        />
      )}

      {/* Header */}
      <header className={`sticky top-0 z-[1100] bg-[#F2EBE0]/95 backdrop-blur-xl transition-[border-color] duration-200 border-b ${scrolled ? "border-[#D4C8B8]" : "border-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Brand — clicking returns to trip page */}
          <button
            onClick={() => setActiveTab("trip")}
            className="text-[28px] font-bold text-[#3D3229] cursor-pointer leading-none"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            dou&apos;s
          </button>

          {/* Nav — underline style like Anthropic */}
          <nav className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab("saved")}
              className={`relative py-1 text-sm font-medium transition-colors cursor-pointer group ${
                activeTab === "saved" ? "text-[#3D3229]" : "text-[#8C7E6E] hover:text-[#3D3229]"
              }`}
            >
              {savedLabel}
              {/* underline */}
              <span className={`absolute bottom-0 left-0 w-full h-px bg-[#3D3229] transition-transform origin-left ${
                activeTab === "saved" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`} />
            </button>
          </nav>
        </div>
      </header>

      {/* Trip tab */}
      {activeTab === "trip" && (
        <>
          <TripPlanner
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            allTripData={allTripData}
            onUpdateStops={handleUpdateStops}
            visitedIds={visitedIds}
            savedIds={savedIds}
            onToggleVisited={handleToggleVisited}
            onToggleSaved={handleToggleSaved}
            availableStores={allAvailableStores}
            onAddCustomStore={handleAddCustomStore}
            userCoords={userCoords}
          />

          {/* Divider */}
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-[#D4C8B8]" />
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EEE5D8] rounded-full border border-[#D4C8B8]">
                <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="#8C7E6E" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="9" cy="9" r="6" /><line x1="14" y1="14" x2="18" y2="18" />
                </svg>
                <span className="text-xs font-semibold text-[#6B5E50]">Discover Stores</span>
              </div>
              <div className="h-px flex-1 bg-[#D4C8B8]" />
            </div>
          </div>

          {/* Search */}
          <section className="max-w-6xl mx-auto px-6 pb-4">
            <div className="max-w-2xl mx-auto">
              <SearchChat onSearch={handleSearch} isLoading={isLoading} messages={messages} />
            </div>
          </section>

          {/* Store cards */}
          <section className="max-w-6xl mx-auto px-6 pb-24">
            <p className="text-xs text-[#A89888] text-center mb-5">
              {hasSearched ? `${stores.length} result${stores.length !== 1 ? "s" : ""}` : "All stores · sorted by rating"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedStores.map((store, i) => (
                <div key={store.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <StoreCard
                    store={store}
                    index={i}
                    onAddToTrip={handleAddToTrip}
                    addedToTrip={addedStoreIds.includes(store.id)}
                    onToggleSaved={(s) => handleToggleSaved(s.id)}
                    isSaved={savedIds.has(store.id)}
                  />
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Saved tab */}
      {activeTab === "saved" && (
        <main className="max-w-6xl mx-auto px-6 py-8 pb-24">
          {savedStoreList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 rounded-full bg-[#EEE5D8] border border-[#D4C8B8] flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A89888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#6B5E50]">No saved stores yet</p>
              <p className="text-xs text-[#A89888] mt-1">Hover over a stop in your plan and tap the heart to save it</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-[#A89888] mb-6">{savedStoreList.length} saved store{savedStoreList.length !== 1 ? "s" : ""}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedStoreList.map((store, i) => (
                  <div key={store.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <SavedStoreCard
                      store={store}
                      note={savedStores[store.id] ?? ""}
                      onNoteChange={(note) => handleNoteChange(store.id, note)}
                      onRemove={() => handleToggleSaved(store.id)}
                      onAddToTrip={handleAddToTrip}
                      addedToTrip={addedStoreIds.includes(store.id)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      )}
    </div>
  );
}
