"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SearchChatProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  messages: Message[];
}

const SUGGESTIONS = [
  "Best coffee shops with wifi",
  "French bakeries with amazing croissants",
  "Upscale Italian restaurant for a date",
  "Affordable bakery with great reviews",
];

export function SearchChat({ onSearch, isLoading, messages }: SearchChatProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSearch(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full">
      {/* Messages */}
      {messages.length > 0 && (
        <div className="mb-4 space-y-3 max-h-72 overflow-y-auto px-1">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="white">
                    <path d="M8 1L10 5.5L15 6.5L11.5 10L12.5 15L8 12.5L3.5 15L4.5 10L1 6.5L6 5.5L8 1Z" />
                  </svg>
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#3D3229] text-white rounded-2xl rounded-br-md"
                    : "bg-[#FBF5EC] text-[#3D3229] rounded-2xl rounded-bl-md shadow-sm border border-[#E0D4C4]"
                }`}
                dangerouslySetInnerHTML={{
                  __html: msg.content.replace(/\*\*(.*?)\*\*/g, "<strong class='text-gray-900'>$1</strong>"),
                }}
              />
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mr-2 shrink-0">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="white">
                  <path d="M8 1L10 5.5L15 6.5L11.5 10L12.5 15L8 12.5L3.5 15L4.5 10L1 6.5L6 5.5L8 1Z" />
                </svg>
              </div>
              <div className="px-4 py-3 bg-[#FBF5EC] rounded-2xl rounded-bl-md shadow-sm border border-[#E0D4C4]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Suggestions */}
      {messages.length === 0 && (
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSearch(s)}
              className="px-4 py-2 text-sm text-[#6B5E50] bg-[#FBF5EC] border border-[#D4C8B8] rounded-full hover:bg-[#EEE5D8] hover:border-[#C4B8A8] hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-3 bg-[#FBF5EC] border border-[#D4C8B8] rounded-2xl px-4 py-3 shadow-[0_2px_12px_rgba(61,50,41,0.06)] focus-within:border-[#A89888] focus-within:shadow-[0_2px_20px_rgba(61,50,41,0.1)] transition-all duration-200">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 shrink-0 mb-0.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about stores, restaurants, cafes..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-[#3D3229] text-sm placeholder:text-[#A89888] focus:outline-none leading-relaxed"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white disabled:opacity-25 disabled:cursor-not-allowed hover:from-amber-600 hover:to-orange-600 transition-all duration-200 cursor-pointer shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
