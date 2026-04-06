import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CheckCircle2, Circle, Trash2, Plus, ArrowLeft } from 'lucide-react';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BucketListPage = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bucketItems, setBucketItems] = useState([]);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const fetchBucketList = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await axios.get(`${apiBase}/goals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const bucketGoals = res.data.filter(goal => goal.category === 'bucket' && !goal.isDeleted);
      setBucketItems(bucketGoals);
    } catch (error) {
      toast.error('Failed to load bucket list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBucketList();
  }, [token]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    setIsAdding(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.post(
        `${apiBase}/goals`,
        { category: 'bucket', title: newItemTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Item added to bucket list', {
        style: { background: '#22c55e', color: '#fff', borderRadius: '12px' }
      });
      setNewItemTitle('');
      fetchBucketList();
    } catch (error) {
      toast.error('Failed to add item');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.put(
        `${apiBase}/goals/${id}`,
        { isCompleted: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBucketList();
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.delete(`${apiBase}/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Item deleted', {
        style: { background: '#22c55e', color: '#fff', borderRadius: '12px' }
      });
      fetchBucketList();
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  return (
    <div className="bg-[#1a1c2d] min-h-screen w-full flex flex-col font-sans text-white relative isolate">
      
      {/* Background Micro-Gradients */}
      <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Fixed Navbar */}
      <div className="flex-none w-full bg-[#1a1c2d]/80 backdrop-blur-xl z-40 px-4 md:px-8 border-b border-white/5 flex items-center justify-center">
        <DashboardNavbar />
      </div>

      <main className="flex-1 w-full max-w-5xl mx-auto py-12 px-6 flex flex-col relative z-10">
        
        {/* Header */}
        <div className="flex flex-col mb-10 gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-[#3b82f6] transition-colors mb-6 outline-none group w-fit font-medium text-sm tracking-wide"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform duration-300" />
            Back to Dashboard
          </button>

          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-2 tracking-tight">
            Bucket List
          </h1>
          <p className="text-gray-400 text-lg">Manage your life goals and aspirations. Add, complete, or remove items from your bucket list.</p>
        </div>

        {/* Add New Item Form */}
        <motion.form 
          onSubmit={handleAddItem}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/[0.03] border border-white/5 backdrop-blur-2xl rounded-[2rem] p-8 md:p-10 shadow-2xl mb-8 flex flex-col gap-4"
        >
          <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Add New Dream</label>
          <div className="flex gap-3">
            <input 
              type="text" 
              value={newItemTitle} 
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="e.g., Travel to Japan, Learn guitar, Write a book..."
              className="flex-1 px-5 py-4 bg-black/30 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none font-medium text-lg"
            />
            <button 
              type="submit"
              disabled={isAdding || !newItemTitle.trim()}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 active:scale-95 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] outline-none disabled:opacity-70 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </motion.form>

        {/* Bucket List Items */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-3"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          ) : bucketItems.length === 0 ? (
            <div className="bg-white/[0.03] border border-white/5 backdrop-blur-2xl rounded-[2rem] p-12 shadow-2xl text-center">
              <p className="text-gray-400 text-lg mb-2">Your bucket list is empty</p>
              <p className="text-gray-500 text-sm">Start adding your dreams and aspirations above!</p>
            </div>
          ) : (
            bucketItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white/[0.03] border border-white/5 backdrop-blur-2xl rounded-2xl p-5 shadow-lg hover:bg-white/[0.05] transition-all group flex items-center gap-4"
              >
                <button
                  onClick={() => handleToggleComplete(item._id, item.isCompleted)}
                  className="flex-shrink-0 outline-none transition-colors"
                >
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-500 hover:text-purple-400 transition-colors" />
                  )}
                </button>

                <span className={`flex-1 text-lg font-medium transition-all ${
                  item.isCompleted 
                    ? 'text-gray-500 line-through' 
                    : 'text-white'
                }`}>
                  {item.title}
                </span>

                <button
                  onClick={() => handleDeleteItem(item._id)}
                  className="flex-shrink-0 p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all outline-none opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Stats Summary */}
        {bucketItems.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-12 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 backdrop-blur-2xl rounded-[2rem] p-8 text-center"
          >
            <p className="text-gray-300 text-lg">
              You've completed <span className="font-bold text-green-400">{bucketItems.filter(i => i.isCompleted).length}</span> out of <span className="font-bold text-purple-400">{bucketItems.length}</span> dreams
            </p>
            <div className="mt-4 w-full bg-black/30 rounded-full h-2 overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-purple-500 transition-all duration-500"
                style={{ width: `${(bucketItems.filter(i => i.isCompleted).length / bucketItems.length) * 100}%` }}
              />
            </div>
          </motion.div>
        )}
      </main>

      {/* Fixed Footer */}
      <div className="flex-none w-full bg-[#1a1c2d]/90 backdrop-blur-md z-40 border-t border-white/5 py-4 mt-auto relative">
        <DashboardFooter />
      </div>
    </div>
  );
};

export default BucketListPage;
