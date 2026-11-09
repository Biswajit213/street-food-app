import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { PostCard } from './components/PostCard';
import { CreatePostModal } from './components/CreatePostModal';
import { PostDetailModal } from './components/PostDetailModal';
import { ShopDirectory } from './components/ShopDirectory';
import { PriceTracker } from './components/PriceTracker';
import { AiAdvisor } from './components/AiAdvisor';
import { AdminDashboard } from './components/AdminDashboard';
import { UserProfileModal } from './components/UserProfileModal';
import { TrendingSidebar } from './components/TrendingSidebar';
import { AnnouncementsView } from './components/AnnouncementsView';
import { DipakStoryModal } from './components/DipakStoryModal';
import { Post, User, NotificationItem, PostCategory } from './types';
import { Flame, Filter, Calendar, Sparkles, MessageSquare, TrendingUp, PlusCircle } from 'lucide-react';
import { auth, googleProvider } from './lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const CATEGORY_FILTERS = [
  'All',
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

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr_1',
    name: 'Dipak Owner',
    username: 'dipak_hotel_official',
    email: 'contact@dipakrestaurant.com',
    avatar: '/public/assets/aistudio/WhatsApp_Image_2026-11-07_at_8.34.21_PM_15550186.jpeg',
    role: 'Vendor',
    isVerifiedVendor: true,
    bio: 'Owner & Head Chef at Dipak Hotel & Restaurant (Simhat, 4 no Gate, Nadia). Veg & Non-Veg Breakfast, Lunch, Dinner, Bengali, Chinese, Indian, Fastfood & Biriyani. Every corner has a story. Every flavour has a person.',
    location: 'Simhat, 4 no Gate, Nadia',
    shopName: 'Dipak Hotel & Restaurant',
    businessCategory: 'Bengali & Multi-Cuisine',
    totalPosts: 12,
    followersCount: 520,
    followingCount: 34,
    joinedDate: 'Jan 2025',
  });

  const [usersList, setUsersList] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | 'today' | 'week' | 'trending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Modals
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPostDetail, setSelectedPostDetail] = useState<Post | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isDipakStoryOpen, setIsDipakStoryOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        setCurrentUser(prev => ({
          ...prev,
          id: user.uid,
          name: user.displayName || prev.name,
          email: user.email || prev.email,
          avatar: user.photoURL || prev.avatar,
          isVerifiedVendor: true,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Firebase Google Sign In Error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase Sign Out Error:", error);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchUserData();
    fetchPosts();
    fetchNotifications();
  }, [selectedCategory, selectedTimeframe, searchQuery]);

  // Sync Dark Mode Class on <html> tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/users/current?userId=${currentUser.id}`);
      const data = await res.json();
      if (data.success) setCurrentUser(data.user);

      const usersRes = await fetch('/api/admin/users');
      const usersData = await usersRes.json();
      if (usersData.success) setUsersList(usersData.users);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPosts = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
      if (selectedTimeframe !== 'all') queryParams.append('filter', selectedTimeframe);
      if (searchQuery) queryParams.append('search', searchQuery);

      const res = await fetch(`/api/posts?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications?userId=${currentUser.id}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadNotifCount(data.unreadCount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSwitchUser = async (userId: string, role?: string) => {
    try {
      const res = await fetch('/api/users/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async (postData: any) => {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      if (data.success) {
        setPosts([data.post, ...posts]);
        fetchUserData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return { ...p, likesCount: data.likesCount, likedBy: data.likedBy };
          }
          return p;
        }));
        if (selectedPostDetail && selectedPostDetail.id === postId) {
          setSelectedPostDetail({
            ...selectedPostDetail,
            likesCount: data.likesCount,
            likedBy: data.likedBy,
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return { ...p, savedBy: data.savedBy };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportPost = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, reason: 'Flagged by community vendor' }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVotePoll = async (postId: string, optionId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/poll/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId, userId: currentUser.id }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return { ...p, poll: data.poll };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkNotifsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      setUnreadNotifCount(0);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const savedPostsList = posts.filter(p => p.savedBy.includes(currentUser.id));
  const userPostsList = posts.filter(p => p.authorId === currentUser.id);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#121212] text-[#222222] dark:text-[#F0F0F0] font-sans antialiased transition-colors">
      
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        notifications={notifications}
        unreadNotifCount={unreadNotifCount}
        onMarkNotificationsRead={handleMarkNotifsRead}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenShopModal={() => setActiveTab('shops')}
        usersList={usersList}
        firebaseUser={firebaseUser}
        onGoogleSignIn={handleGoogleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Main Viewport Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Render Feed Tab */}
        {activeTab === 'feed' && (
          <div>
            <HeroBanner
              onOpenCreatePost={() => setIsCreatePostOpen(true)}
              onNavigateTab={setActiveTab}
              onOpenPriceModal={() => setIsPriceModalOpen(true)}
              onOpenDipakStory={() => setIsDipakStoryOpen(true)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Main Feed Column (2 cols wide) */}
              <div className="lg:col-span-2 space-y-6">
                


                {/* Posts Feed Stream */}
                {posts.length === 0 ? (
                  <div className="bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                    <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">No discussions found</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-4">Be the first street food vendor to post in this category!</p>
                    <button
                      onClick={() => setIsCreatePostOpen(true)}
                      className="px-4 py-2 text-xs font-bold bg-[#FF6B35] text-white rounded-xl shadow"
                    >
                      Create First Discussion
                    </button>
                  </div>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onLike={handleLikePost}
                      onSave={handleSavePost}
                      onReport={handleReportPost}
                      onOpenDetail={(p) => setSelectedPostDetail(p)}
                      onVotePoll={handleVotePoll}
                      onSelectCategory={(cat) => setSelectedCategory(cat)}
                    />
                  ))
                )}
              </div>

              {/* Sidebar Column */}
              <div className="lg:col-span-1">
                <TrendingSidebar
                  onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                    setActiveTab('feed');
                  }}
                  activeVendors={usersList.filter(u => u.isVerifiedVendor)}
                  onOpenPriceModal={() => setIsPriceModalOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Render Shop Directory Tab */}
        {activeTab === 'shops' && (
          <ShopDirectory
            currentUser={currentUser}
            onOpenCreateShopModal={() => setIsProfileOpen(true)}
          />
        )}

        {/* Render Price Tracker Tab */}
        {activeTab === 'prices' && (
          <PriceTracker
            currentUser={currentUser}
            isOpenModalImmediately={isPriceModalOpen}
            onCloseModalImmediately={() => setIsPriceModalOpen(false)}
          />
        )}

        {/* Render AI Copilot Advisor Tab */}
        {activeTab === 'ai-advisor' && (
          <AiAdvisor currentUser={currentUser} />
        )}



        {/* Render Admin Dashboard Tab */}
        {activeTab === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            onRefreshData={fetchPosts}
          />
        )}
      </main>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        currentUser={currentUser}
        onSubmitPost={handleCreatePost}
      />

      <PostDetailModal
        post={selectedPostDetail}
        onClose={() => setSelectedPostDetail(null)}
        currentUser={currentUser}
        onLike={handleLikePost}
        onSave={handleSavePost}
        onReport={handleReportPost}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUpdateUser={setCurrentUser}
        userPosts={userPostsList}
        savedPosts={savedPostsList}
        onOpenPostDetail={(p) => setSelectedPostDetail(p)}
      />

      <DipakStoryModal
        isOpen={isDipakStoryOpen}
        onClose={() => setIsDipakStoryOpen(false)}
      />
    </div>
  );
}
