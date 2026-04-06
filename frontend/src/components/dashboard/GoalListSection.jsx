import { motion } from 'framer-motion';
import { Calendar, Trash2, Check } from 'lucide-react';

const GoalListSection = ({ 
  title,  
  inputType, 
  currentDateStr, 
  setDateStr, 
  goals, 
  onToggle, 
  onDelete 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-[#2d3250] border border-white/5 rounded-2xl shadow-xl overflow-hidden flex flex-col mb-10"
    >
      {/* Section Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-5 bg-[#292d44]/60 border-b border-white/10 gap-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-wider text-white uppercase flex items-center gap-3">
          <Calendar className="w-6 h-6 text-[#3b82f6]" />
          {title}
        </h2>
        
        {/* Dynamic Native OS Date Input Node */}
        <div className="flex items-center">
          <input 
            type={inputType} 
            {...(inputType === 'number' ? { min: "2020", max: "2100", placeholder: "YYYY" } : {})}
            value={currentDateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="w-full md:w-auto bg-[#292d44] border border-white/10 rounded-xl px-4 py-2.5 text-sm md:text-base text-white focus:border-[#3b82f6] outline-none transition-colors shadow-inner cursor-pointer appearance-none"
          />
        </div>
      </div>

      {/* Filtered Active Array Telemetry Component Feed */}
      <div className="flex-1 w-full p-6 min-h-[16rem] max-h-[400px] overflow-y-auto">
        {goals.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center pt-8 pb-4 opacity-50">
            <span className="text-5xl mb-4">📭</span>
            <span className="text-sm md:text-base font-medium italic tracking-wide text-gray-300 text-center">No goals scheduled yet here!</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            {goals.map((goal) => (
              <motion.div 
                key={goal._id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center justify-between p-4 md:p-5 rounded-xl border transition-all duration-300 group ${goal.isCompleted ? 'bg-green-500/10 border-green-500/30 opacity-70 hover:opacity-100' : 'bg-[#292d44] border-white/5 hover:border-white/20 shadow-md view-bounds'}`}
              >
                {/* Structural Input Block Text */}
                <div className="flex items-center gap-5 overflow-hidden pr-4">
                  <button 
                    onClick={() => onToggle(goal._id, goal.isCompleted)}
                    className={`flex-none w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all duration-200 outline-none hover:scale-110 active:scale-95 ${goal.isCompleted ? 'bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-transparent border-gray-400 hover:border-[#3b82f6]'}`}
                  >
                    {goal.isCompleted && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                  </button>
                  
                  <span className={`text-base md:text-lg font-medium break-words ${goal.isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>
                    {goal.title}
                  </span>
                </div>

                {/* Soft Delete Trigger */}
                <button 
                  onClick={() => onDelete(goal._id)}
                  className="flex-none p-3 text-gray-500 hover:text-red-400 hover:bg-red-500/15 rounded-xl transition-colors outline-none opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Remove scheduled goal"
                >
                  <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GoalListSection;
