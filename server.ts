import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize Gemini SDK on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Seed Initial Data
const SEED_DATA = {
  users: [
    {
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
    },
    {
      id: 'usr_admin',
      name: 'StreetBites Admin',
      username: 'admin_official',
      email: 'admin@streetbites.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'Admin',
      isVerifiedVendor: false,
      bio: 'Platform founder & advocate for street food entrepreneurs worldwide.',
      location: 'HQ',
      totalPosts: 30,
      followersCount: 2890,
      followingCount: 200,
      joinedDate: 'Jan 2024',
    },
  ],
  posts: [
    {
      id: 'post_101',
      authorId: 'usr_1',
      authorName: 'Dipak Owner',
      authorUsername: 'dipak_hotel_official',
      authorAvatar: '/public/assets/aistudio/WhatsApp_Image_2026-11-07_at_8.34.21_PM_15550186.jpeg',
      authorRole: 'Vendor',
      isVerifiedVendor: true,
      isAnonymous: false,
      title: 'Every corner has a story. Every flavour has a person: Welcome to Dipak Hotel & Restaurant!',
      content: 'Dipak Hotel and Restaurant (Simhat, 4 no Gate, Nadia) - Serving traditional & affordable Veg & Non-Veg meals (Breakfast, Lunch, Dinner, Bengali, Chinese, Indian, Fastfood & Biriyani). Behind every plate is a story of community, hard work, and delicious food.',
      category: 'Food Quality Problems',
      location: 'Simhat, Nadia',
      imageUrls: ['/public/assets/aistudio/WhatsApp_Image_2026-11-07_at_8.34.21_PM_15550186.jpeg'],
      tags: ['DipakHotel', 'BiriyaniSpecial', 'BengaliCuisine', 'NadiaFood'],
      date: 'Today at 08:30 AM',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likesCount: 48,
      likedBy: ['usr_admin'],
      commentsCount: 9,
      savedBy: ['usr_admin'],
      reportedCount: 0,
      viewCount: 510,
      isPinned: true,
      poll: {
        id: 'poll_1',
        question: 'What is your most popular menu category during evening hours?',
        options: [
          { id: 'opt_1', text: 'Chicken / Mutton Biriyani', votes: 54, votedUserIds: [] },
          { id: 'opt_2', text: 'Chinese & Chowmein', votes: 32, votedUserIds: [] },
          { id: 'opt_3', text: 'Bengali Rice & Fish Curry', votes: 41, votedUserIds: [] },
          { id: 'opt_4', text: 'Fastfood & Rolls', votes: 19, votedUserIds: [] },
        ],
        totalVotes: 146,
      },
    },
  ],
  comments: [
    {
      id: 'cmt_1',
      postId: 'post_101',
      authorId: 'usr_admin',
      authorName: 'StreetBites Admin',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      authorRole: 'Admin',
      isVerifiedVendor: false,
      content: 'Dipak Hotel & Restaurant is a landmark in Simhat! Your biriyani and Bengali thali quality is top tier.',
      timestamp: 'Today at 09:10 AM',
      likesCount: 15,
      likedBy: ['usr_1'],
      replies: [
        {
          id: 'rep_1',
          commentId: 'cmt_1',
          authorId: 'usr_1',
          authorName: 'Dipak Owner',
          authorAvatar: '/public/assets/aistudio/WhatsApp_Image_2026-11-07_at_8.34.21_PM_15550186.jpeg',
          content: 'Thank you Admin! Always welcoming food lovers at Simhat 4 no Gate.',
          timestamp: 'Today at 09:45 AM',
          likesCount: 6,
          likedBy: ['usr_admin'],
        },
      ],
    },
  ],
  shops: [
    {
      id: 'shop_1',
      name: 'Dipak Hotel & Restaurant',
      ownerId: 'usr_1',
      ownerName: 'Dipak Owner',
      description: 'Veg & Non-Veg dining specializing in Breakfast, Lunch, Dinner, Bengali traditional meals, Chinese, Indian, Fastfood, and Biriyani at Simhat 4 no Gate, Nadia. Every corner has a story. Every flavour has a person.',
      location: 'Simhat, 4 no Gate, Nadia',
      category: 'Bengali & Multi-Cuisine',
      photos: [
        '/public/assets/aistudio/WhatsApp_Image_2026-11-07_at_8.34.21_PM_15550186.jpeg',
      ],
      openingHours: 'Mon-Sun: 7:00 AM - 11:30 PM',
      contactPhone: '96472 78105 / 97333 32557',
      contactEmail: 'contact@dipakrestaurant.com',
      rating: 4.95,
      reviewsCount: 310,
      priceRange: '₹₹ (₹80 - ₹300)',
      menuItems: [
        { name: 'Chicken Biriyani Special', price: '₹140', description: 'Fragrant basmati rice with tender chicken piece & boiled egg' },
        { name: 'Bengali Fish Thali', price: '₹110', description: 'Steamed rice, dal, sabzi, fish curry, and papad' },
        { name: 'Chilli Chicken & Chowmein', price: '₹130', description: 'Wok-tossed noodles with spicy gravy chicken' },
        { name: 'Veg Breakfast Combo', price: '₹50', description: 'Hot puris or paratha with sabzi & sweets' },
      ],
      isVerified: true,
      createdAt: '2024-10-15',
    },
  ],
  priceReports: [
    {
      id: 'pr_1',
      item: 'Basmati Rice (Bulk 25kg)',
      category: 'Grains & Rice',
      price: 1850.0,
      unit: '25kg bag',
      city: 'Nadia, WB',
      vendorId: 'usr_1',
      vendorName: 'Dipak Owner',
      shopName: 'Dipak Hotel & Restaurant',
      trend: 'stable',
      changeText: 'Stable wholesale rate for biriyani',
      reportedAt: 'Today at 08:30 AM',
    },
    {
      id: 'pr_4',
      item: 'Cooking Mustard Oil (15L Tin)',
      category: 'Oils & Fats',
      price: 2150.0,
      unit: '15L tin',
      city: 'Nadia, WB',
      vendorId: 'usr_1',
      vendorName: 'Dipak Owner',
      shopName: 'Dipak Hotel & Restaurant',
      trend: 'up',
      changeText: '+4% wholesale hike',
      reportedAt: '3 days ago',
    },
  ],
  announcements: [
    {
      id: 'anc_1',
      title: 'Local Food Festival & Health Hygiene Certification Drive in Nadia',
      content: 'All restaurant and hotel owners in Simhat and Nadia region are invited to participate in the upcoming local food hygiene workshop and digital licensing camp.',
      category: 'Official',
      createdAt: '2 days ago',
      pinned: true,
      authorName: 'StreetBites Admin',
    },
  ],
  notifications: [
    {
      id: 'notif_1',
      userId: 'usr_1',
      type: 'like',
      title: 'New Like on your post',
      message: 'Admin liked your post: "Fresh spices & mutton/quality update..."',
      timestamp: '10 min ago',
      read: false,
      linkId: 'post_101',
    },
  ],
  moderationReports: [],
};

// Data Store in Memory
let dbData: any = { ...SEED_DATA };

// --- API ROUTES ---

// 1. GET Current User Profile / Select Active Role User
app.get('/api/users/current', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'usr_1';
  let user = dbData.users.find((u: any) => u.id === userId);
  if (!user) {
    user = {
      id: userId,
      name: 'Corner Stories User',
      username: 'user_' + userId.substring(0, 6),
      email: 'user@cornerstories.com',
      avatar: '/public/assets/aistudio/WhatsApp_Image_2026-11-07_at_8.34.21_PM_15550186.jpeg',
      role: 'Member',
      isVerifiedVendor: false,
      bio: 'Food enthusiast & community member.',
      location: 'Local Community',
      totalPosts: 0,
      followersCount: 0,
      followingCount: 0,
      joinedDate: 'Nov 2026',
    };
    dbData.users.push(user);
  }
  res.json({ success: true, user });
});

// Switch role or current logged-in demo user
app.post('/api/users/switch-role', (req: Request, res: Response) => {
  const { role, userId } = req.body;
  let targetUser = dbData.users.find((u: any) => u.id === userId);
  if (!targetUser) {
    targetUser = {
      id: userId || 'usr_' + Date.now(),
      name: 'Corner Stories User',
      username: 'user_active',
      email: 'user@cornerstories.com',
      avatar: '/public/assets/aistudio/WhatsApp_Image_2026-11-07_at_8.34.21_PM_15550186.jpeg',
      role: role || 'Member',
      isVerifiedVendor: role === 'Vendor',
      bio: '',
      location: 'Local',
      totalPosts: 0,
      followersCount: 0,
      followingCount: 0,
      joinedDate: 'Nov 2026',
    };
    dbData.users.push(targetUser);
  }
  if (role) {
    targetUser.role = role;
    targetUser.isVerifiedVendor = role === 'Vendor';
  }
  res.json({ success: true, user: targetUser });
});

// Update Profile
app.put('/api/users/profile', (req: Request, res: Response) => {
  const { userId, name, bio, location, shopName, businessCategory, avatar, role } = req.body;
  let user = dbData.users.find((u: any) => u.id === userId);
  if (!user) {
    user = {
      id: userId || 'usr_' + Date.now(),
      name: name || 'Corner Stories User',
      username: (name || 'user').toLowerCase().replace(/\s+/g, '_'),
      email: 'user@cornerstories.com',
      avatar: avatar || '/public/assets/aistudio/WhatsApp_Image_2026-11-07_at_8.34.21_PM_15550186.jpeg',
      role: role || 'Member',
      isVerifiedVendor: role === 'Vendor',
      bio: bio || '',
      location: location || '',
      shopName: shopName || '',
      businessCategory: businessCategory || 'General',
      totalPosts: 0,
      followersCount: 0,
      followingCount: 0,
      joinedDate: 'Nov 2026',
    };
    dbData.users.push(user);
  } else {
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (shopName !== undefined) user.shopName = shopName;
    if (businessCategory !== undefined) user.businessCategory = businessCategory;
    if (avatar) user.avatar = avatar;
    if (role) {
      user.role = role;
      user.isVerifiedVendor = role === 'Vendor';
    }
  }

  res.json({ success: true, user });
});

// 2. POSTS ROUTES
app.get('/api/posts', (req: Request, res: Response) => {
  const { category, search, filter, location } = req.query;
  let result = [...dbData.posts];

  if (category && category !== 'All') {
    result = result.filter((p: any) => p.category === category);
  }

  if (location && location !== 'All Locations') {
    result = result.filter((p: any) => p.location.toLowerCase().includes((location as string).toLowerCase()));
  }

  if (search) {
    const q = (search as string).toLowerCase();
    result = result.filter((p: any) =>
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.tags.some((t: any) => t.toLowerCase().includes(q)) ||
      p.authorName.toLowerCase().includes(q)
    );
  }

  if (filter === 'trending') {
    result.sort((a: any, b: any) => (b.likesCount + b.commentsCount * 2) - (a.likesCount + a.commentsCount * 2));
  } else if (filter === 'today') {
    result = result.filter((p: any) => p.date.includes('Today') || p.date.includes('min') || p.date.includes('hour'));
  } else if (filter === 'week') {
    result.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } else {
    // default timestamp sort
    result.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Ensure pinned posts stay at top if overall view
  const pinned = result.filter((p: any) => p.isPinned);
  const unpinned = result.filter((p: any) => !p.isPinned);

  res.json({ success: true, posts: [...pinned, ...unpinned] });
});

// Create Post
app.post('/api/posts', (req: Request, res: Response) => {
  const { authorId, title, content, category, location, imageUrls, tags, isAnonymous, pollQuestion, pollOptions } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ success: false, error: 'Title, content, and category are required' });
  }

  const author = dbData.users.find((u: any) => u.id === authorId) || dbData.users[0];

  let pollData;
  if (pollQuestion && Array.isArray(pollOptions) && pollOptions.length >= 2) {
    pollData = {
      id: `poll_${Date.now()}`,
      question: pollQuestion,
      options: pollOptions.map((optText: string, idx: number) => ({
        id: `opt_${Date.now()}_${idx}`,
        text: optText,
        votes: 0,
        votedUserIds: [],
      })),
      totalVotes: 0,
    };
  }

  const newPost = {
    id: `post_${Date.now()}`,
    authorId: isAnonymous ? 'usr_anon' : author.id,
    authorName: isAnonymous ? 'Anonymous Vendor' : author.name,
    authorUsername: isAnonymous ? 'anonymous_vendor' : author.username,
    authorAvatar: isAnonymous ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' : author.avatar,
    authorRole: isAnonymous ? ('Member' as const) : author.role,
    isVerifiedVendor: isAnonymous ? false : author.isVerifiedVendor,
    isAnonymous: !!isAnonymous,
    title,
    content,
    category,
    location: location || author.location || 'General Community',
    imageUrls: Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls : ['/src/assets/images/vendor_tacos_1793713590855.jpg'],
    tags: Array.isArray(tags) ? tags : ['StreetFood', category.replace(/\s+/g, '')],
    date: 'Just now',
    timestamp: new Date().toISOString(),
    likesCount: 0,
    likedBy: [],
    commentsCount: 0,
    savedBy: [],
    reportedCount: 0,
    viewCount: 1,
    poll: pollData,
  };

  dbData.posts.unshift(newPost);
  author.totalPosts = (author.totalPosts || 0) + 1;

  res.json({ success: true, post: newPost });
});

// Like / Upvote Post
app.post('/api/posts/:id/like', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;
  const post = dbData.posts.find((p: any) => p.id === id);
  if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

  const uId = userId || 'usr_1';
  const hasLiked = post.likedBy.includes(uId);

  if (hasLiked) {
    post.likedBy = post.likedBy.filter((uid: any) => uid !== uId);
    post.likesCount = Math.max(0, post.likesCount - 1);
  } else {
    post.likedBy.push(uId);
    post.likesCount += 1;

    // Add notification if not self-like
    if (post.authorId !== uId && !post.isAnonymous) {
      dbData.notifications.unshift({
        id: `notif_${Date.now()}`,
        userId: post.authorId,
        type: 'like',
        title: 'New Upvote on your post',
        message: `Someone upvoted your post: "${post.title.substring(0, 45)}..."`,
        timestamp: 'Just now',
        read: false,
        linkId: post.id,
      });
    }
  }

  res.json({ success: true, likesCount: post.likesCount, likedBy: post.likedBy });
});

// Save Post
app.post('/api/posts/:id/save', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;
  const post = dbData.posts.find((p: any) => p.id === id);
  if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

  const uId = userId || 'usr_1';
  const hasSaved = post.savedBy.includes(uId);

  if (hasSaved) {
    post.savedBy = post.savedBy.filter((uid: any) => uid !== uId);
  } else {
    post.savedBy.push(uId);
  }

  res.json({ success: true, savedBy: post.savedBy });
});

// Report Post
app.post('/api/posts/:id/report', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, reason } = req.body;
  const post = dbData.posts.find((p: any) => p.id === id);
  if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

  post.reportedCount += 1;
  const user = dbData.users.find((u: any) => u.id === (userId || 'usr_1')) || dbData.users[0];

  dbData.moderationReports.unshift({
    id: `rep_${Date.now()}`,
    postId: post.id,
    postTitle: post.title,
    reporterId: user.id,
    reporterName: user.name,
    reason: reason || 'Inappropriate content or guideline breach',
    status: 'pending',
    timestamp: 'Just now',
  });

  res.json({ success: true, message: 'Report submitted for community moderator review.' });
});

// 3. COMMENTS ROUTES
app.get('/api/posts/:id/comments', (req: Request, res: Response) => {
  const { id } = req.params;
  const comments = dbData.comments.filter((c: any) => c.postId === id);
  res.json({ success: true, comments });
});

app.post('/api/posts/:id/comments', (req: Request, res: Response) => {
  const { id } = req.params;
  const { authorId, content } = req.body;
  if (!content) return res.status(400).json({ success: false, error: 'Comment content is required' });

  const post = dbData.posts.find((p: any) => p.id === id);
  if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

  const author = dbData.users.find((u: any) => u.id === (authorId || 'usr_1')) || dbData.users[0];

  const newComment = {
    id: `cmt_${Date.now()}`,
    postId: id,
    authorId: author.id,
    authorName: author.name,
    authorAvatar: author.avatar,
    authorRole: author.role,
    isVerifiedVendor: author.isVerifiedVendor,
    content,
    timestamp: 'Just now',
    likesCount: 0,
    likedBy: [],
    replies: [],
  };

  dbData.comments.push(newComment);
  post.commentsCount += 1;

  // Add notification
  if (post.authorId !== author.id && !post.isAnonymous) {
    dbData.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: post.authorId,
      type: 'comment',
      title: 'New Comment on your discussion',
      message: `${author.name} commented on "${post.title.substring(0, 40)}..."`,
      timestamp: 'Just now',
      read: false,
      linkId: post.id,
    });
  }

  res.json({ success: true, comment: newComment });
});

// Reply to comment
app.post('/api/comments/:commentId/replies', (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { authorId, content } = req.body;
  if (!content) return res.status(400).json({ success: false, error: 'Reply content required' });

  const comment = dbData.comments.find((c: any) => c.id === commentId);
  if (!comment) return res.status(404).json({ success: false, error: 'Comment not found' });

  const author = dbData.users.find((u: any) => u.id === (authorId || 'usr_1')) || dbData.users[0];

  const newReply = {
    id: `rep_${Date.now()}`,
    commentId,
    authorId: author.id,
    authorName: author.name,
    authorAvatar: author.avatar,
    content,
    timestamp: 'Just now',
    likesCount: 0,
    likedBy: [],
  };

  comment.replies.push(newReply);
  res.json({ success: true, reply: newReply });
});

// Vote in Poll
app.post('/api/posts/:id/poll/vote', (req: Request, res: Response) => {
  const { id } = req.params;
  const { optionId, userId } = req.body;
  const post = dbData.posts.find((p: any) => p.id === id);
  if (!post || !post.poll) return res.status(404).json({ success: false, error: 'Poll not found' });

  const uId = userId || 'usr_1';

  // Check if user already voted in this poll
  post.poll.options.forEach((opt: any) => {
    opt.votedUserIds = opt.votedUserIds.filter((uid: any) => uid !== uId);
  });

  const selectedOpt = post.poll.options.find((opt: any) => opt.id === optionId);
  if (selectedOpt) {
    selectedOpt.votedUserIds.push(uId);
  }

  // Recalculate votes
  let total = 0;
  post.poll.options.forEach((opt: any) => {
    opt.votes = opt.votedUserIds.length;
    total += opt.votes;
  });
  post.poll.totalVotes = total;
  post.poll.userVotedOptionId = optionId;

  res.json({ success: true, poll: post.poll });
});

// 4. SHOPS DIRECTORY ROUTES
app.get('/api/shops', (req: Request, res: Response) => {
  const { category, search, location } = req.query;
  let result = [...dbData.shops];

  if (category && category !== 'All Categories') {
    result = result.filter((s: any) => s.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (location && location !== 'All Locations') {
    result = result.filter((s: any) => s.location.toLowerCase().includes((location as string).toLowerCase()));
  }

  if (search) {
    const q = (search as string).toLowerCase();
    result = result.filter((s: any) =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q) ||
      s.menuItems.some((m: any) => m.name.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, shops: result });
});

app.post('/api/shops', (req: Request, res: Response) => {
  const { name, ownerId, description, location, category, photos, openingHours, contactPhone, contactEmail, priceRange, menuItems } = req.body;
  if (!name || !description || !location || !category) {
    return res.status(400).json({ success: false, error: 'Name, description, location, and category are required' });
  }

  const owner = dbData.users.find((u: any) => u.id === (ownerId || 'usr_1')) || dbData.users[0];

  const newShop = {
    id: `shop_${Date.now()}`,
    name,
    ownerId: owner.id,
    ownerName: owner.name,
    description,
    location,
    category,
    photos: Array.isArray(photos) && photos.length > 0 ? photos : ['/src/assets/images/vendor_tacos_1793713590855.jpg'],
    openingHours: openingHours || 'Mon-Sun: 4:00 PM - 11:00 PM',
    contactPhone: contactPhone || '(555) 019-2831',
    contactEmail: contactEmail || `${owner.username}@streetbites.com`,
    rating: 5.0,
    reviewsCount: 1,
    priceRange: priceRange || '$ ($3 - $10)',
    menuItems: Array.isArray(menuItems) && menuItems.length > 0 ? menuItems : [{ name: 'Special Street Plate', price: '$8.00', description: 'Chef daily special' }],
    isVerified: true,
    createdAt: new Date().toISOString().split('T')[0],
  };

  dbData.shops.unshift(newShop);
  owner.shopName = name;
  owner.isVerifiedVendor = true;
  owner.role = 'Vendor';

  res.json({ success: true, shop: newShop });
});

// 5. INGREDIENT PRICE TRACKER ROUTES
app.get('/api/prices', (req: Request, res: Response) => {
  const { city, search } = req.query;
  let result = [...dbData.priceReports];

  if (city && city !== 'All Cities') {
    result = result.filter((p: any) => p.city.toLowerCase().includes((city as string).toLowerCase()));
  }

  if (search) {
    const q = (search as string).toLowerCase();
    result = result.filter((p: any) => p.item.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  res.json({ success: true, prices: result });
});

app.post('/api/prices', (req: Request, res: Response) => {
  const { item, category, price, unit, city, vendorId, trend, changeText } = req.body;
  if (!item || !price || !unit || !city) {
    return res.status(400).json({ success: false, error: 'Item, price, unit, and city are required' });
  }

  const vendor = dbData.users.find((u: any) => u.id === (vendorId || 'usr_1')) || dbData.users[0];

  const newPriceReport = {
    id: `pr_${Date.now()}`,
    item,
    category: category || 'General Supplies',
    price: parseFloat(price),
    unit,
    city,
    vendorId: vendor.id,
    vendorName: vendor.name,
    shopName: vendor.shopName || 'Street Food Cart',
    trend: trend || 'stable',
    changeText: changeText || 'Reported by community vendor',
    reportedAt: 'Just now',
  };

  dbData.priceReports.unshift(newPriceReport);

  res.json({ success: true, priceReport: newPriceReport });
});

// 6. ANNOUNCEMENTS ROUTES
app.get('/api/announcements', (req: Request, res: Response) => {
  res.json({ success: true, announcements: dbData.announcements });
});

app.post('/api/announcements', (req: Request, res: Response) => {
  const { title, content, category, pinned, authorName } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, error: 'Title and content are required' });
  }

  const newAnnouncement = {
    id: `anc_${Date.now()}`,
    title,
    content,
    category: category || 'Official',
    createdAt: 'Just now',
    pinned: !!pinned,
    authorName: authorName || 'StreetBites Admin',
  };

  dbData.announcements.unshift(newAnnouncement);
  res.json({ success: true, announcement: newAnnouncement });
});

// 7. NOTIFICATIONS ROUTES
app.get('/api/notifications', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'usr_1';
  const notifs = dbData.notifications.filter((n: any) => n.userId === userId || n.userId === 'all');
  const unreadCount = notifs.filter((n: any) => !n.read).length;
  res.json({ success: true, notifications: notifs, unreadCount });
});

app.post('/api/notifications/read-all', (req: Request, res: Response) => {
  const userId = (req.body.userId as string) || 'usr_1';
  dbData.notifications.forEach((n: any) => {
    if (n.userId === userId || n.userId === 'all') n.read = true;
  });
  res.json({ success: true });
});

// 8. ADMIN DASHBOARD & MODERATION ROUTES
app.get('/api/admin/stats', (req: Request, res: Response) => {
  const stats = {
    totalMembers: dbData.users.length,
    totalVendors: dbData.users.filter((u: any) => u.role === 'Vendor').length,
    totalPosts: dbData.posts.length,
    activeDiscussions: dbData.posts.filter((p: any) => p.commentsCount > 0).length,
    reportedCount: dbData.moderationReports.filter((r: any) => r.status === 'pending').length,
    safetyScore: 98,
  };
  res.json({ success: true, stats });
});

app.get('/api/admin/reports', (req: Request, res: Response) => {
  res.json({ success: true, reports: dbData.moderationReports });
});

app.post('/api/admin/reports/:id/action', (req: Request, res: Response) => {
  const { id } = req.params;
  const { action } = req.body; // 'approve', 'dismiss', 'delete_post'
  const report = dbData.moderationReports.find((r: any) => r.id === id);
  if (!report) return res.status(404).json({ success: false, error: 'Report not found' });

  if (action === 'delete_post') {
    dbData.posts = dbData.posts.filter((p: any) => p.id !== report.postId);
    report.status = 'resolved';
  } else if (action === 'dismiss') {
    report.status = 'dismissed';
  } else {
    report.status = 'resolved';
  }

  res.json({ success: true, report });
});

app.get('/api/admin/users', (req: Request, res: Response) => {
  res.json({ success: true, users: dbData.users });
});

app.post('/api/admin/users/:id/role', (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, isVerifiedVendor } = req.body;
  const user = dbData.users.find((u: any) => u.id === id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });

  if (role) user.role = role;
  if (isVerifiedVendor !== undefined) user.isVerifiedVendor = isVerifiedVendor;

  res.json({ success: true, user });
});

// 9. AI ADVISOR ENDPOINT (Server-Side Gemini API Call)
app.post('/api/ai-advisor', async (req: Request, res: Response) => {
  try {
    const { prompt, topic, vendorContext } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const systemInstruction = `You are "StreetBites Copilot", an expert street food business advisor, culinary economist, and food safety consultant.
Your mission is to provide realistic, empathetic, highly practical, and actionable advice specifically tailored for small street food stall owners, food truck operators, night market vendors, and mobile catering entrepreneurs.

Topics you assist with:
1. **Menu Pricing & Margin Calculations**: Suggest pricing structures, portion control, and combo deal strategies based on ingredient price spikes.
2. **Food Safety & Licensing**: Guidance on temp control, health inspector prep, grease trap upkeep, charcoal smoke reduction, hygiene rules.
3. **Equipment Troubleshooting**: Flat-top grill seasoning, fryer oil longevity, portable generator power load, cooling ice storage.
4. **Crowd Attraction & Marketing**: Low-cost promotional signs, QR loyalty setups, social media teaser photos, menu board clarity.
5. **Supplier Negotiation**: Practical scripts for negotiating wholesale prices with meat and produce suppliers.

Rules:
- Give concise, structured answers with bullet points or bold steps.
- Avoid generic corporate jargon. Speak like an experienced veteran food truck chef giving advice to a fellow stall owner.
- Always include 1 practical tip the vendor can apply immediately today.`;

    const modelName = 'gemini-3.8-flash';
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Vendor Question (${topic || 'General Street Food Business'}):\n"${prompt}"\n\nVendor Context: ${vendorContext || 'Street Food Vendor in city center market.'}`,
      config: {
        systemInstruction,
      },
    });

    const adviceText = response.text || 'Unable to generate advice at this moment. Please try again.';

    res.json({
      success: true,
      advice: adviceText,
      topic: topic || 'General Advice',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Gemini API AI Advisor Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI advice from Gemini server agent.',
      details: error.message,
    });
  }
});

// Create Vite server in middleware mode and configure standard port
async function startServer() {
  const port = process.env.PORT || 3000;

  // Mount Vite development server middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`StreetBites Server running at http://localhost:${port}`);
  });
}

startServer();
