import React from 'react';
import { X, Heart, Utensils, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

interface DipakStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DipakStoryModal: React.FC<DipakStoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-[#1c1c1f] rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Header Cover Image */}
        <div className="relative h-64 sm:h-72 bg-slate-900 overflow-hidden">
          <img
            src="/public/assets/aistudio/WhatsApp_Image_2026-11-07_at_8.34.21_PM_15550186.jpeg"
            alt="Dipak Hotel and Restaurant"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
            aria-label="Close story"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-[#FF6B35] text-white text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Featured Vendor Story
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Simhat, Nadia
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              The Story Behind Dipak Hotel and Restaurant
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              — Stories Behind the Street Food Corners
            </p>
          </div>
        </div>

        {/* Story Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          
          {/* Headline Quote Highlight Box */}
          <div className="p-5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 text-center">
            <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight mb-2">
              "Every corner has a story. Every flavour has a person."
            </p>
            <span className="text-xs font-semibold text-[#FF6B35] uppercase tracking-wider block">
              — Stories Behind the Street Food Corners
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#FF6B35]" /> Meet Dipak Hotel and Restaurant
            </h3>
            <p>
              <strong>Dipak Hotel and Restaurant</strong> is a local food establishment known for serving traditional and popular meals to customers from the surrounding community.
            </p>
            <p className="mt-3">
              Behind every plate is a story, and our interview with the people behind Dipak Hotel and Restaurant gives us a glimpse into the journey of running a local food business.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <p className="font-medium text-slate-900 dark:text-white">
              The restaurant began with a simple idea: <strong className="text-[#FF6B35]">to serve tasty and affordable food while building a connection with the local community.</strong> Biryani is one of the dishes that attracts customers to the restaurant, bringing together the familiar flavours and aromas that many food lovers enjoy.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Challenges & Daily Dedication</h4>
            <p>
              Running a restaurant, however, comes with its own challenges. From managing ingredients and maintaining food quality to dealing with changing customer demands and rising costs, small food businesses work hard every day to keep their customers satisfied.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">The Heart of the Journey</h4>
            <p>
              For the people behind Dipak Hotel and Restaurant, the customers are an important part of the journey. Every returning customer, positive comment, and memorable experience adds another chapter to the restaurant's story.
            </p>
            <p className="mt-3">
              Looking towards the future, the goal is to <strong className="text-[#FF6B35]">continue serving good food, satisfy customers, and grow the restaurant while maintaining the quality that people have come to appreciate.</strong>
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5 text-[#FF6B35]">
              <Heart className="w-4 h-4 fill-[#FF6B35]" /> More Than Just a Restaurant
            </h3>
            <p className="italic text-slate-600 dark:text-slate-300">
              Dipak Hotel and Restaurant is more than just a place to have a meal. It is part of the local food community—a place where people come together over food, conversations, and shared experiences.
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-[#FF6B35]" />
              <span>Simhat, 4 no Gate, Nadia, West Bengal</span>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#e05a2b] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              Close Story
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
