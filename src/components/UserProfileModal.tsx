import React, { useState } from 'react';
import { X, CheckCircle2, MapPin, Store, Edit3, Bookmark, FileText, UserCheck, Calendar } from 'lucide-react';
import { User, Post, UserRole } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  userPosts: Post[];
  savedPosts: Post[];
  onOpenPostDetail: (post: Post) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  userPosts,
  savedPosts,
  onOpenPostDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'edit'>('posts');

  // Edit form state
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [shopName, setShopName] = useState(currentUser.shopName || '');
  const [businessCategory, setBusinessCategory] = useState(currentUser.businessCategory || 'Tacos & Wraps');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [role, setRole] = useState<UserRole>(currentUser.role || 'Vendor');

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          name,
          bio,
          location,
          shopName,
          businessCategory,
          avatar,
          role,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onUpdateUser(data.user);
        setActiveTab('posts');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#1f1f23] rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header Cover */}
        <div className="relative h-36 bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 p-6 flex items-end justify-between">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info Bar */}
        <div className="px-6 pb-4 relative z-10 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-4 gap-4">
            <div className="flex items-end gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-[#1f1f23] shadow-lg"
              />
              <div className="mb-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{currentUser.name}</h2>
                  {currentUser.isVerifiedVendor && <CheckCircle2 className="w-4 h-4 text-[#FF6B35]" />}
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-[#FF6B35]">
                    {currentUser.role}
                  </span>
                </div>
                <span className="text-xs text-slate-400">@{currentUser.username}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('edit')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors self-start sm:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Profile
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{currentUser.bio}</p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#FF6B35]" />{currentUser.location}</span>
            {currentUser.shopName && (
              <span className="flex items-center gap-1"><Store className="w-3.5 h-3.5 text-amber-500" />{currentUser.shopName}</span>
            )}
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" />Joined {currentUser.joinedDate}</span>
          </div>

          <div className="flex items-center gap-6 mt-3 text-xs font-semibold">
            <div className="text-slate-900 dark:text-white">
              <span className="font-mono font-bold text-sm text-[#FF6B35]">{currentUser.followersCount}</span> <span className="text-slate-400 font-normal">Followers</span>
            </div>
            <div className="text-slate-900 dark:text-white">
              <span className="font-mono font-bold text-sm text-[#FF6B35]">{currentUser.followingCount}</span> <span className="text-slate-400 font-normal">Following</span>
            </div>
            <div className="text-slate-900 dark:text-white">
              <span className="font-mono font-bold text-sm text-[#FF6B35]">{userPosts.length}</span> <span className="text-slate-400 font-normal">Posts</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 shrink-0 bg-slate-50/50 dark:bg-slate-900/40">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'posts' ? 'border-[#FF6B35] text-[#FF6B35]' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            My Posts ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'saved' ? 'border-[#FF6B35] text-[#FF6B35]' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Saved Bookmarks ({savedPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'edit' ? 'border-[#FF6B35] text-[#FF6B35]' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Edit Profile
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'posts' && (
            <div className="space-y-3">
              {userPosts.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">You haven't posted any community discussions yet.</div>
              ) : (
                userPosts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onOpenPostDetail(p);
                      onClose();
                    }}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-[#FF6B35] cursor-pointer transition-all"
                  >
                    <span className="text-[10px] font-bold text-[#FF6B35] block mb-1">{p.category} · {p.date}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{p.title}</h4>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-3">
              {savedPosts.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">No saved post bookmarks.</div>
              ) : (
                savedPosts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onOpenPostDetail(p);
                      onClose();
                    }}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-amber-400 cursor-pointer transition-all"
                  >
                    <span className="text-[10px] font-bold text-amber-500 block mb-1">{p.category} · Saved</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{p.title}</h4>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'edit' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Food Shop Name</label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="Member">Normal User / Customer (Member)</option>
                  <option value="Vendor">Restaurant / Vendor Owner</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF6B35] text-white font-bold rounded-xl hover:bg-[#e05a2b]"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
