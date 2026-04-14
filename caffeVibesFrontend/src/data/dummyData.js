export const baseData = [
    {
      type: 'video', id: '1', title: 'The Perfect Morning Pour Over: A Beginner\'s Guide', thumbnail: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', duration: '12:45', views: '24K', createdAt: '2 hrs ago', owner: { id: 'u1', name: 'Barista Ben', username: 'baristaben', avatar: 'https://i.pravatar.cc/150?u=u1' }
    },
    {
      type: 'tweet', id: 't1', content: 'Just tried that new Ethiopian roast from downtown. Mind blown! 🤯 The floral notes are unreal. Anyone else have a favorite light roast right now?', likes: '142', comments: '28', createdAt: '4 hrs ago', owner: { id: 'u2', name: 'Emma Espresso', username: 'emma_e', avatar: 'https://i.pravatar.cc/150?u=u2' }
    },
    {
      type: 'video', id: '2', title: 'Late Night Lofi & Latte Art Compilation #4', thumbnail: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', duration: '1:04:20', views: '112K', createdAt: '1 day ago', owner: { id: 'u3', name: 'Chill Vibes', username: 'chillvibes', avatar: 'https://i.pravatar.cc/150?u=u3' }
    },
    {
      type: 'video', id: '3', title: 'Reviewing the $3,000 Espresso Machine - Is it worth it?', thumbnail: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', duration: '18:12', views: '54K', createdAt: '2 days ago', owner: { id: 'u4', name: 'Tech & Taste', username: 'techtaste', avatar: 'https://i.pravatar.cc/150?u=u4' }
    },
    {
      type: 'tweet', id: 't2', content: 'Unpopular opinion: Cold brew is highly overrated. Flash brewed iced coffee brings out way more complexity without the muddy flavor.', likes: '891', comments: '344', createdAt: '3 days ago', owner: { id: 'u5', name: 'Coffee Critic', username: 'coffeecritic', avatar: 'https://i.pravatar.cc/150?u=u5' }
    },
    {
      type: 'video', id: '4', title: 'Matcha vs Coffee: The Ultimate Showdown', thumbnail: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', duration: '09:30', views: '18K', createdAt: '3 days ago', owner: { id: 'u6', name: 'Healthy Habits', username: 'healthyhabits', avatar: 'https://i.pravatar.cc/150?u=u6' }
    },
    {
      type: 'tweet', id: 't3', content: 'Starting my day right ☕✨', likes: '45', comments: '2', createdAt: '6 days ago', owner: { id: 'u8', name: 'Morning Person', username: 'morning_person', avatar: 'https://i.pravatar.cc/150?u=u8' }
    }
  ];
  const jokesPool = [
      "Why did the coffee file a police report? It got mugged! 😂☕",
      "How does a tech guy drink coffee? He installs Java! 💻☕",
      "What do you call sad coffee? Despresso. 🥺🍯",
      "I've had so much coffee, I can see noises. 👀🔊",
      "Don't talk to me until I've had my coffee. Actually, don't talk to me at all. 🤫",
      "A yawn is a silent scream for coffee. 🗣️☕",
      "I like my coffee like I like my magic: dark and keeping me up all night. 🪄✨",
      "Why did the espresso keep checking its watch? It was pressed for time! ⏰",
      "Procaffeinating: The tendency to not start anything until you've had a cup of coffee. 📝",
      "What's a coffee's favorite karaoke song? Hit Me With Your Best Shot! 🎤🎵"
  ];
  export const jokesData = Array.from({ length: 50 }, (_, i) => ({
      type: 'tweet',
      id: `joke-${i}`,
      category: 'Coffee Recipes',
      content: jokesPool[Math.floor(Math.random() * jokesPool.length)],
      likes: Math.floor(Math.random() * 500) + 10,
      comments: Math.floor(Math.random() * 100) + 1,
      createdAt: `${(i % 24) + 1} hrs ago`,
      owner: {
        id: `ujoke${i}`,
        name: `Humor Beans ${i}`,
        username: `bean_jokes_${i}`,
        avatar: `https://i.pravatar.cc/150?u=jokeuser${i}`
      }
  }));