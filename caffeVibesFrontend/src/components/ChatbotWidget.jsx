import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Trash2, Loader2, Coffee } from 'lucide-react';
import api from '../api/axios';

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-4 py-3">
    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
);

const SYSTEM_CONTEXT = `You are Brew, the friendly AI assistant for Caffe Vibes — a social video sharing platform inspired by coffee culture.

Caffe Vibes features:
- Upload and watch videos
- Post tweets/thoughts (called "vibes")
- Like, dislike, and comment on videos and tweets
- Subscribe to channels/creators
- Create and manage playlists
- User profiles with cover image and avatar
- Real-time updates via WebSockets
- Search for videos and users
- Coffee Recipes section

Rules:
- Be friendly, warm, and use coffee-related puns occasionally
- Only help with questions about Caffe Vibes features
- If asked something unrelated, politely redirect with a coffee pun
- Keep responses concise (2-4 sentences)`;

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey there! ☕ I'm Brew, your Caffe Vibes assistant. How can I help you today? Ask me about uploading videos, playlists, profiles, or anything else on the platform!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const conversationToSend = [
        ...messages.filter(m => m.role !== 'system'),
        userMsg
      ].map(m => ({ role: m.role, content: m.content }));

      const res = await api.post('/chat', { messages: conversationToSend });
      const reply = res.data.data || "I'm having a bit of a coffee break right now! Try again in a moment. ☕";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || '';
      let friendlyMsg = "Oops! Looks like my espresso machine is down. 😅 Please try again shortly.";

      if (errMsg.includes('GEMINI_API_KEY') || errMsg.includes('not configured') || errMsg.includes('invalid_api_key')) {
        friendlyMsg = "⚠️ The AI service isn't configured yet. Please add a valid GEMINI_API_KEY to the backend .env file to enable Brew AI.";
      } else if (errMsg.includes('Too many requests') || errMsg.includes('429')) {
        friendlyMsg = "☕ I'm a little overwhelmed right now! Please wait a moment and try again.";
      } else if (errMsg.includes('quota') || errMsg.includes('billing')) {
        friendlyMsg = "⚠️ The AI service account has reached its quota. Please check your Google Cloud billing.";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: friendlyMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared! Fresh start — just like a new brew. ☕ How can I help?"
    }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-[360px] sm:w-[400px] bg-surface border border-surface-hover rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '520px' }}
          >
            {}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/20 to-primary/5 border-b border-surface-hover flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                  <Coffee size={18} />
                </div>
                <div>
                  <p className="font-bold text-text-main text-sm">Brew AI</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-text-muted">Online — Caffe Vibes Support</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  title="Clear chat"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {}
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    msg.role === 'user'
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-surface-hover border border-surface-hover text-text-muted'
                  }`}>
                    {msg.role === 'user' ? <User size={14} /> : <Coffee size={14} />}
                  </div>

                  {}
                  <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-background rounded-tr-sm font-medium'
                      : 'bg-background border border-surface-hover text-text-main rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center bg-surface-hover border border-surface-hover text-text-muted">
                    <Coffee size={14} />
                  </div>
                  <div className="bg-background border border-surface-hover rounded-2xl rounded-tl-sm">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {}
            <div className="px-3 py-3 border-t border-surface-hover flex-shrink-0">
              <div className="flex items-center gap-2 bg-background border border-surface-hover rounded-xl px-3 py-2 focus-within:border-primary/50 transition-colors">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about Caffe Vibes..."
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-text-main placeholder-text-muted focus:outline-none resize-none max-h-20 leading-relaxed"
                  style={{ overflowY: 'auto' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-background hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {isTyping ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                </button>
              </div>
              <p className="text-[10px] text-text-muted text-center mt-1.5">
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center text-background relative"
        title="Chat with Brew AI"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>

        {}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-background"></span>
        )}
      </motion.button>
    </div>
  );
}
