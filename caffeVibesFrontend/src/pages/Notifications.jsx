import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Trash2, Link as LinkIcon, MessageSquare, Heart, UserPlus, Video, Loader2, CheckCheck } from 'lucide-react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-hot-toast';
import EmptyState from '../components/EmptyState';
export default function Notifications() {
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);
  useEffect(() => {
    if (!socket || !currentUser) return;
    const handleNewNotif = (newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
    };
    socket.on(`notification:${currentUser._id}`, handleNewNotif);
    return () => socket.off(`notification:${currentUser._id}`, handleNewNotif);
  }, [socket, currentUser]);
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };
  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      toast.success('Clearance achieved', { icon: '✅', style: { borderRadius: '1rem', background: '#1A1A1A', color: '#FFF', fontSize: '12px', fontWeight: 'bold' } });
    } catch (e) {
      console.error(e);
      toast.error('Sync failed. Try again.');
    }
  };
  const clearAll = async () => {
    if (!window.confirm('Wipe your entire activity pulse?')) return;
    try {
      await api.delete('/notifications/clear');
      setNotifications([]);
      toast.success('Pulse neutralized', { icon: '🧹', style: { borderRadius: '1rem', background: '#1A1A1A', color: '#FFF', fontSize: '12px', fontWeight: 'bold' } });
    } catch (e) {
      toast.error('Could not clear. Backend pulse lost.');
    }
  };
  const getIcon = (type) => {
    switch (type) {
      case 'LIKE': return <Heart className="text-red-400 fill-red-400" size={16} />;
      case 'COMMENT':
      case 'REPLY': return <MessageSquare className="text-blue-400" size={16} />;
      case 'SUBSCRIPTION': return <UserPlus className="text-green-400" size={16} />;
      case 'VIDEO_UPLOAD': return <Video className="text-primary" size={16} />;
      case 'TWEET_POST': return <LinkIcon className="text-primary" size={16} />;
      default: return <Bell size={16} />;
    }
  };
  const getActionText = (type) => {
    switch (type) {
      case 'LIKE': return 'liked your vibe';
      case 'COMMENT': return 'commented on your video';
      case 'REPLY': return 'replied to your thread';
      case 'SUBSCRIPTION': return 'subscribed to your channel';
      case 'VIDEO_UPLOAD': return 'uploaded a new video';
      case 'TWEET_POST': return 'shared a new vibe';
      default: return 'interacted with you';
    }
  };
  const getRedirectLink = (notif) => {
    if (notif.video) return `/video/${notif.video}`;
    if (notif.tweet) return `/tweets`;
    if (notif.senderDetails?.username) return `/profile/${notif.senderDetails.username}`;
    return '/';
  };
  if (!currentUser) return (
    <div className="py-24 flex justify-center w-full">
      <EmptyState type="login" />
    </div>
  );
  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-8 md:py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex flex-col gap-1">
           <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-text-main tracking-tighter bg-gradient-to-r from-text-main to-text-main/30 bg-clip-text text-transparent">
             Activity Pulse
           </h1>
           <p className="text-xs sm:text-sm font-bold text-text-muted/40 uppercase tracking-[0.2em] sm:tracking-[0.3em]">Your community interactions</p>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={clearAll}
            className="flex items-center gap-3 px-6 py-3 bg-red-400/10 hover:bg-red-400 text-red-400 hover:text-background font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-red-400/10 border border-red-400/20 active:scale-95"
          >
            <Trash2 size={14} /> Clear Pulse
          </button>
        )}
      </div>
      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-sm font-black text-text-muted/20 uppercase tracking-widest">Syncing your vibrations...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="flex flex-col gap-4">
            {notifications.map((notif, idx) => (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 rounded-[2rem] border transition-all duration-500 hover:shadow-2xl 
                           ${notif.isRead 
                             ? 'bg-text-main/[0.01] border-text-main/5 opacity-60' 
                             : 'bg-text-main/[0.03] border-primary/20 shadow-xl shadow-primary/5'}`}
              >
                <div className="flex-shrink-0 relative">
                   <Link to={`/profile/${notif.senderDetails?.username}`}>
                     <img 
                       src={notif.senderDetails?.avatar} 
                       alt={notif.senderDetails?.username} 
                       className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-transparent group-hover:border-primary/40 transition-all shadow-lg"
                     />
                   </Link>
                   <div className="absolute -bottom-1 -right-1 p-1.5 bg-background border border-text-main/10 rounded-xl shadow-2xl">
                     {getIcon(notif.type)}
                   </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Link to={`/profile/${notif.senderDetails?.username}`} className="font-display font-black text-sm text-text-main hover:text-primary transition-colors">
                      @{notif.senderDetails?.username}
                    </Link>
                    <span className="text-xs text-text-muted/60 font-medium">
                      {getActionText(notif.type)}
                    </span>
                  </div>
                  {notif.content && (
                    <p className="text-xs text-text-muted/40 italic font-medium line-clamp-1 mb-1">"{notif.content}"</p>
                  )}
                  <p className="text-[10px] text-text-main/20 font-black uppercase tracking-widest">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(notif.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto ml-auto shrink-0">
                   {!notif.isRead && (
                     <button 
                       onClick={() => markAsRead(notif._id)}
                       className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-background transition-all touch-target"
                       title="Mark as read"
                     >
                       <CheckCheck size={16} />
                     </button>
                   )}
                   <Link 
                     to={getRedirectLink(notif)}
                     onClick={(e) => {
                       if (!notif.isRead) markAsRead(notif._id);
                     }}
                     className="p-3 rounded-xl bg-text-main/[0.05] text-text-muted hover:text-primary hover:bg-text-main/[0.1] transition-all touch-target"
                   >
                     <LinkIcon size={18} />
                   </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState type="subscriptions" title="Inbox is empty" desc="No new pulses yet! Start interacting or subscribe to creators to fill your feed." />
        )}
      </div>
    </div>
  );
}