"use client";

const FONT = "'Caveat', cursive";

interface DayPickerModalProps {
  storeName: string;
  allTripData: Record<number, { storeId: string }[]>;
  onConfirm: (day: number) => void;
  onClose: () => void;
}

const DAYS_IN_MARCH = 31;
const START_DAY = 0; // March 1 2026 = Sunday
const TODAY = 25;

export function DayPickerModal({ storeName, allTripData, onConfirm, onClose }: DayPickerModalProps) {
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#FBF5EC] rounded-2xl shadow-xl border border-[#E0D4C4] p-6 w-full max-w-xs">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-base font-semibold text-[#3D3229]" style={{ fontFamily: FONT, fontSize: "20px" }}>
            Add to which day?
          </h3>
          <p className="text-xs text-[#8C7E6E] mt-0.5 truncate">{storeName}</p>
        </div>

        {/* Mini calendar grid */}
        <div className="grid grid-cols-7 gap-0.5 mb-4">
          {dayNames.map((d, i) => (
            <div key={i} className="text-center py-1" style={{ fontFamily: FONT, fontSize: "11px", color: i === 0 ? "#C4846C" : i === 6 ? "#7CA0B8" : "#8C7E6E" }}>
              {d}
            </div>
          ))}

          {/* Empty start cells */}
          {Array.from({ length: START_DAY }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}

          {/* Day cells */}
          {Array.from({ length: DAYS_IN_MARCH }).map((_, i) => {
            const day = i + 1;
            const hasPlans = (allTripData[day] ?? []).length > 0;
            const isToday = day === TODAY;
            const isPast = day < TODAY;
            const col = (START_DAY + i) % 7;
            const isSun = col === 0;
            const isSat = col === 6;

            return (
              <button
                key={day}
                onClick={() => !isPast && onConfirm(day)}
                disabled={isPast}
                className={`
                  relative flex flex-col items-center justify-center rounded-lg py-1.5 text-xs transition-all cursor-pointer
                  ${isPast ? "opacity-25 cursor-default" : "hover:bg-[#EEE5D8]"}
                  ${isToday ? "ring-1 ring-[#3D3229]" : ""}
                `}
                style={{
                  fontFamily: FONT,
                  fontSize: "14px",
                  color: isPast ? "#A89888" : isSun ? "#C4846C" : isSat ? "#7CA0B8" : "#3D3229",
                  fontWeight: isToday ? 700 : 400,
                }}
              >
                {day}
                {hasPlans && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#3D3229] opacity-50" />
                )}
              </button>
            );
          })}
        </div>

        {/* Cancel */}
        <button
          onClick={onClose}
          className="w-full py-2 text-sm text-[#8C7E6E] hover:text-[#3D3229] transition-colors cursor-pointer"
          style={{ fontFamily: FONT, fontSize: "15px" }}
        >
          cancel
        </button>
      </div>
    </div>
  );
}
