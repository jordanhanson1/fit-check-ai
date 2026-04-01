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

const ITEMS: InspirationItem[] = [
  {
    id: "1",
    title: "Street Luxe Editorial",
    vibe: "Street Luxe",
    tags: ["streetwear", "luxury", "urban", "oversized", "designer"],
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
    size: "tall",
  },
  {
    id: "2",
    title: "Dark Academia Layers",
    vibe: "Dark Academia",
    tags: ["dark academia", "layered", "vintage", "intellectual", "autumn"],
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80",
    size: "medium",
  },
  {
    id: "3",
    title: "Clean Minimal Whites",
    vibe: "Clean Minimal",
    tags: ["minimal", "clean", "white", "simple", "neutral"],
    image: "https://images.unsplash.com/photo-1515886930-d7ac80299fb8?w=400&q=80",
    size: "short",
  },
  {
    id: "4",
    title: "Coastal Prep Summer",
    vibe: "Coastal Prep",
    tags: ["coastal", "preppy", "summer", "nautical", "blue", "white"],
    image: "https://images.unsplash.com/photo-1469334031814-f9ef6c8fae79?w=400&q=80",
    size: "tall",
  },
  {
    id: "5",
    title: "Old Money Aesthetic",
    vibe: "Old Money",
    tags: ["old money", "classic", "tailored", "elegant", "neutral", "preppy"],
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80",
    size: "medium",
  },
  {
    id: "6",
    title: "Y2K Chrome Dreams",
    vibe: "Y2K Revival",
    tags: ["y2k", "retro", "metallic", "chrome", "2000s", "flashy"],
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80",
    size: "tall",
  },
  {
    id: "7",
    title: "Soft Girl Pastels",
    vibe: "Soft Girl",
    tags: ["soft girl", "pastel", "kawaii", "pink", "cute", "feminine"],
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80",
    size: "short",
  },
  {
    id: "8",
    title: "Gorpcore Utility",
    vibe: "Gorpcore",
    tags: ["gorpcore", "utility", "outdoor", "technical", "sporty", "functional"],
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80",
    size: "medium",
  },
  {
    id: "9",
    title: "Techwear Future",
    vibe: "Techwear",
    tags: ["techwear", "futuristic", "black", "technical", "cyberpunk", "urban"],
    image: "https://images.unsplash.com/photo-1551488831-00ddcef29ea5?w=400&q=80",
    size: "tall",
  },
  {
    id: "10",
    title: "Cottagecore Dream",
    vibe: "Cottagecore",
    tags: ["cottagecore", "floral", "feminine", "nature", "vintage", "soft"],
    image: "https://images.unsplash.com/photo-1496747488892-14eaf55ddc55?w=400&q=80",
    size: "short",
  },
  {
    id: "11",
    title: "Hypebeast Drops",
    vibe: "Hypebeast",
    tags: ["hypebeast", "sneakers", "streetwear", "hype", "bold", "logo"],
    image: "https://images.unsplash.com/photo-1512436991641-6745cae1cae3?w=400&q=80",
    size: "medium",
  },
  {
    id: "12",
    title: "Boho Free Spirit",
    vibe: "Boho Chic",
    tags: ["boho", "bohemian", "flowy", "earthy", "layered", "festival"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    size: "tall",
  },
  {
    id: "13",
    title: "Business Slay",
    vibe: "Business Casual",
    tags: ["business casual", "office", "blazer", "professional", "sleek"],
    image: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=400&q=80",
    size: "short",
  },
  {
    id: "14",
    title: "Grunge Revival",
    vibe: "Grunge",
    tags: ["grunge", "90s", "distressed", "denim", "band tee", "dark"],
    image: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&q=80",
    size: "medium",
  },
  {
    id: "15",
    title: "Indie Aesthetic",
    vibe: "Indie",
    tags: ["indie", "vintage", "thrifted", "eclectic", "artsy", "unique"],
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80",
    size: "tall",
  },
  {
    id: "16",
    title: "Athleisure Done Right",
    vibe: "Athleisure",
    tags: ["athleisure", "sporty", "gym", "comfortable", "trendy", "active"],
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80",
    size: "medium",
  },
  {
    id: "17",
    title: "Color Pop Statement",
    vibe: "Color Pop",
    tags: ["colorful", "bold", "statement", "bright", "maximalist", "fun"],
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",
    size: "short",
  },
  {
    id: "18",
    title: "Quiet Luxury",
    vibe: "Quiet Luxury",
    tags: ["quiet luxury", "understated", "quality", "minimal", "neutral", "elegant"],
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
    size: "tall",
  },
  {
    id: "19",
    title: "Barbiecore Pink",
    vibe: "Barbiecore",
    tags: ["barbiecore", "pink", "feminine", "bold", "playful", "glam"],
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80",
    size: "medium",
  },
  {
    id: "20",
    title: "Denim on Denim",
    vibe: "Denim Obsessed",
    tags: ["denim", "casual", "classic", "streetwear", "effortless", "blue"],
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80",
    size: "short",
  },
  {
    id: "21",
    title: "Monochrome Power",
    vibe: "Monochrome",
    tags: ["monochrome", "tonal", "clean", "sleek", "minimal", "bold"],
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80",
    size: "tall",
  },
  {
    id: "22",
    title: "Streetwear Classics",
    vibe: "Classic Streetwear",
    tags: ["streetwear", "classic", "sneakers", "casual", "urban", "everyday"],
    image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&q=80",
    size: "medium",
  },
  {
    id: "23",
    title: "Summer Linen Vibes",
    vibe: "Summer Casual",
    tags: ["summer", "linen", "relaxed", "casual", "breezy", "neutral"],
    image: "https://images.unsplash.com/photo-1469334031814-f9ef6c8fae79?w=400&q=80",
    size: "short",
  },
  {
    id: "24",
    title: "Editorial High Fashion",
    vibe: "High Fashion",
    tags: ["editorial", "high fashion", "avant garde", "bold", "statement", "runway"],
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&q=80",
    size: "tall",
  },
];

const ALL_VIBES = Array.from(new Set(ITEMS.map((i) => i.vibe)));

function InspirationCard({ item }: { item: InspirationItem }) {
  const heightClass =
    item.size === "tall" ? "h-80" : item.size === "medium" ? "h-60" : "h-44";

  return (
    <div className="break-inside-avoid mb-3 group cursor-pointer">
      <div className={`relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 ${heightClass} transition-transform duration-200 group-hover:scale-[1.02]`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <span
            className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase mb-1"
            style={{ background: "linear-gradient(90deg,#ff2d78,#9b51e0)", color: "#fff" }}
          >
            {item.vibe}
          </span>
          <p className="text-white font-bold text-sm leading-tight">{item.title}</p>
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

  // Auto-apply vibe from fitcheck on first load
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
      // Sort by relevance to fitTags if present
      if (fitTags.length === 0 || activeVibe || q) return 0;
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
    <Suspense fallback={
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#ff2d78] border-t-transparent animate-spin" />
      </main>
    }>
      <InspirationContent />
    </Suspense>
  );
}
