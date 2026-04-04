"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface InspirationItem {
  id: string;
  title: string;
  vibe: string;
  tags: string[];
  /** Primary image URL. Falls back to picsum then gradient on error. */
  image: string;
  size: "tall" | "medium" | "short";
}


const ITEMS: InspirationItem[] = [
  // ── Street Luxe ─────────────────────────────────────────────────────────────
  { id: "sl1", title: "Street Luxe Editorial", vibe: "Street Luxe", tags: ["streetwear", "luxury", "urban", "oversized", "designer"], image: "https://images.unsplash.com/photo-1523381426568-c18dc7189b89?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "sl2", title: "Designer Logomania", vibe: "Street Luxe", tags: ["streetwear", "luxury", "logo", "designer", "bold"], image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "sl3", title: "Off-Duty Luxe", vibe: "Street Luxe", tags: ["streetwear", "luxury", "casual", "elevated", "cool"], image: "https://images.unsplash.com/photo-1556906781-9a412961a28c?auto=format&fit=crop&w=400&q=80", size: "short" },
  { id: "sl4", title: "Uptown Downtown", vibe: "Street Luxe", tags: ["streetwear", "luxury", "mix", "contrast", "urban"], image: "https://images.unsplash.com/photo-1529334830-6a7d0d36e05d?auto=format&fit=crop&w=400&q=80", size: "tall" },

  // ── Dark Academia ────────────────────────────────────────────────────────────
  { id: "da1", title: "Library Layers", vibe: "Dark Academia", tags: ["dark academia", "layered", "vintage", "intellectual", "autumn"], image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "da2", title: "Tweed & Turtleneck", vibe: "Dark Academia", tags: ["dark academia", "tweed", "turtleneck", "classic", "scholarly"], image: "https://images.unsplash.com/photo-1612902456551-b93d3a1ca7ef?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "da3", title: "Autumn Scholar", vibe: "Dark Academia", tags: ["dark academia", "autumn", "warm tones", "cozy", "literary"], image: "https://images.unsplash.com/photo-1740409497230-b80c5cc5e6a1?auto=format&fit=crop&w=400&q=80", size: "short" },
  { id: "da4", title: "Moody Monochrome", vibe: "Dark Academia", tags: ["dark academia", "dark", "moody", "monochrome", "intellectual"], image: "https://images.unsplash.com/photo-1696451203069-a7ca86fbc593?auto=format&fit=crop&w=400&q=80", size: "medium" },

  // ── Clean Minimal ────────────────────────────────────────────────────────────
  { id: "cm1", title: "White on White", vibe: "Clean Minimal", tags: ["minimal", "clean", "white", "simple", "neutral"], image: "https://images.unsplash.com/photo-1515886930-d7ac80299fb8?auto=format&fit=crop&w=400&q=80", size: "short" },
  { id: "cm2", title: "Sculptural Silhouette", vibe: "Clean Minimal", tags: ["minimal", "sculptural", "structure", "white", "clean"], image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "cm3", title: "Neutral Palette", vibe: "Clean Minimal", tags: ["minimal", "neutral", "beige", "simple", "effortless"], image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "cm4", title: "One Piece Statement", vibe: "Clean Minimal", tags: ["minimal", "statement", "clean", "modern", "simple"], image: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=400&q=80", size: "short" },

  // ── Coastal Prep ─────────────────────────────────────────────────────────────
  { id: "cp1", title: "Nautical Stripes", vibe: "Coastal Prep", tags: ["coastal", "preppy", "stripes", "nautical", "blue", "white"], image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "cp2", title: "Harbor Club", vibe: "Coastal Prep", tags: ["coastal", "preppy", "summer", "marina", "linen"], image: "https://images.unsplash.com/photo-1469334031814-f9ef6c8fae79?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "cp3", title: "Regatta Ready", vibe: "Coastal Prep", tags: ["coastal", "preppy", "polo", "sailing", "classic"], image: "https://images.unsplash.com/photo-1531734819660-fed5bc4cfb3c?auto=format&fit=crop&w=400&q=80", size: "short" },
  { id: "cp4", title: "East Coast Summer", vibe: "Coastal Prep", tags: ["coastal", "summer", "preppy", "relaxed", "classic"], image: "https://images.unsplash.com/photo-1715765354354-c5e5a84e1704?auto=format&fit=crop&w=400&q=80", size: "tall" },

  // ── Old Money ────────────────────────────────────────────────────────────────
  { id: "om1", title: "Old Money Classic", vibe: "Old Money", tags: ["old money", "classic", "tailored", "elegant", "neutral"], image: "https://images.unsplash.com/photo-1716807335126-54532f2ed0c3?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "om2", title: "Quiet Wealth", vibe: "Old Money", tags: ["old money", "quiet", "understated", "quality", "heritage"], image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "om3", title: "Country Club Casual", vibe: "Old Money", tags: ["old money", "country club", "polo", "khaki", "classic"], image: "https://images.unsplash.com/photo-1500336624523-d727130c3328?auto=format&fit=crop&w=400&q=80", size: "short" },
  { id: "om4", title: "Inherited Elegance", vibe: "Old Money", tags: ["old money", "elegant", "heritage", "tailored", "understated"], image: "https://images.unsplash.com/photo-1768961284589-ac7fd41e1174?auto=format&fit=crop&w=400&q=80", size: "medium" },

  // ── Y2K Revival ──────────────────────────────────────────────────────────────
  { id: "y2k1", title: "Chrome & Candy", vibe: "Y2K Revival", tags: ["y2k", "retro", "metallic", "chrome", "2000s"], image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "y2k2", title: "Butterfly Effect", vibe: "Y2K Revival", tags: ["y2k", "butterfly", "playful", "2000s", "pink"], image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "y2k3", title: "Low Rise & Logos", vibe: "Y2K Revival", tags: ["y2k", "low rise", "logo", "2000s", "flashy"], image: "https://images.unsplash.com/photo-1530048596834-d21c9a02bfca?auto=format&fit=crop&w=400&q=80", size: "short" },
  { id: "y2k4", title: "Glitter & Gloss", vibe: "Y2K Revival", tags: ["y2k", "glitter", "glam", "shiny", "2000s"], image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80", size: "tall" },

  // ── Soft Girl ────────────────────────────────────────────────────────────────
  { id: "sg1", title: "Pastel Dream", vibe: "Soft Girl", tags: ["soft girl", "pastel", "kawaii", "pink", "cute"], image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80", size: "short" },
  { id: "sg2", title: "Bow & Blush", vibe: "Soft Girl", tags: ["soft girl", "bow", "pink", "feminine", "sweet"], image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "sg3", title: "Cloud Nine", vibe: "Soft Girl", tags: ["soft girl", "cloud", "white", "fluffy", "cute"], image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80", size: "tall" },

  // ── Gorpcore ─────────────────────────────────────────────────────────────────
  { id: "gc1", title: "Trail Ready", vibe: "Gorpcore", tags: ["gorpcore", "utility", "outdoor", "technical", "sporty"], image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "gc2", title: "Arc'teryx Aesthetic", vibe: "Gorpcore", tags: ["gorpcore", "technical", "shell", "mountain", "functional"], image: "https://images.unsplash.com/photo-1759685061030-41c288369512?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "gc3", title: "Urban Outdoors", vibe: "Gorpcore", tags: ["gorpcore", "urban", "outdoor", "functional", "layered"], image: "https://images.unsplash.com/photo-1759922656735-746048a8ecd4?auto=format&fit=crop&w=400&q=80", size: "short" },

  // ── Techwear ─────────────────────────────────────────────────────────────────
  { id: "tw1", title: "Cyberpunk Utility", vibe: "Techwear", tags: ["techwear", "futuristic", "black", "technical", "cyberpunk"], image: "https://images.unsplash.com/photo-1551488831-00ddcef29ea5?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "tw2", title: "Cargo Future", vibe: "Techwear", tags: ["techwear", "cargo", "black", "functional", "futuristic"], image: "https://images.unsplash.com/photo-1590411914259-ab083f58d04b?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "tw3", title: "Modular Ninja", vibe: "Techwear", tags: ["techwear", "modular", "dark", "layered", "technical"], image: "https://images.unsplash.com/photo-1535732278552-5a8a57552b63?auto=format&fit=crop&w=400&q=80", size: "short" },

  // ── Cottagecore ──────────────────────────────────────────────────────────────
  { id: "cc1", title: "Garden Party", vibe: "Cottagecore", tags: ["cottagecore", "floral", "feminine", "nature", "vintage"], image: "https://images.unsplash.com/photo-1496747488892-14eaf55ddc55?auto=format&fit=crop&w=400&q=80", size: "short" },
  { id: "cc2", title: "Wildflower Dress", vibe: "Cottagecore", tags: ["cottagecore", "floral dress", "nature", "soft", "romantic"], image: "https://images.unsplash.com/photo-1612821996907-d3710d7f1351?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "cc3", title: "Basket & Blooms", vibe: "Cottagecore", tags: ["cottagecore", "pastoral", "feminine", "linen", "earthy"], image: "https://images.unsplash.com/photo-1761665758660-7f363d45c62f?auto=format&fit=crop&w=400&q=80", size: "medium" },

  // ── Hypebeast ────────────────────────────────────────────────────────────────
  { id: "hb1", title: "Fresh Kicks", vibe: "Hypebeast", tags: ["hypebeast", "sneakers", "hype", "streetwear", "bold"], image: "https://images.unsplash.com/photo-1553028736-b955f3a47513?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "hb2", title: "Drop Season", vibe: "Hypebeast", tags: ["hypebeast", "limited", "supreme", "collab", "rare"], image: "https://images.unsplash.com/photo-1554925051-f668ed70d520?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "hb3", title: "Grail Haul", vibe: "Hypebeast", tags: ["hypebeast", "grail", "sneakers", "hype", "collector"], image: "https://images.unsplash.com/photo-1610392462690-84766bd687ca?auto=format&fit=crop&w=400&q=80", size: "short" },
  { id: "hb4", title: "Collab Heat", vibe: "Hypebeast", tags: ["hypebeast", "collab", "exclusive", "streetwear", "limited"], image: "https://images.unsplash.com/photo-1502389614483-e475fc34407e?auto=format&fit=crop&w=400&q=80", size: "medium" },

  // ── Boho Chic ────────────────────────────────────────────────────────────────
  { id: "bc1", title: "Free Spirit", vibe: "Boho Chic", tags: ["boho", "bohemian", "flowy", "earthy", "festival"], image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "bc2", title: "Desert Wanderer", vibe: "Boho Chic", tags: ["boho", "desert", "earthy", "fringe", "layered"], image: "https://images.unsplash.com/photo-1550153969-335d2fbeb378?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "bc3", title: "Maxi & Macramé", vibe: "Boho Chic", tags: ["boho", "maxi", "macramé", "natural", "relaxed"], image: "https://images.unsplash.com/photo-1581437152838-b666e2bb6c73?auto=format&fit=crop&w=400&q=80", size: "short" },

  // ── Business Casual ──────────────────────────────────────────────────────────
  { id: "biz1", title: "Power Blazer", vibe: "Business Casual", tags: ["business casual", "blazer", "office", "professional"], image: "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=400&q=80", size: "short" },
  { id: "biz2", title: "Boardroom Chic", vibe: "Business Casual", tags: ["business casual", "chic", "polished", "office", "sleek"], image: "https://images.unsplash.com/photo-1762341120551-6a021d18933a?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "biz3", title: "Smart Suit", vibe: "Business Casual", tags: ["business casual", "suit", "smart", "tailored", "professional"], image: "https://images.unsplash.com/photo-1544913988-3cbfca41b9f2?auto=format&fit=crop&w=400&q=80", size: "medium" },

  // ── Grunge ───────────────────────────────────────────────────────────────────
  { id: "gr1", title: "Band Tee Grunge", vibe: "Grunge", tags: ["grunge", "band tee", "90s", "distressed", "dark"], image: "https://images.unsplash.com/photo-1560791365-ee70cfa6b167?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "gr2", title: "Flannel Season", vibe: "Grunge", tags: ["grunge", "flannel", "denim", "90s", "casual"], image: "https://images.unsplash.com/photo-1746044506526-38713273e129?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "gr3", title: "Combat Ready", vibe: "Grunge", tags: ["grunge", "combat boots", "dark", "edgy", "90s"], image: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=400&q=80", size: "short" },

  // ── Indie ────────────────────────────────────────────────────────────────────
  { id: "in1", title: "Thrift Store Find", vibe: "Indie", tags: ["indie", "thrift", "vintage", "eclectic", "unique"], image: "https://images.unsplash.com/photo-1613329357776-979362d69807?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "in2", title: "Record Store Regular", vibe: "Indie", tags: ["indie", "vinyl", "90s", "casual", "artsy"], image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "in3", title: "Art Hoe Aesthetic", vibe: "Indie", tags: ["indie", "art", "colorful", "creative", "unique"], image: "https://images.unsplash.com/photo-1700495937590-79499994f47f?auto=format&fit=crop&w=400&q=80", size: "short" },

  // ── Athleisure ───────────────────────────────────────────────────────────────
  { id: "at1", title: "Gym to Street", vibe: "Athleisure", tags: ["athleisure", "sporty", "gym", "comfortable", "trendy"], image: "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "at2", title: "Lululemon Moment", vibe: "Athleisure", tags: ["athleisure", "yoga", "leggings", "sporty", "chic"], image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "at3", title: "Sporty Luxe", vibe: "Athleisure", tags: ["athleisure", "luxury", "sporty", "elevated", "active"], image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80", size: "short" },
  { id: "at4", title: "Core Aesthetic", vibe: "Athleisure", tags: ["athleisure", "core", "workout", "set", "matching"], image: "https://images.unsplash.com/photo-1664885647983-772bde237f43?auto=format&fit=crop&w=400&q=80", size: "medium" },

  // ── Color Pop ────────────────────────────────────────────────────────────────
  { id: "col1", title: "Dopamine Dressing", vibe: "Color Pop", tags: ["colorful", "bold", "bright", "dopamine", "fun"], image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80", size: "short" },
  { id: "col2", title: "Maximalist Mix", vibe: "Color Pop", tags: ["colorful", "maximalist", "pattern", "bold", "statement"], image: "https://images.unsplash.com/photo-1496360166961-10a51d5f367a?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "col3", title: "Colour Clash", vibe: "Color Pop", tags: ["colorful", "clash", "unexpected", "bold", "experimental"], image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80", size: "medium" },

  // ── Quiet Luxury ─────────────────────────────────────────────────────────────
  { id: "ql1", title: "The Row Aesthetic", vibe: "Quiet Luxury", tags: ["quiet luxury", "understated", "quality", "minimal", "neutral"], image: "https://images.unsplash.com/photo-1760580335310-650fe79bc4d8?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "ql2", title: "Stealth Wealth", vibe: "Quiet Luxury", tags: ["quiet luxury", "stealth", "no logo", "premium", "elegant"], image: "https://images.unsplash.com/photo-1668107510198-81eeb46ebe21?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "ql3", title: "Cashmere Moment", vibe: "Quiet Luxury", tags: ["quiet luxury", "cashmere", "soft", "neutral", "quality"], image: "https://images.unsplash.com/photo-1740409497196-90c3b016d846?auto=format&fit=crop&w=400&q=80", size: "short" },
  { id: "ql4", title: "Elevated Basics", vibe: "Quiet Luxury", tags: ["quiet luxury", "basics", "elevated", "clean", "timeless"], image: "https://images.unsplash.com/photo-1610918018886-598a97d83386?auto=format&fit=crop&w=400&q=80", size: "tall" },

  // ── Barbiecore ───────────────────────────────────────────────────────────────
  { id: "bar1", title: "Hot Pink Everything", vibe: "Barbiecore", tags: ["barbiecore", "pink", "bold", "playful", "glam"], image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "bar2", title: "Dream House Drip", vibe: "Barbiecore", tags: ["barbiecore", "pink", "girly", "fun", "statement"], image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "bar3", title: "Plastic Fantastic", vibe: "Barbiecore", tags: ["barbiecore", "plastic", "shiny", "pink", "camp"], image: "https://images.unsplash.com/photo-1526743040294-b0fb68538d5e?auto=format&fit=crop&w=400&q=80", size: "short" },

  // ── Denim ────────────────────────────────────────────────────────────────────
  { id: "den1", title: "Double Denim", vibe: "Denim Obsessed", tags: ["denim", "double denim", "casual", "classic", "blue"], image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80", size: "short" },
  { id: "den2", title: "Vintage Wash", vibe: "Denim Obsessed", tags: ["denim", "vintage", "wash", "light blue", "retro"], image: "https://images.unsplash.com/photo-1727942990216-cf97154a5f0c?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "den3", title: "Raw Selvedge", vibe: "Denim Obsessed", tags: ["denim", "raw", "selvedge", "quality", "fitted"], image: "https://images.unsplash.com/photo-1765560217763-aaa285ffd313?auto=format&fit=crop&w=400&q=80", size: "medium" },

  // ── Monochrome ───────────────────────────────────────────────────────────────
  { id: "mono1", title: "All Black Everything", vibe: "Monochrome", tags: ["monochrome", "all black", "sleek", "dark", "edgy"], image: "https://images.unsplash.com/photo-1744812103771-711dcb74ea3f?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "mono2", title: "Tonal Dressing", vibe: "Monochrome", tags: ["monochrome", "tonal", "clean", "coordinated", "minimal"], image: "https://images.unsplash.com/photo-1683642766177-8ae7c4be03cb?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "mono3", title: "Greige Wave", vibe: "Monochrome", tags: ["monochrome", "greige", "neutral", "tonal", "elevated"], image: "https://images.unsplash.com/photo-1763766274625-3b502e267f26?auto=format&fit=crop&w=400&q=80", size: "short" },

  // ── Classic Streetwear ───────────────────────────────────────────────────────
  { id: "csw1", title: "Hoodie & Cargo", vibe: "Classic Streetwear", tags: ["streetwear", "hoodie", "cargo", "casual", "hype"], image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=400&q=80", size: "short" },
  { id: "csw2", title: "Sneaker Stack", vibe: "Classic Streetwear", tags: ["streetwear", "sneakers", "hype", "casual", "clean"], image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "csw3", title: "Tee & Joggers", vibe: "Classic Streetwear", tags: ["streetwear", "tee", "joggers", "everyday", "clean"], image: "https://images.unsplash.com/photo-1667844771157-bf231c03c197?auto=format&fit=crop&w=400&q=80", size: "medium" },

  // ── High Fashion ─────────────────────────────────────────────────────────────
  { id: "hf1", title: "Runway Moment", vibe: "High Fashion", tags: ["editorial", "high fashion", "avant garde", "bold", "runway"], image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "hf2", title: "Sculptural Gown", vibe: "High Fashion", tags: ["high fashion", "sculptural", "couture", "art", "dramatic"], image: "https://images.unsplash.com/photo-1773574488221-08b2883a1c80?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "hf3", title: "Deconstructed", vibe: "High Fashion", tags: ["high fashion", "deconstructed", "experimental", "avant garde"], image: "https://images.unsplash.com/photo-1485462537746-965f33f57f69?auto=format&fit=crop&w=400&q=80", size: "short" },

  // ── Power Suit ───────────────────────────────────────────────────────────────
  { id: "ps1", title: "Corner Office", vibe: "Power Suit", tags: ["power suit", "blazer", "formal", "professional", "strong"], image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "ps2", title: "Boss Fit", vibe: "Power Suit", tags: ["power suit", "boss", "strong", "tailored", "confident"], image: "https://images.unsplash.com/photo-1698339571562-252f1b67e9d8?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "ps3", title: "Checked Out", vibe: "Power Suit", tags: ["power suit", "check", "pattern", "tailored", "bold"], image: "https://images.unsplash.com/photo-1645990490574-4dba494b554a?auto=format&fit=crop&w=400&q=80", size: "short" },

  // ── Moto / Leather ───────────────────────────────────────────────────────────
  { id: "mot1", title: "Biker Edge", vibe: "Moto", tags: ["leather", "moto", "biker", "edgy", "jacket"], image: "https://images.unsplash.com/photo-1646228843811-1a75ac4f04f7?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "mot2", title: "Leather Season", vibe: "Moto", tags: ["leather", "moto", "dark", "cool", "rock"], image: "https://images.unsplash.com/photo-1695014192221-0f664d2a9b8c?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "mot3", title: "Rebel Drip", vibe: "Moto", tags: ["leather", "rebel", "boots", "dark", "attitude"], image: "https://images.unsplash.com/photo-1683121231638-4100d7f6deb2?auto=format&fit=crop&w=400&q=80", size: "short" },

  // ── Parisian ─────────────────────────────────────────────────────────────────
  { id: "par1", title: "Left Bank Chic", vibe: "Parisian", tags: ["parisian", "french", "chic", "effortless", "classic"], image: "https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&w=400&q=80", size: "short" },
  { id: "par2", title: "Beret & Baguette", vibe: "Parisian", tags: ["parisian", "beret", "french", "casual chic", "elegant"], image: "https://images.unsplash.com/photo-1634546269412-b671f827674b?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "par3", title: "Riviera Escape", vibe: "Parisian", tags: ["parisian", "riviera", "summery", "relaxed", "french"], image: "https://images.unsplash.com/photo-1523359346063-d879354c0ea5?auto=format&fit=crop&w=400&q=80", size: "medium" },

  // ── Earth Tones ──────────────────────────────────────────────────────────────
  { id: "et1", title: "Terracotta Season", vibe: "Earth Tones", tags: ["earth tones", "terracotta", "warm", "natural", "cozy"], image: "https://images.unsplash.com/photo-1618333452884-5c8d211ed2ad?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "et2", title: "Desert Palette", vibe: "Earth Tones", tags: ["earth tones", "desert", "brown", "sand", "organic"], image: "https://images.unsplash.com/photo-1740427304467-2fb80eaf3447?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "et3", title: "Forest Mood", vibe: "Earth Tones", tags: ["earth tones", "forest", "green", "olive", "nature"], image: "https://images.unsplash.com/photo-1545315003-c5ad6226c272?auto=format&fit=crop&w=400&q=80", size: "short" },

  // ── Night Out Glam ───────────────────────────────────────────────────────────
  { id: "nog1", title: "Disco Era", vibe: "Night Out Glam", tags: ["glam", "disco", "sparkle", "night out", "bold"], image: "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "nog2", title: "Club Ready", vibe: "Night Out Glam", tags: ["glam", "club", "mini dress", "heels", "glitter"], image: "https://images.unsplash.com/photo-1598901847919-c25d2c55f1ac?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "nog3", title: "Red Carpet Serve", vibe: "Night Out Glam", tags: ["glam", "red carpet", "gown", "statement", "elegant"], image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=400&q=80", size: "short" },

  // ── Tropical ─────────────────────────────────────────────────────────────────
  { id: "trop1", title: "Island Print", vibe: "Tropical", tags: ["tropical", "print", "colorful", "summer", "vacation"], image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=400&q=80", size: "short" },
  { id: "trop2", title: "Linen in Tulum", vibe: "Tropical", tags: ["tropical", "linen", "white", "relaxed", "resort"], image: "https://images.unsplash.com/photo-1607784750393-5edbcd13fc36?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "trop3", title: "Woven & Wild", vibe: "Tropical", tags: ["tropical", "woven", "handmade", "earthy", "resort"], image: "https://images.unsplash.com/photo-1768823132512-a8c31572d6aa?auto=format&fit=crop&w=400&q=80", size: "medium" },

  // ── Scandi Minimal ───────────────────────────────────────────────────────────
  { id: "scan1", title: "Stockholm Streets", vibe: "Scandi Minimal", tags: ["scandinavian", "minimal", "clean", "structured", "neutral"], image: "https://images.unsplash.com/photo-1760580334293-0a588da9d7c3?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "scan2", title: "Nordic Layers", vibe: "Scandi Minimal", tags: ["scandinavian", "layers", "winter", "neutral", "quality"], image: "https://images.unsplash.com/photo-1755376224231-3fc80007fb8e?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "scan3", title: "Copenhagen Cool", vibe: "Scandi Minimal", tags: ["scandinavian", "cool", "effortless", "modern", "clean"], image: "https://images.unsplash.com/photo-1581449774163-4afe54745c3e?auto=format&fit=crop&w=400&q=80", size: "short" },

  // ── Skater ───────────────────────────────────────────────────────────────────
  { id: "sk1", title: "Skate Park Ready", vibe: "Skater", tags: ["skater", "baggy", "casual", "street", "sneakers"], image: "https://images.unsplash.com/photo-1665675241472-ef9b474be5f2?auto=format&fit=crop&w=400&q=80", size: "medium" },
  { id: "sk2", title: "Vans & Flannel", vibe: "Skater", tags: ["skater", "vans", "flannel", "casual", "youth"], image: "https://images.unsplash.com/photo-1616178193482-4dad15347c26?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "sk3", title: "Grip Tape Aesthetic", vibe: "Skater", tags: ["skater", "graphic tee", "shorts", "relaxed", "fun"], image: "https://images.unsplash.com/photo-1566913485399-b31b0a99a0e5?auto=format&fit=crop&w=400&q=80", size: "short" },

  // ── Vintage ──────────────────────────────────────────────────────────────────
  { id: "vin1", title: "Decades Mix", vibe: "Vintage", tags: ["vintage", "decades", "thrift", "unique", "retro"], image: "https://images.unsplash.com/photo-1540924782561-3fc182603b86?auto=format&fit=crop&w=400&q=80", size: "short" },
  { id: "vin2", title: "60s Mod Revival", vibe: "Vintage", tags: ["vintage", "60s", "mod", "shift dress", "geometric"], image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=400&q=80", size: "tall" },
  { id: "vin3", title: "80s Power Vibes", vibe: "Vintage", tags: ["vintage", "80s", "bold", "shoulder pads", "statement"], image: "https://images.unsplash.com/photo-1551717743-25945655baab?auto=format&fit=crop&w=400&q=80", size: "medium" },
];

const ALL_VIBES = Array.from(new Set(ITEMS.map((i) => i.vibe)));

// Branded gradient placeholders for final fallback
const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg,#ff2d78 0%,#9b51e0 100%)",
  "linear-gradient(135deg,#9b51e0 0%,#00d4ff 100%)",
  "linear-gradient(135deg,#ff6b6b 0%,#feca57 100%)",
  "linear-gradient(135deg,#48dbfb 0%,#ff9ff3 100%)",
  "linear-gradient(135deg,#1dd1a1 0%,#00d4ff 100%)",
  "linear-gradient(135deg,#ff9f43 0%,#ee5a24 100%)",
];

function InspirationCard({ item }: { item: InspirationItem }) {
  const [src, setSrc] = useState(item.image);
  const [failed, setFailed] = useState(false);

  const heightClass =
    item.size === "tall" ? "h-80" : item.size === "medium" ? "h-60" : "h-44";
  const gradient = FALLBACK_GRADIENTS[parseInt(item.id.replace(/\D/g, "") || "0") % FALLBACK_GRADIENTS.length];

  const handleError = () => {
    // If Unsplash failed and we haven't tried picsum yet, fall back to picsum
    if (!src.includes("picsum")) {
      const seed = encodeURIComponent(item.id + item.vibe);
      setSrc(`https://picsum.photos/seed/${seed}/400/600`);
    } else {
      setFailed(true);
    }
  };

  return (
    <div className="break-inside-avoid mb-3 group cursor-pointer">
      <div className={`relative rounded-2xl overflow-hidden border border-white/10 ${heightClass} transition-transform duration-200 group-hover:scale-[1.02]`}>
        {failed ? (
          <div className="w-full h-full flex items-end" style={{ background: gradient }}>
            <div className="w-full h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={item.title}
            className="w-full h-full object-cover object-top"
            loading="lazy"
            onError={handleError}
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
      <nav className="px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/95 backdrop-blur-sm z-10 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </Link>
        <h1 className="font-black text-lg tracking-tight gradient-text">INSPO</h1>
        <div className="w-14" />
      </nav>

      <div className="px-4 pt-4 pb-2 max-w-2xl mx-auto w-full">
        {hasFitContext && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <span className="text-xl">✨</span>
            <div>
              <p className="text-white font-bold text-sm">Styled for your fit</p>
              <p className="text-white/40 text-xs">
                Based on your <span className="text-[#ff2d78] font-semibold">{vibeParam}</span> vibe
              </p>
            </div>
            <button onClick={() => setActiveVibe(null)} className="ml-auto text-white/30 hover:text-white/60 transition-colors text-xs font-medium">
              Clear
            </button>
          </div>
        )}

        <div className="relative mb-4">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search styles, vibes, keywords..."
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 text-sm font-medium focus:outline-none focus:border-[#ff2d78]/50 focus:bg-white/[0.08] transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveVibe(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${activeVibe === null ? "bg-gradient-to-r from-[#ff2d78] to-[#9b51e0] text-white border-transparent" : "bg-white/5 text-white/50 border-white/10 hover:border-white/20"}`}
          >
            All
          </button>
          {ALL_VIBES.map((vibe) => (
            <button
              key={vibe}
              onClick={() => setActiveVibe(activeVibe === vibe ? null : vibe)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${activeVibe === vibe ? "bg-gradient-to-r from-[#ff2d78] to-[#9b51e0] text-white border-transparent" : "bg-white/5 text-white/50 border-white/10 hover:border-white/20"}`}
            >
              {vibe}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-2 max-w-2xl mx-auto w-full">
        <p className="text-white/30 text-xs font-medium">
          {filtered.length} style{filtered.length !== 1 ? "s" : ""}
          {activeVibe ? ` · ${activeVibe}` : ""}
        </p>
      </div>

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
