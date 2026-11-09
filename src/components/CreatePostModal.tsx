import React, { useState } from 'react';
import { X, Image as ImageIcon, Sparkles, User as UserIcon, Vote, Plus, Trash2 } from 'lucide-react';
import { PostCategory, User } from '../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSubmitPost: (postData: any) => void;
}

const CATEGORIES: PostCategory[] = [
  'Daily Business Problems',
  'Food Quality Problems',
  'Ingredient Price Updates',
  'Supplier Problems',
  'Customer Complaints',
  'Shop Management',
  'Government Rules & Licenses',
  'Street Food Business Ideas',
  'New Food Trends',
  'Success Stories',
  'Equipment Problems',
  'General Discussion',
];

const PRESET_IMAGES = [
  { label: 'Street Market', url: '/src/assets/images/hero_street_market_1793713591273.jpg' },
  { label: 'Taco Stall', url: '/src/assets/images/vendor_tacos_1793713590855.jpg' },
  { label: 'Skewers BBQ', url: '/src/assets/images/vendor_skewers_1793713591288.jpg' },
  { label: 'Noodle Cart', url: '/src/assets/images/vendor_noodles_1793713592917.jpg' },
  { label: 'Churro Sweet Truck', url: '/src/assets/images/vendor_churros_1793713592390.jpg' },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmitPost,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('Daily Business Problems');
  const [location, setLocation] = useState(currentUser.location || 'Austin, TX');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/vendor_tacos_1793713590855.jpg');
  const [tagsInput, setTagsInput] = useState('StreetFood, VendorTip');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Poll state
  const [showPollBuilder, setShowPollBuilder] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['Option 1', 'Option 2']);

  if (!isOpen) return null;

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`]);
    }
  };

  const handleRemovePollOption = (idx: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_: string, i: number) => i !== idx));
    }
  };

  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...pollOptions];
    updated[idx] = val;
    setPollOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tagsArr = tagsInput
      .split(',')
      .map((t: string) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onSubmitPost({
      authorId: currentUser.id,
      title,
      content,
      category,
      location,
      imageUrls: imageUrl ? [imageUrl] : [],
      tags: tagsArr,
      isAnonymous,
      pollQuestion: showPollBuilder ? pollQuestion : undefined,
      pollOptions: showPollBuilder ? pollOptions : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#1f1f23] rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF6B35]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Create Community Post</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Author info & Anonymous toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={isAnonymous ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' : currentUser.avatar}
                alt=""
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {isAnonymous ? 'Anonymous Vendor' : currentUser.name}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isAnonymous ? 'Your identity will be completely hidden' : `Posting as ${currentUser.role}`}
                </span>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF6B35] focus:ring-[#FF6B35]"
              />
              <span>Post Anonymously</span>
            </label>
          </div>

          {/* Post Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Post Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Propane gas prices jumped 18% this morning—how are you adjusting?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PostCategory)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Stall / Market Location
              </label>
              <input
                type="text"
                placeholder="City or Market Name"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
            </div>
          </div>

          {/* Description Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description & Discussion Details <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe your daily problem, vendor experience, recipe question, or business tip in detail..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            />
          </div>

          {/* Photo Preset Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              Attach Food / Cart Photo
            </label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {PRESET_IMAGES.map((img) => (
                <button
                  type="button"
                  key={img.url}
                  onClick={() => setImageUrl(img.url)}
                  className={`relative rounded-lg overflow-hidden h-14 border-2 transition-all ${
                    imageUrl === img.url ? 'border-[#FF6B35] scale-102 shadow' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white truncate px-1 text-center">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or enter custom image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="PropanePrice, StreetTacos, MenuPricing"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          {/* Poll Builder Option */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowPollBuilder(!showPollBuilder)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#FF6B35] hover:underline"
            >
              <Vote className="w-4 h-4" />
              <span>{showPollBuilder ? 'Remove Community Poll' : '+ Attach Interactive Community Poll'}</span>
            </button>

            {showPollBuilder && (
              <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <input
                  type="text"
                  placeholder="Poll Question (e.g. Are you raising menu prices this week?)"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />

                <div className="space-y-2">
                  {pollOptions.map((opt: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePollOption(idx)}
                          className="p-1 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {pollOptions.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddPollOption}
                    className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 font-medium hover:text-[#FF6B35]"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Option
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#FF6B35] hover:bg-[#e05a2b] rounded-xl shadow-md shadow-orange-500/20 transition-all"
            >
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
