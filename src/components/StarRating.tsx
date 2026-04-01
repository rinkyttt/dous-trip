"use client";

export function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const fill = i <= Math.floor(rating) ? 1 : i - 1 < rating ? rating - (i - 1) : 0;
    stars.push(
      <svg key={i} width={size} height={size} viewBox="0 0 20 20" className="inline-block">
        <defs>
          <linearGradient id={`star-fill-${i}-${rating}`}>
            <stop offset={`${fill * 100}%`} stopColor="#D97706" />
            <stop offset={`${fill * 100}%`} stopColor="#E5E7EB" />
          </linearGradient>
        </defs>
        <path
          d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.45.91-5.33L2.27 6.62l5.34-.78L10 1z"
          fill={`url(#star-fill-${i}-${rating})`}
        />
      </svg>
    );
  }
  return <span className="inline-flex gap-0.5">{stars}</span>;
}
