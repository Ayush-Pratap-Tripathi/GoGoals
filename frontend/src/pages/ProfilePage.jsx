import { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Camera, Trash2, ArrowLeft, AlertTriangle, UserCircle2, Save, UploadCloud } from 'lucide-react';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

const ProfilePage = () => {
  const { user, token, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Primary Profile State
  const [name, setName] = useState(user?.name || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  
  // Updating Identifiers
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  // Deletion Modal State
  const [deleteStep, setDeleteStep] = useState(0); 
  const [deleteInput, setDeleteInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const exactPhrase = `I'm ${user?.name} and I am deleting my account on GoGoals.`;

  // Crop Subsystem State
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // 1. Initiate Upload and trigger crop UI
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImageSrc(reader.result);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
      e.target.value = null; // Reset securely
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // 2. Perform the mathematical crop and submit to Node
  const handleSaveCrop = async () => {
    try {
      setIsUpdatingAvatar(true);
      const croppedImageBase64 = await getCroppedImg(cropImageSrc, croppedAreaPixels);
      
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.put(`${apiBase}/auth/profile/avatar`, {
        profilePicture: croppedImageBase64
      }, config);

      login(response.data, response.data.token);
      setProfilePicture(croppedImageBase64);
      setIsCropModalOpen(false);
      setCropImageSrc(null);
      
      toast.success("Profile pic updated successfully", {
        style: { background: '#22c55e', color: '#fff', borderRadius: '12px' }
      });
    } catch (e) {
      toast.error('Failed to save profile picture.');
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  // 3. Destructively wipe profile picture
  const handleRemovePicture = async () => {
    // Avoid double clicks
    if (isUpdatingAvatar) return;
    
    setIsUpdatingAvatar(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.put(`${apiBase}/auth/profile/avatar`, {
        profilePicture: ''
      }, config);

      login(response.data, response.data.token);
      setProfilePicture('');
      
      toast.success("Profile pic removed successfully", {
        style: { background: '#22c55e', color: '#fff', borderRadius: '12px' }
      });
    } catch (e) {
      toast.error('Failed to remove picture.');
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  // 4. Standalone string data handler
  const handleUpdateName = async (e) => {
    e.preventDefault();
    setIsUpdatingName(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.put(`${apiBase}/auth/profile/name`, {
        name
      }, config);

      login(response.data, response.data.token);
      toast.success("Name updated successfully", {
        style: { background: '#22c55e', color: '#fff', borderRadius: '12px' }
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update name.");
    } finally {
      setIsUpdatingName(false);
    }
  };

  // 5. Account Destruction Hook
  const handleDeleteAccount = async () => {
    if (deleteInput !== exactPhrase) {
      toast.error("Exact phrase match required.");
      return;
    }
    setIsDeleting(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.delete(`${apiBase}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Account permanently deleted.");
      logout();
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account.");
      setIsDeleting(false);
    }
  };

  const closeDeleteModals = () => {
    setDeleteStep(0);
    setDeleteInput('');
  };

  return (
    <div className="bg-[#1a1c2d] min-h-screen w-full flex flex-col font-sans text-white relative isolate">
      
      {/* Background Micro-Gradients */}
      <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] bg-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Fixed Navbar */}
      <div className="flex-none w-full bg-[#1a1c2d]/80 backdrop-blur-xl z-40 px-4 md:px-8 border-b border-white/5 flex items-center justify-center">
        <DashboardNavbar />
      </div>

      <main className="flex-1 w-full max-w-5xl mx-auto py-12 px-6 flex flex-col relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col mb-10 gap-4">
          <div className="flex flex-col">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-400 hover:text-[#3b82f6] transition-colors mb-6 outline-none group w-fit font-medium text-sm tracking-wide"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform duration-300" />
              Back to Dashboard
            </button>

            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-2 tracking-tight">
              Account Settings
            </h1>
            <p className="text-gray-400 text-lg">Manage your personal settings, avatar, and security protocols.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Avatar Settings Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="col-span-1 bg-white/[0.03] border border-white/5 backdrop-blur-2xl rounded-[2rem] p-8 flex flex-col items-center gap-8 shadow-2xl h-fit w-full"
          >
            <div className="flex flex-col items-center w-full">
              <div className="w-40 h-40 rounded-full border-4 border-blue-500/20 overflow-hidden bg-black/40 shadow-2xl flex items-center justify-center relative group">
                {profilePicture ? (
                  <img src={profilePicture} alt="User Avatar Display" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <Camera className="w-16 h-16 text-white/20" />
                )}
                {/* Visual loading state overlay if needed, usually fast enough natively */}
                {isUpdatingAvatar && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 backdrop-blur-sm">
                    <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <h3 className="mt-4 text-xl font-bold text-white tracking-wide">{user?.name || 'Your Name'}</h3>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="w-full flex flex-col gap-3">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUpdatingAvatar}
                className="w-full py-3.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 outline-none group disabled:opacity-50"
              >
                <UploadCloud className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                Upload New Image
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              {profilePicture && (
                <button 
                  onClick={handleRemovePicture}
                  disabled={isUpdatingAvatar}
                  className="w-full py-3.5 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 font-medium rounded-xl transition-colors border border-transparent hover:border-red-500/20 outline-none disabled:opacity-50"
                >
                  Remove Picture
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 text-center px-4 leading-relaxed">
              Acceptable formats: JPG, PNG. strictly limits to 2MB. Crops automatically.
            </p>
          </motion.div>

          {/* Details & Danger Zone Column */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-8">
            
            {/* Primary Details Form */}
            <motion.form 
              id="profileNameForm"
              onSubmit={handleUpdateName} 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white/[0.03] border border-white/5 backdrop-blur-2xl rounded-[2rem] p-8 md:p-10 shadow-2xl flex flex-col gap-8"
            >
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <UserCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-wide">Profile Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-5 py-4 bg-black/30 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium text-lg"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest pl-1">Secure Email</label>
                  <input 
                    type="email" 
                    value={user?.email || ''} 
                    disabled
                    className="w-full px-5 py-4 bg-black/50 border border-white/5 rounded-2xl text-gray-500 cursor-not-allowed outline-none font-medium text-lg opacity-80"
                  />
                  <span className="text-xs text-gray-500 pl-1">Emails are locked as the primary indexing identifier.</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isUpdatingName}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 active:scale-95 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] outline-none disabled:opacity-70 w-fit"
              >
                <Save className="w-5 h-5" />
                {isUpdatingName ? 'Synchronizing...' : 'Save Name'}
              </button>
            </motion.form>

            {/* Danger Zone Box */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-red-950/10 border border-red-500/20 backdrop-blur-2xl rounded-[2rem] p-8 md:p-10 shadow-lg relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] pointer-events-none group-hover:bg-red-500/20 transition-all" />

              <div className="flex flex-col gap-3 relative z-10">
                <h3 className="text-2xl font-bold text-red-500 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6" /> 
                  Danger Zone
                </h3>
                <p className="text-gray-400 text-base max-w-2xl leading-relaxed">
                  Permanently erase your account, all configured targets, schedules, and analytics. 
                  This destruction sequence is absolute and cannot be rolled back under any circumstances.
                </p>
                <div className="mt-4">
                  <button 
                    onClick={() => setDeleteStep(1)}
                    className="px-8 py-3.5 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold flex items-center gap-3 outline-none hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                  >
                    <Trash2 className="w-5 h-5" />
                    Initiate Data Wipe
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Fixed Footer */}
      <div className="flex-none w-full bg-[#1a1c2d]/90 backdrop-blur-md z-40 border-t border-white/5 py-4 mt-auto relative">
        <DashboardFooter />
      </div>

      {/* Structured Modal Hierarchy for Deletion */}
      {deleteStep === 1 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1e2136] border border-white/10 p-8 rounded-[2rem] w-full max-w-md flex flex-col text-center items-center shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-3">System Override</h2>
            <p className="text-gray-400 text-base mb-8 leading-relaxed px-4">
              You have requested a complete account termination. This will erase all traces of your history natively. Are you fundamentally sure?
            </p>
            <div className="flex w-full gap-4">
              <button 
                onClick={closeDeleteModals}
                className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors outline-none"
              >
                Abort
              </button>
              <button 
                onClick={() => setDeleteStep(2)}
                className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] outline-none"
              >
                Acknowledge Risk
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {deleteStep === 2 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1e2136] border border-red-500/20 p-8 rounded-[2rem] w-full max-w-xl flex flex-col shadow-[0_0_50px_rgba(239,68,68,0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500" />
            <h2 className="text-2xl font-extrabold text-white mb-3">Target Validation</h2>
            <p className="text-gray-400 text-base mb-8 leading-relaxed">
              We require a final exact sequence input to ensure this execution is entirely voluntary. 
              Please type the phrase shown exactly:
            </p>
            
            <div className="bg-black/50 border border-white/5 rounded-xl p-5 select-all text-center mb-6 overflow-x-auto text-lg font-mono tracking-tight text-white font-medium shadow-inner">
              {exactPhrase}
            </div>

            <input 
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Input validation sequence..."
              className="w-full px-5 py-4 bg-black/30 border-2 border-red-500/20 focus:border-red-500 rounded-xl text-white outline-none transition-all mb-8 font-medium placeholder-red-500/30"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />

            <div className="flex w-full gap-4">
              <button 
                onClick={closeDeleteModals}
                className="flex-[0.8] py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-colors outline-none"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={deleteInput !== exactPhrase || isDeleting}
                className="flex-[1.2] py-4 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:bg-[#333] disabled:text-gray-500 text-white font-bold tracking-wide uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:shadow-none outline-none flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                {isDeleting ? 'Obliterating...' : 'Confirm Wipe'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Advanced Crop Integration Modal */}
      {isCropModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1e2136] border border-white/10 rounded-[2rem] w-full max-w-lg flex flex-col overflow-hidden shadow-2xl relative shadow-black"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#292d44]">
              <h2 className="text-xl font-bold text-white tracking-wide">Adjust Picture</h2>
              <button onClick={() => { setIsCropModalOpen(false); setCropImageSrc(null); }} className="text-gray-400 hover:text-white transition-colors">
                 ✕ 
              </button>
            </div>
            
            <div className="relative w-full h-[350px] md:h-[450px] bg-black">
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="p-6 flex flex-col gap-6 bg-[#292d44]">
              <div className="flex items-center gap-4 px-2">
                 <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Zoom</span>
                 <input 
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(e.target.value)}
                    className="w-full accent-blue-500 h-2 bg-black/50 rounded-lg appearance-none cursor-pointer"
                  />
              </div>

              <div className="flex w-full gap-4">
                <button 
                  onClick={() => { setIsCropModalOpen(false); setCropImageSrc(null); }}
                  className="flex-[0.8] py-3.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors outline-none border border-transparent"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveCrop}
                  disabled={isUpdatingAvatar}
                  className="flex-[1.2] py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold tracking-wide rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-50 outline-none flex items-center justify-center"
                >
                  {isUpdatingAvatar ? 'Processing...' : 'Apply Picture'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
