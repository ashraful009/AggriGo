import { useState, useRef } from 'react';
import { FaCamera, FaTrash, FaUser, FaTimes } from 'react-icons/fa';
import api from '../utils/api';

const ProfilePicture = ({ user, onUpdate }) => {
  const [currentPicture, setCurrentPicture] = useState(
    user?.profilePictures?.length > 0 
      ? user.profilePictures[user.profilePictures.length - 1].url 
      : null
  );
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Validate file
  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, WEBP)');
      return false;
    }

    if (file.size > maxSize) {
      setError('Image size must be less than 5MB');
      return false;
    }

    setError('');
    return true;
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!validateFile(file)) {
      event.target.value = '';
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage({ file, url: reader.result });
      setShowPreview(true);
    };
    reader.readAsDataURL(file);
  };

  // Upload/Update profile picture
  const handleUpload = async () => {
    if (!previewImage) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('profilePicture', previewImage.file);

      const endpoint = currentPicture ? '/profile/picture' : '/profile/picture';
      const method = currentPicture ? 'put' : 'post';

      const response = await api[method](endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setCurrentPicture(response.data.profilePicture.url);
        setShowPreview(false);
        setPreviewImage(null);
        
        // Notify parent component to refresh user data
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Delete profile picture
  const handleDelete = async () => {
    if (!currentPicture) return;
    
    if (!window.confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.delete('/profile/picture');

      if (response.data.success) {
        // Set to previous picture if exists, otherwise null
        setCurrentPicture(
          response.data.profilePicture 
            ? response.data.profilePicture.url 
            : null
        );
        
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.response?.data?.message || 'Failed to delete profile picture');
    } finally {
      setLoading(false);
    }
  };

  // Cancel preview
  const cancelPreview = () => {
    setShowPreview(false);
    setPreviewImage(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      {/* Profile Picture Display */}
      <div className="relative group">
        <div className="w-24 h-24 bg-white rounded-full mx-auto shadow-md flex items-center justify-center text-4xl font-bold text-emerald-600 border-2 border-emerald-100 overflow-hidden">
          {currentPicture ? (
            <img 
              src={currentPicture} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUser className="text-emerald-400 text-3xl" />
          )}
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="text-white hover:text-emerald-300 transition-colors"
            title={currentPicture ? "Change Picture" : "Upload Picture"}
          >
            <FaCamera size={24} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 flex flex-col gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
        >
          <FaCamera size={12} />
          {currentPicture ? 'Change Picture' : 'Upload Picture'}
        </button>

        {currentPicture && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs px-3 py-2 rounded-lg transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed font-semibold border border-red-200"
          >
            <FaTrash size={10} />
            Delete Picture
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600 text-center">{error}</p>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewImage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Preview Profile Picture</h3>
              <button
                onClick={cancelPreview}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="mb-4">
              <div className="w-48 h-48 mx-auto bg-gray-100 rounded-full overflow-hidden border-4 border-emerald-100">
                <img
                  src={previewImage.url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <p className="text-sm text-gray-600 text-center mb-4">
              This is how your profile picture will look
            </p>

            <div className="flex gap-3">
              <button
                onClick={cancelPreview}
                disabled={loading}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold disabled:bg-emerald-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Uploading...' : 'Confirm Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && !showPreview && (
        <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
