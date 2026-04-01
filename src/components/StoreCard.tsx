"use client";

import { useState } from "react";
import type { Store } from "@/lib/mockData";
import { StoreSvg } from "./StoreSvg";
import { StarRating } from "./StarRating";

interface StoreCardProps {
  store: Store;
  index: number;
  onAddToTrip?: (store: Store) => void;
  addedToTrip?: boolean;
  onToggleSaved?: (store: Store) => void;
  isSaved?: boolean;
}

export function StoreCard({ store, onAddToTrip, addedToTrip, onToggleSaved, isSaved }: StoreCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="group bg-[#FBF5EC] rounded-2xl border border-[#E0D4C4] overflow-hidden shadow-[0_1px_3px_rgba(61,50,41,0.06)] hover:shadow-[0_8px_30px_rgba(61,50,41,0.12)] hover:border-[#C4B8A8] transition-all duration-300">
      <div className="relative">
        {store.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={store.photoUrl} alt={store.name} className="w-full h-44 object-cover" />
        ) : (
          <StoreSvg seed={store.photoSeed} className="w-full h-44" />
        )}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {onToggleSaved && (
            <button
              onClick={() => onToggleSaved(store)}
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors cursor-pointer"
              title={isSaved ? "Remove from saved" : "Save store"}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill={isSaved ? "#C4846C" : "none"} stroke="#C4846C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
          <span className="px-2.5 py-1 text-xs font-bold text-white bg-black/60 backdrop-blur-sm rounded-lg">
            {store.priceLevel}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
          <svg width="12" height="12" viewBox="0 0 20 20" fill="#F59E0B">
            <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.45.91-5.33L2.27 6.62l5.34-.78L10 1z" />
          </svg>
          <span className="text-xs font-bold text-[#3D3229]">{store.rating}</span>
          <span className="text-xs text-[#8C7E6E]">({store.reviewCount.toLocaleString()})</span>
        </div>
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="mb-1.5">
          <h3 className="text-base font-semibold text-[#3D3229] group-hover:text-amber-700 transition-colors">{store.name}</h3>
          <p className="text-xs font-medium text-[#A89888] uppercase tracking-wide">{store.category}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-[#6B5E50] leading-relaxed mb-3">{store.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {store.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-[11px] font-medium text-amber-700 bg-amber-50 rounded-md">
              {tag}
            </span>
          ))}
        </div>

        {/* Info rows */}
        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2.5 text-[#8C7E6E]">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="text-gray-300 shrink-0">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">{store.address}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="text-gray-300 shrink-0">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-emerald-600">{store.hours}</span>
          </div>
        </div>

        {/* Add to trip */}
        {onAddToTrip && (
          <button
            onClick={() => onAddToTrip(store)}
            disabled={addedToTrip}
            className={`w-full mb-3 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              addedToTrip
                ? "bg-[#F0E8DC] text-[#8C7E6E] cursor-default"
                : "bg-[#3D3229] text-white hover:bg-[#2D2219]"
            }`}
          >
            {addedToTrip ? "Added to today's trip" : "+ Add to trip"}
          </button>
        )}

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-3" />

        {/* Reviews toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between py-2 px-3 text-sm font-medium text-[#8C7E6E] rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#A89888]">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{store.reviewSummary ? "AI Review Summary" : `Top Reviews (${store.reviews.length})`}</span>
          </div>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {expanded && store.reviewSummary && (
          <div className="mt-2 p-3.5 bg-amber-50/60 rounded-xl border border-amber-100 space-y-2.5">
            <p className="text-xs font-semibold text-[#3D3229] leading-relaxed">✦ {store.reviewSummary.verdict}</p>
            <div>
              <p className="text-[10px] font-semibold text-[#A89888] uppercase tracking-wider mb-0.5">🔥 What people love</p>
              <p className="text-xs text-[#6B5E50] leading-relaxed">{store.reviewSummary.highlights}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#A89888] uppercase tracking-wider mb-0.5">📅 Recent buzz</p>
              <p className="text-xs text-[#6B5E50] leading-relaxed">{store.reviewSummary.recentBuzz}</p>
            </div>
            {store.reviewSummary.concerns && (
              <div>
                <p className="text-[10px] font-semibold text-[#A89888] uppercase tracking-wider mb-0.5">⚠️ Heads up</p>
                <p className="text-xs text-[#6B5E50] leading-relaxed">{store.reviewSummary.concerns}</p>
              </div>
            )}
          </div>
        )}

        {expanded && !store.reviewSummary && (
          <div className="mt-2 space-y-2.5">
            {store.reviews.map((review, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100/80">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#3D3229] flex items-center justify-center text-[10px] font-bold text-white">
                      {review.author[0]}
                    </div>
                    <span className="text-xs font-semibold text-[#4A3F35]">{review.author}</span>
                  </div>
                  <span className="text-[10px] text-[#A89888]">{review.timeAgo}</span>
                </div>
                <div className="mb-1.5">
                  <StarRating rating={review.rating} size={11} />
                </div>
                <p className="text-xs text-[#6B5E50] leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
