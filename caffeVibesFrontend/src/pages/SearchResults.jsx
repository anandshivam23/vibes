import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Loader2, Search, User, Video as VideoIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import VideoCard from '../components/VideoCard';
import EmptyState from '../components/EmptyState';
export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('All');
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!query.trim()) return;
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const [videosRes, usersRes] = await Promise.all([
          api.get(`/videos?query=${encodeURIComponent(query)}&limit=20`).catch(() => ({ data: { data: { docs: [] } } })),
          api.get(`/users/search?q=${encodeURIComponent(query)}&limit=10`).catch(() => ({ data: { data: [] } }))
        ]);
        setVideos(videosRes.data.data?.docs || videosRes.data.data?.videos || []);
        setUsers(usersRes.data.data || []);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [query]);
  const tabs = ['All', 'Videos', 'Channels'];
  const filteredVideos = activeTab === 'Videos' || activeTab === 'All' ? videos : [];
  const filteredUsers = activeTab === 'Channels' || activeTab === 'All' ? users : [];
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-0 py-6 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Search size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-text-main">
              Search Results
            </h1>
            <p className="text-text-muted text-sm">
              Showing results for <span className="text-primary font-semibold">"{query}"</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-8 border-b border-surface-hover pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 text-sm font-semibold rounded-t-lg transition-all border-b-2 ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            {tab}
            {tab === 'Videos' && videos.length > 0 && (
              <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{videos.length}</span>
            )}
            {tab === 'Channels' && users.length > 0 && (
              <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{users.length}</span>
            )}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={36} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-10">
          {filteredUsers.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                <User size={18} className="text-primary" /> Channels
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredUsers.map((user, i) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={`/profile/${user.username}`}
                      className="flex items-center gap-3 p-4 bg-surface border border-surface-hover rounded-xl hover:border-primary/40 hover:-translate-y-0.5 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-surface-hover group-hover:border-primary transition-colors flex-shrink-0">
                        <img
                          src={user.avatar || 'https://i.pravatar.cc/150?img=1'}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-text-main truncate group-hover:text-primary transition-colors">
                          {user.fullName || user.username}
                        </p>
                        <p className="text-xs text-text-muted truncate">@{user.username}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
          {filteredVideos.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                <VideoIcon size={18} className="text-primary" /> Videos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVideos.map((v, i) => (
                  <VideoCard
                    key={v._id}
                    index={i}
                    video={{
                      id: v._id,
                      thumbnail: v.thumbnail,
                      title: v.title,
                      duration:
                        Math.floor((v.duration || 0) / 60) +
                        ':' +
                        Math.floor((v.duration || 0) % 60)
                          .toString()
                          .padStart(2, '0'),
                      views: v.views || 0,
                      createdAt: new Date(v.createdAt).toLocaleDateString(),
                      owner: {
                        id: v.owner?._id,
                        name: v.owner?.fullName || v.owner?.username || 'Unknown',
                        avatar: v.owner?.avatar || 'https://i.pravatar.cc/150?img=1',
                        username: v.owner?.username,
                      },
                    }}
                  />
                ))}
              </div>
            </section>
          )}
          {!isLoading && filteredVideos.length === 0 && filteredUsers.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-4">
                <Search size={32} className="text-text-muted" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">No results found</h3>
              <p className="text-text-muted">
                Try searching with different keywords or check the spelling
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}