import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import CoffeeLoader from '../components/CoffeeLoader';
import { Coffee, Upload } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
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
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-md bg-surface border border-surface-hover p-6 sm:p-8 rounded-2xl shadow-xl animate-fade-in">
          {/* Brand */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-background shadow-xl shadow-primary/20">
              <Coffee size={24} />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-bold text-center text-text-main mb-1">Create Account</h2>
          <p className="text-text-muted text-center text-sm mb-6 sm:mb-8">Join the CaffeVibes community</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name & Username row — stacks on tiny screens */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Full Name</label>
                <input
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-background border border-surface-hover rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Username</label>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-background border border-surface-hover rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary transition-all"
                  placeholder="johndoe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-background border border-surface-hover rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-background border border-surface-hover rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* File uploads — stacks on tiny screens */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Avatar *</label>
                {avatarPreview ? (
                  <div className="relative w-full h-24 rounded-xl overflow-hidden mb-2 border border-surface-hover">
                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setAvatar(null); setAvatarPreview(null); }} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full"><Coffee size={14} /></button>
                  </div>
                ) : null}
                <label className="flex items-center justify-center gap-2 cursor-pointer bg-background border border-surface-hover rounded-xl px-4 py-2.5 text-sm text-text-muted hover:border-primary transition-all text-center">
                  <Upload size={16} className="shrink-0 text-primary" />
                  <span className="truncate">{avatar ? avatar.name : 'Choose file'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setAvatar(file);
                      if (file) setAvatarPreview(URL.createObjectURL(file));
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Cover Image</label>
                {coverPreview ? (
                  <div className="relative w-full h-24 rounded-xl overflow-hidden mb-2 border border-surface-hover">
                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setCoverImage(null); setCoverPreview(null); }} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full"><Coffee size={14} /></button>
                  </div>
                ) : null}
                <label className="flex items-center justify-center gap-2 cursor-pointer bg-background border border-surface-hover rounded-xl px-4 py-2.5 text-sm text-text-muted hover:border-primary transition-all text-center">
                  <Upload size={16} className="shrink-0 text-primary" />
                  <span className="truncate">{coverImage ? coverImage.name : 'Choose file'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setCoverImage(file);
                      if (file) setCoverPreview(URL.createObjectURL(file));
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover text-background font-bold py-3 rounded-xl transition-all disabled:opacity-70 mt-2"
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
