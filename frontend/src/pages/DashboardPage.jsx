import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import SpeechRecordingButton from '../components/dashboard/SpeechRecordingButton';
import logo from '../assets/logo.png';
import StatCard from '../components/dashboard/StatCard';
import ChartBlock from '../components/dashboard/ChartBlock';
import GoalModal from '../components/dashboard/GoalModal';
import GoalCreateModal from '../components/dashboard/GoalCreateModal';
import { generateWeeklyChart, generateMonthlyChart, generateYearlyChart, generateDecadeChart } from '../utils/chartHelpers';
import toast from 'react-hot-toast';
import { Plus, ArrowDown, ArrowUp, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const ChartThumb = ({ name, data, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/10 cursor-pointer active:scale-95 transition-transform hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] min-w-[140px] h-full justify-center">
    <h4 className="font-bold text-sm sm:text-base text-gray-300 font-[cursive] mb-3">{name}</h4>
    <div className="h-28 sm:h-32 w-full pointer-events-none">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" hide={true} />
          <YAxis hide={true} domain={[0, 10]} />
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { quotes } from '../data/quotes';

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
    monthly: { completed: 0, total: 0, score: "0.00" },
    yearly: { completed: 0, total: 0, score: "0.00" }
  });

  const [allGoals, setAllGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('daily');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [speechGoalData, setSpeechGoalData] = useState(null);
  const [activeChartModal, setActiveChartModal] = useState(null);

  // Time Travel Gesture State Limit trackers
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [yearOffset, setYearOffset] = useState(0);
  const [decadeOffset, setDecadeOffset] = useState(0);

  // Motivational Quotes state
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fadeQuote, setFadeQuote] = useState(true);

  // Floating controls tracking
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(1);

  const handleDashboardScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setScrollPosition(scrollTop);
    setMaxScroll(scrollHeight - clientHeight);
  };

  useEffect(() => {
    // Pick a random starting quote when the component mounts
    setQuoteIndex(Math.floor(Math.random() * quotes.length));
  }, []);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setFadeQuote(false); // start fade out
      setTimeout(() => {
        setQuoteIndex(prev => (prev + 1) % quotes.length);
        setFadeQuote(true); // start fade in after change
      }, 500); // Wait for fade out to complete (500ms should match CSS transition duration)
    }, 3000); // Total 3 seconds per quote

    return () => clearInterval(quoteInterval);
  }, []);

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
      const currentYearly = goals.filter(g => g.category === 'yearly' && g.scheduledDate === String(currentYear) && !g.isDeleted);

      // Mathematical Prop Generation bypassing backend aggregates preventing future timezone-drifting exploits natively
      const processStats = (arr) => {
        const total = arr.length;
        const completed = arr.filter(g => g.isCompleted).length;
        return { completed, total, score: total > 0 ? ((completed / total) * 10).toFixed(2) : "0.00" };
      };

      setGoalStats({
        daily: processStats(currentDaily),
        weekly: processStats(currentWeekly),
        monthly: processStats(currentMonthly),
        yearly: processStats(currentYearly)
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
      let finalScheduledDate = scheduledDate;
      if (!finalScheduledDate) {
        if (category === 'daily') finalScheduledDate = todayStr;
        else if (category === 'weekly') finalScheduledDate = thisWeekStr;
        else if (category === 'monthly') finalScheduledDate = thisMonthStr;
        else if (category === 'yearly') finalScheduledDate = String(currentYear);
      }

      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.post(`${apiBase}/goals`, 
        { category, title, scheduledDate: finalScheduledDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Task added successfully!", {
        style: { borderRadius: '10px', background: '#292d44', color: '#fff' }
      });
      fetchDashboardData();
    } catch (error) { toast.error("Failed to add task."); }
  };

  // Dynamically resolve array filters directly out of native App Memory strictly mapping mathematical limit calculations preventing excess DB calls
  const weeklyDataNode = generateWeeklyChart(weekOffset, allGoals);
  const monthlyDataNode = generateMonthlyChart(monthOffset, allGoals);
  const yearlyDataNode = generateYearlyChart(yearOffset, allGoals);
  const decadeDataNode = generateDecadeChart(decadeOffset, allGoals);

  return (
    <div className="bg-[#292d44] h-screen w-full flex flex-col font-sans overflow-hidden text-white relative">
      
      {/* TOP: Fixed Navbar */}
      <div className="flex-none w-full bg-[#292d44]/95 backdrop-blur-md z-40 px-4 md:px-8 border-b border-white/10 shadow-sm relative">
        <DashboardNavbar />
      </div>

      <main 
        id="dashboard-main"
        onScroll={handleDashboardScroll}
        className="flex-1 overflow-x-auto overflow-y-hidden flex flex-row lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden snap-x snap-mandatory lg:snap-none relative w-full pt-10 pb-24 lg:pt-10 lg:pb-32 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        
        {/* Card 1: STATS HERO */}
        <div id="stats-hero" className="w-full shrink-0 snap-center min-w-full lg:min-w-0 max-w-7xl mx-auto flex flex-col justify-between lg:justify-center min-h-[calc(100vh-220px)] lg:min-h-[calc(100vh-140px)] px-4 md:px-10 pt-4 lg:pt-4 pb-4 lg:pb-8 h-full">
          <div className="flex-1 lg:flex-none grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full py-4 lg:py-8 lg:my-0">
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
            <StatCard 
              title="This Year" 
              completed={goalStats.yearly.completed} 
              total={goalStats.yearly.total} 
              score={goalStats.yearly.score} 
              onClick={() => openModalForCategory('yearly')}
            />
          </div>

          {/* Swipe down/right arrow to continue tracking */}
          <div className="pt-6 w-full flex justify-center lg:hidden">
            <button 
              onClick={() => {
                const chartsContainer = document.getElementById('charts-hero');
                if (chartsContainer) chartsContainer.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' });
              }}
              className="flex items-center justify-center gap-2 px-5 py-2 border border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#292d44] transition-all duration-300 text-sm font-semibold group rounded-full"
            >
              Track your progress
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Desktop scroll down to charts */}
          <div className="hidden lg:flex w-full justify-center mt-16 drop-shadow-2xl">
            <button 
              onClick={() => {
                const chartsContainer = document.getElementById('charts-hero');
                if (chartsContainer) chartsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#292d44] transition-all duration-300 font-bold tracking-wide group rounded-full max-w-sm"
            >
              Watch your progress
              <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Separator geometric spacing */}
        <div className="hidden lg:block w-full max-w-7xl mx-auto h-[1px] bg-white/5 my-4" />

        {/* Card 2: CHARTS THUMB GRID */}
        <div id="charts-hero" className="w-full shrink-0 snap-center min-w-full lg:min-w-0 max-w-7xl mx-auto flex flex-col justify-between lg:justify-center min-h-[calc(100vh-220px)] lg:min-h-0 px-4 md:px-10 pb-32 lg:pb-10 relative h-full lg:h-auto">
          
          {/* Mobile Back Button */}
          <div className="w-full flex lg:hidden -mt-4">
            <button 
              onClick={() => {
                const statsContainer = document.getElementById('stats-hero');
                if (statsContainer) statsContainer.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' });
              }}
              className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-sm font-medium pr-4 py-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to stats
            </button>
          </div>

          {/* Mobile Chart Grid (2x2 Thumbnails) */}
          <div className="grid grid-cols-2 gap-8 sm:gap-10 w-full lg:hidden my-auto py-8">
            <ChartThumb name={weeklyDataNode.title} data={weeklyDataNode.data} onClick={() => setActiveChartModal('weekly')} />
            <ChartThumb name={monthlyDataNode.title} data={monthlyDataNode.data} onClick={() => setActiveChartModal('monthly')} />
            <ChartThumb name={yearlyDataNode.title} data={yearlyDataNode.data} onClick={() => setActiveChartModal('yearly')} />
            <ChartThumb name={decadeDataNode.title} data={decadeDataNode.data} onClick={() => setActiveChartModal('decade')} />
          </div>

          {/* Motivational Quote (Integrated beneath charts on mobile) */}
          <div className="lg:hidden flex flex-col items-center text-center opacity-80 px-2 transition-opacity duration-500 pb-4">
            <p className={`text-sm italic text-gray-300 transition-opacity duration-500 ease-in-out ${fadeQuote ? 'opacity-100' : 'opacity-0'}`}>
              "{quotes[quoteIndex]?.quote}"
            </p>
            <span className={`text-xs text-gray-400 mt-2 font-medium transition-opacity duration-500 ease-in-out ${fadeQuote ? 'opacity-100' : 'opacity-0'}`}>
              - {quotes[quoteIndex]?.author}
            </span>
          </div>

          {/* Desktop native full charts */}
          <div className="hidden lg:flex w-full flex-col gap-16">
            <ChartBlock title={weeklyDataNode.title} data={weeklyDataNode.data} onPrevious={() => setWeekOffset(prev => prev - 1)} onNext={() => setWeekOffset(prev => prev + 1)} />
            <div className="w-full h-[1px] bg-white/5" />
            <ChartBlock title={monthlyDataNode.title} data={monthlyDataNode.data} onPrevious={() => setMonthOffset(prev => prev - 1)} onNext={() => setMonthOffset(prev => prev + 1)} />
            <div className="w-full h-[1px] bg-white/5" />
            <ChartBlock title={yearlyDataNode.title} data={yearlyDataNode.data} onPrevious={() => setYearOffset(prev => prev - 1)} onNext={() => setYearOffset(prev => prev + 1)} />
            <div className="w-full h-[1px] bg-white/5" />
            <ChartBlock title={decadeDataNode.title} data={decadeDataNode.data} onPrevious={() => setDecadeOffset(prev => prev - 1)} onNext={() => setDecadeOffset(prev => prev + 1)} />
            
            {/* Desktop-only Quote & Logo appended organically beneath charts */}
            <div className="w-full flex flex-col items-center justify-center text-center mt-6">
              <div className={`transition-opacity duration-500 ease-in-out ${fadeQuote ? 'opacity-100' : 'opacity-0'}`}>
                <p className="max-w-xl text-lg text-gray-300 italic font-medium leading-relaxed opacity-80 whitespace-pre-wrap">
                  "{quotes[quoteIndex]?.quote}"
                </p>
                <span className="block text-sm text-gray-400 font-medium tracking-wide mt-4">
                  - {quotes[quoteIndex]?.author}
                </span>
              </div>
              <div className="flex flex-col items-center mt-12 opacity-50 group hover:opacity-100 transition-all duration-500">
                <img src={logo} alt="GoGoals Icon" className="w-16 h-auto object-contain mb-2 drop-shadow-2xl" />
                <span className="text-2xl font-extrabold tracking-widest drop-shadow-2xl">GoGoals</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Desktop Navigation Controls */}
        <div className="hidden lg:flex fixed bottom-10 left-1/2 -translate-x-1/2 z-50 transition-all duration-500">
          {scrollPosition > 100 && scrollPosition < maxScroll - 50 && (
            <button 
              onClick={() => {
                const mainEl = document.getElementById('dashboard-main');
                if (mainEl) mainEl.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
              }}
              className="flex items-center justify-center p-4 bg-blue-600/80 hover:bg-blue-500 text-white rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 animate-bounce"
            >
              <ArrowDown className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="hidden lg:flex fixed top-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-500">
          {scrollPosition >= maxScroll - 50 && maxScroll > 0 && (
            <button 
              onClick={() => {
                const mainEl = document.getElementById('dashboard-main');
                if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center justify-center p-4 bg-white/10 hover:bg-white text-white hover:text-[#292d44] border border-white/20 rounded-full shadow-2xl transition-all duration-300 backdrop-blur-sm"
            >
              <ArrowUp className="w-6 h-6" />
            </button>
          )}
        </div>

      </main>

      {/* BOTTOM: Slim Fixed Footer */}
      <div className="flex-none w-full bg-[#292d44]/95 backdrop-blur-md z-40 border-t border-white/10 py-3 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
        <DashboardFooter />
      </div>

      {/* SPEECH RECORDING BUTTON */}
      <SpeechRecordingButton 
        onSpeechDataReceived={(goalData) => {
          setSpeechGoalData(goalData);
          setIsCreateModalOpen(true);
        }}
      />

      {/* FLOATING ACTION BUTTON */}
      <button 
        onClick={() => setIsCreateModalOpen(true)}
        className="absolute bottom-20 md:bottom-24 left-6 md:left-10 w-14 h-14 bg-[#3b82f6] hover:bg-[#2563eb] hover:scale-105 active:scale-95 transition-all outline-none border-none rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)] z-50 cursor-pointer text-white"
        title="Create New Goal"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* DYNAMIC GOAL CREATION UI OVERLAY */}
      <GoalCreateModal 
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSpeechGoalData(null);
        }}
        onAdd={handleAddGoal}
        initialData={speechGoalData}
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
              activeCategory === 'monthly' ? goal.scheduledDate === thisMonthStr :
              activeCategory === 'yearly' ? goal.scheduledDate === String(currentYear) : true)
        )}
        onToggle={handleToggleGoal}
        onDelete={handleDeleteGoal}
        onAdd={handleAddGoal}
      />

      {/* CHART MODAL OVERLAY */}
      {activeChartModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 lg:hidden">
          <div className="w-full max-w-lg bg-[#292d44] border border-white/10 rounded-3xl pt-10 pb-4 px-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setActiveChartModal(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white outline-none cursor-pointer z-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="pt-2">
              {activeChartModal === 'weekly' && <ChartBlock title={weeklyDataNode.title} data={weeklyDataNode.data} onPrevious={() => setWeekOffset(prev => prev - 1)} onNext={() => setWeekOffset(prev => prev + 1)} />}
              {activeChartModal === 'monthly' && <ChartBlock title={monthlyDataNode.title} data={monthlyDataNode.data} onPrevious={() => setMonthOffset(prev => prev - 1)} onNext={() => setMonthOffset(prev => prev + 1)} />}
              {activeChartModal === 'yearly' && <ChartBlock title={yearlyDataNode.title} data={yearlyDataNode.data} onPrevious={() => setYearOffset(prev => prev - 1)} onNext={() => setYearOffset(prev => prev + 1)} />}
              {activeChartModal === 'decade' && <ChartBlock title={decadeDataNode.title} data={decadeDataNode.data} onPrevious={() => setDecadeOffset(prev => prev - 1)} onNext={() => setDecadeOffset(prev => prev + 1)} />}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;
