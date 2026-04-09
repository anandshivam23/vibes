import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopNav from './TopNav'
import ChatbotWidget from './ChatbotWidget'
import { AnimatePresence, motion } from 'framer-motion'

export default function Layout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] w-full bg-background overflow-hidden relative">
      <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[45] lg:hidden"
          />
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col min-w-0 h-[100dvh]">
        <TopNav onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto scrollbar-hide px-3 sm:px-5 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
          <Outlet />
        </main>
      </div>

      <ChatbotWidget />
    </div>
  )
}
