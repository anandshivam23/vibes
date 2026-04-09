import React, { useState } from 'react';
import { X, UploadCloud, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

export default function VideoUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !videoFile) {
      return toast.error("Title, description and video file are required");
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('videoFile', videoFile);
    if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
    }

    try {
      setIsPublishing(true);
      const res = await api.post('/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Video published successfully");
      onUploadSuccess(res.data.data);
      onClose();

      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailFile(null);
    } catch (err) {
      toast.error("Failed to upload video");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-surface-hover rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b border-surface-hover">
          <h2 className="text-xl font-bold">Upload Video</h2>
          <button onClick={onClose} className="p-1 hover:bg-surface-hover rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-background border border-surface-hover rounded-lg px-3 py-2 text-text-main focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background border border-surface-hover rounded-lg px-3 py-2 text-text-main focus:outline-none focus:border-primary min-h-[100px]"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
             <div className="flex-1">
                <label className="block text-sm font-medium text-text-muted mb-1">Video File *</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-surface-hover file:text-text-main hover:file:bg-primary hover:file:text-background transition-all"
                  required
                />
             </div>
             <div className="flex-1">
                <label className="block text-sm font-medium text-text-muted mb-1">Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files[0])}
                  className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-surface-hover file:text-text-main hover:file:bg-primary hover:file:text-background transition-all"
                />
             </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-surface-hover mt-6">
             <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg font-medium hover:bg-surface-hover transition-colors">
               Cancel
             </button>
             <button type="submit" disabled={isPublishing} className="bg-primary hover:bg-primary-hover text-background px-5 py-2 rounded-lg font-medium transition-colors flex items-center justify-center min-w-[120px]">
               {isPublishing ? <Loader2 size={18} className="animate-spin" /> : <> <UploadCloud size={18} className="mr-2" /> Upload</>}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
