export type UserRole = 'Visitor' | 'Member' | 'Vendor' | 'Moderator' | 'Admin';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: UserRole;
  isVerifiedVendor: boolean;
  bio: string;
  location: string;
  shopName?: string;
  businessCategory?: string;
  totalPosts: number;
  followersCount: number;
  followingCount: number;
  joinedDate: string;
}

export type PostCategory =
  | 'Daily Business Problems'
  | 'Food Quality Problems'
  | 'Ingredient Price Updates'
  | 'Supplier Problems'
  | 'Customer Complaints'
  | 'Shop Management'
  | 'Government Rules & Licenses'
  | 'Street Food Business Ideas'
  | 'New Food Trends'
  | 'Success Stories'
  | 'Equipment Problems'
  | 'General Discussion';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  votedUserIds: string[];
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
}

export interface CommentReply {
  id: string;
  commentId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likesCount: number;
  likedBy: string[];
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  isVerifiedVendor: boolean;
  content: string;
  timestamp: string;
  likesCount: number;
  likedBy: string[];
  replies: CommentReply[];
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorRole: UserRole;
  isVerifiedVendor: boolean;
  isAnonymous: boolean;
  title: string;
  content: string;
  category: PostCategory;
  location: string;
  imageUrls: string[];
  tags: string[];
  date: string;
  timestamp: string;
  likesCount: number;
  likedBy: string[];
  commentsCount: number;
  savedBy: string[];
  reportedCount: number;
  viewCount: number;
  poll?: Poll;
  isPinned?: boolean;
}

export interface MenuItem {
  name: string;
  price: string;
  description?: string;
}

export interface ShopListing {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  description: string;
  location: string;
  category: string;
  photos: string[];
  openingHours: string;
  contactPhone: string;
  contactEmail: string;
  rating: number;
  reviewsCount: number;
  priceRange: string;
  menuItems: MenuItem[];
  isVerified: boolean;
  createdAt: string;
}

export interface PriceReport {
  id: string;
  item: string;
  category: string;
  price: number;
  unit: string;
  city: string;
  vendorId: string;
  vendorName: string;
  shopName: string;
  trend: 'up' | 'down' | 'stable';
  changeText: string;
  reportedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'reply' | 'follow' | 'announcement' | 'price_alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkId?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Official' | 'Rule Update' | 'Vendor Alert' | 'Event';
  createdAt: string;
  pinned: boolean;
  authorName: string;
}

export interface ModerationReport {
  id: string;
  postId: string;
  postTitle: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  timestamp: string;
}

export interface PlatformStats {
  totalMembers: number;
  totalVendors: number;
  totalPosts: number;
  activeDiscussions: number;
  reportedCount: number;
  safetyScore: number;
}
