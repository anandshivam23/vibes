import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, UserCheck, PlaySquare, Heart, Info, FileText, ThumbsDown, Coffee, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const mainMenu = [
    { label: 'Home', icon: Home, path: '/' },
  ];

  const personalMenu = [
    { label: 'Subscriptions', icon: UserCheck, path: '/subscriptions' },
    { label: 'Playlists', icon: PlaySquare, path: '/playlists' },
    { label: 'Liked', icon: Heart, path: '/liked' },
    { label: 'Disliked', icon: ThumbsDown, path: '/disliked' },
  ];

  const footerMenu = [
    { label: 'About', icon: Info, path: '/about' },
    { label: 'Terms', icon: FileText, path: '/terms' },
  ];

  const isActiveRoute = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) onClose();
  };

  const renderNavGroup = (items) => (
    <nav className="flex flex-col space-y-0.5 w-full px-2 mb-2">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActiveRoute(item.path);
        return (
          <NavLink
            key={item.label}
            to={item.path}
            onClick={handleNavClick}
            title={item.label}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm relative group ${
              active
                ? 'bg-primary/10 text-primary'
                : 'text-text-muted hover:bg-surface-hover hover:text-text-main'
            }`}
          >
            {active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
            )}
            <Icon size={19} className={`flex-shrink-0 ${active ? 'text-primary' : ''}`} />
            <span className="truncate block md:hidden lg:block">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <aside className={`
      fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
      w-72 md:w-16 lg:w-60 xl:w-64
      border-r border-surface-hover/30 bg-background flex flex-col pt-5
      h-[100dvh] overflow-y-auto scrollbar-hide flex-shrink-0
      transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="px-3 lg:px-5 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-background font-bold flex-shrink-0 shadow-xl shadow-primary/20">
            <Coffee size={18} />
          </div>
          <span className="font-display font-extrabold text-lg tracking-tight text-text-main truncate block md:hidden lg:block">Caffe Vibes</span>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 text-text-muted hover:text-primary touch-target flex-shrink-0" aria-label="Close menu">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {renderNavGroup(mainMenu)}

        <div className="px-4 my-5">
          <div className="h-px bg-gradient-to-r from-transparent via-surface-hover/50 to-transparent" />
        </div>
        <p className="px-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-text-muted/40 mb-3 block md:hidden lg:block">
          {currentUser ? 'Your Space' : 'Discover'}
        </p>
        {renderNavGroup(personalMenu)}

        <div className="px-4 my-5">
          <div className="h-px bg-gradient-to-r from-transparent via-surface-hover/50 to-transparent" />
        </div>
        {renderNavGroup(footerMenu)}
      </div>
      <div className="mx-2 mb-2 mt-auto px-2">
        <div className="flex items-center gap-1.5 w-full bg-surface/30 border border-surface-hover/40 p-1.5 rounded-[1rem] md:flex-col lg:flex-row">
          <button 
            onClick={() => setTheme('light')} 
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all duration-300 md:py-2.5 lg:py-2 touch-target ${
              theme === 'light' 
                ? 'bg-primary text-background shadow-md shadow-primary/20' 
                : 'text-text-muted hover:text-text-main hover:bg-surface-hover/50'
            }`}
            title="Light Mode"
          >
            <Sun size={16} className={theme === 'light' ? 'text-background' : 'text-primary'} />
            <span className="text-xs font-bold block md:hidden lg:block">Light</span>
          </button>
          
          <button 
            onClick={() => setTheme('dark')} 
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all duration-300 md:py-2.5 lg:py-2 touch-target ${
              theme === 'dark' 
                ? 'bg-surface-hover text-primary shadow-md border border-text-main/5' 
                : 'text-text-muted hover:text-text-main hover:bg-surface-hover/50'
            }`}
             title="Dark Mode"
          >
            <Moon size={16} className={theme === 'dark' ? 'text-primary' : 'text-text-muted'} />
            <span className="text-xs font-bold block md:hidden lg:block">Dark</span>
          </button>
        </div>
      </div>
      {currentUser && (
        <div className="mx-2 mb-4">
          <div className="p-3 bg-surface/40 backdrop-blur-md rounded-[1.5rem] border border-surface-hover/60 hover:bg-surface/60 transition-all group shadow-lg">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <img src={currentUser.avatar} alt="me" className="w-9 h-9 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-surface rounded-full" />
              </div>
              <div className="min-w-0 flex-1 block md:hidden lg:block">
                <p className="text-sm font-bold text-text-main truncate leading-none mb-1">{currentUser.fullName || currentUser.username}</p>
                <p className="text-[11px] text-text-muted truncate font-medium">@{currentUser.username}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pb-4 pt-2 text-center block md:hidden lg:block">
        <p className="text-[9px] font-bold tracking-widest text-text-muted/30 uppercase italic">© 2026 Caffe Vibes</p>
      </div>
    </aside>
  );
}
