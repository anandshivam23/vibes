import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopNav from './TopNav'
import ChatbotWidget from './ChatbotWidget'
import { AnimatePresence, motion } from 'framer-motion'
export default function Layout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  return (
    <div className="flex h-[100dvh] w-full max-w-[100vw] bg-background overflow-hidden relative">
      <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
          />
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col min-w-0 w-full h-[100dvh] overflow-hidden">
        <TopNav onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          <Outlet />
        </main>
      </div>
      <ChatbotWidget />
    </div>
  )
}