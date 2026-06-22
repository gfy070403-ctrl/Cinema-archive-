import React from "react";
import { Movie } from "../data/movies";

interface ArtPosterProps {
  movie: Movie;
  className?: string;
  isFeatured?: boolean;
}

export default function ArtPoster({ movie, className = "", isFeatured = false }: ArtPosterProps) {
  const { title, genre, year, rating, director } = movie;

  // Generate a semi-stable hash from movie title to create unique, deterministic details
  const getTitleHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const hash = getTitleHash(title);
  const exhibitionCode = `COL-${(hash % 9000 + 1000)}`;

  // Determine the primary genre for artwork rendering
  const isRomance = genre.includes("爱情");
  const isSciFi = genre.includes("科幻");
  const isSuspenseOrCrime = genre.includes("悬疑") || genre.includes("犯罪");
  const isAnimationOrFantasy = genre.includes("动画") || genre.includes("奇幻");
  const isDocumentaryOrHistory = genre.includes("纪录片") || genre.includes("历史") || genre.includes("传记");
  const isComedy = genre.includes("喜剧");

  // Choose visual theme configuration based on primary genre matching
  return (
    <div
      className={`relative w-full aspect-[2/3] overflow-hidden rounded-[4px] border border-brand-deco/40 select-none bg-[#ECEAF0] group ${className}`}
      id={`art-poster-${hash}`}
    >
      {/* Background gradients for museum lighting */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#ECEAF0] via-[#F5F4F7] to-[#D9DDE8] transition-all duration-700 group-hover:scale-105" />
      
      {/* Dynamic light refraction spots inside the poster frame */}
      <div 
        className="absolute w-[140%] h-[120%] -top-[10%] -left-[20%] opacity-40 mix-blend-color-burn"
        style={{
          background: `radial-gradient(circle at ${30 + (hash % 40)}% ${20 + (hash % 50)}%, rgba(170, 182, 216, 0.45) 0%, transparent 60%)`,
        }}
      />
      
      {/* Fine-grain noise texture overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none opacity-25 mix-blend-overlay" />

      {/* Frame border lines */}
      <div className="absolute inset-2 border border-brand-deco/30 pointer-events-none" />

      {/* Grid lines simulating technical layout alignment (MUBI x VOGUE structure) */}
      <div className="absolute left-[8%] right-[8%] top-[8%] bottom-[8%] border border-dashed border-brand-accent/15 pointer-events-none" />

      {/* Content Layout */}
      <div className="absolute inset-0 p-[12%] flex flex-col justify-between z-10">
        
        {/* Poster Header */}
        <div className="flex justify-between items-start text-[8px] md:text-[9px] font-mono tracking-widest text-[#1E2333]/50 uppercase">
          <span className="editorial-tracking">{exhibitionCode}</span>
          <span className="editorial-tracking">{genre[0]}</span>
        </div>

        {/* Poster Core Central Illustration (Dynamic SVG graphics matching genres) */}
        <div className="flex-1 flex items-center justify-center relative my-4 relative">
          <svg
            viewBox="0 0 100 100"
            className="w-4/5 h-[80%] max-h-48 text-[#1E2333]/80 opacity-75 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
          >
            {/* 1. ROMANCE / DRAMA JEWELRY MOVIE ARTWORK (Lace Ribbon Ballet Slippers with Pearl Drops) */}
            {isRomance && (
              <g id="romance-slippers">
                {/* Bow ribbons and shoes outlines */}
                <path d="M35 30 C35 50, 42 75, 45 85 C46 88, 50 88, 50 85 C52 75, 59 50, 59 30" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3,1" />
                {/* Symmetrical left ballet shoe shape with lace details */}
                <path d="M28 50 C28 65, 33 80, 38 85 C41 88, 44 88, 44 80 C44 70, 38 55, 38 40 C38 35, 32 35, 28 50 Z" fill="rgba(217, 221, 232, 0.25)" stroke="currentColor" strokeWidth="0.75" />
                {/* Symmetrical right ballet shoe shape */}
                <path d="M72 50 C72 65, 67 80, 62 85 C59 88, 56 88, 56 80 C56 70, 62 55, 62 40 C62 35, 68 35, 72 50 Z" fill="rgba(170, 182, 216, 0.2)" stroke="currentColor" strokeWidth="0.75" />
                {/* Flowing silk ribbons */}
                <path d="M42 38 Q35 25 50 25 Q65 25 58 38" stroke="currentColor" strokeWidth="0.75" />
                <path d="M46 38 C32 15, 68 15, 54 38" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="25" r="2.5" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="25" r="1.2" fill="white" />
                {/* Falling pearl drops */}
                <circle cx="38" cy="85" r="1.5" fill="white" stroke="currentColor" strokeWidth="0.5" />
                <line x1="38" y1="80" x2="38" y2="83.5" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="62" cy="85" r="1.5" fill="white" stroke="currentColor" strokeWidth="0.5" />
                <line x1="62" y1="80" x2="62" y2="83.5" stroke="currentColor" strokeWidth="0.5" />
              </g>
            )}

            {/* 2. SCI-FI MOVIE ARTWORK (Futuristic Orbit Constellations & Pearl Ring) */}
            {isSciFi && !isRomance && (
              <g id="scifi-orbit">
                <circle cx="50" cy="50" r="32" strokeWidth="0.4" strokeDasharray="2,2" className="stroke-brand-accent/60" />
                <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="0.6" />
                <circle cx="50" cy="50" r="6" fill="rgba(170, 182, 216, 0.1)" stroke="currentColor" strokeWidth="0.8" />
                {/* Celestial beam with a shining star */}
                <line x1="50" y1="5" x2="50" y2="95" strokeWidth="0.5" strokeDasharray="1,1" />
                <line x1="5" y1="50" x2="95" y2="50" strokeWidth="0.5" strokeDasharray="1,1" stroke="currentColor" />
                <path d="M50 35 L52 42 L59 44 L52 46 L50 53 L48 46 L41 44 L48 42 Z" fill="currentColor" />
                {/* Orbital pearl beads */}
                <circle cx="50" cy="18" r="1.8" fill="white" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="82" r="1.8" fill="white" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="18" cy="50" r="1.8" fill="white" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="82" cy="50" r="1.8" fill="white" stroke="currentColor" strokeWidth="0.5" />
              </g>
            )}

            {/* 3. SUSPENSE OR CRIME ARTWORK (Intricate Ornate Hand Mirror Mirror-Gaze Frame in Silver) */}
            {isSuspenseOrCrime && !isRomance && !isSciFi && (
              <g id="mystery-mirror">
                {/* Symmetrical Baroque silver handheld mirror frame */}
                <path d="M50 15 C33 15, 30 32, 30 45 C30 58, 38 68, 50 68 C62 68, 70 58, 70 45 C70 32, 67 15, 50 15 Z" fill="rgba(170, 182, 216, 0.15)" stroke="currentColor" strokeWidth="0.8" />
                {/* Mirror reflection lines */}
                <path d="M35 45 C38 35, 48 25, 60 25" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4,2" opacity="0.6" />
                {/* Intricate handle */}
                <line x1="50" y1="68" x2="50" y2="92" stroke="currentColor" strokeWidth="1.2" />
                <rect x="48" y="72" width="4" height="12" fill="none" stroke="currentColor" strokeWidth="0.55" />
                <circle cx="50" cy="92" r="2.5" fill="white" stroke="currentColor" strokeWidth="0.5" />
                {/* Decorative border ornaments */}
                <path d="M30 45 Q24 45 28 38" stroke="currentColor" strokeWidth="0.5" />
                <path d="M70 45 Q76 45 72 38" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="12" r="1.5" fill="currentColor" />
              </g>
            )}

            {/* 4. ANIMATION OR FANTASY ARTWORK (Ethereal Pure White Stag/Deer with Divine Antlers) */}
            {isAnimationOrFantasy && !isRomance && !isSciFi && !isSuspenseOrCrime && (
              <g id="fantasy-deer">
                {/* Elegant deer head profile facing right in pure curves */}
                <path d="M32 75 C32 65, 38 52, 45 45 C48 42, 55 42, 58 48 C60 52, 57 58, 62 62 C68 64, 78 63, 82 66 C85 68, 85 71, 78 73 C70 75, 62 76, 55 82 C48 88, 32 88, 32 75 Z" fill="rgba(245, 244, 247, 0.4)" stroke="currentColor" strokeWidth="0.8" />
                {/* Antlers stretching up and branching elegantly */}
                <path d="M44 44 Q38 25 32 15 Q30 18 35 28 Q28 20 38 34" fill="none" stroke="currentColor" strokeWidth="0.75" />
                <path d="M48 43 Q54 22 62 10 Q65 14 58 26 Q68 18 56 36" fill="none" stroke="currentColor" strokeWidth="0.75" />
                {/* Glowing pearl eye */}
                <circle cx="60" cy="55" r="1.2" fill="white" stroke="currentColor" strokeWidth="0.5" />
                {/* Sparkling background elements */}
                <path d="M22 28 L23 31 L26 31.5 L23 32 L22 35 L21 32 L18 31.5 L21 31 Z" fill="currentColor" stroke="none" opacity="0.6" />
                <circle cx="75" cy="30" r="1" fill="currentColor" />
                <circle cx="28" cy="48" r="1" fill="currentColor" />
              </g>
            )}

            {/* 5. DOCUMENTARY OR HISTORY (Classic Silver Goddess Sculpture Profile) */}
            {isDocumentaryOrHistory && !isRomance && !isSciFi && !isSuspenseOrCrime && (
              <g id="silver-goddess">
                {/* Graceful Greco-Roman head sculpture profile facing left */}
                <path d="M72 82 C72 75, 64 68, 60 62 C58 55, 59 48, 55 42 C51 36, 42 36, 44 28 C45 22, 36 29, 32 35 C28 41, 31 46, 31 52 C31 58, 25 61, 28 66 C31 71, 38 72, 44 76 C50 80, 58 84, 72 82 Z" fill="rgba(217, 221, 232, 0.45)" stroke="currentColor" strokeWidth="0.8" />
                {/* Waved classical hair buns / diadem crowns */}
                <path d="M42 22 C48 18, 56 22, 57 28 C58 34, 52 38, 46 38" fill="none" stroke="currentColor" strokeWidth="0.75" />
                <path d="M48 24 C52 21, 58 24, 59 30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                {/* Elegant diadem necklace / crown detail */}
                <path d="M38 28 Q44 25 50 30" stroke="currentColor" strokeWidth="0.8" />
                <circle cx="44" cy="26" r="1" fill="currentColor" />
                {/* Delicate facial profile line overlay */}
                <path d="M32 35 C31 38, 29 40, 31 42 C33 44, 34 43, 33 45 C32 47, 30 46, 30 48 Q33 51 35 52" stroke="currentColor" strokeWidth="0.5" fill="none" />
              </g>
            )}

            {/* 6. GENERAL DRAMA / OTHER (Glistening Pearlescent Eye looking outward) */}
            {!isRomance && !isSciFi && !isSuspenseOrCrime && !isAnimationOrFantasy && !isDocumentaryOrHistory && (
              <g id="pearlescent-eye">
                {/* Glistening Eye outline */}
                <path d="M15 50 C28 30, 72 30, 85 50 C72 70, 28 70, 15 50 Z" stroke="currentColor" strokeWidth="0.8" fill="rgba(217,221,232,0.12)" />
                {/* Detailed Iris circles with reflection */}
                <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="0.75" fill="rgba(170,182,216,0.2)" />
                <circle cx="50" cy="50" r="8" fill="currentColor" />
                <circle cx="46" cy="46" r="2.5" fill="white" />
                {/* Soft radiating reflection lines (Eyelashes / makeup sparks) */}
                <path d="M28 39 L24 33 M50 32 L50 24 M72 39 L76 33 M18 47 L12 45 M82 47 L88 45" stroke="currentColor" strokeWidth="0.6" />
                {/* Pearls lining the bottom curve like high fashion eye makeup */}
                <circle cx="28" cy="62" r="1.3" fill="white" stroke="currentColor" strokeWidth="0.3" />
                <circle cx="36" cy="65" r="1.5" fill="white" stroke="currentColor" strokeWidth="0.3" />
                <circle cx="44" cy="67" r="1.7" fill="white" stroke="currentColor" strokeWidth="0.3" />
                <circle cx="52" cy="67" r="1.7" fill="white" stroke="currentColor" strokeWidth="0.3" />
                <circle cx="60" cy="66" r="1.5" fill="white" stroke="currentColor" strokeWidth="0.3" />
                <circle cx="68" cy="63" r="1.3" fill="white" stroke="currentColor" strokeWidth="0.3" />
              </g>
            )}
          </svg>

          {/* Aesthetic genre identifier tag */}
          <div className="absolute right-[5%] bottom-[5%] writing-vertical text-[7px] text-[#1E2333]/30 tracking-widest uppercase font-mono hidden md:block">
            {genre.join(" . ")}
          </div>
        </div>

        {/* Poster Footer: Super refined typography hierarchy */}
        <div className="flex flex-col gap-1.5 md:gap-2 pt-2 border-t border-[#1E2333]/10 mt-auto">
          {/* Title in highly polished serif style */}
          <div className="text-center">
            <h3 
              style={{ wordBreak: "keep-all" }}
              className="font-serif select-text font-medium text-xs md:text-[14px] lg:text-[15px] leading-[1.3] text-[#1E2333] tracking-wider transition-all duration-300"
            >
              {title}
            </h3>
            {/* Soft Romanic subtitle representation using year and score */}
            <p className="font-mono text-[8px] md:text-[9px] text-[#1E2333]/50 mt-0.5 tracking-wider uppercase">
              {director.name} &bull; {year}
            </p>
          </div>

          {/* Rating Badge structured like an exhibition registry coordinate */}
          <div className="flex justify-between items-center text-[8px] font-mono text-[#1E2333]/40 pt-1 pointer-events-none scale-90 origin-bottom">
            <span>RATING</span>
            <span className="font-semibold text-brand-dark tracking-normal text-[9px]">
              {rating.toFixed(1)} <span className="text-[#1E2333]/30 font-normal">/ 10</span>
            </span>
          </div>

        </div>
      </div>

      {/* Modern museum lighting soft gradient overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#ECEAF0]/60 to-transparent pointer-events-none" />
      
      {/* Silvery soft glowing overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-[#AAB6D8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}
