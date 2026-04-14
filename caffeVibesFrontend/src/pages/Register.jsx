import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import CoffeeLoader from '../components/CoffeeLoader';
import { Coffee, Upload, Eye, EyeOff } from 'lucide-react';
const calcStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8)            score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[a-z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  if (score <= 2) return { score, label: 'Weak',   color: 'bg-red-500' };
  if (score <= 3) return { score, label: 'Medium',  color: 'bg-yellow-500' };
  if (score <= 4) return { score, label: 'Strong',  color: 'bg-blue-400' };
  return { score, label: 'Very Strong', color: 'bg-green-500' };
};
const validatePassword = (pw) => {
  const errs = [];
  if (pw.length < 8)             errs.push('At least 8 characters');
  if (!/[A-Z]/.test(pw))        errs.push('One uppercase letter');
  if (!/[a-z]/.test(pw))        errs.push('One lowercase letter');
  if (!/[0-9]/.test(pw))        errs.push('One number');
  if (!/[^A-Za-z0-9]/.test(pw)) errs.push('One special character (!@#$…)');
  return errs;
};
export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const strength = useMemo(() => calcStrength(formData.password), [formData.password]);
  const pwErrors = useMemo(() => validatePassword(formData.password), [formData.password]);
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, username, password } = formData;
    if (!fullName || !email || !username || !password || !avatar) {
      return toast.error('Please fill all required fields including Avatar.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error('Please enter a valid email address');
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return toast.error('Username must be 3–20 characters (letters, numbers, underscores only)');
    }
    if (pwErrors.length > 0) {
      return toast.error('Password does not meet the requirements below');
    }
    try {
      setIsLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append('avatar', avatar);
      if (coverImage) data.append('coverImage', coverImage);
      await register(data);
      toast.success('Account created! Please log in. ☕');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <CoffeeLoader isLoading={isLoading} label="Creating your account..." />
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-md bg-surface border border-surface-hover p-6 sm:p-8 rounded-2xl shadow-xl animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-background shadow-xl shadow-primary/20">
              <Coffee size={24} />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-center text-text-main mb-1">
            Create Account
          </h2>
          <p className="text-text-muted text-center text-sm mb-6 sm:mb-8">
            Join the CaffeVibes community
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Full Name</label>
                <input
                  id="register-fullname"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-background border border-surface-hover rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary transition-all"
                  placeholder="John Doe"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Username</label>
                <input
                  id="register-username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-background border border-surface-hover rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary transition-all"
                  placeholder="johndoe"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Email</label>
              <input
                id="register-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-background border border-surface-hover rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary transition-all"
                placeholder="john@example.com"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => { handleInputChange(e); setPwTouched(true); }}
                  className="w-full bg-background border border-surface-hover rounded-xl px-4 py-2.5 pr-12 text-sm text-text-main focus:outline-none focus:border-primary transition-all"
                  placeholder="Min 8 chars, uppercase, number, symbol"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : 'bg-surface-hover'
                        }`}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p className={`text-xs font-semibold ${
                      strength.score <= 2 ? 'text-red-400'
                      : strength.score <= 3 ? 'text-yellow-400'
                      : strength.score <= 4 ? 'text-blue-400'
                      : 'text-green-400'
                    }`}>
                      {strength.label}
                    </p>
                  )}
                  {pwTouched && pwErrors.length > 0 && (
                    <ul className="text-xs text-text-muted space-y-0.5 mt-1 pl-0.5">
                      {[
                        { text: 'At least 8 characters',    ok: formData.password.length >= 8 },
                        { text: 'One uppercase letter',     ok: /[A-Z]/.test(formData.password) },
                        { text: 'One lowercase letter',     ok: /[a-z]/.test(formData.password) },
                        { text: 'One number',               ok: /[0-9]/.test(formData.password) },
                        { text: 'One special character',    ok: /[^A-Za-z0-9]/.test(formData.password) },
                      ].map(({ text, ok }) => (
                        <li key={text} className={`flex items-center gap-1.5 ${ok ? 'text-green-400' : 'text-text-muted/60'}`}>
                          <span>{ok ? '✓' : '○'}</span> {text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Avatar *</label>
                {avatarPreview && (
                  <div className="relative w-full h-24 rounded-xl overflow-hidden mb-2 border border-surface-hover">
                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setAvatar(null); setAvatarPreview(null); }}
                      className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full text-xs"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 cursor-pointer bg-background border border-surface-hover rounded-xl px-4 py-2.5 text-sm text-text-muted hover:border-primary transition-all text-center">
                  <Upload size={16} className="shrink-0 text-primary" />
                  <span className="truncate">{avatar ? avatar.name : 'Choose file'}</span>
                  <input
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setAvatar(file);
                      setAvatarPreview(URL.createObjectURL(file));
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1.5">Cover Image</label>
                {coverPreview && (
                  <div className="relative w-full h-24 rounded-xl overflow-hidden mb-2 border border-surface-hover">
                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setCoverImage(null); setCoverPreview(null); }}
                      className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full text-xs"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 cursor-pointer bg-background border border-surface-hover rounded-xl px-4 py-2.5 text-sm text-text-muted hover:border-primary transition-all text-center">
                  <Upload size={16} className="shrink-0 text-primary" />
                  <span className="truncate">{coverImage ? coverImage.name : 'Choose file'}</span>
                  <input
                    id="register-cover"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setCoverImage(file);
                      setCoverPreview(URL.createObjectURL(file));
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <button
              id="register-submit"
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover text-background font-bold py-3 rounded-xl transition-all disabled:opacity-70 mt-2"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          <div className="mt-6 text-center text-text-muted text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}