import React from 'react';
import { Bot, PlusCircle, TrendingUp, Store, Sparkles, MessageSquare, ShieldCheck, BookOpen } from 'lucide-react';

interface HeroBannerProps {
  onOpenCreatePost: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenPriceModal: () => void;
  onOpenDipakStory: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenCreatePost,
  onNavigateTab,
  onOpenPriceModal,
  onOpenDipakStory,
}) => {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-900 text-white">
      {/* Background Image with Scrim */}
      <img
        src="/src/assets/images/hero_street_market_1793713591273.jpg"
        alt="Street Food Night Market"
        className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/40" />

      {/* Content Container */}
      <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-12 max-w-4xl">
        {/* Unboxed Metadata Header Kicker */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-300 mb-3 tracking-wide uppercase">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC857]" /> Stories Behind the Street Food Corners
          </span>
          <span aria-hidden="true" className="text-slate-500">·</span>
          <span>Dipak Hotel & Restaurant Spotlight</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 text-wrap balance font-sans leading-tight">
          Every corner has a story. Every flavour has a person.
        </h1>

        <p className="text-sm sm:text-base text-slate-300 mb-6 max-w-2xl leading-relaxed">
          Explore the journey behind Dipak Hotel and Restaurant, share daily vendor challenges, track ingredient prices, and connect with small food business entrepreneurs.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={onOpenDipakStory}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg shadow-amber-500/25 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>Read Dipak Hotel Story</span>
          </button>

          <button
            onClick={onOpenCreatePost}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#e05a2b] text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/25 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Business Problem</span>
          </button>

          <button
            onClick={() => onNavigateTab('ai-advisor')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 text-xs sm:text-sm font-semibold border border-amber-400/30 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Bot className="w-4 h-4 text-amber-400" />
            <span>Ask AI Copilot</span>
          </button>

          <button
            onClick={() => onNavigateTab('shops')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Stall Directory</span>
          </button>
        </div>

        {/* Unboxed Metadata Stats Footer */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 sm:gap-8 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white text-sm">Dipak Hotel & Restaurant</span>
            <span>Simhat, 4 no Gate</span>
          </div>
          <span aria-hidden="true" className="text-slate-700 hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-amber-400 text-sm">Traditional & Biriyani</span>
            <span>Specialists</span>
          </div>
          <span aria-hidden="true" className="text-slate-700 hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Local Community</span>
          </div>
        </div>
      </div>
    </div>
  );
};

