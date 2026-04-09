import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2, Check } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function PlaylistModal({ isOpen, onClose, videoId }) {
  const { currentUser } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchPlaylists();
    }
  }, [isOpen, currentUser]);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/playlist/user/${currentUser._id}`);
      setPlaylists(res.data.data || []);
    } catch (e) {
      toast.error('Failed to load playlists');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    setIsCreating(true);
    try {
      const res = await api.post('/playlist', { name: newPlaylistName, description: '', isPublic });
      setPlaylists([res.data.data, ...playlists]);
      setNewPlaylistName('');
      toast.success('Playlist created');
    } catch (e) {
      toast.error('Failed to create playlist');
    } finally {
      setIsCreating(false);
    }
  };

  const toggleVideoInPlaylist = async (playlist) => {
    const isVideoInPlaylist = playlist.videos.some(v => v._id === videoId || v === videoId || v.id === videoId);

    try {
      if (isVideoInPlaylist) {
         await api.patch(`/playlist/remove/${videoId}/${playlist._id}`);
         setPlaylists(prev => prev.map(p => p._id === playlist._id ? { ...p, videos: p.videos.filter(v => (v._id || v) !== videoId) } : p));
         toast.success("Removed from playlist");
      } else {
         await api.patch(`/playlist/add/${videoId}/${playlist._id}`);
         setPlaylists(prev => prev.map(p => p._id === playlist._id ? { ...p, videos: [...p.videos, videoId] } : p));
         toast.success("Added to playlist");
      }
    } catch (e) {
        toast.error("Failed to update playlist");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-surface-hover rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-4 border-b border-surface-hover">
          <h2 className="text-lg font-bold">Save video to...</h2>
          <button onClick={onClose} className="p-1 hover:bg-surface-hover rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
          {isLoading ? (
            <div className="flex justify-center p-4">
               <Loader2 className="animate-spin text-primary" />
            </div>
          ) : playlists.length > 0 ? (
            playlists.map((pl) => {
              const isAdded = pl.videos.some(v => v._id === videoId || v === videoId || v.id === videoId);
              return (
                <button
                  key={pl._id}
                  onClick={() => toggleVideoInPlaylist(pl)}
                  className="flex items-center gap-3 w-full p-2 hover:bg-surface-hover rounded-lg transition-colors text-left"
                >
                  <div className={`w-5 h-5 border rounded flex flex-shrink-0 items-center justify-center ${isAdded ? 'bg-primary border-primary text-background' : 'border-text-muted/50'}`}>
                     {isAdded && <Check size={14} strokeWidth={3} />}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-text-main truncate">{pl.name}</span>
                    {pl.isPublic === false && <span className="text-[10px] text-primary font-bold uppercase tracking-tighter">Private</span>}
                  </div>
                </button>
              )
            })
          ) : (
            <div className="text-center py-4 text-sm text-text-muted">No playlists found.</div>
          )}
        </div>

        <div className="p-4 border-t border-surface-hover bg-surface/50">
          <div className="flex gap-2">
             <div className="flex-1 flex flex-col gap-2">
               <input
                 type="text"
                 placeholder="New playlist name..."
                 value={newPlaylistName}
                 onChange={e => setNewPlaylistName(e.target.value)}
                 className="w-full bg-background border border-surface-hover rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
               />
               <select 
                 value={isPublic} 
                 onChange={e => setIsPublic(e.target.value === 'true')}
                 className="w-full bg-background border border-surface-hover rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase focus:outline-none focus:border-primary cursor-pointer text-text-muted"
               >
                 <option value="true">Public</option>
                 <option value="false">Private</option>
               </select>
             </div>
             <button
               onClick={handleCreatePlaylist}
               disabled={!newPlaylistName.trim() || isCreating}
               className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-background p-2 rounded-lg flex items-center justify-center transition-colors"
             >
                {isCreating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} strokeWidth={2.5} />}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
