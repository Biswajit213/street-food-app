import React, { useState, useEffect } from 'react';
import {
  Store,
  MapPin,
  Clock,
  Phone,
  Mail,
  Star,
  PlusCircle,
  Search,
  CheckCircle2,
  Utensils,
  ChevronRight,
  X
} from 'lucide-react';
import { ShopListing, User } from '../types';

interface ShopDirectoryProps {
  currentUser: User;
  onOpenCreateShopModal: () => void;
}

const CATEGORIES = [
  'All Categories',
  'Tacos & Wraps',
  'BBQ & Skewers',
  'Noodle & Soup Bar',
  'Desserts & Drinks',
  'Deep Fried Snacks',
  'Gourmet Burgers',
  'Traditional Steamed',
  'Vegan Street Eats',
];

export const ShopDirectory: React.FC<ShopDirectoryProps> = ({
  currentUser,
  onOpenCreateShopModal,
}) => {
  const [shops, setShops] = useState<ShopListing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShop, setSelectedShop] = useState<ShopListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, [selectedCategory, selectedLocation, searchQuery]);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'All Categories') queryParams.append('category', selectedCategory);
      if (selectedLocation !== 'All Locations') queryParams.append('location', selectedLocation);
      if (searchQuery) queryParams.append('search', searchQuery);

      const res = await fetch(`/api/shops?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setShops(data.shops);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6B35] uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" /> Street Food Stall Directory
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Discover Verified Local Street Vendors
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse authentic food stalls, night market carts, and mobile food trucks with direct contact info and real menus.
          </p>
        </div>

        <button
          onClick={onOpenCreateShopModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#e05a2b] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List My Food Stall</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white dark:bg-[#1c1c1f] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search stalls by name, food item, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
          />
        </div>

        {/* Category Tabs */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Shops Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading food stall directory...</div>
      ) : shops.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <Store className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No food stalls found</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting search query or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div
              key={shop.id}
              onClick={() => setSelectedShop(shop)}
              className="bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
            >
              {/* Cover Image */}
              <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={shop.photos[0]}
                  alt={shop.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{shop.rating}</span>
                  <span className="text-slate-400 font-normal">({shop.reviewsCount})</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-semibold text-amber-300 uppercase">
                  {shop.category}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#FF6B35] transition-colors">
                      {shop.name}
                    </h3>
                    {shop.isVerified && (
                      <span title="Verified Vendor Stall">
                        <CheckCircle2 className="w-4 h-4 text-[#FF6B35] shrink-0" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                    {shop.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
                      <span className="truncate">{shop.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{shop.openingHours}</span>
                    </div>
                  </div>

                  {/* Menu Items Teaser */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Popular Items</span>
                    <div className="space-y-1">
                      {shop.menuItems.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-slate-800 dark:text-slate-200 truncate">{item.name}</span>
                          <span className="font-mono text-slate-500 font-semibold">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#FF6B35]">
                  <span>View Full Menu & Contact</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shop Detail Modal */}
      {selectedShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-[#1f1f23] rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header Cover */}
            <div className="relative h-56 bg-slate-900">
              <img src={selectedShop.photos[0]} alt="" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <button
                onClick={() => setSelectedShop(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#FF6B35] text-white">
                    {selectedShop.category}
                  </span>
                  {selectedShop.isVerified && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Stall
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-extrabold">{selectedShop.name}</h2>
                <span className="text-xs text-slate-300">Owner: {selectedShop.ownerName}</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">About Stall</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{selectedShop.description}</p>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-[#FF6B35]" />
                  <span>{selectedShop.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{selectedShop.openingHours}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span>{selectedShop.contactPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span>{selectedShop.contactEmail}</span>
                </div>
              </div>

              {/* Menu List */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-[#FF6B35]" />
                  Stall Menu & Daily Specials
                </h3>
                <div className="space-y-2">
                  {selectedShop.menuItems.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">{item.name}</span>
                        {item.description && <span className="text-[11px] text-slate-500 block mt-0.5">{item.description}</span>}
                      </div>
                      <span className="font-mono text-xs font-bold text-[#FF6B35] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
