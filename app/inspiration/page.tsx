"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface InspirationItem {
  id: string;
  title: string;
  vibe: string;
  tags: string[];
  image: string;
  size: "tall" | "medium" | "short";
}

// Reliable Unsplash photo IDs verified for fashion/outfit content
const ITEMS: InspirationItem[] = [
  {
    id: "1",
    title: "Street Luxe Editorial",
    vibe: "Street Luxe",
    tags: ["streetwear", "luxury", "urban", "oversized", "designer"],
    image: "https://images.unsplash.com/photo-1523381426568-c18dc7189b89?auto=format&fit=crop&w=400&q=80",
    size: "tall",
  },
  {
    id: "2",
    title: "Dark Academia Layers",
    vibe: "Dark Academia",
    tags: ["dark academia", "layered", "vintage", "intellectual", "autumn"],
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80",
    size: "medium",
  },
  {
    id: "3",
    title: "Clean Minimal Whites",
    vibe: "Clean Minimal",
    tags: ["minimal", "clean", "white", "simple", "neutral"],
    image: "https://images.unsplash.com/photo-1515886930-d7ac80299fb8?auto=format&fit=crop&w=400&q=80",
    size: "short",
  },
  {
    id: "4",
    title: "Coastal Prep Summer",
    vibe: "Coastal Prep",
    tags: ["coastal", "preppy", "summer", "nautical", "blue", "white"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    size: "tall",
  },
  {
    id: "5",
    title: "Old Money Aesthetic",
    vibe: "Old Money",
    tags: ["old money", "classic", "tailored", "elegant", "neutral", "preppy"],
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80",
    size: "medium",
  },
  {
    id: "6",
    title: "Y2K Chrome Dreams",
    vibe: "Y2K Revival",
    tags: ["y2k", "retro", "metallic", "chrome", "2000s", "flashy"],
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&q=80",
    size: "tall",
  },
  {
    id: "7",
    title: "Soft Girl Pastels",
    vibe: "Soft Girl",
    tags: ["soft girl", "pastel", "kawaii", "pink", "cute", "feminine"],
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=400&q=80",
    size: "short",
  },
  {
    id: "8",
    title: "Gorpcore Utility",
    vibe: "Gorpcore",
    tags: ["gorpcore", "utility", "outdoor", "technical", "sporty", "functional"],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
    size: "medium",
  },
  {
    id: "9",
    title: "Techwear Future",
    vibe: "Techwear",
    tags: ["techwear", "futuristic", "black", "technical", "cyberpunk", "urban"],
    image: "https://images.unsplash.com/photo-1551488831-00ddcef29ea5?auto=format&fit=crop&w=400&q=80",
    size: "tall",
  },
  {
    id: "10",
    title: "Cottagecore Dream",
    vibe: "Cottagecore",
    tags: ["cottagecore", "floral", "feminine", "nature", "vintage", "soft"],
    image: "https://images.unsplash.com/photo-1496747488892-14eaf55ddc55?auto=format&fit=crop&w=400&q=80",
    size: "short",
  },
  {
    id: "11",
    title: "Hypebeast Drops",
    vibe: "Hypebeast",
    tags: ["hypebeast", "sneakers", "streetwear", "hype", "bold", "logo"],
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
    size: "medium",
  },
  {
    id: "12",
    title: "Boho Free Spirit",
    vibe: "Boho Chic",
    tags: ["boho", "bohemian", "flowy", "earthy", "layered", "festival"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80",
    size: "tall",
  },
  {
    id: "13",
    title: "Business Slay",
    vibe: "Business Casual",
    tags: ["business casual", "office", "blazer", "professional", "sleek"],
    image: "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=400&q=80",
    size: "short",
  },
  {
    id: "14",
    title: "Grunge Revival",
    vibe: "Grunge",
    tags: ["grunge", "90s", "distressed", "denim", "band tee", "dark"],
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=400&q=80",
    size: "medium",
  },
  {
    id: "15",
    title: "Indie Aesthetic",
    vibe: "Indie",
    tags: ["indie", "vintage", "thrifted", "eclectic", "artsy", "unique"],
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80",
    size: "tall",
  },
  {
    id: "16",
    title: "Athleisure Done Right",
    vibe: "Athleisure",
    tags: ["athleisure", "sporty", "gym", "comfortable", "trendy", "active"],
    image: "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=400&q=80",
    size: "medium",
  },
  {
    id: "17",
    title: "Color Pop Statement",
    vibe: "Color Pop",
    tags: ["colorful", "bold", "statement", "bright", "maximalist", "fun"],
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    size: "short",
  },
  {
    id: "18",
    title: "Quiet Luxury",
    vibe: "Quiet Luxury",
    tags: ["quiet luxury", "understated", "quality", "minimal", "neutral", "elegant"],
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
    size: "tall",
  },
  {
    id: "19",
    title: "Barbiecore Pink",
    vibe: "Barbiecore",
    tags: ["barbiecore", "pink", "feminine", "bold", "playful", "glam"],
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
    size: "medium",
  },
  {
    id: "20",
    title: "Denim on Denim",
    vibe: "Denim Obsessed",
    tags: ["denim", "casual", "classic", "streetwear", "effortless", "blue"],
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    size: "short",
  },
  {
    id: "21",
    title: "Monochrome Power",
    vibe: "Monochrome",
    tags: ["monochrome", "tonal", "clean", "sleek", "minimal", "bold"],
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80",
    size: "tall",
  },
  {
    id: "22",
    title: "Streetwear Classics",
    vibe: "Classic Streetwear",
    tags: ["streetwear", "classic", "sneakers", "casual", "urban", "everyday"],
    image: "https://images.unsplash.com/photo-1556906781-9a412961a28c?auto=format&fit=crop&w=400&q=80",
    size: "medium",
  },
  {
    id: "23",
    title: "Summer Linen Vibes",
    vibe: "Summer Casual",
    tags: ["summer", "linen", "relaxed", "casual", "breezy", "neutral"],
    image: "https://images.unsplash.com/photo-1469334031814-f9ef6c8fae79?auto=format&fit=crop&w=400&q=80",
    size: "short",
  },
  {
    id: "24",
    title: "Editorial High Fashion",
    vibe: "High Fashion",
    tags: ["editorial", "high fashion", "avant garde", "bold", "statement", "runway"],
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=400&q=80",
    size: "tall",
  },
  {
    id: "25",
    title: "Oversized Everything",
    vibe: "Oversized",
    tags: ["oversized", "baggy", "relaxed", "streetwear", "cozy", "layered"],
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=400&q=80",
    size: "medium",
  },
  {
    id: "26",
    title: "All Black Fit",
    vibe: "All Black",
    tags: ["all black", "dark", "minimal", "edgy", "sleek", "monochrome"],
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80",
    size: "short",
  },
  {
    id: "27",
    title: "Preppy Campus",
    vibe: "Preppy",
    tags: ["preppy", "collegiate", "polo", "chino", "classic", "american"],
    image: "https://images.unsplash.com/photo-1610384023490-5a8a5f6d9f8a?auto=format&fit=crop&w=400&q=80",
    size: "tall",
  },
  {
    id: "28",
    title: "Festival Fits",
    vibe: "Festival",
    tags: ["festival", "boho", "colorful", "accessories", "summer", "fun"],
    image: "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?auto=format&fit=crop&w=400&q=80",
    size: "medium",
  },
  {
    id: "29",
    title: "Tailored Sharp",
    vibe: "Tailored",
    tags: ["tailored", "suit", "formal", "sharp", "classic", "menswear"],
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
    size: "short",
  },
  {
    id: "30",
    title: "Retro 70s Flare",
    vibe: "Retro 70s",
    tags: ["retro", "70s", "flare", "vintage", "brown", "earth tones"],
    image: "https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&w=400&q=80",
    size: "tall",
  },
  {
    id: "31",
    title: "Cozy Knit Season",
    vibe: "Cozy Knit",
    tags: ["knit", "cozy", "autumn", "sweater", "warm", "layered"],
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80",
    size: "medium",
  },
  {
    id: "32",
    title: "Resort Wear",
    vibe: "Resort",
    tags: ["resort", "tropical", "vacation", "breezy", "summer", "luxe"],
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    size: "short",
  },
  {
    id: "33",
    title: "Punk Edge",
    vibe: "Punk",
    tags: ["punk", "edgy", "leather", "chains", "dark", "rebel"],
    image: "https://images.unsplash.com/photo-1536766820879-059fec98ec0a?auto=format&fit=crop&w=400&q=80",
    size: "tall",
  },
  {
    id: "34",
    title: "Normcore Basics",
    vibe: "Normcore",
    tags: ["normcore", "basics", "simple", "everyday", "neutral", "effortless"],
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=400&q=80",
    size: "medium",
  },
  {
    id: "35",
    title: "Vintage Thrift",
    vibe: "Vintage",
    tags: ["vintage", "thrift", "retro", "unique", "secondhand", "classic"],
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
    size: "short",
  },
  {
    id: "36",
    title: "Neon Maximalist",
    vibe: "Maximalist",
    tags: ["maximalist", "neon", "bold", "colorful", "statement", "loud"],
    image: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?auto=format&fit=crop&w=400&q=80",
    size: "tall",
  },
  {
    id: "37",
    title: "Leather & Moto",
    vibe: "Moto",
    tags: ["leather", "moto", "edgy", "jacket", "biker", "dark"],
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80",
    size: "medium",
  },
  {
    id: "38",
    title: "Parisian Chic",
    vibe: "Parisian",
    tags: ["parisian", "french", "chic", "effortless", "classic", "elegant"],
    image: "https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&w=400&q=80",
    size: "short",
  },
  {
    id: "39",
    title: "Sporty Chic",
    vibe: "Sporty Chic",
    tags: ["sporty", "chic", "active", "feminine", "trendy", "lifestyle"],
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80",
    size: "tall",
  },
  {
    id: "40",
    title: "Earth Tones",
    vibe: "Earth Tones",
    tags: ["earth tones", "natural", "brown", "beige", "warm", "organic"],
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80",
    size: "medium",
  },
  {
    id: "41",
    title: "Luxe Loungewear",
    vibe: "Luxe Lounge",
    tags: ["loungewear", "luxury", "comfortable", "silk", "home", "relaxed"],
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=400&q=80",
    size: "short",
  },
  {
    id: "42",
    title: "Skater Style",
    vibe: "Skater",
    tags: ["skater", "streetwear", "casual", "baggy", "sneakers", "youth"],
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80",
    size: "tall",
  },
  {
    id: "43",
    title: "Smart Casual",
    vibe: "Smart Casual",
    tags: ["smart casual", "polished", "everyday", "versatile", "clean", "office"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    size: "medium",
  },
  {
    id: "44",
    title: "Glam Night Out",
    vibe: "Night Out Glam",
    tags: ["glam", "night out", "party", "sparkle", "dressy", "bold"],
    image: "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?auto=format&fit=crop&w=400&q=80",
    size: "short",
  },
  {
    id: "45",
    title: "Tropical Prints",
    vibe: "Tropical",
    tags: ["tropical", "print", "colorful", "summer", "vacation", "bold"],
    image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=400&q=80",
    size: "tall",
  },
  {
    id: "46",
    title: "Power Suit",
    vibe: "Power Suit",
    tags: ["power suit", "blazer", "formal", "professional", "strong", "tailored"],
    image: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?auto=format&fit=crop&w=400&q=80",
    size: "medium",
  },
  {
    id: "47",
    title: "Streetwear Hoodie",
    vibe: "Hoodie Culture",
    tags: ["hoodie", "streetwear", "casual", "cozy", "hype", "everyday"],
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=400&q=80",
    size: "short",
  },
  {
    id: "48",
    title: "Minimal Scandinavian",
    vibe: "Scandi Minimal",
    tags: ["scandinavian", "minimal", "clean", "neutral", "structured", "quality"],
    image: "https://images.unsplash.com/photo-1512201078372-9c6b2a0d528b?auto=format&fit=crop&w=400&q=80",
    size: "tall",
  },
];

const ALL_VIBES = Array.from(new Set(ITEMS.map((i) => i.vibe)));

// Gradient placeholders shown when an image fails to load
const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #ff2d78 0%, #9b51e0 100%)",
  "linear-gradient(135deg, #9b51e0 0%, #00d4ff 100%)",
  "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
  "linear-gradient(135deg, #48dbfb 0%, #ff9ff3 100%)",
  "linear-gradient(135deg, #1dd1a1 0%, #00d4ff 100%)",
];

function InspirationCard({ item }: { item: InspirationItem }) {
  const [imgFailed, setImgFailed] = useState(false);
  const heightClass =
    item.size === "tall" ? "h-80" : item.size === "medium" ? "h-60" : "h-44";
  const fallback = FALLBACK_GRADIENTS[parseInt(item.id) % FALLBACK_GRADIENTS.length];

  return (
    <div className="break-inside-avoid mb-3 group cursor-pointer">
      <div
        className={`relative rounded-2xl overflow-hidden border border-white/10 ${heightClass} transition-transform duration-200 group-hover:scale-[1.02]`}
      >
        {imgFailed ? (
          <div className="w-full h-full" style={{ background: fallback }} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover object-top"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <span
            className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase mb-1"
            style={{ background: "linear-gradient(90deg,#ff2d78,#9b51e0)", color: "#fff" }}
          >
            {item.vibe}
          </span>
          <p className="text-white font-bold text-sm leading-tight drop-shadow">{item.title}</p>
        </div>
      </div>
    </div>
  );
}

function InspirationContent() {
  const searchParams = useSearchParams();
  const vibeParam = searchParams.get("vibe");
  const tagsParam = searchParams.get("tags");

  const [search, setSearch] = useState("");
  const [activeVibe, setActiveVibe] = useState<string | null>(vibeParam ?? null);

  useEffect(() => {
    if (vibeParam) setActiveVibe(vibeParam);
  }, [vibeParam]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const fitTags = tagsParam ? tagsParam.toLowerCase().split(",") : [];

    return ITEMS.filter((item) => {
      const matchesVibe = activeVibe ? item.vibe === activeVibe : true;
      const matchesSearch =
        q === "" ||
        item.title.toLowerCase().includes(q) ||
        item.vibe.toLowerCase().includes(q) ||
        item.tags.some((t) => t.includes(q));
      return matchesVibe && matchesSearch;
    }).sort((a, b) => {
      if (fitTags.length === 0 || activeVibe || search) return 0;
      const scoreA = fitTags.filter((t) => a.tags.some((at) => at.includes(t))).length;
      const scoreB = fitTags.filter((t) => b.tags.some((bt) => bt.includes(t))).length;
      return scoreB - scoreA;
    });
  }, [search, activeVibe, tagsParam]);

  const hasFitContext = vibeParam || tagsParam;

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Header */}
      <nav className="px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/95 backdrop-blur-sm z-10 border-b border-white/5">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </Link>
        <h1 className="text-white font-black text-lg tracking-tight gradient-text">INSPO</h1>
        <div className="w-14" />
      </nav>

      <div className="px-4 pt-4 pb-2 max-w-2xl mx-auto w-full">
        {/* Fitcheck context banner */}
        {hasFitContext && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <span className="text-xl">✨</span>
            <div>
              <p className="text-white font-bold text-sm">Styled for your fit</p>
              <p className="text-white/40 text-xs">
                Showing styles based on your{" "}
                <span className="text-[#ff2d78] font-semibold">{vibeParam}</span> vibe
              </p>
            </div>
            <button
              onClick={() => setActiveVibe(null)}
              className="ml-auto text-white/30 hover:text-white/60 transition-colors text-xs font-medium"
            >
              Clear
            </button>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search styles, vibes, keywords..."
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 text-sm font-medium focus:outline-none focus:border-[#ff2d78]/50 focus:bg-white/[0.08] transition-all"
          />
        </div>

        {/* Vibe filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveVibe(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              activeVibe === null
                ? "bg-gradient-to-r from-[#ff2d78] to-[#9b51e0] text-white border-transparent"
                : "bg-white/5 text-white/50 border-white/10 hover:border-white/20"
            }`}
          >
            All
          </button>
          {ALL_VIBES.map((vibe) => (
            <button
              key={vibe}
              onClick={() => setActiveVibe(activeVibe === vibe ? null : vibe)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
                activeVibe === vibe
                  ? "bg-gradient-to-r from-[#ff2d78] to-[#9b51e0] text-white border-transparent"
                  : "bg-white/5 text-white/50 border-white/10 hover:border-white/20"
              }`}
            >
              {vibe}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="px-4 pb-2 max-w-2xl mx-auto w-full">
        <p className="text-white/30 text-xs font-medium">
          {filtered.length} style{filtered.length !== 1 ? "s" : ""}
          {activeVibe ? ` · ${activeVibe}` : ""}
        </p>
      </div>

      {/* Masonry grid */}
      <div className="px-4 pb-8 max-w-2xl mx-auto w-full">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">👀</p>
            <p className="text-white/40 font-medium">No styles found</p>
            <p className="text-white/20 text-sm mt-1">Try a different search or clear filters</p>
          </div>
        ) : (
          <div className="columns-2 gap-3">
            {filtered.map((item) => (
              <InspirationCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function InspirationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#ff2d78] border-t-transparent animate-spin" />
        </main>
      }
    >
      <InspirationContent />
    </Suspense>
  );
}
