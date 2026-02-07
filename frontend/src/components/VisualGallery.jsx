import { useState, useEffect } from 'react';
import { FaCloudUploadAlt, FaTrash, FaImages, FaPlus } from 'react-icons/fa';
import api from '../utils/api';

const VisualGallery = ({ onUpdate }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/gallery/images');
      if (response.data.success) {
        setImages(response.data.images || []);
      }
    } catch (error) {
      console.error('Fetch gallery error:', error);
      setError('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const validateFiles = (files) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxFiles = 10;

    if (files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} images at once`);
      return false;
    }

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError('Please select valid image files (JPG, PNG, WEBP)');
        return false;
      }
      if (file.size > maxSize) {
        setError(`Image "${file.name}" exceeds 5MB. Please choose smaller images.`);
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    if (!validateFiles(files)) {
      event.target.value = '';
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      const response = await api.post('/gallery/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setImages(response.data.images || []);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDelete = async (imageUrl) => {
    if (!window.confirm('Are you sure you want to remove this image from your gallery?')) {
      return;
    }

    try {
      const response = await api.delete('/gallery/images', {
        data: { imageUrl }
      });

      if (response.data.success) {
        setImages(response.data.images || []);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.response?.data?.message || 'Failed to delete image');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <FaImages className="text-emerald-600" /> Visual Gallery
          </h3>
        </div>
        <div className="p-12 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-500">Loading gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <FaImages className="text-emerald-600" /> Visual Gallery
        </h3>
        <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-medium">
          {images.length} {images.length === 1 ? 'image' : 'images'}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Upload Button Card */}
          <label className="border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-xl flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-emerald-50 transition-colors group relative overflow-hidden">
            {uploading ? (
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-2"></div>
                <span className="text-xs text-emerald-600 font-medium">Uploading...</span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-emerald-500 mb-2 group-hover:scale-110 transition-transform">
                  <FaPlus />
                </div>
                <span className="text-sm font-bold text-emerald-700">Add Images</span>
                <span className="text-xs text-emerald-600/70">Max 10 at once</span>
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>

          {/* Image Cards */}
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200 shadow-sm bg-gray-100"
            >
              <img
                src={url}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleDelete(url)}
                  className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors shadow-lg transform hover:scale-110"
                  title="Delete image"
                >
                  <FaTrash size={14} />
                </button>
              </div>
              <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {images.length === 0 && !uploading && (
          <div className="text-center py-8">
            <FaCloudUploadAlt className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No images in your gallery yet</p>
            <p className="text-sm text-gray-400">
              Upload product images to showcase them on your profile
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualGallery;
