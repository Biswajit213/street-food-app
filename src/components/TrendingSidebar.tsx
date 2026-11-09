import React from 'react';
import { Flame, CheckCircle2, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';
import { User } from '../types';

interface TrendingSidebarProps {
  onSelectCategory: (category: string) => void;
  activeVendors: User[];
  onOpenPriceModal: () => void;
}

const TRENDING_TOPICS = [
  { name: 'Success Stories', count: 19, trend: '+8%' },
];

export const TrendingSidebar: React.FC<TrendingSidebarProps> = ({
  onSelectCategory,
  activeVendors,
  onOpenPriceModal,
}) => {
  return (
    <aside className="space-y-6">
      {/* Trending Topics Box */}
      <div className="bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Flame className="w-4 h-4 text-[#FF6B35]" />
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Trending Categories</h3>
        </div>

        <div className="space-y-2">
          {TRENDING_TOPICS.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => onSelectCategory(topic.name)}
              className="w-full flex items-center justify-between p-2 rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left group"
            >
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#FF6B35] transition-colors block truncate max-w-[170px]">
                  {topic.name}
                </span>
                <span className="text-[10px] text-slate-400">{topic.count} posts this week</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                {topic.trend}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Price Alert Banner */}
      <div className="bg-gradient-to-tr from-orange-500 to-amber-500 p-5 rounded-2xl text-white shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1 text-amber-100">
          <TrendingUp className="w-4 h-4" /> Live Inflation Tracker
        </div>
        <h4 className="text-sm font-extrabold mb-1">Seeing ingredient price hikes at wholesale?</h4>
        <p className="text-xs text-orange-100 mb-3 leading-relaxed">
          Help fellow street vendors in your city stay informed by logging today's price report.
        </p>
        <button
          onClick={onOpenPriceModal}
          className="w-full py-2 bg-white text-[#FF6B35] font-bold text-xs rounded-xl shadow hover:bg-orange-50 transition-all cursor-pointer"
        >
          Submit Local Price
        </button>
      </div>

      {/* Recently Active Vendors */}
      <div className="bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Active Verified Vendors</h3>
        </div>

        <div className="space-y-3">
          {activeVendors.slice(0, 4).map((vendor) => (
            <div key={vendor.id} className="flex items-center gap-3 text-xs">
              <img src={vendor.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-slate-900 dark:text-white truncate">{vendor.name}</span>
                  {vendor.isVerifiedVendor && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />}
                </div>
                <span className="text-[10px] text-slate-400 block truncate">{vendor.shopName || vendor.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Rules Box */}
      <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 text-xs">
        <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 dark:text-white">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Vendor Safety Code</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
          StreetBites is built on mutual support, respectful pricing transparency, and verified business advice. Be kind to fellow stall owners.
        </p>
      </div>
    </aside>
  );
};
