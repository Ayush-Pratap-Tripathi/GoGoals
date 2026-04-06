// Helper to compute exact score perfectly capping to 10
export const calculateScore = (goalsArr) => {
  const activeTargets = goalsArr.filter(g => !g.isDeleted);
  if (activeTargets.length === 0) return 0;
  const completed = activeTargets.filter(g => g.isCompleted).length;
  return Number(((completed / activeTargets.length) * 10).toFixed(2));
};

// Generates Array identically bounded to ISO 8601 formatting 7 Days
export const generateWeeklyChart = (offset, allGoals) => {
  const targetDate = new Date();
  
  // Calculate ISO strictly locking to Monday-Sunday bounds natively tracking standard ISO rules
  const dayOfWeek = targetDate.getDay() || 7; 
  targetDate.setDate(targetDate.getDate() - dayOfWeek + 1 + (offset * 7));

  // Determine exact ISO Week Number formatting native labels
  const d = new Date(Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  const weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  
  const title = offset === 0 ? "This Week" : `Week-${weekNo} ${d.getUTCFullYear()}`;
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const data = [];

  for (let i = 0; i < 7; i++) {
    const iterationDate = new Date(targetDate);
    iterationDate.setDate(targetDate.getDate() + i);
    
    const yyyy = iterationDate.getFullYear();
    const mm = String(iterationDate.getMonth() + 1).padStart(2, '0');
    const dd = String(iterationDate.getDate()).padStart(2, '0');
    const lookupString = `${yyyy}-${mm}-${dd}`;

    const matchedGoals = allGoals.filter(g => g.category === 'daily' && g.scheduledDate === lookupString);
    data.push({
      name: days[i],
      value: calculateScore(matchedGoals)
    });
  }

  return { title, data };
};

// Generates highly accurate valid date iterations mapped physically to standard Gregorian arrays 
export const generateMonthlyChart = (offset, allGoals) => {
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + offset);

  const yyyy = targetDate.getFullYear();
  const monthName = targetDate.toLocaleString('default', { month: 'long' });
  const title = offset === 0 ? "This Month" : `${monthName} ${yyyy}`;

  // Rigorously finds Leap Year boundaries and valid month limits natively 
  const daysInMonth = new Date(yyyy, targetDate.getMonth() + 1, 0).getDate();
  const data = [];

  const mm = String(targetDate.getMonth() + 1).padStart(2, '0');

  for (let i = 1; i <= daysInMonth; i++) {
    const dd = String(i).padStart(2, '0');
    const lookupString = `${yyyy}-${mm}-${dd}`;

    const matchedGoals = allGoals.filter(g => g.category === 'daily' && g.scheduledDate === lookupString);
    data.push({
      name: String(i),
      value: calculateScore(matchedGoals)
    });
  }

  return { title, data };
};

// Generates statically strictly parsing 12 intervals
export const generateYearlyChart = (offset, allGoals) => {
  const targetDate = new Date();
  targetDate.setFullYear(targetDate.getFullYear() + offset);

  const yyyy = targetDate.getFullYear();
  const title = offset === 0 ? "This Year" : `Year ${yyyy}`;

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const data = [];

  for (let i = 0; i < 12; i++) {
    const mm = String(i + 1).padStart(2, '0');
    const lookupString = `${yyyy}-${mm}`; // Expected string mapped natively from OS Month Pickers

    const matchedGoals = allGoals.filter(g => g.category === 'monthly' && g.scheduledDate === lookupString);
    data.push({
      name: monthsList[i].substring(0, 3), // e.g. "Jan", "Feb" to prevent chart axis crowding
      value: calculateScore(matchedGoals)
    });
  }

  return { title, data };
};

// Generates shifting historical arrays sliding iteratively explicitly resolving decade boundaries
export const generateDecadeChart = (offset, allGoals) => {
  const currentYear = new Date().getFullYear();
  const endYear = currentYear + offset;
  const startYear = endYear - 9; // Strictly 10 bars total inclusively 
  
  const title = "Yearly Progress";
  const data = [];

  for (let i = startYear; i <= endYear; i++) {
    const lookupString = String(i);

    const matchedGoals = allGoals.filter(g => g.category === 'yearly' && g.scheduledDate === lookupString);
    data.push({
      name: String(i),
      value: calculateScore(matchedGoals)
    });
  }

  return { title, data };
};
