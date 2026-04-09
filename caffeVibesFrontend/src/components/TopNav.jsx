import React, { useState, useRef } from 'react';
import { Search, Bell, Video, Feather, LogOut, X, Menu, Coffee } from 'lucide-react';
import CoffeeLoader from './CoffeeLoader';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import VideoUploadModal from './VideoUploadModal';
import TweetModal from './TweetModal';

export default function TopNav({ onMenuClick }) {
  const [isUploading, setIsUploading] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isTweetModalOpen, setIsTweetModalOpen] = useState(false);
  const searchRef = useRef(null);

  const handleCreateTweetClick = () => {
    if (!currentUser) { navigate('/login'); return; }
    setIsTweetModalOpen(true);
  };

  const handleUploadVideoClick = () => {
    if (!currentUser) { navigate('/login'); return; }
    setIsVideoModalOpen(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchQuery('');
    setShowMobileSearch(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <CoffeeLoader isLoading={isUploading} fullScreen={true} />
      {showMobileSearch && (
        <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex items-start p-4 pt-6 lg:hidden">
          <form onSubmit={handleSearch} className="w-full flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/60" />
              <input
                ref={searchRef}
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vibes..."
                className="w-full bg-surface/60 border border-surface-hover/60 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-text-main placeholder-text-muted/40"
              />
            </div>
            <button type="button" onClick={() => setShowMobileSearch(false)} className="p-3 text-text-muted hover:text-primary">
              <X size={22} />
            </button>
          </form>
        </div>
      )}

      <header className="h-16 border-b border-surface-hover/30 bg-background/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-3 sm:px-5 lg:px-8 gap-3">
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onMenuClick}
            id="hamburger-btn"
            aria-label="Open menu"
            className="lg:hidden p-2.5 text-text-muted hover:text-primary transition-colors rounded-xl hover:bg-surface/50 touch-target"
          >
            <Menu size={22} />
          </button>
          <Link to="/" className="flex items-center gap-2 lg:hidden" aria-label="Caffe Vibes Home">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-background shadow-lg shadow-primary/20">
              <Coffee size={16} />
            </div>
            <span className="font-display font-black text-base tracking-tight text-text-main hidden sm:block">Caffe Vibes</span>
          </Link>
        </div>
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative group hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted/60 group-focus-within:text-primary transition-colors">
            <Search size={17} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vibes..."
            className="w-full bg-surface/40 border border-surface-hover/50 rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:bg-surface/80 transition-all placeholder-text-muted/40 text-text-main"
          />
        </form>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setShowMobileSearch(true)}
            className="sm:hidden w-10 h-10 rounded-2xl bg-surface/40 border border-surface-hover/60 flex items-center justify-center text-text-muted hover:text-primary transition-all touch-target"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          <button
            onClick={handleCreateTweetClick}
            className="hidden sm:flex w-10 h-10 rounded-2xl bg-surface/40 border border-surface-hover/60 items-center justify-center text-text-muted hover:bg-surface hover:text-primary transition-all shadow-sm group touch-target"
            title="Create Post"
            aria-label="Create post"
          >
            <Feather size={18} className="group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={handleUploadVideoClick}
            className="w-10 h-10 rounded-2xl bg-surface/40 border border-surface-hover/60 flex items-center justify-center text-text-muted hover:bg-surface hover:text-primary transition-all shadow-sm group touch-target"
            title="Upload Video"
            aria-label="Upload video"
          >
            <Video size={18} className="group-hover:scale-110 transition-transform" />
          </button>
          <Link
            to="/notifications"
            className="w-10 h-10 rounded-2xl bg-surface/40 border border-surface-hover/60 flex items-center justify-center text-text-muted hover:bg-surface hover:text-primary transition-all relative shadow-sm group touch-target"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={18} className="group-hover:rotate-12 transition-transform" />
            {currentUser && (
              <>
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background animate-ping" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
              </>
            )}
          </Link>
          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-text-main/5">
              <Link
                to={`/profile/${currentUser.username}`}
                className="w-10 h-10 rounded-2xl bg-surface/40 p-0.5 overflow-hidden border border-surface-hover/60 hover:border-primary shadow-lg hover:scale-105 active:scale-95 transition-all touch-target"
                aria-label="My profile"
              >
                <img
                  src={currentUser.avatar || 'https://i.pravatar.cc/150?img=32'}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 h-10 px-3 sm:px-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-background rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border border-red-500/20 active:scale-95 touch-target whitespace-nowrap"
                aria-label="Log out"
              >
                <LogOut size={15} />
                <span className="hidden lg:inline">Vibe Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <Link
                to="/login"
                className="flex items-center justify-center h-[38px] px-3 sm:px-4 text-[13px] font-bold text-text-muted hover:text-primary transition-all whitespace-nowrap touch-target rounded-xl hover:bg-surface/50"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center h-[38px] px-5 sm:px-6 text-[13px] font-bold bg-primary hover:bg-primary-hover text-background rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap touch-target"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      <VideoUploadModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onUploadSuccess={(newVideo) => navigate(`/video/${newVideo._id}`)}
      />
      <TweetModal
        isOpen={isTweetModalOpen}
        onClose={() => setIsTweetModalOpen(false)}
      />
    </>
  );
}
