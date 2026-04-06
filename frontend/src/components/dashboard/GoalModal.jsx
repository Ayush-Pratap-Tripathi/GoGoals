import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Check } from 'lucide-react';
import { useState } from 'react';

const GoalModal = ({ isOpen, onClose, category, goals, onToggle, onDelete, onAdd }) => {
  const [newTitle, setNewTitle] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newTitle.trim() === '') return;
    onAdd(category, newTitle);
    setNewTitle('');
  };

  const formattedCategory = category === 'daily' ? "Today" : 
                            category === 'weekly' ? "This Week" : 
                            category === 'monthly' ? "This Month" : "Goals";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto shadow-2xl">
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
            className="w-full max-w-lg mx-4 bg-[#2d3250] border border-white/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden relative z-10 flex flex-col font-sans"
            style={{ maxHeight: '85vh' }}
          >
            {/* Modal Navigation Block */}
            <div className="flex items-center justify-between px-6 py-5 bg-white/5 border-b border-white/10 shadow-sm">
              <h2 className="text-xl font-extrabold tracking-widest text-white uppercase">{formattedCategory}'s Tasks</h2>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:scale-110 active:scale-95 transition-all outline-none border-none"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            {/* List Array Feed Container */}
            <div className="flex-1 overflow-y-auto w-full p-4" style={{ minHeight: '40vh' }}>
              {goals.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center py-10 opacity-60">
                  <span className="text-4xl mb-4">✨</span>
                  <span className="text-sm font-medium italic tracking-wide">No pending tasks! Enjoy your break.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3 w-full">
                  {goals.map((goal) => (
                    <motion.div 
                      key={goal._id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${goal.isCompleted ? 'bg-green-500/10 border-green-500/30 opacity-70 hover:opacity-100' : 'bg-[#292d44] border-white/5 hover:border-white/20 shadow-md'}`}
                    >
                      {/* Left Block */}
                      <div className="flex items-center gap-4 overflow-hidden pr-4">
                        <button 
                          onClick={() => onToggle(goal._id, goal.isCompleted)}
                          className={`flex-none w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all duration-200 outline-none hover:scale-110 active:scale-95 ${goal.isCompleted ? 'bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-transparent border-gray-400 hover:border-blue-400'}`}
                        >
                          {goal.isCompleted && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                        </button>
                        
                        <span className={`text-sm md:text-base font-medium break-words ${goal.isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {goal.title}
                        </span>
                      </div>

                      {/* Right Control Actions */}
                      <button 
                        onClick={() => onDelete(goal._id)}
                        className="flex-none p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/15 rounded-lg transition-colors outline-none opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete Task"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Addition Insertion Core */}
            <form onSubmit={handleAddSubmit} className="border-t border-white/10 bg-[#292d44]/50 p-5 flex gap-3 w-full shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] backdrop-blur-md">
              <input 
                type="text" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}

                className="flex-1 bg-[#2d3250] border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all shadow-inner"
              />
              <button 
                type="submit"
                disabled={!newTitle.trim()}
                className="w-12 h-12 rounded-xl bg-[#3b82f6] flex items-center justify-center hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0 shadow-lg"
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GoalModal;
