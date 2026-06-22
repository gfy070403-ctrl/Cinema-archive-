/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { movieData, Movie } from "./data/movies";
import ArtPoster from "./components/ArtPoster";
import FilmExhibitionCard from "./components/FilmExhibitionCard";
import DetailModal from "./components/DetailModal";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Sparkles, 
  Award, 
  MapPin, 
  Calendar, 
  Clock, 
  Filter, 
  BookOpen, 
  Compass, 
  Info, 
  ListFilter, 
  RotateCw, 
  Heart, 
  CheckCircle2, 
  Bookmark,
  ChevronRight,
  TrendingUp,
  X,
  Play
} from "lucide-react";

interface SavedReview {
  notes: string;
  status: string; // none, watched, want_to, favorite
  personalRating: number;
  updatedAt: string;
}

interface SavedReviewsMap {
  [title: string]: SavedReview;
}

export default function App() {
  // --- States ---
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  // Spotlight Movie (displays in the Hero left col, can be selected randomly)
  const [spotlightMovie, setSpotlightMovie] = useState<Movie>(movieData[1]); // Default to "霸王别姬" (1993)
  
  // Saved reviews from local storage
  const [reviews, setReviews] = useState<SavedReviewsMap>({});

  // Stats calculation
  const [totalCuratedHours, setTotalCuratedHours] = useState(0);

  // --- Initial Mount Load ---
  useEffect(() => {
    const saved = localStorage.getItem("cinema_archive_reviews_v2");
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse reviews", e);
      }
    }

    // Calculate total runtime hours of the collection
    const hours = Math.round(movieData.reduce((acc, m) => acc + m.duration, 0) / 60);
    setTotalCuratedHours(hours);
  }, []);

  // --- Save / Update Review ---
  const handleSaveReview = (title: string, notes: string, status: string, rating: number) => {
    const updatedReviews = {
      ...reviews,
      [title]: {
        notes,
        status,
        personalRating: rating,
        updatedAt: new Date().toISOString()
      }
    };
    setReviews(updatedReviews);
    localStorage.setItem("cinema_archive_reviews_v2", JSON.stringify(updatedReviews));
  };

  // --- Spotlight Event ---
  const handlePickRandomSpotlight = () => {
    const filteredDataset = movieData.filter(m => m.title !== spotlightMovie.title);
    const randomIndex = Math.floor(Math.random() * filteredDataset.length);
    setSpotlightMovie(filteredDataset[randomIndex]);
  };

  // --- Filter Core ---
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const getFilteredMovies = () => {
    return movieData.filter((movie) => {
      // Category logic
      if (selectedCategory !== "全部") {
        if (selectedCategory === "其他") {
          const mainGenres = ["爱情", "剧情", "悬疑", "犯罪", "动画", "纪录片", "科幻"];
          const hasMainGenre = movie.genre.some((g) => mainGenres.includes(g));
          if (hasMainGenre) return false;
        } else {
          if (!movie.genre.includes(selectedCategory)) return false;
        }
      }

      // Search query logic
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = movie.title.toLowerCase().includes(q);
        const matchDirector = movie.director.name.toLowerCase().includes(q);
        const matchSummary = movie.summary.toLowerCase().includes(q);
        const matchGenre = movie.genre.some((g) => g.toLowerCase().includes(q));
        const matchYear = movie.year.toString().includes(q);
        if (!matchTitle && !matchDirector && !matchSummary && !matchGenre && !matchYear) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredMovies = getFilteredMovies();

  // Categories defined as per reference layout
  const categories = ["全部", "爱情", "剧情", "悬疑", "犯罪", "动画", "纪录片", "科幻", "其他"];

  // Helper stats inside local review logs
  const reviewCount = Object.keys(reviews).filter(key => reviews[key].status !== "none").length;
  const favoriteCount = Object.keys(reviews).filter(key => reviews[key].status === "favorite").length;

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-[#DFDCE2] via-[#EAE7EB] to-[#CDC5D2] noise-overlay pb-24 select-text text-[#12151F] flex flex-col cursor-default film-soft-focus">
      
      {/* Absolute Decorative Layer: Glorious Symmetrical Lily Flower & Cherub Illustration on Background */}
      <div className="absolute top-[3%] left-[-5%] w-[40%] max-w-[500px] aspect-[1/1] opacity-[0.25] pointer-events-none -z-10 mix-blend-multiply overflow-hidden">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#8E9BBF]">
          {/* Symmetrical white lily line drawings with elegant curls */}
          <path d="M 50,150 C 60,110 90,90 120,105 C 150,120 160,160 140,180 C 120,200 70,185 50,150 Z" fill="rgba(255,255,255,0.3)" stroke="currentColor" strokeWidth="0.4" />
          <path d="M 120,105 C 105,70 125,40 150,55 C 175,70 180,100 165,120 C 150,140 135,140 120,105 Z" fill="rgba(255,255,255,0.2)" stroke="currentColor" strokeWidth="0.4" />
          <path d="M 120,105 C 80,115 50,95 45,75 C 40,55 70,45 95,65 C 120,85 125,95 120,105 Z" fill="rgba(255,255,255,0.15)" stroke="currentColor" strokeWidth="0.4" />
          {/* Flower stalks and stamens */}
          <path d="M 120,105 Q 160,180 180,200" stroke="currentColor" strokeWidth="0.8" />
          <path d="M 120,105 Q 135,90 145,75" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="145" cy="75" r="1.5" fill="#ffffff" stroke="currentColor" strokeWidth="0.4" />
          <path d="M 120,105 Q 115,85 105,72" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="105" cy="72" r="1.5" fill="#ffffff" stroke="currentColor" strokeWidth="0.4" />
          <path d="M 120,105 Q 130,100 140,95" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="140" cy="95" r="1.5" fill="#ffffff" stroke="currentColor" strokeWidth="0.4" />
          {/* Star cross sparkle */}
          <path d="M 90,60 L 90,40 M 80,50 L 100,50" stroke="#ffffff" strokeWidth="0.8" />
          <circle cx="90" cy="50" r="1" fill="#ffffff" />
        </svg>
      </div>

      {/* Absolute Decorative Layer: High-Fidelity Goddess Bust Outline in Top Right */}
      <div className="absolute top-0 right-0 w-[55%] max-w-[700px] aspect-[1/1] opacity-35 pointer-events-none -z-10 mix-blend-multiply overflow-hidden scale-102 origin-top-right">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#8E9BBF]">
          {/* Symmetrical classical Greek goddess bust vector */}
          <path 
            d="M 120,35 
               C 135,28 170,25 185,55 
               C 198,80 182,108 168,118 
               C 155,128 150,148 142,162 
               C 137,172 108,182 88,188 
               C 68,193 52,188 45,178 
               C 39,168 45,152 49,145 
               C 53,137 47,129 42,122 
               C 35,112 28,95 28,82 
               C 28,68 35,60 39,55 
               C 41,52 38,45 38,39 
               C 38,32 44,22 54,15 
               C 64,9 81,12 91,19 
               C 101,25 110,30 120,35 Z" 
            fill="url(#goddess-silver-grad-heavy)" 
            stroke="rgba(255,255,255,0.85)" 
            strokeWidth="0.6" 
          />
          {/* Detailed sculptural shading contours */}
          <path d="M 45,130 C 58,125 72,128 85,135 Q 100,142 110,158" stroke="rgba(255,255,255,0.7)" strokeWidth="0.4" />
          <path d="M 120,35 C 112,48 95,58 75,62 M 122,38 C 115,55 98,72 82,78" stroke="rgba(255,255,255,0.6)" strokeWidth="0.4" />
          
          {/* Perfect string of glowing pearls draping around the goddess neck */}
          <path d="M 68,142 Q 95,155 122,130" stroke="rgba(30, 35, 51, 0.15)" strokeWidth="0.5" />
          {/* Individual drawing pearls */}
          <circle cx="72" cy="143" r="2" fill="#ffffff" stroke="rgba(18,21,31,0.2)" strokeWidth="0.4" />
          <circle cx="78" cy="146" r="2.2" fill="#ffffff" stroke="rgba(18,21,31,0.2)" strokeWidth="0.4" />
          <circle cx="85" cy="148" r="2.4" fill="#ffffff" stroke="rgba(18,21,31,0.2)" strokeWidth="0.4" />
          <circle cx="92" cy="149" r="2.4" fill="#ffffff" stroke="rgba(18,21,31,0.2)" strokeWidth="0.4" />
          <circle cx="99" cy="148" r="2.4" fill="#ffffff" stroke="rgba(18,21,31,0.2)" strokeWidth="0.4" />
          <circle cx="106" cy="145" r="2.2" fill="#ffffff" stroke="rgba(18,21,31,0.2)" strokeWidth="0.4" />
          <circle cx="112" cy="140" r="2" fill="#ffffff" stroke="rgba(18,21,31,0.2)" strokeWidth="0.4" />
          <circle cx="118" cy="134" r="1.8" fill="#ffffff" stroke="rgba(18,21,31,0.2)" strokeWidth="0.4" />

          {/* Symmetrical white rose lining */}
          <path d="M 160,140 C 172,130 188,142 180,155 C 172,168 152,162 160,140 Z" fill="rgba(255,255,255,0.4)" stroke="currentColor" strokeWidth="0.3" />

          <defs>
            <radialGradient id="goddess-silver-grad-heavy" cx="50%" cy="35%" r="65%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.7)" />
              <stop offset="45%" stopColor="rgba(223, 221, 228, 0.55)" />
              <stop offset="85%" stopColor="rgba(186, 194, 216, 0.35)" />
              <stop offset="100%" stopColor="rgba(132, 145, 179, 0.15)" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Atmospheric Ambient Glow Backdrops & Halos */}
      <div className="absolute top-[5%] left-[8%] w-[50vw] h-[50vw] rounded-full bg-radial from-[rgba(255,255,255,0.65)] via-[rgba(186,194,216,0.25)] to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[40%] right-[5%] w-[450px] h-[450px] rounded-full bg-radial from-[rgba(255,255,255,0.7)] via-[rgba(240,237,243,0.3)] to-transparent blur-3xl pointer-events-none -z-10" />

      {/* --- EXQUISITE HEAD OF CHRONICLES --- */}
      <header className="w-full max-w-7xl mx-auto px-6 pt-12 pb-8 flex flex-col items-center border-b border-[#12151F]/8 relative z-10">
        
        {/* String of pearls top border */}
        <div className="w-full flex justify-center gap-1.5 mb-5 opacity-90">
          <div className="pearl-bead" />
          <div className="pearl-bead" />
          <div className="pearl-bead scale-90" />
          <div className="pearl-bead scale-75" />
          <div className="w-12 border-b border-[#12151F]/15 self-center mx-1" />
          <div className="pearl-bead scale-75" />
          <div className="pearl-bead scale-90" />
          <div className="pearl-bead" />
          <div className="pearl-bead" />
        </div>

        {/* Editorial Subtitle Row */}
        <div className="w-full flex justify-between items-center text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#12151F]/55 mb-5">
          <span className="editorial-tracking flex items-center gap-2">
            <span className="w-2 h-2 p-px rounded-full bg-white ring-1 ring-brand-accent/50 inline-block" /> 
            WHERE MEMORIES NEVER FADE
          </span>
          <div className="flex gap-6 font-semibold">
            <a href="#featured-section" className="hover:text-brand-accent gallery-transition hover:underline decoration-brand-deco underline-offset-4">ARCHIVE &bull; 珍藏</a>
            <a href="#exhibition-grid" className="hover:text-brand-accent gallery-transition hover:underline decoration-brand-deco underline-offset-4">EXHIBITIONS &bull; 展厅</a>
            <a href="#archive-ledger" className="hover:text-brand-accent gallery-transition hover:underline decoration-brand-deco underline-offset-4">LEDGER &bull; 手账</a>
          </div>
        </div>

        {/* Cinematic Master Title block */}
        <div className="text-center my-6 md:my-10 relative select-none">
          {/* Subtle soft-focus light circle behind text */}
          <div className="absolute inset-x-0 -top-8 -bottom-8 bg-[rgba(255,255,255,0.55)] blur-2xl rounded-full -z-10 opacity-70" />
          
          <h1 className="font-serif font-light text-5xl md:text-8xl lg:text-[102px] text-[#12151F] tracking-wide leading-[0.9] silver-shimmer">
            Cinema Archive
          </h1>
          
          <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
            <div className="pearl-bead-lg animate-pulse" />
            <span className="font-serif text-sm md:text-base text-brand-dark/70 tracking-[0.22em] uppercase italic font-medium">
              A Private Museum of Silver Screen Memories &bull; 电影档案收藏馆
            </span>
            <div className="pearl-bead-lg animate-pulse" />
          </div>
        </div>

        {/* Symmetrical biological drawing lines */}
        <div className="w-full flex items-center justify-between mt-3 text-[10px] font-mono text-[#12151F]/40 border-t border-[#12151F]/6 pt-4">
          <span>EXPO REGISTER NO. 56FLM</span>
          <span className="italic">HEART-BEATS RESOUND IN METALLIC HALIDES</span>
          <span>EST. MCMLXXXV</span>
        </div>
      </header>


      {/* --- EXTRAVAGANT THREE-COLUMN LAYOUT (Direct Copy of Reference Poster Grid) --- */}
      <section id="featured-section" className="w-full max-w-7xl mx-auto px-6 mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column A (Cols 1-4): "NOW PLAYING" (Elegant Symmetrical Arch Crystal Plate) */}
          <div className="lg:col-span-4 bg-gradient-to-b from-white/80 via-white/45 to-white/12 p-8 rounded-t-[180px] rounded-b-[12px] border border-white/90 shadow-2xl flex flex-col justify-between silver-glass relative overflow-hidden group min-h-[580px] film-soft-focus">
            {/* Glossy liquid highlight reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-[#8E9BBF]/12 opacity-80 pointer-events-none" />
            
            {/* Arched Border Guide */}
            <div className="absolute inset-3 rounded-t-[172px] rounded-b-[8px] border-2 border-dashed border-[#12151F]/8 pointer-events-none" />

            <div className="mt-8 text-center relative z-10 flex flex-col items-center">
              <span className="font-mono text-[10px] text-[#12151F]/60 tracking-[0.35em] uppercase font-bold block mb-1">
                NOW PLAYING &bull; 金色轮播
              </span>
              <div className="flex gap-1 mt-2">
                <div className="pearl-bead scale-90" />
                <div className="pearl-bead" />
                <div className="pearl-bead scale-90" />
              </div>
            </div>

            {/* Central High-Fashion Poster Deck */}
            <div className="my-8 flex flex-col items-center relative z-10">
              
              {/* Exquisite Jewelry Frame enclosing the highlighted artwork */}
              <div 
                className="w-[58%] aspect-[2/3] shadow-[0_20px_50px_-10px_rgba(18,21,31,0.3)] hover:shadow-[0_25px_60px_-8px_rgba(142,155,191,0.55)] rounded-[6px] overflow-hidden cursor-pointer group-hover:scale-102 transition-all duration-700 border-2 border-white/90 relative bg-white"
                onClick={() => setSelectedMovie(spotlightMovie)}
              >
                {/* Physical Glass reflection pane over artwork */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/5 to-transparent pointer-events-none z-10" />
                <ArtPoster movie={spotlightMovie} className="pointer-events-none" />
              </div>
              
              <div className="text-center mt-6 px-4">
                <h3 className="font-serif text-xl font-semibold tracking-wide text-brand-dark line-clamp-1 hover:text-brand-accent cursor-pointer transition-colors duration-300"
                    onClick={() => setSelectedMovie(spotlightMovie)}>
                  {spotlightMovie.title}
                </h3>
                <p className="font-mono text-[10px] text-brand-dark/50 uppercase tracking-[0.2em] mt-1.5 font-bold">
                  {spotlightMovie.director.name} &bull; {spotlightMovie.year} 
                </p>
                
                {/* Vintage lace separator */}
                <div className="flex items-center justify-center gap-1.5 my-3 opacity-60">
                  <div className="w-8 h-px bg-brand-dark/20" />
                  <span className="font-serif text-xs italic text-brand-dark/40">&sect;</span>
                  <div className="w-8 h-px bg-brand-dark/20" />
                </div>

                <p className="font-serif text-xs text-brand-dark/75 leading-relaxed line-clamp-2 italic px-2">
                  “{spotlightMovie.summary}”
                </p>
              </div>
            </div>

            {/* Premium, jewel-encrusted random browser control */}
            <div className="pb-6 text-center mt-auto relative z-10">
              <button 
                onClick={handlePickRandomSpotlight}
                className="px-6 py-2.5 rounded-full bg-white hover:bg-gradient-to-r hover:from-white hover:to-[#ECEAF0] text-brand-dark hover:text-brand-accent text-[10px] font-mono font-bold tracking-[0.2em] uppercase border border-brand-deco/80 hover:border-brand-accent/60 shadow-[0_4px_12px_rgba(18,21,31,0.06)] scale-100 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 mx-auto cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 animate-spin text-brand-accent" style={{ animationDuration: '10s' }} />
                CHRONICLE STRIP / 混流漫游
              </button>
            </div>
          </div>

          {/* Column B (Cols 5-8): "THE ARCHIVE" (Premium Soft-Focus Pearl Gaze & Search Panel) */}
          <div className="lg:col-span-4 bg-white/75 p-8 rounded-[12px] border border-white/80 flex flex-col justify-between silver-glass shadow-2xl relative overflow-hidden min-h-[580px] group film-soft-focus">
            {/* Fine layout grid and guides mapping correct high-fashion layouts */}
            <div className="absolute inset-3 border border-[#12151F]/5 pointer-events-none" />
            <div className="absolute left-[8%] right-[8%] top-[8%] bottom-[8%] border border-dashed border-[#12151F]/6 pointer-events-none" />

            <div className="pt-4 relative z-10">
              <span className="font-mono text-[10px] text-brand-accent tracking-[0.35em] uppercase font-bold block">
                THE ARCHIVE
              </span>
              <h2 className="font-serif text-3xl font-medium text-brand-dark mt-2 tracking-wide leading-tight">
                检索档案馆
              </h2>
              <p className="text-[11px] font-serif italic text-brand-dark/50 mt-1">
                Explore the silver library.
              </p>
            </div>

            {/* Glistening physical eye SVG framed with genuine CSS 3D pearl drops */}
            <div className="my-6 flex flex-col items-center justify-center relative z-10 self-center w-full max-w-[210px] py-4">
              {/* Pulsing divine halo behind eye */}
              <div className="absolute w-40 h-40 rounded-full blur-3xl bg-gradient-to-tr from-[#8E9BBF]/25 to-white/40 animate-pulse pointer-events-none -z-10" />
              
              <svg viewBox="0 0 100 100" className="w-full text-brand-dark/85 opacity-90 filter drop-shadow(0 4px 8px rgba(18,21,31,0.15))" stroke="currentColor" fill="none" strokeWidth="0.8">
                {/* Exquisite hand-drawn eye contours */}
                <path d="M10 50 C25 24, 75 24, 90 50 C75 76, 25 76, 10 50 Z" />
                <circle cx="50" cy="50" r="19" fill="rgba(255,255,255,0.65)" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="9" fill="currentColor" />
                <circle cx="47" cy="47" r="2.5" fill="white" />
                {/* Symmetrical fine classical eyelashes */}
                <path d="M28 35 L22 25 M39 30 L37 18 M50 29 L50 16 M61 30 L63 18 M72 35 L78 25 M18 45 L11 41 M82 45 L89 41" stroke="currentColor" strokeWidth="0.6" />
              </svg>

              {/* Symmetrical draping pearls aligned at the bottom boundary (like high makeup) */}
              <div className="flex gap-1.5 mt-2.5">
                <div className="pearl-bead scale-75" />
                <div className="pearl-bead scale-90" />
                <div className="pearl-bead" />
                <div className="pearl-bead-lg" />
                <div className="pearl-bead" />
                <div className="pearl-bead scale-90" />
                <div className="pearl-bead scale-75" />
              </div>
            </div>

            {/* High-Contrast Interactive Search Engine */}
            <div className="relative z-10 px-2 pb-6">
              <label htmlFor="search-input" className="sr-only">搜索文献</label>
              <div className="relative">
                <input
                  id="search-input"
                  type="text"
                  autoComplete="off"
                  placeholder="键入电影、导演、特定流派..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs font-serif pl-10 pr-12 py-3.5 bg-white hover:bg-white/95 focus:bg-white text-brand-dark placeholder:text-brand-dark/35 border-2 border-brand-deco/80 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 rounded-sm focus:outline-none gallery-transition shadow-inner font-medium"
                />
                
                {/* Styled Jewelry Search Icon */}
                <div className="absolute left-3.5 top-[15px] text-brand-dark/40">
                  <Search className="w-4 h-4 text-brand-dark/50" />
                </div>

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-[15px] w-6 h-6 rounded-full bg-brand-bg/50 hover:bg-brand-bg text-brand-dark flex items-center justify-center transition-all"
                    title="Clear Search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="pb-4 flex justify-between items-center text-[9px] font-mono text-[#12151F]/50 relative z-10 px-1 font-semibold">
              <span>FACILITY REGISTER COORDINATES</span>
              <span className="italic">Every Film Leaves a Trace</span>
            </div>
          </div>

          {/* Column C (Cols 9-12): "OUR COLLECTION" (Divine White Stag & Ledger Statistics) */}
          <div className="lg:col-span-4 bg-[#EAE7EB]/90 p-8 rounded-[12px] border border-white/80 flex flex-col justify-between silver-glass shadow-2xl relative overflow-hidden min-h-[580px] group film-soft-focus">
            {/* Mirror reflection backdrop pane overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/5 pointer-events-none" />
            <div className="absolute inset-3 border border-[#12151F]/5 pointer-events-none" />

            <div className="pt-4 relative z-10 flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] text-brand-accent tracking-[0.35em] uppercase font-bold block">
                  OUR COLLECTION
                </span>
                <h2 className="font-serif text-3xl font-medium text-brand-dark mt-2 tracking-wide leading-tight">
                  典藏与账册
                </h2>
              </div>
              <span className="font-mono text-xs text-[#12151F]/70 font-bold border border-white bg-white/60 rounded px-2.5 py-0.5 shadow-sm">
                {movieData.length} EXP
              </span>
            </div>

            {/* Ethereal vector: Elegant Divine Stag with stylized double antlers */}
            <div className="my-4 flex flex-col items-center justify-center relative z-10 w-full max-w-[200px] self-center">
              <svg viewBox="0 0 100 100" className="w-full text-brand-dark/85 opacity-90 drop-shadow(0 4px 6px rgba(18,21,31,0.1))" stroke="currentColor" fill="none" strokeWidth="0.8">
                {/* Symmetrical/Smooth contours of noble deer head profile facing right */}
                <path d="M30 75 C30 63, 36 50, 44 43 C47 40, 54 40, 57 46 C59 50, 56 56, 61 60 C68 62, 78 61, 82 64 C85 66, 85 69, 78 71 C70 73, 62 74, 55 80 C48 86, 30 86, 30 75 Z" fill="rgba(255,255,255,0.7)" />
                {/* Intricate branching Antlers */}
                <path d="M42 43 Q36 22 28 12 Q26 15 31 26 Q23 18 34 32" stroke="currentColor" strokeWidth="0.8" />
                <path d="M46 42 Q52 20 60 8 Q63 12 56 24 Q66 16 54 34" stroke="currentColor" strokeWidth="0.8" />
                {/* Eyes and sparkles */}
                <circle cx="58" cy="53" r="1.5" fill="#ffffff" stroke="currentColor" strokeWidth="0.4" />
                {/* Water waves at bottom with pearlescent floating beads */}
                <path d="M15 88 Q50 82 85 88" stroke="currentColor" strokeWidth="0.4" strokeDasharray="3,3" />
                <path d="M25 93 Q50 90 75 93" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2,2" />
              </svg>
              
              {/* Pearl constellation lines */}
              <div className="flex gap-1 mt-3">
                <div className="pearl-bead scale-75" />
                <div className="pearl-bead scale-90" />
                <div className="pearl-bead" />
                <div className="pearl-bead scale-95" />
              </div>
            </div>

            {/* Micro layout ledger metrics */}
            <div className="grid grid-cols-2 gap-4 py-5 border-y-2 border-dashed border-[#12151F]/8 text-xs font-mono relative z-10 mt-auto bg-white/20 p-2 rounded-sm">
              <div className="border-r border-[#12151F]/10 pr-2">
                <span className="text-brand-dark/45 text-[9px] block uppercase tracking-wider font-bold">馆藏典册</span>
                <span className="text-xl font-bold text-brand-dark flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-brand-accent rounded-full inline-block" />
                  {movieData.length}
                </span>
                <span className="text-[10px] text-brand-dark/60 block mt-0.5">光影真迹</span>
              </div>
              <div className="pl-2">
                <span className="text-brand-dark/45 text-[9px] block uppercase tracking-wider font-bold">总放映时长</span>
                <span className="text-xl font-bold text-brand-dark flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-brand-accent rounded-full inline-block" />
                  {totalCuratedHours}
                </span>
                <span className="text-[10px] text-brand-dark/60 block mt-0.5">小时洗礼</span>
              </div>
              <div className="border-t border-r border-[#12151F]/10 pt-3 mt-1 pr-2">
                <span className="text-brand-dark/45 text-[9px] block uppercase tracking-wider font-bold">观影日志</span>
                <span className="text-xl font-bold text-brand-dark flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
                  {reviewCount}
                </span>
                <span className="text-[10px] text-brand-dark/60 block mt-0.5">篇留白感悟</span>
              </div>
              <div className="border-t border-[#12151F]/10 pt-3 mt-1 pl-2">
                <span className="text-brand-dark/45 text-[9px] block uppercase tracking-wider font-bold">绝世珍藏</span>
                <span className="text-xl font-bold text-brand-dark flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-pink-500 fill-current" />
                  {favoriteCount}
                </span>
                <span className="text-[10px] text-brand-dark/60 block mt-0.5">部臻品</span>
              </div>
            </div>

            <div className="pb-4 flex justify-between items-center text-[9px] font-mono text-[#12151F]/50 relative z-10 pt-2 font-bold select-none">
              <span>SECURED VAULT REGISTRY</span>
              <span className="uppercase tracking-wider">MUBI &bull; VOGUE EXPO</span>
            </div>
          </div>

        </div>
      </section>

      {/* --- CURATED FILTRATION STRIP OVER TRANSLUCENT LACE VISTA --- */}
      <section className="w-full max-w-7xl mx-auto px-6 mt-16 md:mt-24 relative z-20">
        <div className="border-y-2 border-[#12151F]/8 py-8 px-4 bg-gradient-to-r from-transparent via-[#ECEAF0]/80 to-transparent relative rounded-md">
          
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="pearl-bead-lg animate-pulse" />
            <span className="font-mono text-[10px] md:text-xs text-brand-dark/80 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
              SELECT FILM EXHIBITION GALLERY / 选择入馆展厅
            </span>
            <div className="pearl-bead-lg animate-pulse" />
          </div>

          {/* Grid layout of high-end category labels. Highly stylized with vertical labels to reflect magazine template */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 select-none">
            {categories.map((cat, idx) => {
              const numericId = `0${idx + 1}`;
              const isSelected = selectedCategory === cat;

              // Symmetrical background vector detailing unique designs behind each tab
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`group relative overflow-hidden h-28 p-4 rounded-md border gallery-transition text-left flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "bg-[#12151F] text-white border-[#12151F] shadow-[0_15px_30px_rgba(18,21,31,0.25)] scale-[1.03]"
                      : "bg-white/80 hover:bg-white text-brand-dark border-brand-deco/60 hover:border-brand-accent shadow-sm"
                  }`}
                >
                  {/* Decorative faint vector lace backgrounds */}
                  <div className="absolute right-2 bottom-2 w-12 h-12 pointer-events-none opacity-[0.14] group-hover:opacity-30 transition-opacity">
                    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="0.5">
                      {idx === 0 && <circle cx="20" cy="20" r="14" />}
                      {idx === 1 && <path d="M 20,8 C 15,16 6,24 20,34 C 34,24 25,16 20,8 Z" fill="currentColor" opacity="0.1" />} 
                      {idx === 2 && <path d="M 10,12 H 30 V 28 H 10 Z" />} 
                      {idx === 3 && <circle cx="20" cy="20" r="16" strokeDasharray="2,2" />} 
                      {idx === 4 && <path d="M 20,6 V 34 M 6,20 H 34" />} 
                      {idx === 5 && <polygon points="20,6 34,30 6,30" />} 
                      {idx === 6 && <circle cx="20" cy="20" r="10" strokeWidth="0.4" />} 
                      {idx === 7 && <circle cx="20" cy="20" r="7" fill="currentColor" />} 
                      {idx === 8 && <rect x="12" y="12" width="16" height="16" strokeDasharray="1,1" />} 
                    </svg>
                  </div>

                  {/* Symmetrical numerical notation */}
                  <span className={`font-mono text-[10px] tracking-widest font-bold block uppercase ${
                    isSelected ? "text-brand-accent" : "text-[#12151F]/40"
                  }`}>
                    &bull; {numericId} &bull;
                  </span>

                  {/* Category names styled for Vogue */}
                  <div className="mt-auto">
                    <span className="font-serif text-[15px] md:text-[16px] font-semibold block leading-none">
                      {cat}
                    </span>
                    <span className="font-mono text-[8px] opacity-50 uppercase tracking-widest block mt-1">
                      {cat === "全部" && "All Exhibits"}
                      {cat === "爱情" && "L'Amour"}
                      {cat === "剧情" && "Le Drame"}
                      {cat === "悬疑" && "Le Mystère"}
                      {cat === "犯罪" && "Le Crime"}
                      {cat === "动画" && "L'Animation"}
                      {cat === "纪录片" && "L'Archive"}
                      {cat === "科幻" && "La Fiction"}
                      {cat === "其他" && "Divers"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* --- THE EXHIBITION GALLERIA (Exhibition Panels replacing modern card template) --- */}
      <section id="exhibition-grid" className="w-full max-w-7xl mx-auto px-6 mt-12 flex-1 relative z-20">
        
        {/* Fine layout search summary notification */}
        {searchQuery && (
          <div className="mb-10 px-6 py-4.5 border border-white/95 text-xs text-[#12151F] font-mono flex justify-between items-center bg-white/70 rounded-md shadow-sm">
            <span className="flex items-center gap-2">
              <span className="pearl-bead" />
              已为您检索查找到符合 <span className="font-bold text-[#12151F] italic font-serif">&quot;{searchQuery}&quot;</span> 的 <strong>{filteredMovies.length}</strong> 部珍重馆藏电影
            </span>
            <button 
              onClick={() => setSearchQuery("")}
              className="text-xs text-[#12151F] hover:text-brand-accent font-bold underline underline-offset-4 cursor-pointer"
            >
              重置
            </button>
          </div>
        )}

        {filteredMovies.length === 0 ? (
          /* Empty state */
          <div className="py-24 text-center border-2 border-dashed border-[#12151F]/15 rounded-md bg-white/40 flex flex-col items-center justify-center shadow-inner">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-brand-dark/40 mb-4 border border-[#12151F]/10">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-brand-dark font-medium tracking-wide">
              很抱歉，在当前展厅内未查找到符合过滤条件的电影
            </h3>
            <p className="text-xs text-brand-dark/60 font-serif leading-relaxed mt-2 max-w-md mx-auto">
              您可以更换搜索关键字，或者重置到“全部”展区。
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("全部");
              }}
              className="mt-6 px-6 py-3 text-xs font-mono bg-brand-dark text-white rounded-sm hover:bg-brand-dark/95 shadow-md font-bold hover:scale-103 active:scale-97 transition-all cursor-pointer"
            >
              一键归位 / 查阅完整 56 部经典
            </button>
          </div>
        ) : (
          /* Real Movie Exhibition Panels */
          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12"
          >
            {filteredMovies.map((movie, idx) => {
              const review = reviews[movie.title];
              const logStatus = review?.status || "none";

              // Premium items of class (Vogue focus elements)
              const isPromoted = movie.title === "霸王别姬" || movie.title === "泰坦尼克号" || movie.title === "千与千寻" || movie.title === "教父" || movie.title === "花样年华" || movie.rating >= 9.3;

              return (
                <FilmExhibitionCard
                  key={movie.title}
                  movie={movie}
                  idx={idx}
                  logStatus={logStatus}
                  isPromoted={isPromoted}
                  onClick={() => setSelectedMovie(movie)}
                />
              );
            })}
          </motion.div>
        )}
      </section>

      {/* --- REVIEWS HAND-BOOK CASE (Heavy Symmetrical Translucent Drawer Panel) --- */}
      <section id="archive-ledger" className="w-full max-w-7xl mx-auto px-6 mt-24 pt-14 border-t-2 border-dashed border-[#12151F]/12 relative z-20">
        <div className="bg-white/80 border-2 border-white/90 rounded-[12px] p-8 lg:p-12 relative overflow-hidden silver-glass shadow-2xl film-soft-focus">
          
          <div className="absolute right-[-10%] top-[-10%] w-[350px] h-[350px] rounded-full bg-radial from-[#8E9BBF]/15 via-transparent to-transparent blur-3xl pointer-events-none" />
          <div className="absolute left-[-5%] bottom-[-5%] w-[300px] h-[300px] rounded-full bg-radial from-[#ffffff]/50 via-transparent to-transparent blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-[#12151F]/15 gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 bg-[#12151F] text-white rounded-sm text-[9px] font-mono font-bold tracking-[0.16em] uppercase">
                  Private Archives Ledger
                </span>
                
                {/* Symmetrical Mini Pearls representing catalog lock */}
                <div className="flex gap-1">
                  <div className="pearl-bead scale-75" />
                  <div className="pearl-bead" />
                  <div className="pearl-bead scale-75" />
                </div>

                <span className="font-mono text-[10px] text-brand-dark/45 uppercase tracking-widest hidden sm:inline">
                  ● 观影随笔手札
                </span>
              </div>
              <h2 className="font-serif font-semibold text-3xl text-brand-dark mt-3 tracking-wide">
                观影感悟与典藏账册
              </h2>
              <p className="text-xs text-brand-dark/65 font-serif leading-relaxed mt-1.5 max-w-2xl">
                所有在“电影文献卡片”中撰写、编辑过的观影手笔，均在此以实木皮装印册的布局实时呈现，并支持一键唤醒回溯。
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-white/90 border border-brand-deco/80 rounded-sm font-mono text-xs text-[#12151F]/80 shadow-sm font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-ping" />
                入账感悟: <strong>{reviewCount}</strong> 篇
              </span>
            </div>
          </div>

          {/* Active Review logs grid display if reviews exist */}
          {reviewCount === 0 ? (
            <div className="py-16 text-center text-xs text-brand-dark/50 font-serif max-w-md mx-auto leading-relaxed relative z-10 select-none">
              <div className="flex justify-center gap-1.5 mb-4">
                <div className="pearl-bead scale-90" />
                <div className="pearl-bead" />
                <div className="pearl-bead scale-90" />
              </div>
              您的典藏手账案册当前尚无记录。<br />
              请在上方展厅内挑选喜爱的电影海报，键入“<strong>入馆查阅</strong>”随手记下文字，回忆即刻录入此页。
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 relative z-10">
              {movieData
                .filter(m => reviews[m.title] && reviews[m.title].status !== "none")
                .map(m => {
                  const rev = reviews[m.title];
                  return (
                    <div 
                      key={m.title}
                      onClick={() => setSelectedMovie(m)}
                      className="bg-white/90 hover:bg-white rounded-[6px] border-2 border-white/60 hover:border-brand-accent p-5 shadow-sm hover:shadow-xl gallery-transition cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                    >
                      {/* Inner glossy reflection lines */}
                      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

                      <div>
                        {/* Title group with pearl headers */}
                        <div className="flex justify-between items-center pb-2.5 border-b border-[#12151F]/6 mb-3.5">
                          <span className="font-mono text-[10px] text-brand-accent font-bold tracking-widest uppercase flex items-center gap-1.5">
                            {rev.status === "watched" && "✓ 已观影"}
                            {rev.status === "want_to" && "☘ 计划中"}
                            {rev.status === "favorite" && "❤ 极度珍藏"}
                          </span>
                          
                          {/* Semicolon separation */}
                          <span className="text-[10px] font-mono text-yellow-500 font-bold tracking-tight">
                            {"★".repeat(rev.personalRating)}
                            {"☆".repeat(5 - rev.personalRating)}
                          </span>
                        </div>
                        
                        <h4 className="font-serif font-semibold text-[15px] text-[#12151F] tracking-wide mb-1.5 group-hover:text-brand-accent duration-300">
                          {m.title}
                        </h4>
                        
                        <p className="text-[12px] text-brand-dark/75 font-serif leading-relaxed line-clamp-4 italic">
                          {rev.notes ? `“{rev.notes}”` : "已标记此观影作品，尚未填写留白随笔。"}
                        </p>
                      </div>

                      {/* Footer with fine notation */}
                      <div className="flex justify-between items-center text-[9px] font-mono text-[#12151F]/45 border-t border-[#12151F]/6 pt-3 mt-4">
                        <span className="font-bold">{m.genre[0]} &bull; {m.year}</span>
                        <span>{new Date(rev.updatedAt).toLocaleDateString()} &bull; 阅</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

        </div>
      </section>

      {/* --- DETAIL MODAL FOR ARCHIVE FILM VIEWER --- */}
      <DetailModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onSaveReview={handleSaveReview}
        savedReview={selectedMovie ? reviews[selectedMovie.title] : undefined}
      />

      {/* --- EXQUISITE VOGUE-STYLE SIGNATURE FOOTER --- */}
      <footer className="w-full max-w-7xl mx-auto px-6 mt-28 pt-10 border-t border-[#12151F]/10 text-center flex flex-col items-center gap-6 relative z-20">
        
        {/* Double pearl string signature decoration */}
        <div className="flex gap-1 opacity-70">
          <div className="pearl-bead scale-75" />
          <div className="pearl-bead" />
          <div className="pearl-bead scale-75" />
        </div>

        {/* Abstract logo representation */}
        <div className="w-12 h-12 rounded-full border-2 border-white/90 bg-white/40 shadow-inner flex items-center justify-center text-sm font-serif font-bold italic text-brand-dark select-none">
          M
        </div>

        <div className="flex flex-col items-center">
          <p className="font-serif text-xl text-[#12151F]/80 font-semibold tracking-wide">
            我的电影收藏馆
          </p>
          <p className="font-mono text-[10px] text-brand-accent tracking-[0.3em] uppercase mt-1 font-bold">
            EVERY FILM LEAVES A TRACE
          </p>
        </div>

        <div className="max-w-lg text-center text-xs text-brand-dark/60 font-serif leading-relaxed px-4">
          “我们的眼睛或许会随生命悄悄浑浊，但电影留在胶片上的每一段焦痕、每一个光点，将化作生命中永不褪色的纯真痕迹。”
        </div>

        <div className="mt-8 pt-6 border-t border-[#12151F]/6 w-full flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] font-mono text-[#12151F]/45 font-semibold">
          <span>&copy; {new Date().getFullYear()} 我的电影收藏馆 &bull; Private Cinematic Museum Ledger. All catalog memories reserved.</span>
          <span className="flex items-center gap-2 uppercase tracking-widest font-bold">
            <TrendingUp className="w-4 h-4 text-brand-accent shrink-0" /> MUBI &bull; VOGUE &bull; CHROME LAYOUT
          </span>
        </div>

      </footer>

    </div>
  );
}
