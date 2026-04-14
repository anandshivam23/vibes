import React, { useState } from 'react';
import { X, Loader2, Camera, Shield, AlertTriangle, User, KeyRound, Trash2, Mail, AtSign, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
const TAB_PROFILE = 'profile';
const TAB_SECURITY = 'security';
const TAB_DANGER = 'danger';
export default function EditProfileModal({ isOpen, onClose, profile, onUpdated }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TAB_PROFILE);
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar || null);
  const [coverPreview, setCoverPreview] = useState(profile?.coverImage || null);
  const [isSaving, setIsSaving] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isChangingPw, setIsChangingPw] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const DELETE_PHRASE = 'DELETE MY ACCOUNT';
  if (!isOpen) return null;
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
  };
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); }
  };
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let updatedProfile = { ...profile };
      if (fullName !== profile.fullName) {
        const res = await api.patch('/users/update-account', { fullName, email: profile.email });
        updatedProfile = { ...updatedProfile, ...res.data.data };
      }
      if (avatarFile) {
        const fd = new FormData();
        fd.append('avatar', avatarFile);
        const res = await api.patch('/users/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        updatedProfile = { ...updatedProfile, avatar: res.data.data.avatar };
      }
      if (coverFile) {
        const fd = new FormData();
        fd.append('coverImage', coverFile);
        const res = await api.patch('/users/cover-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        updatedProfile = { ...updatedProfile, coverImage: res.data.data.coverImage };
      }
      toast.success('Profile updated!');
      onUpdated?.(updatedProfile);
      onClose();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) return toast.error('Fill all fields');
    if (newPassword !== confirmPassword) return toast.error('New passwords do not match');
    const pwErrors = [];
    if (newPassword.length < 8)             pwErrors.push('at least 8 characters');
    if (!/[A-Z]/.test(newPassword))        pwErrors.push('an uppercase letter');
    if (!/[a-z]/.test(newPassword))        pwErrors.push('a lowercase letter');
    if (!/[0-9]/.test(newPassword))        pwErrors.push('a number');
    if (!/[^A-Za-z0-9]/.test(newPassword)) pwErrors.push('a special character');
    if (pwErrors.length > 0) {
      return toast.error(`Password needs: ${pwErrors.join(', ')}`);
    }
    if (oldPassword === newPassword) return toast.error('New password must differ from current password');
    setIsChangingPw(true);
    try {
      await api.post('/users/change-password', { oldPassword, newPassword });
      toast.success('Password changed successfully!');
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPw(false);
    }
  };
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== DELETE_PHRASE) return toast.error(`Type "${DELETE_PHRASE}" to confirm`);
    setIsDeleting(true);
    try {
      await api.delete('/users/delete-account');
      await logout();
      toast.success('Account deleted. Goodbye! ☕');
      navigate('/register');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };
  const tabs = [
    { key: TAB_PROFILE, label: 'Profile', icon: User },
    { key: TAB_SECURITY, label: 'Security', icon: Shield },
    { key: TAB_DANGER, label: 'Danger Zone', icon: AlertTriangle },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-surface border border-surface-hover rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-surface-hover flex-shrink-0">
          <h2 className="text-xl font-bold text-text-main">Edit Profile</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-hover transition-colors text-text-muted">
            <X size={18} />
          </button>
        </div>
        <div className="flex border-b border-surface-hover flex-shrink-0">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all border-b-2 ${
                activeTab === key
                  ? key === TAB_DANGER
                    ? 'border-red-500 text-red-400'
                    : 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-main'
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
        <div className="overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {activeTab === TAB_PROFILE && (
              <motion.form
                key="profile"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSaveProfile}
                className="p-6 space-y-5"
              >
                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-2">Cover Image</label>
                  <div className="relative h-36 rounded-xl overflow-hidden bg-surface-hover group cursor-pointer border border-surface-hover">
                    {coverPreview && <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />}
                    {!coverPreview && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted">
                        <Camera size={28} className="mb-1" />
                        <span className="text-xs">No cover image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={22} className="text-white mr-2" />
                      <span className="text-white text-sm font-semibold">Change Cover</span>
                    </div>
                    <input id="cover-upload" type="file" accept="image/*" onChange={handleCoverChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/30 flex-shrink-0 group cursor-pointer shadow-lg">
                    {avatarPreview
                      ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-surface-hover flex items-center justify-center"><User size={32} className="text-text-muted" /></div>
                    }
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                      <Camera size={20} className="text-white" />
                    </div>
                    <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 rounded-full" />
                  </div>
                  <div>
                    <p className="font-bold text-text-main">Profile Photo</p>
                    <p className="text-xs text-text-muted mt-1">Click to change • Recommended: 400×400</p>
                    <p className="text-xs text-primary mt-1 font-semibold">JPG, PNG, GIF up to 5MB</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Your display name"
                      className="w-full bg-background border border-surface-hover rounded-xl pl-9 pr-4 py-2.5 text-text-main focus:outline-none focus:border-primary/60 transition-colors text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-1.5">Username</label>
                  <div className="relative">
                    <AtSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      value={profile?.username || ''}
                      disabled
                      className="w-full bg-surface-hover/50 border border-surface-hover rounded-xl pl-9 pr-4 py-2.5 text-text-muted cursor-not-allowed text-sm"
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-1 pl-1">Username cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      className="w-full bg-surface-hover/50 border border-surface-hover rounded-xl pl-9 pr-4 py-2.5 text-text-muted cursor-not-allowed text-sm"
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-1 pl-1">Email cannot be changed here</p>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl hover:bg-surface-hover transition-colors text-sm font-semibold text-text-muted">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSaving} className="px-6 py-2 bg-primary hover:bg-primary-hover text-background rounded-xl text-sm font-bold disabled:opacity-50 transition-colors flex items-center gap-2">
                    {isSaving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : 'Save Changes'}
                  </button>
                </div>
              </motion.form>
            )}
            {activeTab === TAB_SECURITY && (
              <motion.form
                key="security"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleChangePassword}
                className="p-6 space-y-5"
              >
                <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl mb-4">
                  <Shield size={20} className="text-primary flex-shrink-0" />
                  <p className="text-sm text-text-muted">Change your account password. Choose something strong and unique.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-1.5">Current Password</label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type={showOld ? 'text' : 'password'}
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full bg-background border border-surface-hover rounded-xl pl-9 pr-10 py-2.5 text-text-main focus:outline-none focus:border-primary/60 transition-colors text-sm"
                    />
                    <button type="button" onClick={() => setShowOld(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main">
                      {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-1.5">New Password</label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Min 8 chars, uppercase, number, symbol"
                      className="w-full bg-background border border-surface-hover rounded-xl pl-9 pr-10 py-2.5 text-text-main focus:outline-none focus:border-primary/60 transition-colors text-sm"
                    />
                    <button type="button" onClick={() => setShowNew(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main">
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {newPassword && (
                    <div className="mt-1.5 space-y-1.5">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => {
                          let score = 0;
                          if (newPassword.length >= 8)            score++;
                          if (/[A-Z]/.test(newPassword))          score++;
                          if (/[a-z]/.test(newPassword))          score++;
                          if (/[0-9]/.test(newPassword))          score++;
                          if (/[^A-Za-z0-9]/.test(newPassword))  score++;
                          const color = score <= 2 ? 'bg-red-500' : score <= 3 ? 'bg-yellow-500' : score <= 4 ? 'bg-blue-400' : 'bg-green-500';
                          return <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= score ? color : 'bg-surface-hover'}`} />;
                        })}
                      </div>
                      <ul className="text-xs space-y-0.5 pl-0.5">
                        {[
                          { text: 'At least 8 characters',  ok: newPassword.length >= 8 },
                          { text: 'Uppercase letter',        ok: /[A-Z]/.test(newPassword) },
                          { text: 'Lowercase letter',        ok: /[a-z]/.test(newPassword) },
                          { text: 'Number',                  ok: /[0-9]/.test(newPassword) },
                          { text: 'Special character',       ok: /[^A-Za-z0-9]/.test(newPassword) },
                        ].map(({ text, ok }) => (
                          <li key={text} className={`flex items-center gap-1.5 ${ok ? 'text-green-400' : 'text-text-muted/50'}`}>
                            <span>{ok ? '✓' : '○'}</span> {text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className={`w-full bg-background border rounded-xl pl-9 pr-4 py-2.5 text-text-main focus:outline-none transition-colors text-sm ${
                        confirmPassword && confirmPassword !== newPassword ? 'border-red-500/60' : 'border-surface-hover focus:border-primary/60'
                      }`}
                    />
                  </div>
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="text-xs text-red-400 mt-1 pl-1">Passwords don't match</p>
                  )}
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl hover:bg-surface-hover transition-colors text-sm font-semibold text-text-muted">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPw || !oldPassword || !newPassword || newPassword !== confirmPassword}
                    className="px-6 py-2 bg-primary hover:bg-primary-hover text-background rounded-xl text-sm font-bold disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {isChangingPw ? <><Loader2 size={15} className="animate-spin" /> Changing...</> : 'Change Password'}
                  </button>
                </div>
              </motion.form>
            )}
            {activeTab === TAB_DANGER && (
              <motion.div
                key="danger"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="p-6 space-y-5"
              >
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-400 text-sm">Danger Zone</p>
                    <p className="text-xs text-text-muted mt-1">These actions are permanent and cannot be undone. Please proceed with caution.</p>
                  </div>
                </div>
                <div className="bg-surface border border-red-500/20 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <Trash2 size={18} className="text-red-400" />
                    </div>
                    <div>
                      <p className="font-bold text-text-main text-sm">Delete Account</p>
                      <p className="text-xs text-text-muted">Permanently delete your account, all videos, tweets and playlists.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-2">
                      To confirm, type <span className="text-red-400 font-bold">"{DELETE_PHRASE}"</span> below:
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={e => setDeleteConfirmText(e.target.value)}
                      placeholder={DELETE_PHRASE}
                      className="w-full bg-background border border-red-500/30 focus:border-red-500/60 rounded-xl px-4 py-2.5 text-sm text-text-main focus:outline-none transition-colors placeholder-text-muted/50 font-mono"
                    />
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || deleteConfirmText !== DELETE_PHRASE}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    {isDeleting ? <><Loader2 size={15} className="animate-spin" /> Deleting...</> : <><Trash2 size={15} /> Delete My Account Forever</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}