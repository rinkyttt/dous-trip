"use client";

import { useState, useMemo } from "react";
import type { TripStop, Store } from "@/lib/mockData";
import { getStoreById } from "@/lib/mockData";

import { HandDrawnCalendar } from "./HandDrawnCalendar";
import { RouteMap } from "./RouteMap";
import { StoreVisitList } from "./StoreVisitList";

interface TripPlannerProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  allTripData: Record<number, TripStop[]>;
  onUpdateStops: (day: number, stops: TripStop[]) => void;
  visitedIds: Set<string>;
  savedIds: Set<string>;
  onToggleVisited: (storeId: string) => void;
  onToggleSaved: (storeId: string) => void;
  availableStores: Store[];
  onAddCustomStore: (store: Store) => void;
  userCoords?: { lat: number; lng: number } | null;
}

export function TripPlanner({ selectedDay, onSelectDay, allTripData, onUpdateStops, visitedIds, savedIds, onToggleVisited, onToggleSaved, availableStores, onAddCustomStore, userCoords }: TripPlannerProps) {
  const [sharedLocation, setSharedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const tripStops = allTripData[selectedDay] ?? [];
  const plannedDays = Object.keys(allTripData)
    .map(Number)
    .filter((d) => allTripData[d].length > 0);

  const resolvedStores = useMemo(() => {
    const findStore = (id: string) => availableStores.find((s) => s.id === id) ?? getStoreById(id);
    return tripStops.map((stop) => findStore(stop.storeId)).filter((s): s is Store => s !== undefined);
  }, [tripStops, availableStores]);

  const todayDate = new Date();
  const todayDay = todayDate.getDate();
  const monthName = new Date(2026, 2, selectedDay).toLocaleString("en", { month: "long" });

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Calendar */}
      <section className="pt-6 pb-4 flex justify-center">
        <div className="w-full max-w-md">
        <HandDrawnCalendar
          year={2026}
          month={2}
          today={todayDay}
          selectedDay={selectedDay}
          plannedDays={plannedDays}
          onSelectDay={onSelectDay}
        />
        </div>
      </section>

      {/* Selected day label */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1 bg-gradient-to-r from-[#D4C8B8] to-transparent" />
        <span className="text-sm font-semibold text-[#3D3229]">
          {monthName} {selectedDay}{selectedDay === todayDay ? " — Today" : ""}
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-[#D4C8B8] to-transparent" />
      </div>

      {/* Split layout: Map + Visit List */}
      <section className="flex flex-col lg:flex-row gap-6 pb-10">
        <div className="flex-1 min-w-0">
          <RouteMap stores={resolvedStores} visitedIds={visitedIds} externalUserLocation={sharedLocation} onLocated={setSharedLocation} />
        </div>
        <div className="lg:w-[320px] shrink-0">
          <StoreVisitList
            tripStops={tripStops}
            onUpdateStops={(stops) => onUpdateStops(selectedDay, stops)}
            selectedDay={selectedDay}
            visitedIds={visitedIds}
            savedIds={savedIds}
            onToggleVisited={onToggleVisited}
            onToggleSaved={onToggleSaved}
            availableStores={availableStores}
            onAddCustomStore={onAddCustomStore}
            userCoords={userCoords}
            onLocated={setSharedLocation}
          />
        </div>
      </section>
    </div>
  );
}
