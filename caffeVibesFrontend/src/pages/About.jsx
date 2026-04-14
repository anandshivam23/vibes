import React from 'react';
export default function About() {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-display font-bold text-text-main mb-6">About Caffe Vibes</h1>
      <div className="bg-surface border border-surface-hover p-8 rounded-2xl shadow-xl space-y-6">
        <p className="text-text-muted leading-relaxed text-lg">
          Welcome to <span className="text-primary font-semibold">Caffe Vibes</span>, the ultimate social platform dedicated to the art, science, and community of coffee.
        </p>
        <p className="text-text-muted leading-relaxed text-lg">
          Whether you are a seasoned barista, a home brewing enthusiast, or someone who just loves a good cup of morning joe, Caffe Vibes is your digital coffeehouse.
          We built this platform to bring people together over their shared love for rich aromas, perfect roasts, and the cozy atmosphere that only coffee can provide.
        </p>
        <div className="h-px w-full bg-surface-hover my-6"></div>
        <h2 className="text-2xl font-display font-bold text-text-main">Our Mission</h2>
        <p className="text-text-muted leading-relaxed text-lg">
          To connect the global coffee community, providing a space where techniques are shared, beans are debated, and every pour is celebrated.
          Grab your favorite mug, settle in, and share your favorite vibes with us.
        </p>
      </div>
    </div>
  );
}