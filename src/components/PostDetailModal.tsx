import React, { useState, useEffect } from 'react';
import {
  X,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Share2,
  Send,
  CornerDownRight,
  CheckCircle2,
  MapPin,
  Flag,
  Calendar,
  Eye,
  Tag as TagIcon
} from 'lucide-react';
import { Post, Comment, User } from '../types';

interface PostDetailModalProps {
  post: Post | null;
  onClose: () => void;
  currentUser: User;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onReport: (postId: string) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  onClose,
  currentUser,
  onLike,
  onSave,
  onReport,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingToCmtId, setReplyingToCmtId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    if (post) {
      fetchComments();
    }
  }, [post]);

  const fetchComments = async () => {
    if (!post) return;
    setLoadingComments(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`);
      const data = await res.json();
      if (data.success) {
        setComments(data.comments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !newCommentText.trim()) return;

    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: currentUser.id,
          content: newCommentText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComments([...comments, data.comment]);
        post.commentsCount += 1;
        setNewCommentText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    try {
      const res = await fetch(`/api/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: currentUser.id,
          content: replyText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComments(comments.map(c => {
          if (c.id === commentId) {
            return { ...c, replies: [...(c.replies || []), data.reply] };
          }
          return c;
        }));
        setReplyText('');
        setReplyingToCmtId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!post) return null;

  const isLiked = post.likedBy.includes(currentUser.id);
  const isSaved = post.savedBy.includes(currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#1f1f23] rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6B35]">
            <span>{post.category}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-normal">{post.date}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Author Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={post.authorAvatar}
                alt=""
                className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{post.authorName}</span>
                  {post.isVerifiedVendor && <CheckCircle2 className="w-4 h-4 text-[#FF6B35]" />}
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-[#FF6B35]">
                    {post.authorRole}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{post.location}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onReport(post.id)}
              className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Report post"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Full Text */}
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3 leading-snug">
              {post.title}
            </h1>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          </div>

          {/* Post Image */}
          {post.imageUrls && post.imageUrls.length > 0 && (
            <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 max-h-96 border border-slate-200 dark:border-slate-800">
              <img src={post.imageUrls[0]} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#FF6B35]">
              {post.tags.map((t, i) => (
                <span key={i}>#{t}</span>
              ))}
            </div>
          )}

          {/* Action Stats Bar */}
          <div className="flex items-center justify-between py-3 border-y border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onLike(post.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  isLiked ? 'bg-orange-50 dark:bg-orange-950/50 text-[#FF6B35]' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likesCount} Upvotes</span>
              </button>

              <button
                onClick={() => onSave(post.id)}
                className={`p-1.5 rounded-lg border ${
                  isSaved ? 'border-amber-400 bg-amber-50 text-amber-500' : 'border-slate-200 dark:border-slate-700 text-slate-400'
                }`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 text-slate-400 text-xs">
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.viewCount} views</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{comments.length} comments</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Community Discussion ({comments.length})</h3>

            {/* Add Comment Input Box */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Add your solution, advice, or perspective..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF6B35] text-white text-xs font-bold rounded-xl hover:bg-[#e05a2b] transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Comments Thread */}
            <div className="space-y-4 pt-4">
              {loadingComments ? (
                <div className="text-center py-6 text-xs text-slate-400">Loading discussion comments...</div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                  No comments yet. Be the first street food vendor to reply!
                </div>
              ) : (
                comments.map((cmt) => (
                  <div key={cmt.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <img src={cmt.authorAvatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{cmt.authorName}</span>
                            {cmt.isVerifiedVendor && <CheckCircle2 className="w-3 h-3 text-[#FF6B35]" />}
                            <span className="text-[10px] font-semibold text-slate-400">{cmt.authorRole}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{cmt.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-9">
                      {cmt.content}
                    </p>

                    {/* Comment Actions & Reply Trigger */}
                    <div className="flex items-center gap-3 pl-9 text-[11px] text-slate-500">
                      <button
                        onClick={() => setReplyingToCmtId(replyingToCmtId === cmt.id ? null : cmt.id)}
                        className="font-semibold text-[#FF6B35] hover:underline"
                      >
                        Reply
                      </button>
                    </div>

                    {/* Reply Input Form if active */}
                    {replyingToCmtId === cmt.id && (
                      <div className="pl-9 pt-2 flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                        <button
                          onClick={() => handleAddReply(cmt.id)}
                          className="px-3 py-1.5 bg-[#FF6B35] text-white text-xs font-semibold rounded-lg"
                        >
                          Send
                        </button>
                      </div>
                    )}

                    {/* Nested Replies */}
                    {cmt.replies && cmt.replies.length > 0 && (
                      <div className="pl-9 pt-2 space-y-2 border-t border-slate-200/60 dark:border-slate-800">
                        {cmt.replies.map((rep) => (
                          <div key={rep.id} className="flex items-start gap-2 text-xs bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                            <CornerDownRight className="w-3.5 h-3.5 text-[#FF6B35] shrink-0 mt-0.5" />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 dark:text-white">{rep.authorName}</span>
                                <span className="text-[10px] text-slate-400">{rep.timestamp}</span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 mt-0.5">{rep.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
