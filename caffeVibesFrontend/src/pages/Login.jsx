import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import CoffeeLoader from '../components/CoffeeLoader';
import { Coffee, Eye, EyeOff } from 'lucide-react';
export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedId = identifier.trim();
    if (!trimmedId || !password) {
      return toast.error('Please fill in all fields');
    }
    if (trimmedId.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedId)) {
        return toast.error('Please enter a valid email address');
      }
    }
    try {
      setIsLoading(true);
      await login(trimmedId, password);
      toast.success('Welcome back! ☕');
      navigate('/');
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <CoffeeLoader isLoading={isLoading} label="Signing you in..." />
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-md bg-surface border border-surface-hover p-6 sm:p-8 rounded-2xl shadow-xl animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-background shadow-xl shadow-primary/20">
              <Coffee size={24} />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-center text-text-main mb-1">
            Welcome Back
          </h2>
          <p className="text-text-muted text-center text-sm mb-6 sm:mb-8">
            Sign in to continue to CaffeVibes
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">
                Email or Username
              </label>
              <input
                id="login-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-background border border-surface-hover rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Enter email or username"
                autoComplete="username"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-surface-hover rounded-xl px-4 py-3 pr-12 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover text-background font-bold py-3 rounded-xl transition-all disabled:opacity-70 flex justify-center mt-2"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 text-center text-text-muted text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}