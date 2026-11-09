import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  PlusCircle,
  Search,
  Filter,
  DollarSign,
  AlertCircle,
  MapPin,
  X
} from 'lucide-react';
import { PriceReport, User } from '../types';

interface PriceTrackerProps {
  currentUser: User;
  isOpenModalImmediately?: boolean;
  onCloseModalImmediately?: () => void;
}

const CITIES = ['All Cities', 'Austin, TX', 'Seattle, WA', 'Portland, OR', 'Chicago, IL'];

export const PriceTracker: React.FC<PriceTrackerProps> = ({
  currentUser,
  isOpenModalImmediately,
  onCloseModalImmediately,
}) => {
  const [prices, setPrices] = useState<PriceReport[]>([]);
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [item, setItem] = useState('');
  const [category, setCategory] = useState('Fuel & Energy');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('cylinder');
  const [city, setCity] = useState(currentUser.location || 'Austin, TX');
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('up');
  const [changeText, setChangeText] = useState('Price increased at local wholesaler');

  useEffect(() => {
    if (isOpenModalImmediately) {
      setShowSubmitModal(true);
    }
  }, [isOpenModalImmediately]);

  useEffect(() => {
    fetchPrices();
  }, [selectedCity, searchQuery]);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedCity !== 'All Cities') queryParams.append('city', selectedCity);
      if (searchQuery) queryParams.append('search', searchQuery);

      const res = await fetch(`/api/prices?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPrices(data.prices);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !price) return;

    try {
      const res = await fetch('/api/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item,
          category,
          price: parseFloat(price),
          unit,
          city,
          vendorId: currentUser.id,
          trend,
          changeText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPrices([data.priceReport, ...prices]);
        setShowSubmitModal(false);
        if (onCloseModalImmediately) onCloseModalImmediately();
        setItem('');
        setPrice('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6B35] uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" /> Daily Ingredient & Supply Tracker
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Crowd-Sourced Street Food Cost Index
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time price reports for propane gas, cooking oil, meats, flour, and packaging submitted by local vendors.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#e05a2b] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit Price Update</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white dark:bg-[#1c1c1f] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search items (e.g. Propane, Oil, Beef, Flour)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
          />
        </div>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium"
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Price Table / Cards */}
      <div className="bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400">Loading daily price index...</div>
        ) : prices.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">No price reports found for this filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Item & Category</th>
                  <th className="py-3.5 px-4">Current Price</th>
                  <th className="py-3.5 px-4">Trend & Change</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Reported By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {prices.map((pr) => (
                  <tr key={pr.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{pr.item}</div>
                      <span className="text-[11px] text-slate-400">{pr.category}</span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-sm text-slate-900 dark:text-white">
                      ${pr.price.toFixed(2)} <span className="text-[11px] text-slate-400 font-normal">/ {pr.unit}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        {pr.trend === 'up' && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">
                            <TrendingUp className="w-3.5 h-3.5" /> High
                          </span>
                        )}
                        {pr.trend === 'down' && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                            <TrendingDown className="w-3.5 h-3.5" /> Lower
                          </span>
                        )}
                        {pr.trend === 'stable' && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            <Minus className="w-3.5 h-3.5" /> Stable
                          </span>
                        )}
                        <span className="text-slate-500 dark:text-slate-400 text-xs truncate max-w-[200px]">{pr.changeText}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#FF6B35]" />{pr.city}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">{pr.vendorName}</div>
                      <span className="text-[10px] text-slate-400">{pr.reportedAt}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submit Price Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1f1f23] rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Submit Daily Price Report</h3>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  if (onCloseModalImmediately) onCloseModalImmediately();
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cooking Oil (5 Gal) or Propane Cylinder"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="42.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="cylinder / 5gal / 50lb bag"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Fuel & Energy">Fuel & Energy</option>
                    <option value="Oils & Fats">Oils & Fats</option>
                    <option value="Meats & Poultry">Meats & Poultry</option>
                    <option value="Grains & Bakery">Grains & Bakery</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Produce">Produce</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">City / Location</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Trend Direction</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTrend('up')}
                    className={`flex-1 py-1.5 rounded-lg border text-center font-semibold ${
                      trend === 'up' ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Price Increase
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrend('down')}
                    className={`flex-1 py-1.5 rounded-lg border text-center font-semibold ${
                      trend === 'down' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Price Decrease
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrend('stable')}
                    className={`flex-1 py-1.5 rounded-lg border text-center font-semibold ${
                      trend === 'stable' ? 'border-slate-400 bg-slate-100 text-slate-700' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Stable
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF6B35] text-white font-bold rounded-xl"
                >
                  Save Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
