import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Loader2, PlaySquare, Trash2, Play, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function PlaylistDetail() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const fetchPlaylist = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/playlist/${id}`);
      setPlaylist(res.data.data);
    } catch (e) {
      toast.error('Failed to load playlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveVideo = async (videoId) => {
    try {
      await api.patch(`/playlist/remove/${videoId}/${id}`);
      setPlaylist(prev => ({
        ...prev,
        videos: prev.videos.filter(v => (v._id || v) !== videoId)
      }));
      toast.success('Video removed from playlist');
    } catch (e) {
      toast.error('Failed to remove video');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="animate-spin text-primary" size={36} /></div>;
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <PlaySquare size={48} className="text-text-muted" />
        <h2 className="text-xl font-bold">Playlist not found</h2>
        <Link to="/playlists" className="text-primary hover:underline">Back to playlists</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 md:px-0 pb-10 mt-4">
      <div className="flex flex-col md:flex-row gap-8">
        {}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="sticky top-24 bg-surface/40 backdrop-blur-md rounded-3xl p-6 border border-surface-hover shadow-xl overflow-hidden group">
            {}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />

            <div className="relative aspect-video rounded-2xl bg-surface-hover mb-6 overflow-hidden border border-surface-hover shadow-inner">
               {playlist.videos?.[0]?.thumbnail ? (
                 <img src={playlist.videos[0].thumbnail} alt={playlist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center">
                   <PlaySquare size={48} className="text-text-muted/30" />
                 </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                 <span className="text-white text-xs font-bold uppercase tracking-wider">{playlist.videos?.length || 0} videos</span>
               </div>
            </div>

            <h1 className="text-2xl font-display font-bold text-text-main leading-tight mb-2">{playlist.name}</h1>
            <p className="text-sm text-text-muted mb-6 line-clamp-3 leading-relaxed">
              {playlist.description || "No description provided."}
            </p>

            <div className="flex flex-col gap-3">
                <button
                  disabled={!playlist.videos?.length}
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-background font-bold py-3 px-6 rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                  onClick={() => {
                    if (playlist.videos?.length) {
                      const firstVideoId = playlist.videos[0]._id || playlist.videos[0];
                      window.location.href = `/video/${firstVideoId}`;
                    }
                  }}
                >
                 <Play size={18} fill="currentColor" /> Play all
               </button>
            </div>

            <div className="mt-8 pt-6 border-t border-surface-hover">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-surface-hover overflow-hidden border border-surface-hover ring-2 ring-primary/5">
                   {playlist.owner?.avatar ? (
                     <img src={playlist.owner.avatar} alt="owner" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-surface text-text-muted">
                        <User size={20} />
                     </div>
                   )}
                 </div>
                 <div className="min-w-0">
                   <p className="text-xs text-text-muted">Playlist by</p>
                   <p className="text-sm font-bold text-text-main truncate">
                     {playlist.owner?.fullName || playlist.owner?.username || "Unknown"}
                   </p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {}
        <div className="flex-1">
          <div className="flex flex-col gap-4">
            {playlist.videos?.length === 0 ? (
              <div className="text-center py-20 bg-surface/20 rounded-3xl border border-surface-hover border-dashed">
                <PlaySquare size={48} className="mx-auto text-text-muted/30 mb-4" />
                <p className="text-text-muted">This playlist is currently empty.</p>
              </div>
            ) : (
              playlist.videos.map((vid, i) => (
                <motion.div
                  key={vid._id || i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-surface hover:bg-surface-hover rounded-2xl p-3 border border-transparent hover:border-surface-hover/60 transition-all flex gap-4 items-center"
                >
                  <span className="text-xs font-bold text-text-muted w-6 text-center select-none">{i + 1}</span>

                  <Link to={`/video/${vid._id}`} className="relative w-32 md:w-44 flex-shrink-0 aspect-video rounded-xl overflow-hidden bg-surface-hover border border-surface-hover">
                    <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Play size={20} className="text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all" fill="currentColor" />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/video/${vid._id}`} className="font-bold text-text-main hover:text-primary transition-colors line-clamp-1 decoration-primary underline-offset-2">
                       {vid.title}
                    </Link>
                    <p className="text-xs text-text-muted mt-1 truncate">
                       {playlist.owner?.username || "Owner"} · {vid.views} views
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemoveVideo(vid._id)}
                    className="p-2.5 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove from playlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
