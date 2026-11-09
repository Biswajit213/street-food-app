import React, { useState, useEffect } from 'react';
import { Megaphone, Pin, Calendar, ShieldCheck } from 'lucide-react';
import { Announcement } from '../types';

export const AnnouncementsView: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        if (data.success) setAnnouncements(data.announcements);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6B35] uppercase tracking-wider mb-1">
          <Megaphone className="w-4 h-4" /> Official Community Bulletins
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Platform Notices & Vendor Policy Updates
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Official announcements from city councils, vendor safety updates, and platform rule changes.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading community bulletins...</div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-12 text-xs text-slate-400">No official announcements published yet.</div>
      ) : (
        <div className="space-y-4">
          {announcements.map((anc) => (
            <div
              key={anc.id}
              className={`p-6 rounded-2xl border transition-all ${
                anc.pinned
                  ? 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/60 shadow-sm'
                  : 'bg-white dark:bg-[#1c1c1f] border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#FF6B35] px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900/40">
                    {anc.category}
                  </span>
                  {anc.pinned && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      <Pin className="w-3 h-3" /> Pinned Notice
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {anc.createdAt}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{anc.title}</h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-4">
                {anc.content}
              </p>

              <div className="flex items-center gap-2 text-xs text-slate-400 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Published by {anc.authorName}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
