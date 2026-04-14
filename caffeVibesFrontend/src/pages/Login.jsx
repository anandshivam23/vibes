import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import CoffeeLoader from '../components/CoffeeLoader';
import { Coffee } from 'lucide-react';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      return toast.error("Please fill in all fields");
    }

    try {
      setIsLoading(true);
      await login(identifier, password);
      toast.success("Successfully logged in!");
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CoffeeLoader isLoading={isLoading} label="Signing you in..." />
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-md bg-surface border border-surface-hover p-6 sm:p-8 rounded-2xl shadow-xl animate-fade-in">
          {/* Brand */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-background shadow-xl shadow-primary/20">
              <Coffee size={24} />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-bold text-center text-text-main mb-1">Welcome Back</h2>
          <p className="text-text-muted text-center text-sm mb-6 sm:mb-8">Sign in to continue to CaffeVibes</p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Email or Username</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-background border border-surface-hover rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Enter email or username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-surface-hover rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover text-background font-bold py-3 rounded-xl transition-all disabled:opacity-70 flex justify-center mt-2"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-text-muted text-sm">
            Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link>
          </div>
        </div>
      </div>
    </>
  );
}
