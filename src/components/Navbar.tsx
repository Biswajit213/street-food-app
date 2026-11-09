import React, { useState } from 'react';
import {
  Flame,
  Search,
  PlusCircle,
  Bell,
  Sun,
  Moon,
  Store,
  TrendingUp,
  Bot,
  Megaphone,
  Shield,
  CheckCircle2,
  ChevronDown,
  Menu,
  X,
  LogOut,
  LogIn
} from 'lucide-react';
import { User, NotificationItem } from '../types';

interface NavbarProps {
  currentUser: User;
  onSwitchUser: (userId: string, role?: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenCreatePost: () => void;
  notifications: NotificationItem[];
  unreadNotifCount: number;
  onMarkNotificationsRead: () => void;
  onOpenProfile: () => void;
  onOpenShopModal: () => void;
  usersList: User[];
  firebaseUser: any | null;
  onGoogleSignIn: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchUser,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  isDarkMode,
  setIsDarkMode,
  onOpenCreatePost,
  notifications,
  unreadNotifCount,
  onMarkNotificationsRead,
  onOpenProfile,
  onOpenShopModal,
  usersList,
  firebaseUser,
  onGoogleSignIn,
  onSignOut,
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'feed', label: 'Discussions', icon: Flame },
    { id: 'shops', label: 'Stall Directory', icon: Store },
    { id: 'prices', label: 'Price Tracker', icon: TrendingUp },
    { id: 'ai-advisor', label: 'AI Copilot', icon: Bot },
  ];

  if (currentUser.role === 'Admin' || currentUser.role === 'Moderator') {
    navLinks.push({ id: 'admin', label: 'Moderation', icon: Shield });
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Title */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('feed')}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#FFC857] flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 fill-white/20" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 font-sans">
                  Corner <span className="text-[#FF6B35]">Stories</span>
                </span>
              </div>
            </button>

            {/* Quick Demo Role Switcher Badge */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Switch demo user profile / role"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="truncate max-w-[110px]">{currentUser.name}</span>
                <span className="text-[10px] font-semibold uppercase px-1 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-[#FF6B35]">
                  {currentUser.role}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showUserDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#202124] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Switch Test Persona
                  </div>
                  {usersList.map((usr) => (
                    <button
                      key={usr.id}
                      onClick={() => {
                        onSwitchUser(usr.id);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors ${
                        currentUser.id === usr.id ? 'bg-orange-50 dark:bg-orange-950/30 text-[#FF6B35] font-semibold' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <img src={usr.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="truncate font-medium">{usr.name}</span>
                          {usr.isVerifiedVendor && <CheckCircle2 className="w-3 h-3 text-[#FF6B35] shrink-0" />}
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">{usr.role} · {usr.location}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FF6B35] font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF6B35]' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Search, Dark Mode, Notifications, Firebase Auth & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative hidden xl:block w-48">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search vendor posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-transparent dark:border-slate-700/60 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notifications Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifs(!showNotifs);
                  if (!showNotifs) onMarkNotificationsRead();
                }}
                className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF6B35] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#202124] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Vendor Notifications</span>
                    <button
                      onClick={onMarkNotificationsRead}
                      className="text-[11px] text-[#FF6B35] hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-slate-400">No new notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                            !n.read ? 'bg-orange-50/40 dark:bg-orange-950/20' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-[#FF6B35] shrink-0 mt-0.5">
                              <Bell className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{n.title}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Create Post Button */}
            <button
              onClick={onOpenCreatePost}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#FF6B35] hover:bg-[#e05a2b] text-white shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Create Post</span>
            </button>

            {/* Firebase Auth Section */}
            {firebaseUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#FF6B35] transition-all"
                  title={firebaseUser.displayName || 'Google User'}
                >
                  <img
                    src={firebaseUser.photoURL || currentUser.avatar}
                    alt={firebaseUser.displayName || currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                </button>
                <button
                  onClick={onSignOut}
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Sign Out from Firebase"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ) : (
              <button
                onClick={onGoogleSignIn}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border border-slate-700 transition-all shadow-sm whitespace-nowrap"
                title="Sign in with Google Firebase Auth"
              >
                <LogIn className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span className="hidden sm:inline">Firebase Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18181b] px-4 py-3 space-y-2">
          <div className="mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Active User Persona</span>
            <select
              value={currentUser.id}
              onChange={(e) => {
                onSwitchUser(e.target.value);
                setMobileMenuOpen(false);
              }}
              className="w-full text-xs p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              {usersList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    activeTab === link.id
                      ? 'bg-orange-50 dark:bg-orange-950/50 text-[#FF6B35] font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#FF6B35]" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
