import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, PlaySquare, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import EmptyState from '../components/EmptyState';

export default function Playlists() {
  const { currentUser } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!currentUser) { setIsLoading(false); return; }
    fetchPlaylists();
  }, [currentUser]);

  const fetchPlaylists = async () => {
    try {
      const res = await api.get(`/playlist/user/${currentUser._id}`);
      setPlaylists(res.data.data || []);
    } catch (e) {
      toast.error('Failed to load playlists');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsCreating(true);
    try {
      const res = await api.post('/playlist', { name: newName, description: newDesc, isPublic });
      setPlaylists(prev => [res.data.data, ...prev]);
      setNewName('');
      setNewDesc('');
      setShowCreate(false);
      toast.success('Playlist created!');
    } catch (e) {
      toast.error('Failed to create playlist');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (playlistId) => {
    if (!window.confirm('Delete this playlist?')) return;
    try {
      await api.delete(`/playlist/${playlistId}`);
      setPlaylists(prev => prev.filter(p => p._id !== playlistId));
      toast.success('Playlist deleted');
    } catch (e) {
      toast.error('Failed to delete playlist');
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
    return <div className="flex justify-center py-24"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 md:px-0 pb-10">
      <div className="flex items-center justify-between mt-4 mb-8">
        <h1 className="text-2xl font-display font-bold">Your Playlists</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-background font-semibold py-2 px-4 rounded-full transition-colors text-sm"
        >
          <Plus size={16} /> New Playlist
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-surface border border-primary/30 rounded-2xl p-5 mb-8 flex flex-col gap-3">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-bold">New Playlist</h3>
            <button type="button" onClick={() => setShowCreate(false)}><X size={18} className="text-text-muted hover:text-text-main" /></button>
          </div>
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Playlist name *" className="bg-background border border-surface-hover rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" required />
          <input type="text" value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description (optional)" className="bg-background border border-surface-hover rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-muted font-bold px-1">Visibility</label>
            <select 
              value={isPublic} 
              onChange={e => setIsPublic(e.target.value === 'true')}
              className="bg-background border border-surface-hover rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="true">Public (Visible to everyone)</option>
              <option value="false">Private (Only you can see)</option>
            </select>
          </div>

          <button type="submit" disabled={isCreating || !newName.trim()} className="self-end bg-primary hover:bg-primary-hover text-background font-semibold px-5 py-2 rounded-full text-sm disabled:opacity-50 transition-colors mt-2">
            {isCreating ? <Loader2 size={16} className="animate-spin" /> : 'Create'}
          </button>
        </form>
      )}

      {playlists.length === 0 ? (
        <div className="py-20 flex justify-center w-full">
          <EmptyState type="playlists" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((pl, i) => (
            <div key={pl._id || i} className="group bg-surface border border-surface-hover rounded-2xl overflow-hidden hover:border-primary/30 transition-all shadow-lg hover:shadow-2xl">
              <Link to={`/playlist/${pl._id}`} className="block relative h-40 bg-surface-hover overflow-hidden">
                {pl.isPublic === false && (
                  <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-md text-[10px] text-white font-bold px-3 py-1 rounded-full border border-text-main/20">
                    Private
                  </div>
                )}
                {pl.videos?.[0]?.thumbnail ? (
                  <img src={pl.videos[0].thumbnail} alt={pl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-text-main/[0.02]">
                    <PlaySquare size={36} className="text-text-muted/20" />
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-lg">
                  {pl.videos?.length || 0} VIDEOS
                </div>
              </Link>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <Link to={`/playlist/${pl._id}`} className="font-display font-black text-text-main hover:text-primary transition-colors line-clamp-1 tracking-tight">{pl.name}</Link>
                  <button onClick={() => handleDelete(pl._id)} className="text-text-muted/40 hover:text-red-400 transition-colors ml-2 flex-shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-xs text-text-muted/60 mt-2 line-clamp-2 leading-relaxed">{pl.description || 'No description'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
