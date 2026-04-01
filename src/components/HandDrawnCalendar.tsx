"use client";

import type { ReactNode } from "react";

const FONT = "'Caveat', cursive";

function wobble(seed: number, amplitude: number = 2): number {
  return Math.sin(seed * 1337.7) * amplitude;
}

interface HandDrawnCalendarProps {
  year: number;
  month: number;
  today: number;
  selectedDay: number;
  plannedDays: number[];
  onSelectDay: (day: number) => void;
}

export function HandDrawnCalendar({
  year,
  month,
  today,
  selectedDay,
  plannedDays,
  onSelectDay,
}: HandDrawnCalendarProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const monthName = new Date(year, month, 1).toLocaleString("en", { month: "long" });
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const colW = 56;
  const rowH = 48;
  const padX = 20;
  const padY = 64;
  const totalW = padX * 2 + colW * 7;
  const weeks = Math.ceil((daysInMonth + startDay) / 7);
  const totalH = padY + rowH * weeks + 14;

  // Small doodles
  const doodleDays: Record<number, (x: number, y: number) => ReactNode> = {
    [today]: (x, y) => (
      <g key={`d-${today}`} transform={`translate(${x + colW - 18}, ${y + 3})`} opacity="0.65">
        <path d="M0 0 C-0.5 0,-1.5 0.5,-1.5 1.5 L-1.5 6.5 C-1.5 7.5,-0.5 8,0.5 8 L5.5 8 C6.5 8,7.5 7.5,7.5 6.5 L7.5 1.5 C7.5 0.5,7 0,6 0Z" stroke="#3D3229" strokeWidth="0.8" fill="none" />
        <path d="M7.5 2 C9 2,9.5 3,9 4.5 C8.5 5.5,7.5 5,7.5 5" stroke="#3D3229" strokeWidth="0.7" fill="none" />
        <path d="M2 -0.5 C2 -2,2.5 -2,2.5 -3.5" stroke="#3D3229" strokeWidth="0.5" strokeLinecap="round" opacity="0.6" />
        <path d="M5 -0.5 C5 -2,5.5 -2,5.5 -3.5" stroke="#3D3229" strokeWidth="0.5" strokeLinecap="round" opacity="0.6" />
      </g>
    ),
    7: (x, y) => (
      <g key="d-7" transform={`translate(${x + colW - 16}, ${y + 4})`} opacity="0.55">
        <circle cx="0" cy="0" r="3" stroke="#3D3229" strokeWidth="0.6" fill="none" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const r = (a * Math.PI) / 180;
          return <line key={a} x1={Math.cos(r)*4} y1={Math.sin(r)*4} x2={Math.cos(r)*5.5} y2={Math.sin(r)*5.5} stroke="#3D3229" strokeWidth="0.5" strokeLinecap="round" />;
        })}
      </g>
    ),
    14: (x, y) => (
      <g key="d-14" transform={`translate(${x + colW - 16}, ${y + 5})`} opacity="0.55">
        <path d="M0 1.5 C0 -0.5,-3.5 -1.5,-3.5 0.5 C-3.5 2.5,0 5,0 5 C0 5,3.5 2.5,3.5 0.5 C3.5 -1.5,0 -0.5,0 1.5Z" stroke="#3D3229" strokeWidth="0.7" fill="none" />
      </g>
    ),
    21: (x, y) => (
      <g key="d-21" transform={`translate(${x + colW - 16}, ${y + 5})`} opacity="0.55">
        <path d="M0 -5 L1 -1.5 L4.8 -1.5 L1.9 0.6 L2.9 4.1 L0 2 L-2.9 4.1 L-1.9 0.6 L-4.8 -1.5 L-1 -1.5Z" stroke="#3D3229" strokeWidth="0.6" fill="none" />
      </g>
    ),
    1: (x, y) => (
      <g key="d-1" transform={`translate(${x + colW - 16}, ${y + 5})`} opacity="0.5">
        <circle cx="-1" cy="0" r="2.5" stroke="#3D3229" strokeWidth="0.5" fill="none" />
        <circle cx="3" cy="-1" r="2.5" stroke="#3D3229" strokeWidth="0.5" fill="none" />
      </g>
    ),
  };

  return (
    <div className="w-full flex justify-center">
      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        style={{ width: "100%", maxWidth: `${totalW}px`, display: "block", fontFamily: FONT }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Paper background with slight texture shadow */}
        <filter id="paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="in" />
        </filter>

        <rect width={totalW} height={totalH} rx="10" fill="#FBF5EC" />
        {/* Subtle paper grain overlay */}
        <rect width={totalW} height={totalH} rx="10" fill="url(#grain)" opacity="0.03" />

        {/* Month + year — handwritten large */}
        <text x={padX} y={26} fontSize="22" fontWeight="700" fill="#3D3229" fontFamily={FONT}
          transform={`rotate(${wobble(1, 0.4)} ${padX} 26)`}>
          {monthName}
        </text>
        <text x={padX + monthName.length * 13 + 4} y={26} fontSize="14" fill="#8C7E6E" fontFamily={FONT}>
          {year}
        </text>

        {/* Day headers — handwritten */}
        {dayNames.map((d, i) => (
          <text
            key={d}
            x={padX + i * colW + colW / 2}
            y={48}
            fontSize="11"
            fill={i === 0 ? "#C4846C" : i === 6 ? "#7CA0B8" : "#8C7E6E"}
            textAnchor="middle"
            fontFamily={FONT}
            transform={`rotate(${wobble(i * 3, 0.6)} ${padX + i * colW + colW / 2} 48)`}
          >
            {d}
          </text>
        ))}

        {/* Horizontal grid lines — wobbly hand-drawn */}
        {Array.from({ length: weeks + 1 }).map((_, row) => {
          const y = padY + row * rowH;
          const pts = Array.from({ length: 8 }, (_, k) => {
            const xk = padX + (k / 7) * (totalW - padX * 2);
            return `${k === 0 ? "M" : "L"} ${xk + wobble(row * 10 + k, 1)} ${y + wobble(row * 7 + k * 3, 1.2)}`;
          }).join(" ");
          return <path key={`h-${row}`} d={pts} stroke="#CBBFB0" strokeWidth="0.7" fill="none" strokeLinecap="round" />;
        })}

        {/* Vertical grid lines — wobbly */}
        {Array.from({ length: 8 }).map((_, col) => {
          const x = padX + col * colW;
          const pts = Array.from({ length: 6 }, (__, k) => {
            const yk = padY + (k / 5) * (weeks * rowH);
            return `${k === 0 ? "M" : "L"} ${x + wobble(col * 9 + k * 4, 1.2)} ${yk + wobble(col * 5 + k, 0.8)}`;
          }).join(" ");
          return <path key={`v-${col}`} d={pts} stroke="#CBBFB0" strokeWidth="0.7" fill="none" strokeLinecap="round" />;
        })}

        {/* Empty start cells — diagonal hatching */}
        {Array.from({ length: startDay }).map((_, i) => {
          const x = padX + i * colW;
          const y = padY;
          return (
            <g key={`empty-${i}`} opacity="0.06">
              {[0, 1, 2, 3].map((j) => (
                <line key={j} x1={x + 4 + j * 14} y1={y + 3} x2={x + j * 14} y2={y + rowH - 3} stroke="#8C7E6E" strokeWidth="0.9" />
              ))}
            </g>
          );
        })}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const cellIndex = startDay + i;
          const col = cellIndex % 7;
          const row = Math.floor(cellIndex / 7);
          const x = padX + col * colW;
          const y = padY + row * rowH;
          const isToday = day === today;
          const isSelected = day === selectedDay;
          const hasPlans = plannedDays.includes(day);
          const isSunday = col === 0;
          const isSaturday = col === 6;

          // Slight rotation per cell for handwritten feel
          const rot = wobble(day * 7, 0.5);

          return (
            <g key={day} style={{ cursor: "pointer" }} onClick={() => onSelectDay(day)}>
              {/* Hit area */}
              <rect x={x + 1} y={y + 1} width={colW - 2} height={rowH - 2} rx="4" fill="transparent" />

              {/* Selected fill */}
              {isSelected && !isToday && (
                <rect x={x + 3} y={y + 3} width={colW - 6} height={rowH - 6} rx="5"
                  fill="#EEE5D8"
                  stroke="#C4A882" strokeWidth="0.7" strokeDasharray="2.5 2"
                />
              )}

              {/* Today — hand-drawn wobbly ellipse */}
              {isToday && (
                <>
                  <ellipse
                    cx={x + colW / 2 + wobble(day, 1)} cy={y + rowH / 2 + wobble(day + 1, 0.8)}
                    rx={colW * 0.38 + wobble(day + 2, 1.5)}
                    ry={rowH * 0.38 + wobble(day + 3, 1)}
                    fill={isSelected ? "#E0CEBC" : "#F2E4D0"}
                    stroke="#3D3229" strokeWidth="1.3"
                    strokeDasharray={`${4 + wobble(day, 1)} ${2 + wobble(day + 4, 0.5)}`}
                    transform={`rotate(${rot * 2} ${x + colW / 2} ${y + rowH / 2})`}
                  />
                </>
              )}

              {/* Day number — rotated slightly */}
              <text
                x={x + colW / 2}
                y={y + rowH / 2 + 5}
                fontSize={isToday || isSelected ? "17" : "15"}
                fontWeight={isToday ? "700" : isSelected ? "600" : "400"}
                fill={isSunday ? "#C4846C" : isSaturday ? "#7CA0B8" : "#3D3229"}
                textAnchor="middle"
                fontFamily={FONT}
                transform={`rotate(${rot} ${x + colW / 2} ${y + rowH / 2})`}
              >
                {day}
              </text>

              {/* Plan dot — hand-drawn small circle */}
              {hasPlans && (
                <circle
                  cx={x + colW / 2 + wobble(day * 3, 1)}
                  cy={y + rowH - 7}
                  r="2.2"
                  fill={isSelected ? "#3D3229" : "#3D3229"}
                  opacity={isSelected ? 0.9 : 0.25}
                />
              )}

              {/* Doodle */}
              {doodleDays[day] && doodleDays[day](x, y)}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
