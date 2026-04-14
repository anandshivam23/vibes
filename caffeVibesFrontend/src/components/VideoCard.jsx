import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VideoCard({ video, index, compact }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      className={`group flex flex-col cursor-pointer ${compact ? 'gap-2 sm:gap-3 mb-2' : 'gap-3 sm:gap-5 mb-4 sm:mb-6'}`}
    >
      <Link 
        to={`/video/${video.id}`} 
        className={`relative aspect-video overflow-hidden bg-surface border border-text-main/5 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:border-primary/30 ${compact ? 'rounded-xl sm:rounded-2xl' : 'rounded-2xl sm:rounded-[2rem]'}`}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-90 transition-opacity duration-300"></div>
 
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-background/10 backdrop-blur-[1px]">
          <motion.div 
            className={`${compact ? 'w-10 h-10 rounded-xl' : 'w-14 h-14 rounded-2xl'} bg-primary shadow-xl flex items-center justify-center text-background`}
          >
            <Play fill="currentColor" size={compact ? 16 : 24} className="translate-x-0.5" />
          </motion.div>
        </div>
 
        <span className={`absolute bottom-3 right-3 bg-background/90 backdrop-blur-md font-bold uppercase tracking-widest rounded-lg text-text-main shadow-lg border border-text-main/10 ${compact ? 'text-[9px] px-2 py-1' : 'text-[11px] px-3 py-1'}`}>
          {video.duration}
        </span>
      </Link>
 
      <div className={`flex items-start gap-4 ${compact ? 'px-1' : 'px-2'}`}>
        {!compact && (
          <Link to={`/profile/${video.owner.username || video.owner.id}`} className="flex-shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-surface-hover border-2 border-transparent group-hover:border-primary/40 transition-all duration-500 shadow-xl group-hover:rotate-6">
              <img src={video.owner.avatar} alt={video.owner.name} className="w-full h-full object-cover" />
            </div>
          </Link>
        )}
        <div className="flex flex-col overflow-hidden py-1">
          <Link to={`/video/${video.id}`} className={`font-display font-black text-text-main line-clamp-2 leading-tight group-hover:text-primary transition-colors tracking-tight ${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base md:text-lg'}`}>
            {video.title}
          </Link>
          <div className={`flex flex-wrap items-center gap-2 mt-2 ${compact ? 'hidden sm:flex' : 'flex'}`}>
             <Link to={`/profile/${video.owner.username || video.owner.id}`} className={`font-bold text-text-muted/60 hover:text-primary transition-colors uppercase tracking-[0.1em] ${compact ? 'text-[9px]' : 'text-[11px]'}`}>
               {video.owner.name}
             </Link>
             <div className="w-1 h-1 rounded-full bg-text-main/5" />
             <div className={`text-text-muted/30 font-black uppercase tracking-widest flex items-center gap-2 ${compact ? 'text-[8px]' : 'text-[10px]'}`}>
               <span>{video.views} hits</span>
               {compact && <div className="hidden lg:block w-1 h-1 rounded-full bg-text-main/5" />}
               {!compact && <div className="w-1 h-1 rounded-full bg-text-main/5" />}
               <span className={compact ? 'hidden lg:inline' : 'inline'}>{video.createdAt ? new Date(video.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recently'}</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
