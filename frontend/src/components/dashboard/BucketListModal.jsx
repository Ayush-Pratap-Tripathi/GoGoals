import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, CheckCircle2, Circle } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';

const BucketListModal = ({ isOpen, onClose }) => {
  const { token } = useContext(AuthContext);
  const [bucketItems, setBucketItems] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const fetchBucketList = async (showLoading = true) => {
    if (!token || !isOpen) return;
    if (showLoading) setIsLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await axios.get(`${apiBase}/goals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const bucketGoals = res.data.filter(goal => goal.category === 'bucket' && !goal.isDeleted);
      setBucketItems(bucketGoals);
    } catch (error) {
      console.error('Failed to load bucket list');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBucketList();
    }
  }, [isOpen, token]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsAdding(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.post(
        `${apiBase}/goals`,
        { category: 'bucket', title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTitle('');
      fetchBucketList(false);
    } catch (error) {
      toast.error('Failed to add item');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    // Optimistic UI Update
    setBucketItems((prev) => 
      prev.map(item => item._id === id ? { ...item, isCompleted: !currentStatus } : item)
    );

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.put(
        `${apiBase}/goals/${id}`,
        { isCompleted: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBucketList(false);
    } catch (error) {
      // Revert if API fails
      setBucketItems((prev) => 
        prev.map(item => item._id === id ? { ...item, isCompleted: currentStatus } : item)
      );
      toast.error('Failed to update item');
    }
  };

  const handleDeleteItem = async (id) => {
    const itemToDelete = bucketItems.find(i => i._id === id);
    // Optimistic Update
    setBucketItems((prev) => prev.filter(item => item._id !== id));

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.delete(`${apiBase}/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBucketList(false);
    } catch (error) {
      if (itemToDelete) {
        setBucketItems((prev) => [...prev, itemToDelete]);
      }
      toast.error('Failed to delete item');
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-auto">
          {/* Backdrop Blur Layer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0f111a]/80 backdrop-blur-md cursor-pointer"
          />

          {/* Action Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.90, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.90, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-lg mx-4 bg-[#2d3250] border border-white/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden relative z-10 flex flex-col font-sans max-h-[70vh]"
          >
            {/* Modal Navigation Block */}
            <div className="flex items-center justify-between px-6 py-5 bg-white/5 border-b border-white/10 shadow-sm">
              <h2 className="text-xl font-extrabold tracking-widest text-white uppercase">Bucket List</h2>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:scale-110 active:scale-95 transition-all outline-none border-none"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            {/* List Array Feed Container */}
            <div className="flex-1 overflow-y-auto w-full p-4" style={{ minHeight: '40vh' }}>
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              ) : bucketItems.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center py-10 opacity-60">
                  <span className="text-4xl mb-4">🎯</span>
                  <span className="text-sm font-medium italic tracking-wide">No dreams yet! Add your aspirations below.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3 w-full">
                  <AnimatePresence>
                    {bucketItems.map((item) => (
                      <motion.div 
                        key={item._id} 
                        layout
                        initial={{ opacity: 0, x: -10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, height: 0, marginTop: 0, marginBottom: 0, padding: 0, overflow: 'hidden' }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${item.isCompleted ? 'bg-green-500/10 border-green-500/30 opacity-70 hover:opacity-100' : 'bg-[#292d44] border-white/5 hover:border-white/20 shadow-md'}`}
                      >
                        {/* Left Block */}
                        <div className="flex items-center gap-4 overflow-hidden pr-4">
                          <button 
                            onClick={() => handleToggleComplete(item._id, item.isCompleted)}
                            className="flex-none outline-none transition-all hover:scale-110 active:scale-95"
                          >
                            {item.isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400 hover:text-purple-400" />
                            )}
                          </button>
                          
                          <span className={`text-sm md:text-base font-medium break-words ${item.isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>
                            {item.title}
                          </span>
                        </div>

                        {/* Right Control Actions */}
                        <button 
                          onClick={() => handleDeleteItem(item._id)}
                          className="flex-none p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/15 rounded-lg transition-colors outline-none opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete Item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Addition Insertion Core */}
            <form onSubmit={handleAddSubmit} className="border-t border-white/10 bg-[#292d44]/50 p-5 flex gap-3 w-full shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] backdrop-blur-md">
              <input 
                type="text" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Add a new dream..."
                className="flex-1 bg-[#2d3250] border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa] transition-all shadow-inner"
              />
              <button 
                type="submit"
                disabled={!newTitle.trim() || isAdding}
                className="w-12 h-12 rounded-xl bg-[#a78bfa] flex items-center justify-center hover:bg-purple-400 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0 shadow-lg"
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default BucketListModal;
