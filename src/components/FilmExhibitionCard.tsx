/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Movie } from "../data/movies";
import ArtPoster from "./ArtPoster";
import { CheckCircle2, Bookmark, Heart, ChevronRight } from "lucide-react";

interface FilmExhibitionCardProps {
  movie: Movie;
  idx: number;
  logStatus: any;
  isPromoted: boolean;
  onClick: () => void;
  key?: string | number;
}

export default function FilmExhibitionCard({
  movie,
  idx,
  logStatus,
  isPromoted,
  onClick,
}: FilmExhibitionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values to track normalized mouse coords from -0.5 to 0.5
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for smoother, organic tilt response
  const springConfig = { damping: 30, stiffness: 180, mass: 1 };
  const rotateXSpring = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateYSpring = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), springConfig);

  // Transformed dynamic glare gradient position
  const glareBg = useTransform(() => {
    const px = (x.get() + 0.5) * 100;
    const py = (y.get() + 0.5) * 100;
    return `radial-gradient(circle at ${px}% ${py}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 65%)`;
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Relative mouse position from left/top of the card
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize values between -0.5 and 0.5
    const normX = (mouseX / width) - 0.5;
    const normY = (mouseY / height) - 0.5;

    x.set(normX);
    y.set(normY);
  };

  const handleMouseLeave = () => {
    // Smoothly return back to original flat position
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={`group flex flex-col justify-between bg-white text-[#12151F] rounded-[8px] border border-white/90 overflow-hidden shadow-[0_8px_30px_rgba(18,21,31,0.06)] hover:shadow-[0_25px_60px_-15px_rgba(142,155,191,0.45)] hover:border-brand-accent/60 gallery-transition cursor-zoom-in relative p-4 ${
        isPromoted ? "ring-2 ring-brand-deco/60 bg-gradient-to-b from-white to-[#F5F4F7]" : ""
      }`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      id={`movie-card-${movie.title}`}
    >
      {/* Dynamic Glare Sheen Layer responding nicely to mouse movement */}
      <motion.div
        style={{
          background: glareBg,
        }}
        className="absolute inset-0 pointer-events-none mix-blend-overlay z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Decorative Frame Overlays to look like luxurious museum physical plates */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-brand-accent/5 opacity-50 pointer-events-none" />

      {/* Fine double border reflecting luxury packaging */}
      <div className="absolute inset-1 border border-[#12151F]/4 rounded-[6px] pointer-events-none" />
      <div className="absolute inset-2 border-2 border-dashed border-[#12151F]/2 rounded-[5px] pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header metadata row inside plate */}
      <div 
        style={{ transform: "translateZ(30px)" }}
        className="pb-3 pt-2 px-1 border-b border-[#12151F]/8 flex justify-between items-center text-[9px] font-mono text-brand-dark/55 tracking-wider uppercase font-semibold"
      >
        <span className="flex items-center gap-1.5 selection:bg-brand-accent">
          {isPromoted ? (
            <span className="flex gap-0.5">
              <span className="pearl-bead scale-75 inline-block" />
              <span className="pearl-bead scale-50 inline-block" />
            </span>
          ) : (
            <span className="inline-block w-1.5 h-1.5 bg-[#12151F]/30 rounded-full" />
          )}
          NO. {(idx + 1).toString().padStart(2, "0")}
        </span>
        <span>{movie.year} &bull; {movie.region[0]}</span>
      </div>

      {/* Large Cinematic High-End Poster Canvas */}
      <div 
        style={{ transform: "translateZ(45px)" }}
        className="pt-3 pb-2 overflow-hidden relative self-center w-full"
      >
        {/* Floating ribbon borders only for highly acclaimed cinematic works */}
        {isPromoted && (
          <div className="absolute inset-x-2 top-4 bottom-2 border border-white/60 rounded-[4px] z-20 pointer-events-none shadow-sm" />
        )}

        <div className="rounded-[4px] overflow-hidden bg-[#ECEAF0] relative border border-brand-deco/40">
          <ArtPoster movie={movie} className="scale-[0.98] group-hover:scale-[1.01] transition-transform duration-700" />

          {/* Physical glossy glare overlay across the poster */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/45 opacity-60 mix-blend-overlay z-10" />
        </div>

        {/* Status Badge overlay on top of plate */}
        {logStatus !== "none" && (
          <div className="absolute top-5 right-5 z-20 flex gap-1.5 items-center bg-white/95 backdrop-blur-sm border border-brand-deco/80 px-2.5 py-1 rounded-sm shadow-[0_4px_10px_rgba(18,21,31,0.08)] scale-90">
            {logStatus === "watched" && (
              <span className="text-[9px] font-mono text-emerald-800 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> 已放映
              </span>
            )}
            {logStatus === "want_to" && (
              <span className="text-[9px] font-mono text-indigo-800 font-bold flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-indigo-500" /> 计划表
              </span>
            )}
            {logStatus === "favorite" && (
              <span className="text-[9px] font-mono text-pink-800 font-bold flex items-center gap-1">
                <Heart className="w-3 h-3 text-pink-500 fill-current" /> 收藏珍品
              </span>
            )}
          </div>
        )}
      </div>

      {/* Core Card Info Block */}
      <div 
        style={{ transform: "translateZ(25px)" }}
        className="pt-3 px-1 flex-1 flex flex-col justify-between z-10"
      >
        <div>
          <div className="flex justify-between items-start gap-1 pb-1">
            <h3 className="font-serif font-semibold text-base text-[#12151F] leading-[1.3] group-hover:text-brand-accent transition-colors duration-300 line-clamp-1">
              {movie.title}
            </h3>
            {/* Rating block */}
            <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
              <span className="text-yellow-500 text-xs">★</span>
              <span className="font-mono text-xs font-bold text-[#12151F]">{movie.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Genre indicators closely detailed */}
          <p className="font-mono text-[9px] text-[#12151F]/50 tracking-widest uppercase font-semibold">
            {movie.genre.join(" &bull; ")} &bull; {movie.duration} min
          </p>

          {/* Thin pearl strand divider running across the card */}
          <div className="w-full flex justify-between gap-1 mt-3 mb-2.5 opacity-30">
            <div className="pearl-bead scale-50" />
            <div className="pearl-bead scale-50" />
            <div className="w-full border-t border-[#12151F]/20 self-center" />
            <div className="pearl-bead scale-50" />
            <div className="pearl-bead scale-50" />
          </div>

          {/* Storyline text in classic serif style */}
          <p className="text-[12px] text-brand-dark/75 font-serif leading-relaxed line-clamp-3 italic">
            {movie.summary}
          </p>
        </div>

        {/* Designer/Curator credit segment at the bottom */}
        <div className="mt-4 pt-3.5 border-t border-[#12151F]/8 flex justify-between items-center text-[10px] font-mono text-brand-dark/50">
          <span className="font-semibold">{movie.director.name} <span className="opacity-50">({movie.director.region})</span></span>
          <span className="font-bold uppercase tracking-wider flex items-center gap-0.5 group-hover:text-brand-accent transition-colors duration-300">
            OPEN 查阅 <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

      </div>
    </motion.article>
  );
}
