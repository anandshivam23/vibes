import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Loader2, UserCheck, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import EmptyState from '../components/EmptyState';
export default function Subscriptions() {
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!currentUser) { setIsLoading(false); return; }
    fetchSubscriptions();
  }, [currentUser]);
  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/subscriptions/c/${currentUser._id}`);
      setChannels(res.data.data || []);
    } catch (e) {
      toast.error('Failed to load subscriptions');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!socket || !currentUser) return;
    const handleSubUpdate = ({ channelId, isSubscribed, subscribersCount, byUserId }) => {
      if (byUserId?.toString() !== currentUser._id?.toString()) return;
      if (isSubscribed) {
        fetchSubscriptions();
      } else {
        setChannels(prev => prev.filter(sub => {
          const ch = sub.channel || sub;
          return ch._id?.toString() !== channelId?.toString();
        }));
      }
    };
    socket.on('subscriptionUpdate', handleSubUpdate);
    return () => socket.off('subscriptionUpdate', handleSubUpdate);
  }, [socket, currentUser]);
  const handleUnsubscribe = async (channelId) => {
    try {
      await api.post(`/subscriptions/c/${channelId}`);
      setChannels(prev => prev.filter(sub => {
        const ch = sub.channel || sub;
        return ch._id?.toString() !== channelId?.toString();
      }));
      toast.success('Unsubscribed');
    } catch (e) {
      toast.error('Failed to unsubscribe');
    }
  };
  if (!currentUser) {
    return (
      <div className="py-24 flex justify-center w-full">
        <EmptyState type="login" />
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex justify-center py-24"><Loader2 className="animate-spin text-primary" size={32} /></div>
    );
  }
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 md:px-0 pb-10">
      <div className="flex items-center gap-3 mt-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Users size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">Your Subscriptions</h1>
          <p className="text-text-muted text-sm">{channels.length} channel{channels.length !== 1 ? 's' : ''} you follow</p>
        </div>
      </div>
      {channels.length === 0 ? (
        <div className="py-20 flex justify-center w-full">
           <EmptyState 
             type="subscriptions" 
           />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {channels.map((sub, i) => {
            const channel = sub.channel || sub;
            return (
              <motion.div
                key={channel._id || i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-surface border border-surface-hover rounded-2xl p-5 flex flex-col items-center gap-4 hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-xl transition-all"
              >
                <Link to={`/profile/${channel.username}`} className="relative group">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors">
                    <img src={channel.avatar || 'https://i.pravatar.cc/150?img=32'} alt={channel.username} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-surface" />
                </Link>
                <div className="text-center min-w-0 w-full">
                  <Link to={`/profile/${channel.username}`} className="font-bold text-text-main hover:text-primary transition-colors block truncate">
                    {channel.fullName || channel.username}
                  </Link>
                  <p className="text-sm text-text-muted">@{channel.username}</p>
                  <p className="text-xs text-text-muted mt-1 flex items-center justify-center gap-1">
                    <Users size={11} /> {channel.subscriberCount || channel.subscribersCount || 0} subscribers
                  </p>
                </div>
                <div className="flex gap-2 w-full">
                  <Link
                    to={`/profile/${channel.username}`}
                    className="flex-1 text-center text-sm font-semibold py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                  >
                    View Channel
                  </Link>
                  <button
                    onClick={() => handleUnsubscribe(channel._id)}
                    className="text-sm font-semibold py-1.5 px-3 rounded-full bg-surface-hover hover:bg-red-500/20 hover:text-red-400 border border-surface-hover transition-colors"
                  >
                    Unsubscribe
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}