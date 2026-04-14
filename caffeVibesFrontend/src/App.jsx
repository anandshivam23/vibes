import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Feed from './pages/Feed'
import VideoPlayer from './pages/VideoPlayer'
import Profile from './pages/Profile'
import Subscriptions from './pages/Subscriptions'
import Playlists from './pages/Playlists'
import PlaylistDetail from './pages/PlaylistDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import About from './pages/About'
import Terms from './pages/Terms'
import SearchResults from './pages/SearchResults'
import Notifications from './pages/Notifications'
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
          <Toaster position="top-center" toastOptions={{ style: { background: '#1c1c1e', color: '#f3f4f6', border: '1px solid #2c2c2e' } }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Feed />} />
            <Route path="video/:id" element={<VideoPlayer />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="about" element={<About />} />
            <Route path="terms" element={<Terms />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="tweets" element={<Feed />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="playlists" element={<Playlists />} />
            <Route path="playlist/:id" element={<PlaylistDetail />} />
            <Route path="liked" element={<Feed />} />
            <Route path="disliked" element={<Feed />} />
          </Route>
        </Routes>
        </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
export default App