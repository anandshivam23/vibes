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
            <Icon size={18} className={`flex-shrink-0 ${active ? 'text-primary' : ''}`} />
            {/* Always show label when sidebar is open on mobile */}
            <span className="truncate">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <aside className={`
      fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
      w-64 lg:w-60 xl:w-64
      border-r border-surface-hover/30 bg-background flex flex-col pt-4
      h-[100dvh] overflow-y-auto scrollbar-hide flex-shrink-0
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Brand header */}
      <div className="px-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-background font-bold flex-shrink-0 shadow-xl shadow-primary/20">
            <Coffee size={16} />
          </div>
          <span className="font-display font-extrabold text-base tracking-tight text-text-main truncate">Caffe Vibes</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 text-text-muted hover:text-primary rounded-lg"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {renderNavGroup(mainMenu)}

        <div className="px-4 my-4">
          <div className="h-px bg-gradient-to-r from-transparent via-surface-hover/50 to-transparent" />
        </div>

        <p className="px-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-text-muted/40 mb-2">
          {currentUser ? 'Your Space' : 'Discover'}
        </p>
        {renderNavGroup(personalMenu)}

        <div className="px-4 my-4">
          <div className="h-px bg-gradient-to-r from-transparent via-surface-hover/50 to-transparent" />
        </div>
        {renderNavGroup(footerMenu)}
      </div>

      {/* Theme toggler */}
      <div className="mx-2 mb-2 mt-auto px-2">
        <div className="flex items-center gap-1.5 w-full bg-surface/30 border border-surface-hover/40 p-1.5 rounded-[1rem]">
          <button
            onClick={() => setTheme('light')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all duration-300 ${
              theme === 'light'
                ? 'bg-primary text-background shadow-md shadow-primary/20'
                : 'text-text-muted hover:text-text-main hover:bg-surface-hover/50'
            }`}
            title="Light Mode"
          >
            <Sun size={15} className={theme === 'light' ? 'text-background' : 'text-primary'} />
            <span className="text-xs font-bold">Light</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-surface-hover text-primary shadow-md border border-text-main/5'
                : 'text-text-muted hover:text-text-main hover:bg-surface-hover/50'
            }`}
            title="Dark Mode"
          >
            <Moon size={15} className={theme === 'dark' ? 'text-primary' : 'text-text-muted'} />
            <span className="text-xs font-bold">Dark</span>
          </button>
        </div>
      </div>

      {/* User info */}
      {currentUser && (
        <div className="mx-2 mb-3">
          <div className="p-3 bg-surface/40 backdrop-blur-md rounded-[1.25rem] border border-surface-hover/60 hover:bg-surface/60 transition-all group shadow-lg">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={currentUser.avatar}
                  alt="me"
                  className="w-8 h-8 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-surface rounded-full" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-text-main truncate leading-none mb-0.5">
                  {currentUser.fullName || currentUser.username}
                </p>
                <p className="text-[11px] text-text-muted truncate font-medium">@{currentUser.username}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pb-3 pt-1 text-center">
        <p className="text-[9px] font-bold tracking-widest text-text-muted/30 uppercase italic">© 2026 Caffe Vibes</p>
      </div>
    </aside>
  );
}
