/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Movie } from "../data/movies";
import ArtPoster from "./ArtPoster";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Calendar, 
  Clock, 
  Globe, 
  Award, 
  Sparkles, 
  BookOpen, 
  Edit3, 
  CheckCircle2, 
  Bookmark, 
  Heart,
  ChevronRight
} from "lucide-react";

interface DetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  onSaveReview: (title: string, notes: string, status: string, rating: number) => void;
  savedReview?: {
    notes: string;
    status: string;
    personalRating: number;
    updatedAt: string;
  };
}

export default function DetailModal({ movie, onClose, onSaveReview, savedReview }: DetailModalProps) {
  if (!movie) return null;

  const { title, director, year, genre, rating, duration, region, summary } = movie;

  // Review states
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("none"); // none, watched, want_to, favorite
  const [personalRating, setPersonalRating] = useState(0);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Sync state with incoming saved reviews when selected movie changes
  useEffect(() => {
    if (savedReview) {
      setNotes(savedReview.notes || "");
      setStatus(savedReview.status || "none");
      setPersonalRating(savedReview.personalRating || 0);
    } else {
      setNotes("");
      setStatus("none");
      setPersonalRating(0);
    }
  }, [movie, savedReview]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveReview(title, notes, status, personalRating);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 2800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto bg-[#12151F]/60 backdrop-blur-md film-soft-focus">
        
        {/* Modal Backdrop Click Close */}
        <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

        {/* Modal Content Window (Pure Silver & Pearl Literature Layout) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 30 }}
          transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl overflow-hidden bg-gradient-to-b from-white via-[#EAE7EB] to-[#DFDCE2] rounded-[12px] border-2 border-white/90 museum-glow z-10 noise-overlay flex flex-col md:flex-row md:max-h-[85vh]"
          id="museum-exhibition-modal"
        >
          {/* Double silver guidelines */}
          <div className="absolute inset-1.5 border border-[#12151F]/8 rounded-[10px] pointer-events-none z-10" />
          <div className="absolute inset-2.5 border-2 border-dashed border-[#12151F]/3 rounded-[9px] pointer-events-none z-10 opacity-60" />

          {/* Left Column: Big Artistic Film Poster in Fine Bevel */}
          <div className="w-full md:w-[42%] bg-gradient-to-b from-[#ECEAF0] to-[#DFDCE2] p-8 flex flex-col justify-center items-center relative border-b md:border-b-0 md:border-r border-brand-deco/60 z-20">
            
            {/* Fine decorative lighting circle in backing */}
            <div className="absolute w-52 h-52 rounded-full bg-radial from-white via-[#8E9BBF]/20 to-transparent blur-3xl top-1/4 pointer-events-none -z-10" />
            
            {/* Poster Framed like a physical Oil Painting plate */}
            <div className="w-full max-w-[270px] shadow-[0_20px_50px_rgba(18,21,31,0.22)] rounded-[6px] overflow-hidden relative border-2 border-white">
              {/* Glass glare effect inside card */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none z-20" />
              <ArtPoster movie={movie} className="scale-100" />
            </div>
            
            <div className="mt-6 text-center px-4 relative z-10">
              <span className="font-mono text-[9px] text-brand-dark/50 tracking-[0.25em] uppercase font-bold">
                EXHIBITION PLACARD CODE
              </span>
              
              {/* Genre tags */}
              <div className="mt-3.5 flex flex-wrap gap-1.5 justify-center">
                {genre.map((g) => (
                  <span key={g} className="px-2.5 py-0.5 bg-white/70 text-[9px] text-[#12151F] font-mono border border-brand-deco/50 rounded-sm font-bold uppercase tracking-wider">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Narrative Catalogue Entry and Private Notes */}
          <div className="flex-1 p-8 lg:p-10 flex flex-col overflow-y-auto max-h-full relative z-20">
            
            {/* Top Close Button & Metadata Tag */}
            <div className="flex justify-between items-center pb-4 border-b border-[#12151F]/10 mb-6 relative">
              <span className="font-mono text-[10px] text-brand-accent tracking-[0.22em] uppercase flex items-center gap-2 font-bold select-none">
                <span className="pearl-bead animate-pulse" /> DIGITAL CATALOG SYSTEM
              </span>
              <button
                id="close-modal-btn"
                onClick={onClose}
                className="p-1 px-[14px] rounded-full hover:bg-[#12151F] text-brand-dark hover:text-white transition-all border-2 border-[#12151F]/15 flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase cursor-pointer shadow-sm"
              >
                Close <X className="w-3 h-3" />
              </button>
            </div>

            {/* Movie Title Header */}
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-[#12151F] font-semibold tracking-wide leading-tight">
                {title}
              </h2>
              
              {/* Horizontal pearl string divider */}
              <div className="flex gap-1.5 my-3.5 items-center opacity-85 select-none">
                <div className="pearl-bead scale-75" />
                <div className="pearl-bead" />
                <div className="pearl-bead-lg" />
                <div className="pearl-bead" />
                <div className="pearl-bead scale-75" />
                <div className="w-16 border-t-2 border-dashed border-[#12151F]/10 self-center" />
              </div>

              <div className="flex flex-wrap gap-y-2 items-center gap-x-5 text-xs text-brand-dark/70 font-mono font-bold">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-brand-accent" /> {year} 年</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-brand-accent" /> {duration} 分钟</span>
                <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-brand-accent" /> {region.join(", ")}</span>
                <span className="flex items-center gap-1 text-[#12151F] bg-white border border-brand-deco px-2 py-0.5 rounded-sm shadow-inner">
                  <Award className="w-3.5 h-3.5 text-yellow-500 fill-current" /> 评分: {rating.toFixed(1)} / 10
                </span>
              </div>
            </div>

            {/* Catalog Info Dividers */}
            <div className="mt-6 space-y-4">
              <div className="flex text-xs leading-relaxed border-l-4 border-brand-accent pl-3.5">
                <div className="w-20 font-mono text-[#12151F]/50 uppercase tracking-widest font-bold">制作导演</div>
                <div className="flex-1 text-brand-dark font-semibold">
                  {director.name} <span className="opacity-50 font-normal">({director.region})</span>
                </div>
              </div>

              <p className="text-sm text-brand-dark/95 leading-relaxed font-serif pl-1 whitespace-pre-wrap italic">
                “{summary}”
              </p>
            </div>

            {/* Diary Log Form Section (Local Preservation) */}
            <div className="mt-8 pt-6 border-t border-[#12151F]/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="pearl-bead-lg" stroke="currentColor" />
                <h4 className="font-serif text-[15px] font-bold text-brand-dark tracking-wide">
                  私人观影日志 &bull; 手账系统
                </h4>
                <span className="text-[9px] font-mono font-bold text-brand-accent bg-[#12151F]/5 px-2 py-0.2 rounded uppercase">
                  OFFLINE CAPTURE
                </span>
              </div>

              <form onSubmit={handleSave} className="space-y-4 bg-white/50 p-5 rounded-md border-2 border-white/60 shadow-inner">
                {/* Save Curation Status badges */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-mono tracking-widest text-[#12151F]/50 uppercase font-bold">
                    [1] 确定馆藏归档状态
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => setStatus("none")}
                      className={`px-3 py-1.5 text-[11px] font-mono rounded-sm gallery-transition border-2 ${
                        status === "none"
                          ? "bg-[#12151F]/10 border-[#12151F] text-brand-dark font-bold"
                          : "bg-white border-brand-deco/60 text-[#12151F]/60 hover:bg-white"
                      }`}
                    >
                      未观影
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus("watched")}
                      className={`px-3 py-1.5 text-[11px] font-mono rounded-sm gallery-transition border-2 flex items-center gap-1 ${
                        status === "watched"
                          ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold"
                          : "bg-white border-brand-deco/60 text-[#12151F]/60 hover:bg-white"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 已查阅
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus("want_to")}
                      className={`px-3 py-1.5 text-[11px] font-mono rounded-sm gallery-transition border-2 flex items-center gap-1 ${
                        status === "want_to"
                          ? "bg-indigo-50 border-indigo-500 text-indigo-800 font-bold"
                          : "bg-white border-brand-deco/60 text-[#12151F]/60 hover:bg-white"
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5 text-indigo-500" /> 计划中
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus("favorite")}
                      className={`px-3 py-1.5 text-[11px] font-mono rounded-sm gallery-transition border-2 flex items-center gap-1 ${
                        status === "favorite"
                          ? "bg-pink-50 border-pink-400 text-pink-800 font-bold"
                          : "bg-white border-brand-deco/60 text-[#12151F]/60 hover:bg-white"
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 text-pink-500 fill-current" /> 极度珍藏
                    </button>
                  </div>
                </div>

                {/* Symmetrical Pearl Rating system */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-mono tracking-widest text-[#12151F]/50 uppercase font-bold flex justify-between">
                    <span>[2] 收藏评估登记 (按需评分)</span>
                    {personalRating > 0 && <span className="text-[#12151F]/80 font-bold font-mono">{personalRating} / 5 星尘</span>}
                  </label>
                  <div className="flex gap-2.5 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setPersonalRating(star)}
                        className="transition-all hover:scale-115 active:scale-95 focus:outline-none flex flex-col items-center gap-1 group cursor-pointer"
                      >
                        {/* 3D Pearl style star button wrapper */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                          star <= personalRating
                            ? "bg-white border-brand-accent shadow-md md:scale-105"
                            : "bg-white/50 border-brand-deco/30 opacity-60 hover:opacity-100"
                        }`}>
                          <span className={`text-base leading-none font-sans ${star <= personalRating ? "text-yellow-500 font-bold" : "text-brand-deco"}`}>
                            ★
                          </span>
                        </div>
                        <span className="font-mono text-[8px] opacity-45 uppercase tracking-tighter">LV.{star}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Notes Entry */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] text-[#12151F]/50 font-mono tracking-widest uppercase font-bold flex justify-between">
                    <span>[3] 随笔留白 & 艺术批注</span>
                    <span className="text-[8px] italic opacity-60 font-semibold tracking-normal">Write your personal impressions...</span>
                  </label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="在这座电影博物馆的案册中，留存您真挚的观影断想。比如那些令人难忘的经典对白，或它唤醒的那一段宁寂时光..."
                    className="w-full text-xs font-serif p-3.5 bg-white border-2 border-brand-deco/60 rounded-sm focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/25 text-[#12151F] placeholder:text-[#12151F]/35 leading-relaxed resize-none font-medium shadow-inner"
                  />
                </div>

                {/* Submit button decorated with pearl border */}
                <div className="flex justify-between items-center pt-3 border-t border-[#12151F]/6">
                  <div className="text-[9px] font-mono text-[#12151F]/50">
                    {savedReview?.updatedAt ? (
                      <span className="font-semibold">最后更新: {new Date(savedReview.updatedAt).toLocaleString()} &bull; 留念</span>
                    ) : (
                      <span>未有日志存盘 &bull; 留白</span>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#12151F] hover:bg-brand-dark/95 text-white text-[11px] font-mono font-bold uppercase rounded-sm gallery-transition cursor-pointer flex items-center gap-2 hover:shadow-[0_4px_12px_rgba(18,21,31,0.25)] hover:scale-103 active:scale-97 select-none"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-brand-accent" /> 保存至档案库 &sect;
                  </button>
                </div>
              </form>

              {/* Saved success banner */}
              <AnimatePresence>
                {showSavedToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[11px] font-mono rounded-sm flex items-center gap-2 justify-center font-bold"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    观影记录已成功登记并录入电影收藏馆账册库。
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Artistic layout quote footer */}
            <div className="mt-10 pt-6 border-t border-[#12151F]/8 text-center font-serif text-[11px] text-brand-dark/45 italic tracking-wider leading-relaxed pb-2 select-none">
              “电影是寻找另一个人的旅程。” &mdash; 我的电影收藏馆
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
