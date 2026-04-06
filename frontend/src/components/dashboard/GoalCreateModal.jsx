import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarPlus, Target } from 'lucide-react';
import { useState } from 'react';

const GoalCreateModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('daily');
  const [scheduledDate, setScheduledDate] = useState(''); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !category) return;
    
    // Pass strictly mapped backend API variables seamlessly out of React isolation
    onAdd(category, title, scheduledDate);
    
    // Destroy input states resolving closure UI cleanly
    setTitle('');
    setCategory('daily');
    setScheduledDate('');
    onClose();
  };

  // Natively render identically mapping DOM type strings to trigger exact user-OS system calendars
  const renderDateInput = () => {
    switch(category) {
      case 'daily':
        return (
          <input 
            type="date" 
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full bg-[#292d44] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#3b82f6] outline-none transition-colors"
          />
        );
      case 'weekly':
        return (
          <input 
            type="week" 
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full bg-[#292d44] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#3b82f6] outline-none transition-colors"
          />
        );
      case 'monthly':
        return (
          <input 
            type="month" 
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full bg-[#292d44] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#3b82f6] outline-none transition-colors"
          />
        );
      case 'yearly':
        return (
          <input 
            type="number" 

            min="2020" max="2100"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full bg-[#292d44] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#3b82f6] outline-none transition-colors"
          />
        );
      default:
        return null;
    }
  };

  // Label UI map tracking form field semantics dynamically!
  const dateLabel = category === 'daily' ? 'Select Date' :
                    category === 'weekly' ? 'Select Week' :
                    category === 'monthly' ? 'Select Month' :
                    category === 'yearly' ? 'Enter Year' : 'No Date Required';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-auto shadow-2xl">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0f111a]/80 backdrop-blur-md cursor-pointer"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="w-full max-w-md bg-[#2d3250] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10 font-sans mx-4"
          >
            {/* Modal Heading Title Hook */}
            <div className="flex items-center justify-between px-6 py-5 bg-[#292d44]/50 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <CalendarPlus className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold tracking-wide text-white uppercase">Add Missing Goal</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110 active:scale-95 outline-none"
              >
                <X className="w-4 h-4 text-gray-300" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
              
              {/* String Description Target */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-300 tracking-wide uppercase">Goal Description <span className="text-red-400">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Target className="w-4 h-4 text-gray-500" />
                  </div>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}

                    className="w-full bg-[#292d44] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors shadow-inner"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Dropdown Select Hooks */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-300 tracking-wide uppercase">Goal Category <span className="text-red-400">*</span></label>
                <select 
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setScheduledDate(''); // Wipe scheduling array conditionally destroying parameter string leaks
                  }}
                  className="w-full bg-[#292d44] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors cursor-pointer"
                >
                  <option value="daily">Daily Goal</option>
                  <option value="weekly">Weekly Goal</option>
                  <option value="monthly">Monthly Goal</option>
                  <option value="yearly">Yearly Goal</option>
                  <option value="bucket">Bucket List</option>
                </select>
              </div>

              {/* System Calendar Hook Mount */}
              {category !== 'bucket' && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-300 tracking-wide uppercase">{dateLabel}</label>
                  {renderDateInput()}
                  <p className="text-xs text-gray-500 mt-1 italic leading-relaxed">Selecting a range ensures the tracker counts it identically within that cycle.</p>
                </div>
              )}

              {/* Executing Submit Array */}
              <button 
                type="submit"
                disabled={!title.trim()}
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-[#3b82f6] hover:from-blue-500 hover:to-blue-400 text-white font-bold tracking-widest uppercase py-4 rounded-xl transition-all shadow-[0_5px_20px_rgba(59,130,246,0.3)] active:scale-95 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Schedule Goal
              </button>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GoalCreateModal;
