"use client";

// Hand-drawn doodle style SVG illustrations for store cards
export function StoreSvg({ seed, className }: { seed: number; className?: string }) {
  const variant = seed % 8;

  // Coffee cup - hand drawn style
  if (variant === 0 || variant === 4) {
    return (
      <svg className={className} viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="240" rx="12" fill="#FBF8F3" />
        {/* Cup body - wobbly lines */}
        <path d="M148 108 C147 107, 145 108, 144 110 L138 172 C137 180, 142 186, 150 187 L250 187 C258 186, 263 180, 262 172 L256 110 C255 108, 253 107, 252 108" stroke="#3D3229" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Handle */}
        <path d="M256 122 C268 120, 278 128, 278 140 C278 152, 270 160, 258 158" stroke="#3D3229" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Saucer */}
        <path d="M120 190 C120 188, 140 184, 200 184 C260 184, 280 188, 280 190 C280 194, 260 198, 200 198 C140 198, 120 194, 120 190Z" stroke="#3D3229" strokeWidth="2" fill="none" />
        {/* Steam - wavy */}
        <path d="M170 100 C168 90, 174 82, 172 72" stroke="#3D3229" strokeWidth="1.8" strokeLinecap="round" fill="none" strokeDasharray="2 4" />
        <path d="M200 96 C198 84, 204 76, 202 64" stroke="#3D3229" strokeWidth="1.8" strokeLinecap="round" fill="none" strokeDasharray="2 4" />
        <path d="M230 100 C228 90, 234 82, 232 72" stroke="#3D3229" strokeWidth="1.8" strokeLinecap="round" fill="none" strokeDasharray="2 4" />
        {/* Heart in cup */}
        <path d="M192 140 C192 134, 186 130, 182 134 C178 138, 182 144, 192 152 C202 144, 206 138, 202 134 C198 130, 192 134, 192 140Z" stroke="#3D3229" strokeWidth="1.5" fill="none" />
        {/* Small dots decoration */}
        <circle cx="120" cy="120" r="2" fill="#3D3229" opacity="0.3" />
        <circle cx="280" cy="100" r="1.5" fill="#3D3229" opacity="0.2" />
        <circle cx="310" cy="140" r="2" fill="#3D3229" opacity="0.15" />
      </svg>
    );
  }

  // Bread / bakery
  if (variant === 1 || variant === 5) {
    return (
      <svg className={className} viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="240" rx="12" fill="#FBF8F3" />
        {/* Bread loaf */}
        <path d="M130 170 C130 170, 132 120, 160 105 C180 95, 220 95, 240 105 C268 120, 270 170, 270 170" stroke="#3D3229" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Score lines on bread */}
        <path d="M160 115 C170 125, 180 128, 195 120" stroke="#3D3229" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M190 110 C200 120, 210 123, 225 115" stroke="#3D3229" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M175 125 C185 135, 195 138, 210 130" stroke="#3D3229" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Cutting board */}
        <path d="M110 170 L290 170 C292 170, 294 172, 294 174 L294 180 C294 182, 292 184, 290 184 L110 184 C108 184, 106 182, 106 180 L106 174 C106 172, 108 170, 110 170Z" stroke="#3D3229" strokeWidth="2" fill="none" />
        {/* Wheat stalk left */}
        <path d="M90 190 L100 130" stroke="#3D3229" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M96 150 C90 145, 88 140, 92 136" stroke="#3D3229" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M98 142 C104 137, 106 132, 102 128" stroke="#3D3229" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Wheat stalk right */}
        <path d="M310 190 L300 130" stroke="#3D3229" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M304 150 C310 145, 312 140, 308 136" stroke="#3D3229" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M302 142 C296 137, 294 132, 298 128" stroke="#3D3229" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Crumbs */}
        <circle cx="150" cy="195" r="1.5" fill="#3D3229" opacity="0.3" />
        <circle cx="230" cy="192" r="1" fill="#3D3229" opacity="0.25" />
        <circle cx="260" cy="196" r="1.5" fill="#3D3229" opacity="0.2" />
      </svg>
    );
  }

  // Plate / restaurant
  if (variant === 2 || variant === 6) {
    return (
      <svg className={className} viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="240" rx="12" fill="#FBF8F3" />
        {/* Plate - slightly wobbly ellipse */}
        <ellipse cx="200" cy="150" rx="82" ry="40" stroke="#3D3229" strokeWidth="2.5" fill="none" />
        <ellipse cx="200" cy="148" rx="58" ry="26" stroke="#3D3229" strokeWidth="1.5" fill="none" strokeDasharray="3 5" />
        {/* Fork - hand drawn */}
        <path d="M92 80 L92 190" stroke="#3D3229" strokeWidth="2" strokeLinecap="round" />
        <path d="M84 80 L84 115 C84 120, 88 124, 92 124" stroke="#3D3229" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M92 80 L92 115" stroke="#3D3229" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M100 80 L100 115 C100 120, 96 124, 92 124" stroke="#3D3229" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Knife */}
        <path d="M308 80 L308 190" stroke="#3D3229" strokeWidth="2" strokeLinecap="round" />
        <path d="M308 80 C318 80, 320 100, 318 115 C316 124, 310 126, 308 124" stroke="#3D3229" strokeWidth="1.5" fill="none" />
        {/* Small food doodle on plate */}
        <path d="M185 140 C185 134, 190 130, 195 132 C198 128, 205 128, 208 132 C213 130, 218 134, 216 140" stroke="#3D3229" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        <path d="M188 142 L214 142" stroke="#3D3229" strokeWidth="1" strokeLinecap="round" />
        {/* Sparkle */}
        <path d="M140 90 L140 100 M135 95 L145 95" stroke="#3D3229" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M260 85 L260 93 M256 89 L264 89" stroke="#3D3229" strokeWidth="1" strokeLinecap="round" />
      </svg>
    );
  }

  // Storefront - default
  return (
    <svg className={className} viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="240" rx="12" fill="#FBF8F3" />
      {/* Building outline */}
      <rect x="110" y="75" width="180" height="125" rx="3" stroke="#3D3229" strokeWidth="2.5" fill="none" />
      {/* Awning - scalloped */}
      <path d="M105 100 C105 100, 120 115, 140 100 C160 85, 170 115, 190 100 C210 85, 220 115, 240 100 C260 85, 270 115, 290 100 C295 97, 295 100, 295 100" stroke="#3D3229" strokeWidth="2" fill="none" />
      <line x1="105" y1="100" x2="295" y2="100" stroke="#3D3229" strokeWidth="2" />
      {/* Door */}
      <rect x="175" y="140" width="50" height="60" rx="3" stroke="#3D3229" strokeWidth="2" fill="none" />
      <circle cx="218" cy="172" r="2.5" stroke="#3D3229" strokeWidth="1.5" fill="none" />
      {/* Windows */}
      <rect x="122" y="112" width="36" height="30" rx="2" stroke="#3D3229" strokeWidth="1.8" fill="none" />
      <line x1="140" y1="112" x2="140" y2="142" stroke="#3D3229" strokeWidth="1.2" />
      <line x1="122" y1="127" x2="158" y2="127" stroke="#3D3229" strokeWidth="1.2" />
      <rect x="242" y="112" width="36" height="30" rx="2" stroke="#3D3229" strokeWidth="1.8" fill="none" />
      <line x1="260" y1="112" x2="260" y2="142" stroke="#3D3229" strokeWidth="1.2" />
      <line x1="242" y1="127" x2="278" y2="127" stroke="#3D3229" strokeWidth="1.2" />
      {/* Sign */}
      <rect x="170" y="78" width="60" height="16" rx="2" stroke="#3D3229" strokeWidth="1.2" fill="none" />
      <line x1="178" y1="86" x2="222" y2="86" stroke="#3D3229" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 3" />
      {/* Flag */}
      <line x1="300" y1="60" x2="300" y2="100" stroke="#3D3229" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M300 62 L318 68 L300 76" stroke="#3D3229" strokeWidth="1.3" fill="none" />
      {/* Small plant */}
      <path d="M115 200 L115 188 C115 188, 110 182, 108 176" stroke="#3D3229" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M115 188 C115 188, 120 182, 122 176" stroke="#3D3229" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M115 192 C115 192, 108 188, 105 184" stroke="#3D3229" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    </svg>
  );
}
