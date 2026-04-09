import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-hot-toast';
import EmptyState from '../components/EmptyState';
import EditProfileModal from '../components/EditProfileModal';
import { Loader2, Pencil, Play, MessageSquare, ListMusic, Heart, Users, Mail, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoCard from '../components/VideoCard';
import TweetCard from '../components/TweetCard';

export default function Profile() {
  let { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('Videos');
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const isOwnProfile = currentUser && (currentUser.username === id || currentUser._id === id);



  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/users/c/${id}`);
        setProfile(response.data.data);
        setIsSubscribed(response.data.data.isSubscribed);

        try {
          const vids = await api.get(`/videos?userId=${response.data.data._id}`);
          setVideos(vids.data.data?.docs || vids.data.data?.videos || []);
        } catch (e) { setVideos([]); }

        try {

          const tws = await api.get(`/tweets/user/${response.data.data._id}`);
          const tweetData = tws.data.data;



          const profileOwner = {
            _id: response.data.data._id,
            username: tweetData.username || response.data.data.username,
            fullName: tweetData.fullName || response.data.data.fullName,
            avatar: tweetData.avatar || response.data.data.avatar,
          };
          const tweetsArray = (tweetData.tweets || []).map(t => ({
            ...t,
            ownerDetails: t.ownerDetails || profileOwner
          }));
          setTweets(tweetsArray);
        } catch (e) { setTweets([]); }

        try {
          const pLists = await api.get(`/playlist/user/${response.data.data._id}`);
          setPlaylists(pLists.data.data || []);
        } catch (e) { setPlaylists([]); }

      } catch (error) {
        toast.error('Failed to load profile details');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProfile();
  }, [id]);


  useEffect(() => {
    if (activeTab === 'Liked' && isOwnProfile && likedVideos.length === 0) {
      api.get('/likes/videos').then(res => {
        const items = (res.data.data || []).map(item => {
          const v = item.videoDetails;
          const ch = item.channel;
          return {
            id: v?._id,
            thumbnail: v?.thumbnail,
            title: v?.title,
            duration: Math.floor((v?.duration || 0) / 60) + ':' + Math.floor((v?.duration || 0) % 60).toString().padStart(2, '0'),
            views: Array.isArray(v?.views) ? v.views.length : (v?.views || 0),
            createdAt: new Date(v?.createdAt).toLocaleDateString(),
            owner: { id: ch?._id, name: ch?.fullName || ch?.username || 'Unknown', avatar: ch?.avatar, username: ch?.username }
          };
        }).filter(v => v.id);
        setLikedVideos(items);
      }).catch(() => setLikedVideos([]));
    }
  }, [activeTab]);


  useEffect(() => {
    if (!socket || !profile) return;
    const handleSubUpdate = ({ channelId, subscribersCount, isSubscribed: newSub, byUserId }) => {
      if (channelId === profile._id || channelId === profile._id?.toString()) {
        setProfile(prev => ({ ...prev, subscribersCount }));

        if (currentUser && byUserId === currentUser._id) {
          setIsSubscribed(newSub);
        }
      }
    };
    socket.on('subscriptionUpdate', handleSubUpdate);
    return () => socket.off('subscriptionUpdate', handleSubUpdate);
  }, [socket, profile, currentUser]);

  const handleSubscribe = async () => {
    if (!currentUser) return toast.error('Please log in to subscribe');
    if (isSubscribing) return;
    setIsSubscribing(true);
    try {
      const res = await api.post(`/subscriptions/c/${profile._id}`);
      const data = res.data.data;
      setIsSubscribed(data.isSubscribed);
      setProfile(prev => ({ ...prev, subscribersCount: data.subscribersCount }));
      toast.success(data.isSubscribed ? 'Subscribed!' : 'Unsubscribed');
    } catch (e) {
      toast.error('Failed to update subscription');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleProfileUpdated = (updatedProfile) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
  };
  const handleTweetDelete = (tweetId) => setTweets(prev => prev.filter(t => t._id !== tweetId));
  const handleTweetUpdate = (tweetId, newContent) => setTweets(prev => prev.map(t => t._id === tweetId ? { ...t, content: newContent } : t));

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  if (!profile) {
    return <div className="w-full mt-10"><EmptyState type="error" /></div>;
  }

  const stats = [
    { label: 'Subscribers', value: profile.subscribersCount || 0 },
    { label: 'Videos', value: videos.length },
    { label: 'Tweets', value: tweets.filter(t => t.type === 'tweet' || !t.type || t.type === 'TWEET').length },
    { label: 'Jokes', value: tweets.filter(t => t.type === 'joke' || t.type === 'JOKE').length },
    { label: 'Playlists', value: playlists.length },
  ];

  const tabs = isOwnProfile
    ? ['Videos', 'Tweets', 'Jokes', 'Playlists', 'Liked']
    : ['Videos', 'Tweets', 'Jokes', 'Playlists'];

  return (
    <div className="animate-fade-in relative pb-10">
      <div
        className="w-full h-40 sm:h-48 md:h-64 rounded-2xl bg-gradient-to-r from-surface to-primary/30 bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: profile.coverImage ? `url('${profile.coverImage}')` : undefined }}
      >
        {!profile.coverImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-surface to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
      </div>
      <div className="px-3 sm:px-4 lg:px-6 -mt-16 sm:-mt-20 flex flex-col lg:flex-row items-center lg:items-end gap-4 lg:gap-6 relative z-20">
        <div className="relative group shrink-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-[2rem] sm:rounded-[2.5rem] border-4 border-background overflow-hidden bg-surface shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
            <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left min-w-0 w-full gap-2 pb-3 lg:pb-6">
          <h1 className="text-fluid-4xl lg:text-5xl font-display font-black text-text-main tracking-tighter max-w-full bg-gradient-to-r from-text-main to-text-main/40 bg-clip-text text-transparent">
            {profile.fullName || profile.username}
          </h1>

          <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start">
            <span className="text-xs sm:text-sm font-bold text-primary tracking-widest uppercase whitespace-nowrap">@{profile.username}</span>
            {isOwnProfile && profile.email && (
              <span className="hidden md:flex items-center gap-1.5 text-xs text-text-muted/40 font-bold uppercase tracking-wider whitespace-nowrap">
                <Mail size={11} /> {profile.email}
              </span>
            )}
          </div>
          <div className="w-full flex flex-col sm:flex-row sm:items-center gap-3 mt-1">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex bg-text-main/[0.03] backdrop-blur-3xl border border-text-main/10 rounded-2xl md:rounded-3xl shadow-xl px-2 py-2 w-auto min-w-max">
                {stats.map(({ label, value }, i) => (
                  <div
                    key={label}
                    className={`flex flex-col items-center justify-center px-3 sm:px-4 md:px-5 lg:px-6 group cursor-default ${
                      i < stats.length - 1 ? 'border-r border-text-main/5' : ''
                    }`}
                  >
                    <span className="font-display font-black text-lg sm:text-xl md:text-2xl lg:text-2xl text-text-main group-hover:text-primary transition-colors leading-tight tabular-nums">
                      {value}
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-black text-text-muted/30 uppercase tracking-wider leading-tight whitespace-nowrap mt-0.5">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="shrink-0 flex justify-center sm:justify-start lg:ml-auto">
              {isOwnProfile ? (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-2 font-black py-2.5 px-5 rounded-2xl border border-text-main/5 bg-text-main/[0.02] hover:bg-text-main/[0.05] backdrop-blur-3xl transition-all text-[10px] uppercase tracking-widest shadow-xl active:scale-95 whitespace-nowrap touch-target"
                >
                  <Pencil size={13} /> Customize
                </button>
              ) : (
                <button
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                  className={`font-black py-2.5 px-5 sm:px-6 rounded-2xl transition-all shadow-2xl text-[10px] uppercase tracking-widest active:scale-95 border whitespace-nowrap touch-target ${
                    isSubscribed
                      ? 'bg-text-main/[0.02] text-text-main border-text-main/10 hover:bg-text-main/[0.05]'
                      : 'bg-primary border-primary text-background shadow-primary/20 hover:scale-105'
                  }`}
                >
                  {isSubscribing ? <Loader2 size={16} className="animate-spin inline" /> : isSubscribed ? '✓ Subscribed' : 'Subscribe'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 mx-3 sm:mx-4 lg:mx-6 overflow-x-auto scrollbar-hide">
        <div className="inline-flex items-center p-1.5 bg-text-main/[0.02] backdrop-blur-3xl border border-text-main/5 rounded-full min-w-max">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 sm:px-5 lg:px-6 py-2.5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap rounded-full ${
                activeTab === tab ? 'text-background' : 'text-text-muted/40 hover:text-text-main'
              }`}
            >
              <span className="relative z-10">{tab}</span>
              {activeTab === tab && (
                <motion.div
                  layoutId="active-profile-tab"
                  className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/20"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="py-8 px-4 md:px-8"
        >
          {activeTab === 'Videos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.length > 0 ? videos.map((v, i) => (
                <VideoCard key={v._id || i} video={{
                  id: v._id,
                  thumbnail: v.thumbnail,
                  title: v.title,
                  duration: Math.floor(v.duration / 60) + ':' + (Math.floor(v.duration % 60)).toString().padStart(2, '0'),
                  views: Array.isArray(v.views) ? v.views.length : (v.views || 0),
                  createdAt: new Date(v.createdAt).toLocaleDateString(),
                  owner: { id: profile._id, name: profile.fullName || profile.username, username: profile.username, avatar: profile.avatar }
                }} index={i} />
              )) : (
                <div className="col-span-full py-10 text-center"><EmptyState type="profileVideos" action={isOwnProfile ? undefined : null} /></div>
              )}
            </div>
          )}

          {activeTab === 'Tweets' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tweets.filter(t => t.type === 'tweet' || !t.type).length > 0 ? tweets.filter(t => t.type === 'tweet' || !t.type).map((t, i) => {
                const tweetOwner = t.ownerDetails || t.owner || {};
                return (
                  <TweetCard
                    key={t._id || i}
                    tweet={{
                      id: t._id,
                      type: 'tweet',
                      content: t.content,
                      likes: t.likesCount || 0,
                      isLiked: t.isLiked || (currentUser && t.likes?.some(l => (l.likedBy || l) === currentUser._id || (l.likedBy || l)?.toString() === currentUser._id)),
                      comments: t.commentsCount || 0,
                      createdAt: t.createdAt,
                      owner: {
                        id: tweetOwner._id || profile._id,
                        name: tweetOwner.fullName || tweetOwner.username || profile.fullName || profile.username,
                        username: tweetOwner.username || profile.username,
                        avatar: tweetOwner.avatar || profile.avatar
                      }
                    }}
                    index={i}
                    onDelete={handleTweetDelete}
                    onUpdate={handleTweetUpdate}
                  />
                );
              }) : (
                <div className="col-span-full"><EmptyState type="tweets" action={isOwnProfile ? undefined : null} /></div>
              )}
            </div>
          )}

          {activeTab === 'Jokes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tweets.filter(t => t.type === 'joke').length > 0 ? tweets.filter(t => t.type === 'joke').map((t, i) => {
                const tweetOwner = t.ownerDetails || t.owner || {};
                return (
                  <TweetCard
                    key={t._id || i}
                    tweet={{
                      id: t._id,
                      type: 'joke',
                      content: t.content,
                      likes: t.likesCount || 0,
                      isLiked: t.isLiked || (currentUser && t.likes?.some(l => (l.likedBy || l) === currentUser._id || (l.likedBy || l)?.toString() === currentUser._id)),
                      comments: t.commentsCount || 0,
                      createdAt: t.createdAt,
                      owner: {
                        id: tweetOwner._id || profile._id,
                        name: tweetOwner.fullName || tweetOwner.username || profile.fullName || profile.username,
                        username: tweetOwner.username || profile.username,
                        avatar: tweetOwner.avatar || profile.avatar
                      }
                    }}
                    index={i}
                    onDelete={handleTweetDelete}
                    onUpdate={handleTweetUpdate}
                  />
                );
              }) : (
                <div className="col-span-full"><EmptyState type="jokes" action={isOwnProfile ? undefined : null} /></div>
              )}
            </div>
          )}

          {activeTab === 'Playlists' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.length > 0 ? playlists.map((pl, i) => (
                <Link
                  key={pl._id || i}
                  to={`/playlist/${pl._id}`}
                  className="bg-surface rounded-xl overflow-hidden border border-surface-hover hover:border-primary/30 transition-all group hover:-translate-y-1 hover:shadow-xl relative block"
                >
                  {isOwnProfile && pl.isPublic === false && (
                    <div className="absolute top-2 left-2 z-10 bg-black/70 backdrop-blur-md text-[10px] text-white font-bold px-2 py-0.5 rounded-full border border-text-main/20">
                      Private
                    </div>
                  )}
                  <div className="bg-surface-hover h-40 relative overflow-hidden">
                    {pl.videos?.length > 0 && pl.videos[0]?.thumbnail ? (
                      <img src={pl.videos[0].thumbnail} alt="thumbnail" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ListMusic size={32} className="text-text-muted" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center text-white scale-90 group-hover:scale-100 transition-transform">
                        <Play size={28} className="mx-auto mb-1" fill="currentColor" />
                        <span className="font-bold text-sm">Play All</span>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {pl.videos?.length || 0} VIDEOS
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold text-text-main line-clamp-1 group-hover:text-primary transition-colors">{pl.name}</h3>
                    <p className="text-xs text-text-muted line-clamp-2 mt-1">{pl.description || 'No description'}</p>
                  </div>
                </Link>
              )) : (
                <div className="col-span-full"><EmptyState type="playlists" action={isOwnProfile ? undefined : null} /></div>
              )}
            </div>
          )}

          {activeTab === 'Liked' && isOwnProfile && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedVideos.length > 0 ? likedVideos.map((v, i) => (
                <VideoCard key={v.id || i} video={v} index={i} />
              )) : (
                <div className="col-span-full py-10 text-center text-text-muted">
                  <Heart size={40} className="mx-auto mb-3 text-text-muted/40" />
                  <p className="font-semibold">No liked videos yet</p>
                  <p className="text-sm mt-1">Videos you like will appear here</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {isOwnProfile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profile}
          onUpdated={handleProfileUpdated}
        />
      )}
    </div>
  );
}
