import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import GoalCreateModal from '../components/dashboard/GoalCreateModal';
import GoalListSection from '../components/dashboard/GoalListSection';
import { Plus, ArrowLeft } from 'lucide-react';
import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const MyGoalsPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Core Chronological Native Mapping Identical to Dashboard Sync Defaults
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
  const currentDay = String(today.getDate()).padStart(2, '0');
  
  // OS Identical Standard Ranges Binding natively explicitly matching HTML5 String conversions
  const d = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  const weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);

  // Initialize Native Calendar React Trackers mapped defaulting strictly to hardware endpoints resolving present time limits
  const [dailyDate, setDailyDate] = useState(`${currentYear}-${currentMonth}-${currentDay}`);
  const [weeklyDate, setWeeklyDate] = useState(`${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`);
  const [monthlyDate, setMonthlyDate] = useState(`${currentYear}-${currentMonth}`);
  const [yearlyDate, setYearlyDate] = useState(String(currentYear));

  const [allGoals, setAllGoals] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('daily');

  // Architecture Routing Refs targeting scrolling bounds exclusively
  const dailyRef = useRef(null);
  const weeklyRef = useRef(null);
  const monthlyRef = useRef(null);
  const yearlyRef = useRef(null);

  const scrollToSection = (tab) => {
    setActiveTab(tab);
    const refs = { daily: dailyRef, weekly: weeklyRef, monthly: monthlyRef, yearly: yearlyRef };
    
    // Calculate standard offset accounting for Fixed Navbars
    if (refs[tab]?.current) {
      const yOffset = -100; // Account for the sticky 100px navbar roughly
      const element = refs[tab].current;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const fetchGoalsData = async () => {
    if (!token) return;
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const goalsRes = await axios.get(`${apiBase}/goals`, { headers: { Authorization: `Bearer ${token}` } });
      setAllGoals(goalsRes.data);
    } catch (error) {
      toast.error("Failed fetching goals telemetry.");
    }
  };

  useEffect(() => {
    fetchGoalsData();
  }, [token]);

  // Backend Manipulation Handlers (Recycling identically structurally sound arrays preventing duplication bounds)
  const handleToggleGoal = async (id, currentStatus) => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.put(`${apiBase}/goals/${id}`, 
        { isCompleted: !currentStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchGoalsData();
    } catch (error) { toast.error("Failed to update task status."); }
  };

  const handleDeleteGoal = async (id) => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.delete(`${apiBase}/goals/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchGoalsData();
    } catch (error) { toast.error("Failed to delete task."); }
  };

  const handleAddGoal = async (category, title, scheduledDate = null) => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.post(`${apiBase}/goals`, 
        { category, title, scheduledDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Task scheduled successfully!", {
        style: { borderRadius: '10px', background: '#292d44', color: '#fff' }
      });
      fetchGoalsData();
    } catch (error) { toast.error("Failed to add scheduled task."); }
  };

  // Natively filter Arrays binding React state structurally into DOM variables eliminating external mappings
  const dailyArray = allGoals.filter(g => g.category === 'daily' && g.scheduledDate === dailyDate && !g.isDeleted);
  const weeklyArray = allGoals.filter(g => g.category === 'weekly' && g.scheduledDate === weeklyDate && !g.isDeleted);
  const monthlyArray = allGoals.filter(g => g.category === 'monthly' && g.scheduledDate === monthlyDate && !g.isDeleted);
  const yearlyArray = allGoals.filter(g => g.category === 'yearly' && g.scheduledDate === yearlyDate && !g.isDeleted);

  return (
    <div className="bg-[#292d44] min-h-screen w-full flex flex-col font-sans overflow-x-hidden text-white relative">
      
      {/* TOP: Fixed Navbar (Shared with Dashboard) */}
      <div className="flex-none w-full bg-[#292d44]/95 backdrop-blur-md z-40 px-4 md:px-8 border-b border-white/10 shadow-sm sticky top-0">
        <DashboardNavbar />
      </div>

      {/* MIDDLE: Scrollable Main Pipeline Structure */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 pt-10 pb-32">
        
        {/* Navigation Control */}
        <div className="flex items-center mb-10 w-full">
          
          {/* React Router Back Navigation Structure */}
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group w-max outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 flex items-center justify-center transition-all group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="font-bold tracking-widest uppercase text-sm md:text-base">Dashboard</span>
          </button>
        </div>

        {/* Dynamic Chronological Renders Component Pipelines */}
        <div ref={dailyRef} className="scroll-mt-32">
          <GoalListSection 
            title="Daily Goals"
            inputType="date"
            currentDateStr={dailyDate}
            setDateStr={setDailyDate}
            goals={dailyArray}
            onToggle={handleToggleGoal}
            onDelete={handleDeleteGoal}
          />
        </div>

        <div ref={weeklyRef} className="scroll-mt-32">
          <GoalListSection 
            title="Weekly Goals"
            inputType="week"
            currentDateStr={weeklyDate}
            setDateStr={setWeeklyDate}
            goals={weeklyArray}
            onToggle={handleToggleGoal}
            onDelete={handleDeleteGoal}
          />
        </div>

        <div ref={monthlyRef} className="scroll-mt-32">
          <GoalListSection 
            title="Monthly Goals"
            inputType="month"
            currentDateStr={monthlyDate}
            setDateStr={setMonthlyDate}
            goals={monthlyArray}
            onToggle={handleToggleGoal}
            onDelete={handleDeleteGoal}
          />
        </div>

        <div ref={yearlyRef} className="scroll-mt-32 mb-10">
          <GoalListSection 
            title="Yearly Goals"
            inputType="number"
            currentDateStr={yearlyDate}
            setDateStr={setYearlyDate}
            goals={yearlyArray}
            onToggle={handleToggleGoal}
            onDelete={handleDeleteGoal}
          />
        </div>

      </main>

      {/* BOTTOM: Fixed Footer Geometry */}
      <div className="flex-none w-full bg-[#292d44]/95 backdrop-blur-md z-40 border-t border-white/10 py-3 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] fixed bottom-0">
        <DashboardFooter />
      </div>

      {/* GLOBAL FLOATING ACTION BUTTON */}
      <button 
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-20 md:bottom-24 right-6 md:right-10 w-16 h-16 bg-[#3b82f6] hover:bg-[#2563eb] hover:scale-105 active:scale-95 transition-all outline-none border-none rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.6)] z-[60] cursor-pointer text-white"
        title="Schedule New Goal"
      >
        <Plus className="w-8 h-8" strokeWidth={2.5} />
      </button>

      {/* FLOATING CHRONOLOGICAL TABS */}
      <div className="fixed bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-50 flex bg-[#292d44]/90 backdrop-blur-xl p-1.5 rounded-full shadow-[0_10px_50px_rgba(0,0,0,0.6)] border border-white/10 overflow-x-auto w-[90%] max-w-lg lg:w-auto [&::-webkit-scrollbar]:hidden ring-1 ring-[#3b82f6]/20">
        {['daily', 'weekly', 'monthly', 'yearly'].map((tab) => (
          <button
            key={tab}
            onClick={() => scrollToSection(tab)}
            className={`flex-1 md:flex-none py-3 px-4 md:px-7 rounded-full text-[11px] md:text-sm font-extrabold tracking-widest uppercase transition-all duration-300 outline-none whitespace-nowrap
              ${activeTab === tab 
                ? 'bg-gradient-to-r from-blue-600 to-[#3b82f6] text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] border-none' 
                : 'text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* DYNAMIC GOAL CREATION UI ENGINE */}
      <GoalCreateModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAdd={handleAddGoal}
      />

    </div>
  );
};

export default MyGoalsPage;
