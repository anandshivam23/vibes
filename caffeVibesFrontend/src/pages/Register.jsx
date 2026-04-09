import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import CoffeeLoader from '../components/CoffeeLoader';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.username || !formData.password || !avatar) {
      return toast.error("Please fill all required fields including Avatar.");
    }

    try {
      setIsLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append('avatar', avatar);
      if (coverImage) data.append('coverImage', coverImage);

      await register(data);
      toast.success("Account created! Please log in.");
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CoffeeLoader isLoading={isLoading} label="Creating your account..." />
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-lg bg-surface border border-surface-hover p-8 rounded-2xl shadow-xl animate-fade-in">
        <h2 className="text-3xl font-display font-bold text-center text-text-main mb-2">Create Account</h2>
        <p className="text-text-muted text-center mb-8">Join the CaffeVibes community</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Full Name</label>
              <input
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full bg-background border border-surface-hover rounded-xl px-4 py-2 text-text-main focus:outline-none focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Username</label>
              <input
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-background border border-surface-hover rounded-xl px-4 py-2 text-text-main focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-background border border-surface-hover rounded-xl px-4 py-2 text-text-main focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-background border border-surface-hover rounded-xl px-4 py-2 text-text-main focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Avatar *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-surface-hover file:text-text-main hover:file:bg-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-surface-hover file:text-text-main hover:file:bg-primary/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-hover text-background font-bold py-3 rounded-xl transition-all disabled:opacity-70 mt-4"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-text-muted text-sm">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
    </>
  );
}
