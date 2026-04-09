import React, { useState } from 'react';
import { X, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters');
    }

    setIsSaving(true);
    try {
      await api.post('/users/change-password', {
        oldPassword,
        newPassword
      });
      toast.success('Password updated successfully!');
      onClose();

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-surface border border-surface-hover rounded-2xl w-full max-w-md shadow-2xl animate-fade-in overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-surface-hover">
          <div className="flex items-center gap-2">
            <Lock size={20} className="text-primary" />
            <h2 className="text-xl font-bold">Change Password</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-surface-hover rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-text-muted mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                required
                className="w-full bg-background border border-surface-hover rounded-xl px-4 py-3 pr-11 text-text-main focus:outline-none focus:border-primary transition-all text-sm"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main p-1"
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-text-muted mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                className="w-full bg-background border border-surface-hover rounded-xl px-4 py-3 pr-11 text-text-main focus:outline-none focus:border-primary transition-all text-sm"
                placeholder="Minimum 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main p-1"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-background border border-surface-hover rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary transition-all text-sm"
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 bg-primary hover:bg-primary-hover text-background rounded-xl text-sm font-bold shadow-lg shadow-primary/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Update Password'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl border border-surface-hover hover:bg-surface-hover transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
