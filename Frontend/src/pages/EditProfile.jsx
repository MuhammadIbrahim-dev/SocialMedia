import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  updateProfile, 
  updateProfileWithAvatar, 
  clearUpdateError 
} from "../redux/userSlice";
import { 
  FiEdit, 
  FiSave, 
  FiX, 
  FiUpload, 
  FiUser, 
  FiMail, 
  FiFileText,
  FiAlertCircle,
  FiCheck,
  FiCamera
} from "react-icons/fi";

export default function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const { user } = useSelector((state) => state.auth);
  const { current: profile, updateStatus, updateError } = useSelector((state) => state.users);
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        username: profile.username || "",
        bio: profile.bio || ""
      });
      setPreviewUrl(profile.avatar || "");
      setImageError(false);
    }
  }, [profile]);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearUpdateError());
  }, [dispatch]);

  // Validation functions
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
      errors.name = "Name must be less than 50 characters";
    }
    
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (formData.username.length > 30) {
      errors.username = "Username must be less than 30 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = "Username can only contain letters, numbers, and underscores";
    }
    
    if (formData.bio.length > 500) {
      errors.bio = "Bio must be less than 500 characters";
    }
    
    return errors;
  };

  const hasChanges = () => {
    if (!profile) return false;
    return (
      formData.name !== profile.name ||
      formData.username !== profile.username ||
      formData.bio !== profile.bio ||
      selectedFile !== null
    );
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setValidationErrors(prev => ({ 
          ...prev, 
          avatar: "Please select an image file" 
        }));
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors(prev => ({ 
          ...prev, 
          avatar: "File size must be less than 5MB" 
        }));
        return;
      }
      
      setSelectedFile(file);
      setValidationErrors(prev => ({ ...prev, avatar: null }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setValidationErrors({});
    dispatch(clearUpdateError());
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // Check if there are changes
    if (!hasChanges()) {
      setValidationErrors({ general: "No changes detected" });
      return;
    }
    
    try {
      if (selectedFile) {
        // Update with avatar
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name.trim());
        formDataToSend.append('username', formData.username.trim());
        formDataToSend.append('bio', formData.bio.trim());
        formDataToSend.append('avatar', selectedFile);
        
        await dispatch(updateProfileWithAvatar(formDataToSend));
      } else {
        // Update without avatar
        await dispatch(updateProfile({
          name: formData.name.trim(),
          username: formData.username.trim(),
          bio: formData.bio.trim()
        }));
      }
      
      // Success - navigate back to profile
      navigate(`/profile/${user._id || user.id}`);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (hasChanges()) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmed) return;
    }
    navigate(`/profile/${user._id || user.id}`);
  };

  // Handle avatar click
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  // Get fallback avatar URL
  const getFallbackAvatar = (name = 'User') => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=ffffff&size=400`;
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="relative w-full max-w-3xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-30"></div>
          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <FiEdit className="text-white text-lg" />
                </div>
                <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
              </div>
              <button
                onClick={handleCancel}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300 hover:scale-110"
              >
                <FiX size={24} />
              </button>
            </div>

          {/* General Error */}
          {updateError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <FiAlertCircle className="text-red-500 flex-shrink-0" />
              <span className="text-red-700">{updateError.message || updateError}</span>
            </div>
          )}

          {validationErrors.general && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
              <FiAlertCircle className="text-yellow-500 flex-shrink-0" />
              <span className="text-yellow-700">{validationErrors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <img
                  src={imageError ? getFallbackAvatar(formData.name) : (previewUrl || getFallbackAvatar(formData.name))}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-slate-200 group-hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={handleAvatarClick}
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all cursor-pointer"
                     onClick={handleAvatarClick}>
                  <FiCamera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                </div>
              </div>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <FiUpload size={16} />
                  {selectedFile ? "Change Avatar" : "Upload Avatar"}
                </button>
                <p className="text-xs text-slate-500 mt-2">
                  JPG, PNG, GIF up to 5MB
                </p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {validationErrors.avatar && (
                <p className="text-sm text-red-600">{validationErrors.avatar}</p>
              )}
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FiUser className="inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                  validationErrors.name 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                }`}
                placeholder="Enter your full name"
                disabled={updateStatus === "loading"}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FiUser className="inline mr-2" />
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                  validationErrors.username 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                }`}
                placeholder="Enter your username"
                disabled={updateStatus === "loading"}
              />
              {validationErrors.username && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.username}</p>
              )}
              <p className="mt-1 text-xs text-slate-500">
                Only letters, numbers, and underscores allowed
              </p>
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FiFileText className="inline mr-2" />
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-4 py-3 border rounded-lg transition-colors resize-none ${
                  validationErrors.bio 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                }`}
                placeholder="Tell us about yourself..."
                disabled={updateStatus === "loading"}
              />
              <div className="flex justify-between items-center mt-1">
                {validationErrors.bio && (
                  <p className="text-sm text-red-600">{validationErrors.bio}</p>
                )}
                <p className="text-xs text-slate-500 ml-auto">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={updateStatus === "loading" || !hasChanges() || Object.keys(validationErrors).some(key => validationErrors[key])}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                {updateStatus === "loading" ? (
                  <>
                    <div className="w-5 h-5 cursor-pointer border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave size={18} />
                    Save Changes
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={updateStatus === "loading"}
                className="px-6 py-3 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <FiX size={18} />
                Cancel
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </main>
  );
}
