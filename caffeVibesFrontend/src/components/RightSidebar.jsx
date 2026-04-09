import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { Play, Loader2, Bell, Zap, ChevronRight, ChevronLeft, Heart, MessageSquare, UserPlus, Video, ExternalLink } from 'lucide-react';
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
        const { scrollLeft, scrollWidth, clientWidth } = videoScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 5) {
          videoScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          videoScrollRef.current.scrollBy({ left: 150, behavior: 'smooth' });
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
    <div className="w-80 xl:w-96 hidden lg:flex flex-col gap-4 h-[calc(100vh-4rem)] overflow-hidden animate-fade-in">
      
      {}
      <div className="bg-text-main/[0.01] backdrop-blur-3xl rounded-[3rem] p-7 border border-text-main/10 shadow-3xl flex flex-col h-[45%] min-h-[300px] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 rounded-full" />
        
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-inner">
              <Bell size={20} />
            </div>
            <h3 className="font-display font-black text-xs text-text-main uppercase tracking-[0.2em]">Activity Pulse</h3>
          </div>
          <Link to="/notifications" className="p-2 rounded-xl bg-text-main/[0.02] hover:bg-text-main/[0.05] text-text-muted hover:text-primary transition-all">
             <ExternalLink size={14} />
          </Link>
        </div>

        <div 
          ref={notificationScrollRef}
          className="flex-1 flex flex-col gap-5 overflow-y-auto scrollbar-hide pr-1"
        >
          {isLoading && notifications.length === 0 ? (
            <div className="flex py-10 justify-center"><Loader2 className="animate-spin text-primary/20" size={24} /></div>
          ) : notifications.length > 0 ? (
            <AnimatePresence initial={false}>
              {notifications.map((notif, idx) => (
                <motion.div 
                  key={notif._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group/item flex gap-4 items-start relative pb-2 border-b border-text-main/[0.03] last:border-0"
                >
                  <img src={notif.senderDetails?.avatar} alt="user" className="w-8 h-8 rounded-xl object-cover border border-text-main/10 shadow-lg mt-1" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] leading-relaxed text-text-muted/60 font-medium">
                      <Link to={`/profile/${notif.senderDetails?.username}`} className="font-black text-text-main hover:text-primary transition-all">
                        @{notif.senderDetails?.username}
                      </Link> <span className="text-[10px] lowercase">{getActionText(notif.type)}</span>
                    </p>
                    {notif.content && <p className="text-[10px] text-text-main/30 mt-1 line-clamp-1 italic font-bold">"{notif.content}"</p>}
                    <p className="text-[9px] text-text-muted/20 font-black uppercase tracking-tighter mt-1">{timeAgo(notif.createdAt)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <p className="text-[11px] text-text-muted/20 italic py-6 text-center font-bold uppercase tracking-widest leading-relaxed">
              {currentUser ? 'Awaiting new vibes...' : 'Login to sync with your community pulse'}
            </p>
          )}
        </div>
        
        {notifications.length > 0 && (
          <Link to="/notifications" className="mt-4 text-[9px] font-black uppercase tracking-[0.3em] text-center text-text-muted/40 hover:text-primary transition-colors border-t border-text-main/5 pt-4">
             Explore Full History
          </Link>
        )}
      </div>

      {}
      <div className="bg-text-main/[0.01] backdrop-blur-3xl rounded-[3rem] p-7 border border-text-main/10 shadow-3xl flex flex-col h-[50%] group relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 rounded-full" />
        
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-inner">
              <Zap size={20} />
            </div>
            <h3 className="font-display font-black text-xs text-text-main uppercase tracking-[0.2em]">Next Discovery</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => videoScrollRef.current?.scrollBy({ top: -120, behavior: 'smooth' })}
              className="p-1.5 rounded-lg bg-text-main/[0.02] hover:bg-text-main/[0.05] text-text-muted transition-all"
              title="Scroll up"
            >
              <ChevronLeft size={14} className="rotate-90" />
            </button>
            <button 
              onClick={() => videoScrollRef.current?.scrollBy({ top: 120, behavior: 'smooth' })}
              className="p-1.5 rounded-lg bg-text-main/[0.02] hover:bg-text-main/[0.05] text-text-muted transition-all"
              title="Scroll down"
            >
              <ChevronRight size={14} className="rotate-90" />
            </button>
          </div>
        </div>

        <div 
          ref={videoScrollRef}
          className="flex flex-col gap-4 overflow-y-auto scrollbar-hide pr-1"
        >
          {isLoading && videos.length === 0 ? (
            <div className="flex py-12 justify-center"><Loader2 className="animate-spin text-primary/20" size={24} /></div>
          ) : (
            videos.slice(0, 7).map((vid, idx) => (
              <motion.div
                key={vid._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group/vid relative overflow-hidden p-3 rounded-[2rem] bg-text-main/[0.01] hover:bg-text-main/[0.03] border border-text-main/5 hover:border-text-main/10 transition-all duration-500 shadow-sm hover:shadow-2xl"
              >
                <Link to={`/video/${vid._id}`} className="flex gap-4 items-center">
                  <div className="relative w-24 h-16 md:w-28 md:h-18 flex-shrink-0 rounded-[1.5rem] overflow-hidden bg-surface-hover border border-text-main/10 group-hover/vid:border-primary/20 transition-all">
                    <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover/vid:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/vid:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                      <Play size={14} fill="currentColor" className="text-background" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] font-black text-text-main group-hover/vid:text-primary transition-colors line-clamp-1 tracking-tight">{vid.title}</h4>
                    <p className="text-[10px] text-text-muted/40 mt-1 font-bold truncate">@{vid.owner?.username || 'user'}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <p className="text-[9px] text-text-muted/20 font-black uppercase tracking-tighter">{vid.views || 0} hits</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
