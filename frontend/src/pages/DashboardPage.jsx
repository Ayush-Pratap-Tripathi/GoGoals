import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import logo from '../assets/logo.png';
import StatCard from '../components/dashboard/StatCard';
import ChartBlock from '../components/dashboard/ChartBlock';
import GoalModal from '../components/dashboard/GoalModal';
import GoalCreateModal from '../components/dashboard/GoalCreateModal';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const DashboardPage = () => {
  const { token } = useContext(AuthContext);

  // Core Chronological Native Mapping (Resolves Client OS Timezone strictly uniformly matching HTML5 inputs)
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
  const currentDay = String(today.getDate()).padStart(2, '0');
  
  const todayStr = `${currentYear}-${currentMonth}-${currentDay}`; // e.g., '2026-03-31'
  const thisMonthStr = `${currentYear}-${currentMonth}`;         // e.g., '2026-03'

  // ISO Week Matcher (Synchronized exactly to <input type="week"> physics)
  const d = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  const weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  const thisWeekStr = `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`; // e.g., '2026-W14'

  // Bind active statistics fetched natively from aggregating Node route
  const [goalStats, setGoalStats] = useState({
    daily: { completed: 0, total: 0, score: "0.00" },
    weekly: { completed: 0, total: 0, score: "0.00" },
    monthly: { completed: 0, total: 0, score: "0.00" }
  });

  const [allGoals, setAllGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('daily');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    if (!token) return;
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      
      const goalsRes = await axios.get(`${apiBase}/goals`, { headers: { Authorization: `Bearer ${token}` } });
      const goals = goalsRes.data;

      // Advanced Node Filtering strictly isolating active local chronological limits mapped from user targets
      const currentDaily = goals.filter(g => g.category === 'daily' && g.scheduledDate === todayStr && !g.isDeleted);
      const currentWeekly = goals.filter(g => g.category === 'weekly' && g.scheduledDate === thisWeekStr && !g.isDeleted);
      const currentMonthly = goals.filter(g => g.category === 'monthly' && g.scheduledDate === thisMonthStr && !g.isDeleted);

      // Mathematical Prop Generation bypassing backend aggregates preventing future timezone-drifting exploits natively
      const processStats = (arr) => {
        const total = arr.length;
        const completed = arr.filter(g => g.isCompleted).length;
        return { completed, total, score: total > 0 ? ((completed / total) * 10).toFixed(2) : "0.00" };
      };

      setGoalStats({
        daily: processStats(currentDaily),
        weekly: processStats(currentWeekly),
        monthly: processStats(currentMonthly)
      });
      
      setAllGoals(goals);

    } catch (error) {
      console.error("Failed fetching dashboard aggregation stats:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const openModalForCategory = (category) => {
    setActiveCategory(category);
    setIsModalOpen(true);
  };

  // Backend Manipulation Hooks
  const handleToggleGoal = async (id, currentStatus) => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.put(`${apiBase}/goals/${id}`, 
        { isCompleted: !currentStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData();
    } catch (error) { toast.error("Failed to update task status."); }
  };

  const handleDeleteGoal = async (id) => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.delete(`${apiBase}/goals/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchDashboardData();
    } catch (error) { toast.error("Failed to delete task."); }
  };

  const handleAddGoal = async (category, title, scheduledDate = null) => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.post(`${apiBase}/goals`, 
        { category, title, scheduledDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Task added successfully!", {
        style: { borderRadius: '10px', background: '#292d44', color: '#fff' }
      });
      fetchDashboardData();
    } catch (error) { toast.error("Failed to add task."); }
  };

  const weekData = [
    { name: 'Monday', value: 0 }, { name: 'Tuesday', value: 0 },
    { name: 'Wednesday', value: 0 }, { name: 'Thursday', value: 0 },
    { name: 'Friday', value: 0 }, { name: 'Saturday', value: 0 }, { name: 'Sunday', value: 0 }
  ];

  const monthData = Array.from({ length: 31 }, (_, i) => ({ name: (i + 1).toString(), value: 0 }));

  const yearData = [
    { name: 'January', value: 0 }, { name: 'February', value: 0 }, { name: 'March', value: 0 },
    { name: 'April', value: 0 }, { name: 'May', value: 0 }, { name: 'June', value: 0 },
    { name: 'July', value: 0 }, { name: 'August', value: 0 }, { name: 'September', value: 0 },
    { name: 'October', value: 0 }, { name: 'November', value: 0 }, { name: 'December', value: 0 }
  ];

  const yearlyProgressData = [
    { name: '2016', value: 0 }, { name: '2017', value: 0 }, { name: '2018', value: 0 },
    { name: '2019', value: 0 }, { name: '2020', value: 0 }, { name: '2021', value: 0 },
    { name: '2022', value: 0 }, { name: '2023', value: 0 }, { name: '2024', value: 0 },
    { name: '2025', value: 0 }
  ];

  return (
    <div className="bg-[#292d44] h-screen w-full flex flex-col font-sans overflow-hidden text-white relative">
      
      {/* TOP: Fixed Navbar */}
      <div className="flex-none w-full bg-[#292d44]/95 backdrop-blur-md z-40 px-4 md:px-8 border-b border-white/10 shadow-sm relative">
        <DashboardNavbar />
      </div>

      {/* MIDDLE: Scrollable Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative w-full pt-10 pb-32">
        
        {/* STATS HERO: Expanding height to natively fit the screen below navbar */}
        <div className="w-full max-w-7xl mx-auto flex flex-col justify-center min-h-[calc(100vh-220px)] px-4 md:px-10 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <StatCard 
              title="Today" 
              completed={goalStats.daily.completed} 
              total={goalStats.daily.total} 
              score={goalStats.daily.score} 
              onClick={() => openModalForCategory('daily')}
            />
            <StatCard 
              title="This Week" 
              completed={goalStats.weekly.completed} 
              total={goalStats.weekly.total} 
              score={goalStats.weekly.score} 
              onClick={() => openModalForCategory('weekly')}
            />
            <StatCard 
              title="This Month" 
              completed={goalStats.monthly.completed} 
              total={goalStats.monthly.total} 
              score={goalStats.monthly.score} 
              onClick={() => openModalForCategory('monthly')}
            />
          </div>
        </div>

        {/* Separator geometric spacing */}
        <div className="w-full max-w-7xl mx-auto h-[1px] bg-white/5 my-4" />

        {/* CHARTS CONTAINER */}
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-16 px-4 md:px-10 mt-10">
          <ChartBlock title="This Week" data={weekData} />
          
          <div className="w-full h-[1px] bg-white/5" />
          <ChartBlock title="This Month" data={monthData} />
          
          <div className="w-full h-[1px] bg-white/5" />
          <ChartBlock title="This Year" data={yearData} />
          
          <div className="w-full h-[1px] bg-white/5" />
          <ChartBlock title="Yearly Progress" data={yearlyProgressData} />
        </div>

        {/* FULL SCREEN MOTIVATIONAL TAIL */}
        {/* Forces exactly 1 standard viewport height to span out the final scrolling act */}
        <div className="w-full min-h-[calc(100vh-140px)] flex flex-col items-center justify-center text-center mt-10 px-6">
          <p className="max-w-xl text-lg md:text-xl text-gray-300 italic font-medium leading-relaxed opacity-80 px-4">
            "Anything motivational or inspiring quote here to motivate the user or inspire them to not to give up and keep moving."
          </p>
          <span className="text-sm text-gray-400 font-medium tracking-wide mt-6">- Author Source</span>
          
          <div className="flex flex-col items-center mt-20 opacity-70 group hover:opacity-100 transition-all duration-500">
            <img src={logo} alt="GoGoals Icon" className="w-24 h-auto object-contain mb-4 drop-shadow-2xl" />
            <span className="text-4xl font-extrabold tracking-widest drop-shadow-2xl">GoGoals</span>
          </div>
        </div>

      </main>

      {/* BOTTOM: Slim Fixed Footer */}
      <div className="flex-none w-full bg-[#292d44]/95 backdrop-blur-md z-40 border-t border-white/10 py-3 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
        <DashboardFooter />
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button 
        onClick={() => setIsCreateModalOpen(true)}
        className="absolute bottom-20 md:bottom-24 right-6 md:right-10 w-14 h-14 bg-[#3b82f6] hover:bg-[#2563eb] hover:scale-105 active:scale-95 transition-all outline-none border-none rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)] z-50 cursor-pointer text-white"
        title="Create New Goal"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* DYNAMIC GOAL CREATION UI OVERLAY */}
      <GoalCreateModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAdd={handleAddGoal}
      />

      {/* DYNAMIC GOAL MANAGEMENT UI OVERLAY */}
      <GoalModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={activeCategory}
        goals={allGoals.filter(goal => 
             goal.category === activeCategory && 
             !goal.isDeleted &&
             (activeCategory === 'daily' ? goal.scheduledDate === todayStr :
              activeCategory === 'weekly' ? goal.scheduledDate === thisWeekStr :
              activeCategory === 'monthly' ? goal.scheduledDate === thisMonthStr : true)
        )}
        onToggle={handleToggleGoal}
        onDelete={handleDeleteGoal}
        onAdd={handleAddGoal}
      />

    </div>
  );
};

export default DashboardPage;
