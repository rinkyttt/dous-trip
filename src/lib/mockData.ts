export interface Review {
  author: string;
  rating: number;
  text: string;
  timeAgo: string;
}

export interface ReviewSummary {
  verdict: string;
  highlights: string;
  recentBuzz: string;
  concerns: string | null;
}

export interface Store {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  priceLevel: string;
  address: string;
  hours: string;
  phone: string;
  website: string;
  description: string;
  tags: string[];
  reviews: Review[];
  photoSeed: number;
  photoUrl?: string;
  lat: number;
  lng: number;
  neighborhood: string;
  reviewSummary?: ReviewSummary;
}

export interface TripStop {
  storeId: string;
  timeSlot: string;
}

const allStores: Store[] = [
  {
    id: "1",
    name: "Girl & the Goat",
    category: "American Restaurant",
    rating: 4.6,
    reviewCount: 4821,
    priceLevel: "$$$",
    address: "800 W Randolph St, Chicago, IL 60607",
    hours: "Open · Closes 11 PM",
    phone: "(312) 492-6262",
    website: "girlandthegoat.com",
    description: "Stephanie Izard's flagship West Loop restaurant — bold, inventive small plates in a buzzy, wood-fired space.",
    tags: ["small plates", "wood-fired", "date night", "west loop"],
    reviews: [
      { author: "Nina K.", rating: 5, text: "The wood-oven roasted pig face is legendary. Everything at this table is electric. One of the best meals I've had in Chicago, full stop.", timeAgo: "1 week ago" },
      { author: "James T.", rating: 5, text: "We did the chef's tasting and every course was a surprise. Stephanie Izard is a genius. Book months ahead — it's worth the wait.", timeAgo: "2 weeks ago" },
      { author: "Priya M.", rating: 4, text: "Incredible food, the escargot ravioli was mind-blowing. A bit loud for conversation but the energy is infectious.", timeAgo: "1 month ago" },
    ],
    photoSeed: 3,
    lat: 41.8842,
    lng: -87.6470,
    neighborhood: "West Loop",
  },
  {
    id: "2",
    name: "Au Cheval",
    category: "Diner & Bar",
    rating: 4.5,
    reviewCount: 6234,
    priceLevel: "$$",
    address: "800 W Randolph St, Chicago, IL 60607",
    hours: "Open · Closes 2 AM",
    phone: "(312) 929-4580",
    website: "auchevalchicago.com",
    description: "Cult-status diner known for its double cheeseburger, bone marrow, and late-night vibes in the heart of West Loop.",
    tags: ["burgers", "late night", "diner", "west loop"],
    reviews: [
      { author: "Sam R.", rating: 5, text: "This burger changed my life. The double with the egg and bacon is worth every calorie and every minute of the wait. Pure perfection.", timeAgo: "3 days ago" },
      { author: "Kate L.", rating: 5, text: "The bone marrow toast is criminally good. Come at an odd hour or expect a long wait. Totally worth it.", timeAgo: "1 week ago" },
      { author: "Tyler B.", rating: 4, text: "Probably the best burger in the city. A bit cramped and loud but who cares. The chicken liver mousse is also incredible.", timeAgo: "2 weeks ago" },
    ],
    photoSeed: 3,
    lat: 41.8843,
    lng: -87.6468,
    neighborhood: "West Loop",
  },
  {
    id: "3",
    name: "Publican",
    category: "Beer Hall & Restaurant",
    rating: 4.5,
    reviewCount: 3102,
    priceLevel: "$$$",
    address: "837 W Fulton Market, Chicago, IL 60607",
    hours: "Open · Closes 10 PM",
    phone: "(312) 733-9555",
    website: "thepublicanrestaurant.com",
    description: "Expansive, Roman-hall-style beer pub celebrating oysters, pork, and craft beer in the Fulton Market district.",
    tags: ["beer", "oysters", "pork", "fulton market"],
    reviews: [
      { author: "Chris D.", rating: 5, text: "The oysters, ham, and beer trio is the perfect Chicago meal. Loud, communal, and absolutely delicious. A must-do brunch spot too.", timeAgo: "5 days ago" },
      { author: "Rachel W.", rating: 4, text: "Sunday brunch here is iconic. The frites are some of the best in the city. Great beer selection and a beautiful, dramatic space.", timeAgo: "2 weeks ago" },
      { author: "Mark S.", rating: 5, text: "Every dish is a revelation. The pig ear salad converted me and I've been a devoted fan ever since. Bring a group.", timeAgo: "1 month ago" },
    ],
    photoSeed: 3,
    lat: 41.8860,
    lng: -87.6483,
    neighborhood: "Fulton Market",
  },
  {
    id: "4",
    name: "Big Star",
    category: "Taco Bar",
    rating: 4.4,
    reviewCount: 5417,
    priceLevel: "$",
    address: "1531 N Damen Ave, Chicago, IL 60622",
    hours: "Open · Closes 2 AM",
    phone: "(773) 235-4039",
    website: "bigstarchicago.com",
    description: "Beloved honky-tonk taco bar on the Wicker Park/Bucktown border — cheap tacos, strong whiskey, great patio.",
    tags: ["tacos", "whiskey", "patio", "bucktown"],
    reviews: [
      { author: "Anna C.", rating: 5, text: "The best $4 taco you'll ever eat. The pork belly with pickled jalapeño is unreal. The patio in summer is Chicago at its finest.", timeAgo: "1 week ago" },
      { author: "Diego F.", rating: 4, text: "Proper honky-tonk vibes. Get the whiskies, the queso, and the fish taco. Always a line but always worth it.", timeAgo: "3 weeks ago" },
      { author: "Mia L.", rating: 5, text: "Cheap, delicious, and the best atmosphere in the neighborhood. The churros with chocolate are a must for dessert.", timeAgo: "1 month ago" },
    ],
    photoSeed: 3,
    lat: 41.9098,
    lng: -87.6776,
    neighborhood: "Wicker Park",
  },
  {
    id: "5",
    name: "Dove's Luncheonette",
    category: "Tex-Mex Diner",
    rating: 4.5,
    reviewCount: 2891,
    priceLevel: "$$",
    address: "1545 N Damen Ave, Chicago, IL 60622",
    hours: "Open · Closes 10 PM",
    phone: "(773) 645-4060",
    website: "doveschicago.com",
    description: "Soul-warming Tex-Mex diner from the One Off Hospitality Group — enchiladas, soul music, and the best breakfast in Wicker Park.",
    tags: ["tex-mex", "brunch", "soul food", "wicker park"],
    reviews: [
      { author: "Keisha B.", rating: 5, text: "The chicken enchiladas with mole are transcendent. A tiny space with big soul — the music selection alone is worth the visit.", timeAgo: "4 days ago" },
      { author: "Eric H.", rating: 5, text: "Best weekend brunch spot in the city. The migas with everything on top is a religious experience. Counter seating adds to the charm.", timeAgo: "2 weeks ago" },
      { author: "Sophia N.", rating: 4, text: "Iconic Wicker Park spot. The brisket hash is incredible. Small and always packed but the food is worth squeezing in.", timeAgo: "1 month ago" },
    ],
    photoSeed: 1,
    lat: 41.9101,
    lng: -87.6775,
    neighborhood: "Wicker Park",
  },
  {
    id: "6",
    name: "Mindy's Bakery",
    category: "Bakery & Cafe",
    rating: 4.6,
    reviewCount: 1834,
    priceLevel: "$$",
    address: "1747 N Damen Ave, Chicago, IL 60647",
    hours: "Open · Closes 6 PM",
    phone: "(773) 489-2600",
    website: "mindysbakery.com",
    description: "James Beard Award-winning pastry chef Mindy Segal's beloved Bucktown bakery, known for cookies, cakes, and creative sweets.",
    tags: ["bakery", "cookies", "pastries", "bucktown"],
    reviews: [
      { author: "Laura T.", rating: 5, text: "The hot chocolate cookies are the reason I moved to Bucktown. Mindy is a genius with sugar. Everything is handmade and extraordinary.", timeAgo: "3 days ago" },
      { author: "Dan P.", rating: 5, text: "Best bakery in Chicago, hands down. The salty butterscotch pudding made me cry real tears of joy. A true neighborhood treasure.", timeAgo: "1 week ago" },
      { author: "Amy Z.", rating: 4, text: "Incredible pastries and a cozy space. The seasonal specials are always worth trying. A bit pricey but absolutely worth it.", timeAgo: "2 weeks ago" },
    ],
    photoSeed: 2,
    lat: 41.9145,
    lng: -87.6776,
    neighborhood: "Bucktown",
  },
  {
    id: "7",
    name: "Small Cheval",
    category: "Burger Bar",
    rating: 4.4,
    reviewCount: 2203,
    priceLevel: "$$",
    address: "1732 N Milwaukee Ave, Chicago, IL 60647",
    hours: "Open · Closes 2 AM",
    phone: "(773) 661-2469",
    website: "smallchevalmilwaukee.com",
    description: "Au Cheval's little sibling in Bucktown — streamlined menu of their famous smash burgers, fries, and cold drinks.",
    tags: ["burgers", "late night", "casual", "bucktown"],
    reviews: [
      { author: "Jake M.", rating: 5, text: "Same Au Cheval magic in a smaller, more neighborhood package. The single burger with the special sauce is perfect. Easier to get into than the original.", timeAgo: "1 week ago" },
      { author: "Rosa C.", rating: 4, text: "Great for a quick, incredible burger. The fries are crispy perfection. Love that this exists closer to home.", timeAgo: "2 weeks ago" },
      { author: "Ben W.", rating: 4, text: "Reliable, delicious, and unpretentious. The double smash burger with egg is a late-night ritual for me.", timeAgo: "1 month ago" },
    ],
    photoSeed: 3,
    lat: 41.9142,
    lng: -87.6726,
    neighborhood: "Bucktown",
  },
  {
    id: "8",
    name: "Lula Cafe",
    category: "Farm-to-Table Cafe",
    rating: 4.6,
    reviewCount: 3567,
    priceLevel: "$$",
    address: "2537 N Kedzie Blvd, Chicago, IL 60647",
    hours: "Open · Closes 10 PM",
    phone: "(773) 489-9554",
    website: "lulacafe.com",
    description: "Logan Square pioneer and farm-to-table legend — inventive seasonal menus, legendary Monday prix fixe, and a warm neighborhood soul.",
    tags: ["farm-to-table", "seasonal", "brunch", "logan square"],
    reviews: [
      { author: "Chloe K.", rating: 5, text: "The Monday prix fixe is one of Chicago's great dining traditions. Seasonal, creative, and always surprising. Lula defined what Logan Square could be.", timeAgo: "5 days ago" },
      { author: "Marcus G.", rating: 5, text: "Been coming here for 10 years and it only gets better. The brunch is the best in Chicago — the egg dishes are masterclasses in simplicity.", timeAgo: "2 weeks ago" },
      { author: "Jen H.", rating: 4, text: "A true neighborhood gem. Everything is so thoughtfully sourced and prepared. The pasta changes weekly and is always incredible.", timeAgo: "1 month ago" },
    ],
    photoSeed: 3,
    lat: 41.9292,
    lng: -87.7027,
    neighborhood: "Logan Square",
  },
];

export function getStoreById(id: string): Store | undefined {
  return allStores.find((s) => s.id === id);
}

export function getAllStores(): Store[] {
  return allStores;
}

export const defaultTripData: Record<number, TripStop[]> = {
  25: [
    { storeId: "6", timeSlot: "10:00 AM" },
    { storeId: "4", timeSlot: "12:30 PM" },
    { storeId: "1", timeSlot: "7:00 PM" },
  ],
  27: [
    { storeId: "5", timeSlot: "10:30 AM" },
    { storeId: "3", timeSlot: "7:00 PM" },
  ],
  29: [
    { storeId: "7", timeSlot: "12:00 PM" },
    { storeId: "2", timeSlot: "8:00 PM" },
  ],
};

// Simple keyword matching to simulate AI-powered search
export function searchStores(query: string): { stores: Store[]; summary: string } {
  const q = query.toLowerCase();

  const scored = allStores.map((store) => {
    let score = 0;
    const fields = [
      store.name.toLowerCase(),
      store.category.toLowerCase(),
      store.description.toLowerCase(),
      store.neighborhood.toLowerCase(),
      ...store.tags.map((t) => t.toLowerCase()),
    ].join(" ");

    const words = q.split(/\s+/).filter((w) => w.length > 2);
    for (const word of words) {
      if (fields.includes(word)) score += 2;
    }

    if (q.includes("burger") && fields.includes("burger")) score += 5;
    if (q.includes("taco") && fields.includes("taco")) score += 5;
    if (q.includes("bakery") || q.includes("pastry") || q.includes("cookie")) {
      if (fields.includes("bakery") || fields.includes("pastry")) score += 5;
    }
    if (q.includes("brunch") && fields.includes("brunch")) score += 4;
    if (q.includes("late night") && fields.includes("late night")) score += 5;
    if (q.includes("patio") && fields.includes("patio")) score += 3;
    if (q.includes("beer") && fields.includes("beer")) score += 4;
    if (q.includes("date") && fields.includes("date night")) score += 4;
    if (q.includes("west loop") && fields.includes("west loop")) score += 5;
    if (q.includes("bucktown") && fields.includes("bucktown")) score += 5;
    if (q.includes("wicker") && fields.includes("wicker park")) score += 5;
    if (q.includes("logan") && fields.includes("logan square")) score += 5;
    if ((q.includes("best") || q.includes("top")) && store.rating >= 4.5) score += 3;
    if (q.includes("cheap") || q.includes("affordable")) {
      if (store.priceLevel === "$") score += 4;
      if (store.priceLevel === "$$") score += 2;
    }
    if (q.includes("fancy") || q.includes("upscale")) {
      if (store.priceLevel === "$$$") score += 4;
    }
    if (words.length > 0 && score === 0) {
      if (q.includes("food") || q.includes("eat") || q.includes("restaurant") || q.includes("place")) score = 1;
    }

    return { store, score };
  });

  const results = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || b.store.rating - a.store.rating)
    .map((s) => s.store);

  const finalResults = results.length > 0 ? results : allStores.sort((a, b) => b.rating - a.rating).slice(0, 4);
  const summary = generateSummary(q, finalResults);

  return { stores: finalResults, summary };
}

function generateSummary(query: string, stores: Store[]): string {
  if (stores.length === 0) return "No results found. Try 'best burgers', 'West Loop dinner', or 'Bucktown brunch'.";
  const top = stores[0];
  const q = query.toLowerCase();

  if (q.includes("burger")) return `Found ${stores.length} burger spots. **${top.name}** tops the list with ${top.rating} stars — ${top.reviewCount.toLocaleString()} reviewers can't be wrong.`;
  if (q.includes("taco")) return `Here are ${stores.length} taco spots. **${top.name}** in ${top.neighborhood} is the standout — legendary $4 tacos and late-night whiskey.`;
  if (q.includes("bakery") || q.includes("pastry") || q.includes("cookie")) return `Found ${stores.length} bakery and pastry spot${stores.length > 1 ? "s" : ""}. **${top.name}** leads with ${top.rating} stars — their handmade sweets are the stuff of legend.`;
  if (q.includes("brunch")) return `Here are ${stores.length} brunch picks. **${top.name}** in ${top.neighborhood} is the crowd favorite.`;
  if (q.includes("west loop") || q.includes("fulton")) return `Found ${stores.length} West Loop/Fulton Market spot${stores.length > 1 ? "s" : ""}. **${top.name}** stands out with ${top.rating} stars.`;
  if (q.includes("bucktown") || q.includes("wicker")) return `Here are ${stores.length} Bucktown/Wicker Park picks. **${top.name}** is the top-rated at ${top.rating} stars.`;

  return `Found ${stores.length} places. **${top.name}** in ${top.neighborhood} leads with ${top.rating} stars across ${top.reviewCount.toLocaleString()} reviews.`;
}
