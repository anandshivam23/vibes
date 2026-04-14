import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { Play, Loader2, Bell, Compass, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function RightSidebar() {
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const notificationScrollRef = useRef(null);
  const videoScrollRef = useRef(null);

  const isHome = location.pathname === '/';
  const isLikedPage = location.pathname === '/liked';
  const isDislikedPage = location.pathname === '/disliked';

  const timeAgo = (date) => {
    if (!date) return 'now';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    if (!socket || !currentUser) return;

    socket.on(`notification:${currentUser._id}`, (newNotif) => {
      setNotifications(prev => [newNotif, ...prev].slice(0, 10));
    });

    return () => socket.off(`notification:${currentUser._id}`);
  }, [socket, currentUser]);

  useEffect(() => {
    if (!notifications.length) return;
    const interval = setInterval(() => {
      if (notificationScrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = notificationScrollRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
          notificationScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          notificationScrollRef.current.scrollBy({ top: 50, behavior: 'smooth' });
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [notifications]);

  useEffect(() => {
    if (videos.length <= 4) return;
    const interval = setInterval(() => {
      if (videoScrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = videoScrollRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
          videoScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          videoScrollRef.current.scrollBy({ top: 120, behavior: 'smooth' });
        }
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [videos]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (currentUser) {
        const [vidRes, notifRes] = await Promise.all([
          api.get('/videos?limit=7'),
          api.get('/notifications')
        ]);
        setVideos(vidRes.data.data?.docs || vidRes.data.data?.videos || []);
        setNotifications((notifRes.data.data || []).slice(0, 10));
      } else {
        const vidRes = await api.get('/videos?limit=7');
        setVideos(vidRes.data.data?.docs || vidRes.data.data?.videos || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionText = (type) => {
    switch (type) {
      case 'LIKE': return 'liked you';
      case 'COMMENT': return 'commented';
      case 'REPLY': return 'replied';
      case 'SUBSCRIPTION': return 'subscribed';
      case 'VIDEO_UPLOAD': return 'uploaded';
      case 'TWEET_POST': return 'posted';
      default: return 'alert';
    }
  };


  return (
    <div className="flex flex-col gap-4 items-start animate-fade-in">
      
      {/* ── Activity Pulse ── */}
      <div className="w-full bg-text-main/[0.01] backdrop-blur-3xl rounded-2xl sm:rounded-[2rem] p-4 sm:p-5 border border-text-main/10 shadow-lg flex flex-col min-h-[240px] max-h-[320px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl -z-10 rounded-full" />
        
        {/* Fixed header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Bell size={16} />
            </div>
            <h3 className="font-display font-black text-[11px] text-text-main uppercase tracking-[0.15em]">Activity Pulse</h3>
          </div>
          <Link to="/notifications" className="p-1.5 rounded-lg bg-text-main/[0.02] hover:bg-text-main/[0.05] text-text-muted hover:text-primary transition-all" title="View all">
             <ExternalLink size={13} />
          </Link>
        </div>

        {/* Scrollable notification list */}
        <div 
          ref={notificationScrollRef}
          className="flex-1 flex flex-col gap-3 overflow-y-auto scrollbar-hide pr-1"
        >
          {isLoading && notifications.length === 0 ? (
            <div className="flex items-center justify-center flex-1 py-6">
              <Loader2 className="animate-spin text-primary/20" size={20} />
            </div>
          ) : notifications.length > 0 ? (
            <AnimatePresence initial={false}>
              {notifications.map((notif, idx) => (
                <motion.div 
                  key={notif._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="group/item flex gap-3 items-start pb-2.5 border-b border-text-main/[0.03] last:border-0"
                >
                  <img src={notif.senderDetails?.avatar} alt="user" className="w-7 h-7 rounded-lg object-cover border border-text-main/10 shadow mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] leading-relaxed text-text-muted/60 font-medium">
                      <Link to={`/profile/${notif.senderDetails?.username}`} className="font-black text-text-main hover:text-primary transition-all">
                        @{notif.senderDetails?.username}
                      </Link> <span className="text-[10px] lowercase">{getActionText(notif.type)}</span>
                    </p>
                    {notif.content && <p className="text-[10px] text-text-main/30 mt-0.5 line-clamp-1 italic font-bold">"{notif.content}"</p>}
                    <p className="text-[9px] text-text-muted/20 font-black uppercase tracking-tighter mt-0.5">{timeAgo(notif.createdAt)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="flex items-center justify-center flex-1">
              <p className="text-[11px] text-text-muted/20 italic text-center font-bold uppercase tracking-widest leading-relaxed">
                {currentUser ? 'Awaiting new vibes...' : 'Login to sync your pulse'}
              </p>
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <Link to="/notifications" className="mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-center text-text-muted/40 hover:text-primary transition-colors border-t border-text-main/5 pt-3 flex-shrink-0">
             Explore Full History
          </Link>
        )}
      </div>

      {/* ── Next Discovery ── */}
      <div className="w-full bg-text-main/[0.01] backdrop-blur-3xl rounded-2xl sm:rounded-[2rem] p-4 sm:p-5 border border-text-main/10 shadow-lg flex flex-col min-h-[280px] max-h-[420px] relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 blur-3xl -z-10 rounded-full" />
        
        {/* Fixed header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Compass size={16} />
            </div>
            <h3 className="font-display font-black text-[11px] text-text-main uppercase tracking-[0.15em]">Next Discovery</h3>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => videoScrollRef.current?.scrollBy({ top: -120, behavior: 'smooth' })}
              className="p-1.5 rounded-lg bg-text-main/[0.02] hover:bg-text-main/[0.05] text-text-muted transition-all"
              title="Scroll up"
            >
              <ChevronUp size={14} />
            </button>
            <button 
              onClick={() => videoScrollRef.current?.scrollBy({ top: 120, behavior: 'smooth' })}
              className="p-1.5 rounded-lg bg-text-main/[0.02] hover:bg-text-main/[0.05] text-text-muted transition-all"
              title="Scroll down"
            >
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Scrollable video list */}
        <div 
          ref={videoScrollRef}
          className="flex-1 flex flex-col gap-3 overflow-y-auto scrollbar-hide pr-1"
        >
          {isLoading && videos.length === 0 ? (
            <div className="flex items-center justify-center flex-1 py-8">
              <Loader2 className="animate-spin text-primary/20" size={20} />
            </div>
          ) : videos.length > 0 ? (
            videos.slice(0, 7).map((vid, idx) => (
              <motion.div
                key={vid._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.08 }}
                className="group/vid relative overflow-hidden p-2.5 rounded-xl sm:rounded-2xl bg-text-main/[0.01] hover:bg-text-main/[0.03] border border-text-main/5 hover:border-text-main/10 transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                <Link to={`/video/${vid._id}`} className="flex gap-3 items-center">
                  <div className="relative w-20 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-surface-hover border border-text-main/10 group-hover/vid:border-primary/20 transition-all">
                    <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover/vid:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/vid:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                      <Play size={12} fill="currentColor" className="text-background" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] font-black text-text-main group-hover/vid:text-primary transition-colors line-clamp-2 tracking-tight leading-snug">{vid.title}</h4>
                    <p className="text-[10px] text-text-muted/40 mt-1 font-bold truncate">@{vid.owner?.username || 'user'}</p>
                    <p className="text-[9px] text-text-muted/20 font-black uppercase tracking-tighter mt-0.5">{vid.views || 0} hits</p>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="flex items-center justify-center flex-1">
              <p className="text-[11px] text-text-muted/20 italic text-center font-bold uppercase tracking-widest">No videos yet</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
