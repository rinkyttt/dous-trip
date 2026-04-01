"use client";

import { useState } from "react";
import type { Store } from "@/lib/mockData";
import { StoreSvg } from "./StoreSvg";

interface SavedStoreCardProps {
  store: Store;
  note: string;
  onNoteChange: (note: string) => void;
  onRemove: () => void;
  onAddToTrip: (store: Store) => void;
  addedToTrip: boolean;
}

export function SavedStoreCard({ store, note, onNoteChange, onRemove, onAddToTrip, addedToTrip }: SavedStoreCardProps) {
  const [editingNote, setEditingNote] = useState(false);
  const [draft, setDraft] = useState(note);

  const saveNote = () => {
    onNoteChange(draft);
    setEditingNote(false);
  };

  return (
    <article className="group bg-[#FBF5EC] rounded-2xl border border-[#E0D4C4] overflow-hidden shadow-[0_1px_3px_rgba(61,50,41,0.06)] hover:shadow-[0_8px_30px_rgba(61,50,41,0.12)] hover:border-[#C4B8A8] transition-all duration-300">
      <div className="relative">
        <StoreSvg seed={store.photoSeed} className="w-full h-40" />
        <div className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold text-white bg-black/60 backdrop-blur-sm rounded-lg">
          {store.priceLevel}
        </div>
        {/* Remove saved button */}
        <button
          onClick={onRemove}
          className="absolute top-3 left-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-50"
          title="Remove from saved"
        >
          <svg width="12" height="12" viewBox="0 0 20 20" fill="#C4846C">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
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
          <h3 className="text-base font-semibold text-[#3D3229]">{store.name}</h3>
          <p className="text-xs font-medium text-[#A89888] uppercase tracking-wide">{store.category} · {store.neighborhood}</p>
        </div>

        <p className="text-sm text-[#6B5E50] leading-relaxed mb-3">{store.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {store.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-[11px] font-medium text-amber-700 bg-amber-50 rounded-md">
              {tag}
            </span>
          ))}
        </div>

        {/* Info */}
        <div className="text-xs text-[#8C7E6E] mb-4 space-y-1">
          <div className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" className="text-[#C4B8A8] shrink-0">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{store.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" className="text-[#C4B8A8] shrink-0">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-emerald-600 font-medium">{store.hours}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E8E0D5] mb-3" />

        {/* Note section */}
        {editingNote ? (
          <div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a personal note..."
              className="w-full text-xs text-[#3D3229] bg-[#F2EBE0] border border-[#D4C8B8] rounded-xl px-3 py-2 resize-none focus:outline-none focus:border-[#A89888] placeholder:text-[#C4B8A8] leading-relaxed"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={saveNote}
                className="flex-1 py-1.5 text-[11px] font-semibold text-white bg-[#3D3229] rounded-lg hover:bg-[#2D2219] cursor-pointer transition-colors"
              >
                Save note
              </button>
              <button
                onClick={() => { setDraft(note); setEditingNote(false); }}
                className="px-3 py-1.5 text-[11px] text-[#8C7E6E] hover:text-[#3D3229] cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => { setDraft(note); setEditingNote(true); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#EEE5D8] transition-colors cursor-pointer text-left"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#A89888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            {note ? (
              <span className="text-xs text-[#6B5E50] leading-relaxed line-clamp-2">{note}</span>
            ) : (
              <span className="text-xs text-[#C4B8A8]">Add a note...</span>
            )}
          </button>
        )}
      </div>
    </article>
  );
}
