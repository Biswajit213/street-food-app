import React, { useState } from 'react';
import {
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Share2,
  Flag,
  CheckCircle2,
  Eye,
  MapPin,
  Tag as TagIcon,
  User as UserIcon,
  Pin,
  Vote,
  Check
} from 'lucide-react';
import { Post, User } from '../types';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onReport: (postId: string) => void;
  onOpenDetail: (post: Post) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onSelectCategory: (category: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onLike,
  onSave,
  onReport,
  onOpenDetail,
  onVotePoll,
  onSelectCategory,
}) => {
  const [shareCopied, setShareCopied] = useState(false);
  const isLiked = post.likedBy.includes(currentUser.id);
  const isSaved = post.savedBy.includes(currentUser.id);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <article className="bg-white dark:bg-[#1c1c1f] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all mb-4 overflow-hidden group">
      {/* Pinned Post Header Bar if pinned */}
      {post.isPinned && (
        <div className="bg-orange-50 dark:bg-orange-950/40 border-b border-orange-100 dark:border-orange-900/50 px-4 py-1.5 flex items-center gap-2 text-xs font-semibold text-[#FF6B35]">
          <Pin className="w-3.5 h-3.5" />
          <span>Pinned Community Announcement</span>
        </div>
      )}

      <div className="p-4 sm:p-6">
        {/* Author Header & Unboxed Metadata */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-white hover:underline cursor-pointer">
                  {post.authorName}
                </span>
                {post.isVerifiedVendor && (
                  <span title="Verified Food Vendor">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B35] shrink-0" />
                  </span>
                )}
                {post.authorRole === 'Vendor' && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-[#FF6B35]">
                    Vendor
                  </span>
                )}
                {post.authorRole === 'Moderator' && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                    Mod
                  </span>
                )}
              </div>

              {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                <button
                  onClick={() => onSelectCategory(post.category)}
                  className="font-medium text-[#FF6B35] hover:underline cursor-pointer"
                >
                  {post.category}
                </button>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {post.location}
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span>{post.date}</span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onReport(post.id);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Report inappropriate post"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>

        {/* Post Title */}
        <h2
          onClick={() => onOpenDetail(post)}
          className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug hover:text-[#FF6B35] dark:hover:text-[#FF6B35] cursor-pointer transition-colors"
        >
          {post.title}
        </h2>

        {/* Post Content Excerpt */}
        <p
          onClick={() => onOpenDetail(post)}
          className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-4 line-clamp-3 leading-relaxed cursor-pointer"
        >
          {post.content}
        </p>

        {/* Attached Post Images */}
        {post.imageUrls && post.imageUrls.length > 0 && (
          <div
            onClick={() => onOpenDetail(post)}
            className="mb-4 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 max-h-80 cursor-pointer border border-slate-200/60 dark:border-slate-800"
          >
            <img
              src={post.imageUrls[0]}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
            />
          </div>
        )}

        {/* Embedded Community Poll if present */}
        {post.poll && (
          <div className="mb-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-900 dark:text-white">
              <Vote className="w-4 h-4 text-[#FF6B35]" />
              <span>{post.poll.question}</span>
            </div>

            <div className="space-y-2">
              {post.poll.options.map((opt) => {
                const isVoted = opt.votedUserIds?.includes(currentUser.id);
                const percent = post.poll?.totalVotes
                  ? Math.round((opt.votes / post.poll.totalVotes) * 100)
                  : 0;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onVotePoll(post.id, opt.id)}
                    className={`w-full text-left relative overflow-hidden rounded-lg p-2.5 text-xs transition-all border ${
                      isVoted
                        ? 'border-[#FF6B35] bg-orange-50/60 dark:bg-orange-950/40 text-slate-900 dark:text-white font-semibold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {/* Vote progress fill bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-orange-200/50 dark:bg-orange-900/30 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isVoted && <Check className="w-3.5 h-3.5 text-[#FF6B35]" />}
                        <span>{opt.text}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500 font-semibold">{percent}% ({opt.votes})</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 text-[11px] text-slate-400 text-right">
              {post.poll.totalVotes} total votes
            </div>
          </div>
        )}

        {/* Tags list as unboxed inline text */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
            <TagIcon className="w-3 h-3 text-slate-400" />
            {post.tags.map((tag, idx) => (
              <span key={idx} className="hover:text-[#FF6B35] cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Footer Action Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Upvote Button */}
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                isLiked
                  ? 'bg-orange-50 dark:bg-orange-950/50 text-[#FF6B35] font-semibold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-[#FF6B35]' : ''}`} />
              <span className="tabular-nums">{post.likesCount}</span>
            </button>

            {/* Comment Count Button */}
            <button
              onClick={() => onOpenDetail(post)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-600 dark:text-slate-400"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="tabular-nums">{post.commentsCount}</span>
              <span className="hidden sm:inline">Comments</span>
            </button>

            {/* Save Bookmark Button */}
            <button
              onClick={() => onSave(post.id)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'
              }`}
              title={isSaved ? 'Saved to bookmarks' : 'Save post'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* View Counter */}
            <span className="flex items-center gap-1 text-[11px] text-slate-400 hidden sm:flex">
              <Eye className="w-3.5 h-3.5" />
              <span className="tabular-nums">{post.viewCount}</span>
            </span>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-[11px]">{shareCopied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
