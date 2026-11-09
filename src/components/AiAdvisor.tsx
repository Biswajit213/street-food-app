import React, { useState } from 'react';
import { Bot, Sparkles, Send, Copy, Check, Lightbulb, ShieldAlert, Wrench, DollarSign, Users, RefreshCw } from 'lucide-react';
import { User } from '../types';

interface AiAdvisorProps {
  currentUser: User;
}

const PRESET_TOPICS = [
  { id: 'pricing', label: 'Menu Pricing & Margin', icon: DollarSign },
  { id: 'equipment', label: 'Equipment Troubleshoot', icon: Wrench },
  { id: 'safety', label: 'Food Safety & Permits', icon: ShieldAlert },
  { id: 'marketing', label: 'Crowd & Promo Ideas', icon: Users },
  { id: 'supplier', label: 'Supplier Negotiation', icon: Lightbulb },
];

const QUICK_PROMPTS = [
  'How do I calculate food cost percentage for my street taco cart?',
  'My flat-top grill has stubborn grease buildup. What is the safest fast cleaning method?',
  'What key steps ensure passing an unannounced city health inspection?',
  'What is a polite script to negotiate wholesale beef prices with my supplier?',
  'How can I use a simple QR code loyalty scheme to attract lunchtime office crowds?',
];

export const AiAdvisor: React.FC<AiAdvisorProps> = ({ currentUser }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Menu Pricing & Margin');
  const [responseAdvice, setResponseAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAskAi = async (customPrompt?: string) => {
    const textToAsk = customPrompt || prompt;
    if (!textToAsk.trim()) return;

    setLoading(true);
    setResponseAdvice(null);
    try {
      const res = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToAsk,
          topic: selectedTopic,
          vendorContext: `${currentUser.shopName || 'Food Cart'} owned by ${currentUser.name} located in ${currentUser.location}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResponseAdvice(data.advice);
      } else {
        setResponseAdvice(`Error: ${data.error || 'Failed to get AI advice.'}`);
      }
    } catch (err: any) {
      setResponseAdvice('Unable to connect to AI Advisor server endpoint.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (responseAdvice) {
      navigator.clipboard.writeText(responseAdvice);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-950 to-orange-950 rounded-2xl text-white shadow-lg border border-slate-800">
        <div className="flex items-center gap-2.5 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
          <Bot className="w-5 h-5 text-[#FFC857]" /> StreetBites AI Vendor Copilot
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
          Real-Time Business & Culinary Advice for Stall Owners
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Powered by Gemini 3.8 Flash. Get immediate guidance on menu costing during ingredient inflation, grill upkeep, inspector prep, and customer growth strategies.
        </p>
      </div>

      {/* Topic Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {PRESET_TOPICS.map((topic) => {
          const Icon = topic.icon;
          const isSelected = selectedTopic === topic.label;
          return (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.label)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#FF6B35] text-white shadow-md shadow-orange-500/20'
                  : 'bg-white dark:bg-[#1c1c1f] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-[#FF6B35]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{topic.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Form Box */}
      <div className="bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
            Ask AI Copilot a Question ({selectedTopic})
          </label>
          <div className="relative">
            <textarea
              rows={3}
              placeholder="e.g., My propane prices jumped by $7 per tank. How can I adjust my taco cart menu without losing lunchtime regulars?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            />
            <button
              onClick={() => handleAskAi()}
              disabled={loading || !prompt.trim()}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-4 py-2 bg-[#FF6B35] hover:bg-[#e05a2b] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Get Business Advice</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Popular Vendor Questions
          </span>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(qp);
                  handleAskAi(qp);
                }}
                className="text-left text-xs px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors"
              >
                "{qp}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advice Output View */}
      {loading && (
        <div className="p-8 bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#FF6B35] mx-auto flex items-center justify-center animate-bounce">
            <Bot className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Consulting StreetBites AI Advisor for best food vendor practices...
          </p>
        </div>
      )}

      {responseAdvice && !loading && (
        <div className="p-6 bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF6B35]" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Advisor Strategy</h3>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#FF6B35] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Advice'}</span>
            </button>
          </div>

          <div className="prose prose-sm dark:prose-invert text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
            {responseAdvice}
          </div>
        </div>
      )}
    </div>
  );
};
