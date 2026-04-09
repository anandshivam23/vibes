import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Share2, MoreHorizontal, Pencil, Trash2, Check, X, Send, CornerDownRight, ThumbsDown, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const MAX_LINES = 3;
const CHAR_THRESHOLD = 180;

export default function TweetCard({ tweet, index, onDelete, onUpdate, isReply = false }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [likesCount, setLikesCount] = useState(tweet.likes || tweet.likesCount || 0);
  const [isLiked, setIsLiked] = useState(tweet?.isLiked || false);
  const [isDisliked, setIsDisliked] = useState(tweet?.isDisliked || false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(tweet.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef(null);


  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  const isOwner = currentUser && (
    currentUser._id === (tweet.owner?.id || tweet.owner?._id || tweet.ownerDetails?._id || tweet.owner) ||
    currentUser._id?.toString() === (tweet.owner?.id || tweet.owner?._id || tweet.ownerDetails?._id || tweet.owner)?.toString()
  );
  const isLong = tweet.content && tweet.content.length > CHAR_THRESHOLD;

  useEffect(() => {
    setLikesCount(tweet.likes || tweet.likesCount || 0);
  }, [tweet.likes, tweet.likesCount]);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLike = async () => {
    if (!currentUser) return toast.error('Please login to interact');
    const originalLiked = isLiked;
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
    setLikesCount(prev => originalLiked ? Math.max(0, prev - 1) : prev + 1);
    try {
      await api.post(`/likes/toggle/t/${tweet.id || tweet._id}`);
    } catch (err) {
      setIsLiked(originalLiked);
      setLikesCount(tweet.likes || tweet.likesCount || 0);
      toast.error('Failed to toggle like');
    }
  };

  const handleDislike = async () => {
    if (!currentUser) return toast.error('Please login to interact');
    const originalDisliked = isDisliked;
    setIsDisliked(!isDisliked);
    if (isLiked) { setIsLiked(false); setLikesCount(prev => Math.max(0, prev - 1)); }
    try {
      await api.post(`/dislikes/toggle/t/${tweet.id || tweet._id}`);
    } catch (err) {
      setIsDisliked(originalDisliked);
      toast.error('Failed to toggle dislike');
    }
  };

  const handleDelete = async () => {
    setIsMenuOpen(false);
    if (!window.confirm('Delete this tweet?')) return;
    try {
      await api.delete(`/tweets/${tweet.id || tweet._id}`);
      toast.success('Tweet deleted');
      onDelete?.(tweet.id || tweet._id);
    } catch (e) {
      toast.error('Failed to delete tweet');
    }
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    setIsSaving(true);
    try {
      await api.patch(`/tweets/${tweet.id || tweet._id}`, { content: editContent });
      toast.success('Tweet updated');
      onUpdate?.(tweet.id || tweet._id, editContent);
      setIsEditing(false);
    } catch (e) {
      toast.error('Failed to update tweet');
    } finally {
      setIsSaving(false);
    }
  };

  const fetchReplies = async () => {
    if (showReplies) { setShowReplies(false); return; }
    setIsLoadingReplies(true);
    try {
      const res = await api.get(`/tweets/${tweet.id || tweet._id}/replies`);
      setReplies(res.data.data || []);
      setShowReplies(true);
    } catch (err) {
      toast.error('Failed to load replies');
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const handlePostReply = async () => {
    if (!replyContent.trim() || !currentUser) return;
    setIsSubmittingReply(true);
    try {
      const res = await api.post('/tweets', {
        content: replyContent,
        parentTweet: tweet.id || tweet._id,
        type: tweet.type || 'tweet'
      });
      toast.success('Reply posted!');
      setReplyContent('');
      setShowReplyInput(false);
      setReplies(prev => [...prev, res.data.data]);
      setShowReplies(true);
    } catch (err) {
      toast.error('Failed to post reply');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const ownerData = tweet.ownerDetails || tweet.owner;
  const displayContent = isExpanded || !isLong
    ? tweet.content
    : tweet.content.slice(0, CHAR_THRESHOLD) + '…';

    const formatDate = (date) => {
      if (!date) return 'Just now';
      const d = new Date(date);
      if (isNaN(d.getTime())) return 'Recently';
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
      <div className={`flex flex-col w-full h-full ${isReply ? 'mt-1' : 'mb-px'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.03 }}
          className={`relative group transition-all duration-300 overflow-hidden flex flex-col h-full
                     ${isReply ? 'ml-0 p-0 pl-3 md:pl-6' : 'bg-surface border border-text-main/5 p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-primary/20'}`}
        >
          <div className="flex gap-4 md:gap-10 h-full flex-1">
            {}
            <div className="flex flex-col items-center flex-shrink-0 relative">
              <Link to={`/profile/${ownerData?.username}`} className="relative z-10">
                <div className={`rounded-xl md:rounded-2xl overflow-hidden border border-text-main/10 group-hover:border-primary/40 transition-all 
                               ${isReply ? 'w-8 h-8 md:w-10 h-10' : 'w-12 h-12 md:w-14 h-14'}`}>
                  <img src={ownerData?.avatar} alt={ownerData?.username} className="w-full h-full object-cover" />
                </div>
                {!isReply && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />}
              </Link>
              
              {}
              {((showReplies && replies.length > 0) || isReply) && (
                <div className={`absolute top-0 bottom-0 w-px bg-text-main/10 group-hover:bg-primary/20 transition-colors -z-10
                                ${isReply ? 'h-full' : 'top-14 h-[5000px]'}`} />
              )}

              {}
              {isReply && (
                <div className="absolute -left-4 top-5 w-4 h-px bg-text-main/10" />
              )}
            </div>

            {}
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              {}
              <div className="flex items-center justify-between">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Link to={`/profile/${ownerData?.username}`} className="font-display font-bold text-sm md:text-base text-text-main hover:text-primary transition-colors truncate">
                      {ownerData?.fullName || ownerData?.username}
                    </Link>
                    <span className="text-xs text-text-muted/60 font-medium truncate">@{ownerData?.username}</span>
                    <span className="text-[10px] text-text-muted/40 font-bold uppercase tracking-tighter">· {formatDate(tweet.createdAt || tweet.createdAtRaw)}</span>
                  </div>
                </div>

                {isOwner && (
                  <div className="relative" ref={menuRef}>
                    <button onClick={() => setIsMenuOpen(p => !p)} className="p-2 rounded-xl border border-transparent hover:border-text-main/5 hover:bg-text-main/[0.02] text-text-muted transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                    <AnimatePresence>
                      {isMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 top-12 bg-background/90 backdrop-blur-xl border border-text-main/10 rounded-2xl shadow-3xl z-30 min-w-[160px] p-1.5"
                        >
                          <button onClick={() => { setIsEditing(true); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-primary hover:bg-text-main/[0.02] rounded-xl transition-all">
                            <Pencil size={14} /> Edit
                          </button>
                          <button onClick={handleDelete} className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                            <Trash2 size={14} /> Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {}
              <div className={`text-text-main leading-relaxed tracking-wide font-light break-words overflow-wrap-anywhere whitespace-pre-wrap
                              ${isReply ? 'text-sm' : 'text-base md:text-lg'}`}>
                {isEditing ? (
                  <div className="flex flex-col gap-3">
                    <textarea
                      value={editContent} onChange={e => setEditContent(e.target.value)}
                      className="w-full bg-surface/40 border border-primary/20 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 resize-none min-h-[120px]"
                      maxLength={500} autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => { setIsEditing(false); setEditContent(tweet.content); }} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:bg-text-main/5">Cancel</button>
                      <button onClick={handleSaveEdit} disabled={isSaving} className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary text-background flex items-center gap-2">
                         {isSaving ? <Loader2 size={14} className="animate-spin" /> : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {displayContent}
                    {isLong && (
                      <button onClick={() => setIsExpanded(p => !p)} className="block mt-2 text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-80">
                        {isExpanded ? 'Show Less' : 'Read Full Thread'}
                      </button>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center gap-3 sm:gap-6 pt-2 mt-auto flex-nowrap overflow-hidden">
                <button onClick={handleLike} className={`flex items-center gap-1.5 group/btn text-[10px] sm:text-[11px] font-bold shrink-0 ${isLiked ? 'text-red-400' : 'text-text-muted hover:text-red-400'}`}>
                  <div className={`p-2 rounded-lg transition-all ${isLiked ? 'bg-red-400/10' : 'group-hover/btn:bg-red-400/10'}`}>
                    <Heart size={15} className={isLiked ? 'fill-red-400' : ''} />
                  </div>
                  <span>{likesCount}</span>
                </button>

                <button
                  onClick={() => { if (!currentUser) return toast.error('Login to reply'); setShowReplyInput(!showReplyInput); }}
                  className={`flex items-center gap-1.5 group/btn text-[10px] sm:text-[11px] font-bold shrink-0 ${showReplyInput ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
                >
                  <div className={`p-2 rounded-lg transition-all ${showReplyInput ? 'bg-primary/10' : 'group-hover/btn:bg-primary/10'}`}>
                    <MessageSquare size={15} />
                  </div>
                  <span>{tweet.repliesCount || tweet.comments || replies.length || ''}</span>
                </button>

                <div className="flex-1" />

                <button
                  onClick={fetchReplies}
                  className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-text-muted/40 hover:text-primary transition-colors whitespace-nowrap shrink-0"
                >
                  {isLoadingReplies ? '...' : showReplies ? 'Collapse' : 'Thread'}
                </button>
              </div>

              {}
              <AnimatePresence>
                {showReplyInput && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="pt-4 border-t border-text-main/[0.03] mt-2 flex flex-col gap-4">
                      <textarea
                        value={replyContent} onChange={e => setReplyContent(e.target.value)}
                        placeholder="Contribute to the vibe..."
                        className="w-full bg-surface/20 border-none focus:outline-none text-sm py-2 resize-none h-20 placeholder-text-muted/40 font-medium"
                        autoFocus
                      />
                      <div className="flex justify-end gap-3 pb-2">
                         <button onClick={() => setShowReplyInput(false)} className="text-[10px] font-black uppercase tracking-widest text-text-muted">Discard</button>
                         <button onClick={handlePostReply} disabled={isSubmittingReply || !replyContent.trim()} className="px-6 py-2.5 bg-primary text-background rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50">
                            {isSubmittingReply ? 'Sending...' : 'Post Reply'}
                         </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {}
              <AnimatePresence>
                {showReplies && (
                  <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-text-main/[0.03]">
                    {replies.map((reply, i) => (
                      <TweetCard
                        key={reply._id} tweet={reply} isReply={true} index={i}
                        onDelete={(rid) => setReplies(prev => prev.filter(r => r._id !== rid))}
                        onUpdate={(rid, content) => setReplies(prev => prev.map(r => r._id === rid ? { ...r, content } : r))}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    );
}
