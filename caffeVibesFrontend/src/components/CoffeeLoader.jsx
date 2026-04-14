import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const calmingQuotes = [
  "Brewing your perfect moment...",
  "Sipping on serenity...",
  "Steeping good vibes only...",
  "Taking a pause for the perfect pour...",
  "Even a bad cup of coffee is better than no coffee at all.",
  "Coffee is a language in itself...",
  "Patience is the secret to a great brew.",
  "Good things take time — just like a good espresso."
];
export default function CoffeeLoader({ isLoading, fullScreen = true, label }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % calmingQuotes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isLoading]);
  if (!isLoading) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`${
          fullScreen
            ? 'fixed inset-0 z-50 bg-background/90 backdrop-blur-md'
            : 'absolute inset-0 z-10 w-full h-full min-h-[200px] bg-background/70 backdrop-blur-sm rounded-2xl'
        } flex flex-col items-center justify-center gap-6`}
      >
        <div className="relative w-32 h-40 flex flex-col items-center justify-end">
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: '100%', opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="absolute top-0 left-1/2 -ml-1 w-2 bg-primary rounded-b-full z-10"
          />
          <div className="w-24 h-24 border-4 border-text-main rounded-b-[2rem] border-t-0 relative overflow-hidden z-20 bg-[#1C1612]">
            <motion.div
              initial={{ height: '10%' }}
              animate={{ height: '90%' }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2.5, ease: 'easeInOut' }}
              className="absolute bottom-0 w-full bg-primary/80"
            />
          </div>
          <div className="absolute right-[2px] bottom-6 w-8 h-12 border-4 border-text-main rounded-r-full border-l-0 z-10" />
        </div>
        {label && (
          <p className="text-text-main font-semibold text-base">{label}</p>
        )}
        <div className="h-10 relative w-full flex items-center justify-center px-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={quoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-primary font-display font-medium text-base tracking-wide italic text-center"
            >
              "{calmingQuotes[quoteIndex]}"
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}