import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const presets = {
  feed: {
    emoji: '🌌',
    title: 'The universe is quiet...',
    desc: 'BEYOND THE SILENCE LIES YOUR NEXT BIG VIBE. BE THE ONE TO BREAK THE VOID AND SPARK A REVOLUTION!',
    action: null,
  },
  tweets: {
    emoji: '☕',
    title: 'Spill the beans!',
    desc: 'YOU HAVEN\'T POSTED ANY VIBES YET. WHAT\'S BREWING IN THAT BRILLIANT MIND OF YOURS?',
    action: { label: 'Start Vibe', to: '/' },
  },
  jokes: {
    emoji: '🃏',
    title: 'No laughs here yet...',
    desc: 'GOT A WORLD-CLASS PUN? DROP IT AND BRIGHTEN THE GALAXY! THE STAGE IS YOURS.',
    action: { label: 'Drop a Joke', to: '/' },
  },
  comments: {
    emoji: '💬',
    title: 'Silent as a tomb...',
    desc: 'BE THE ONE TO BREAK THE SILENCE. YOUR THOUGHTS ARE THE FUEL THIS COMMUNITY NEEDS!',
    action: null,
  },
  playlists: {
    emoji: '🎧',
    title: "Collection Empty 🎧",
    desc: 'BEYOND THE SILENCE LIES A CURATED EXPERIENCE. THIS CHANNEL IS WAITING FOR ITS FIRST SELECTION.',
    action: { label: 'Explore Now', to: '/' },
  },
  liked: {
    emoji: '🔥',
    title: 'No heat here yet!',
    desc: "START EXPLORING AND HIT THAT THUMBS UP! YOUR HIGH-FIDELITY FAVORITES WILL LIVE HERE.",
    action: { label: 'Start Exploring', to: '/' },
  },
  disliked: {
    emoji: "🌊",
    title: "Ocean of Calm",
    desc: "ZERO DRAMA ZONE. EITHER EVERYTHING IS A VIBE OR YOU'RE JUST VIBING ON A HIGHER FREQUENCY. KEEP THE POSITIVITY FLOWING!",
    action: null,
  },
  subscriptions: {
    emoji: '📡',
    title: 'Frequency Silent 👀',
    desc: 'DISCOVER TOP-TIER CREATORS AND FOLLOW THEIR PULSE! STAY CONNECTED WITH THE ELITE.',
    action: { label: 'Discover Creators', to: '/' },
  },
  profileVideos: {
    emoji: '🎬',
    title: 'No tapes found 🎞️',
    desc: 'BE THE PRODUCER! THIS CHANNEL IS WAITING FOR ITS HIGH-DEFINITION GLOBAL DEBUT.',
    action: null,
  },
  error: {
    emoji: '🌪️',
    title: 'Mixed Signals',
    desc: 'THE VIBES ARE A BIT TURBULENT. CHECK YOUR CONNECTION AND LET\'S TRY SYNCING AGAIN!',
    action: null,
  },
  login: {
    emoji: '🔐',
    title: 'Access Restricted',
    desc: 'VIBE CHECK REQUIRED! LOGIN OR SIGN UP TO ACCESS YOUR PERSONAL HIGH-FIDELITY COLLECTION. YOUR VIBES ARE WAITING.',
    action: { label: 'Vibe In Now', to: '/login' },
  },
};

export default function EmptyState({ type = 'feed', title, desc, emoji, action }) {
  const preset = presets[type] || presets.feed;
  const displayEmoji = emoji || preset.emoji;
  const displayTitle = title || preset.title;
  const displayDesc = desc || preset.desc;
  const displayAction = action !== undefined ? action : preset.action;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.1, y: -30 }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className="flex flex-col items-center justify-center py-16 md:py-32 px-5 md:px-10 text-center bg-text-main/[0.01] backdrop-blur-3xl border border-text-main/5 rounded-[2rem] md:rounded-[4rem] w-full shadow-2xl relative overflow-hidden group mb-12"
      >
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
        
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-8xl md:text-9xl mb-12 select-none drop-shadow-2xl"
        >
          {displayEmoji}
        </motion.div>

        <h3 className="text-3xl md:text-5xl font-display font-black text-text-main mb-4 tracking-tighter">
          {displayTitle}
        </h3>
        
        <p className="text-xs md:text-lg text-text-muted/40 max-w-md leading-relaxed mb-12 font-bold uppercase tracking-widest md:tracking-[0.3em] px-2 md:px-4 break-words w-full">
          {displayDesc}
        </p>

        {displayAction && (
          <Link
            to={displayAction.to}
            className="px-12 py-5 bg-primary text-background font-black rounded-2xl text-[12px] uppercase tracking-[0.4em] transition-all duration-700 shadow-2xl hover:shadow-primary/40 active:scale-95 border border-primary/20"
          >
            {displayAction.label}
          </Link>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
