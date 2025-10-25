import React, { useState, useEffect } from 'react';
import {
  Star,
  ArrowRight,
  RotateCcw,
  Plus,
  Minus,
  Volume2,
  VolumeX,
} from 'react-feather';
import './finance.css';

const FinancialSuccessGame = () => {
  const [currentStage, setCurrentStage] = useState('opening');
  const [studentInfo, setStudentInfo] = useState({
    firstName: '',
    lastName: '',
    school: '',
    phone: ''
  });
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [editingGoalPrice, setEditingGoalPrice] = useState(false);
  const [tempGoalPrice, setTempGoalPrice] = useState('');
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [tempPrices, setTempPrices] = useState({});

  // ערכי ברירת מחדל מקוריים
  const defaultGoals = [
    { id: 'bike', name: 'אופניים', icon: '🚴', price: 2000, color: 'bg-blue-500' },
    { id: 'phone', name: 'פלאפון', icon: '📱', price: 4000, color: 'bg-purple-500' },
    { id: 'vacation', name: 'חופשה', icon: '✈️', price: 5000, color: 'bg-cyan-500' },
    { id: 'car', name: 'רכב', icon: '🚗', price: 30000, color: 'bg-blue-400' },
    { id: 'room', name: 'עיצוב חדר', icon: '🛋️', price: 3000, color: 'bg-orange-500' },
    { id: 'personal', name: 'יעד אישי', icon: '🎯', price: 1000, color: 'bg-green-500' },
    { id: 'license', name: 'רישיון נהיגה', icon: '🏆', price: 8000, color: 'bg-indigo-500' },
    { id: 'game', name: 'משחק', icon: '🎮', price: 500, color: 'bg-pink-500' },
    { id: 'instrument', name: 'כלי נגינה', icon: '🎵', price: 2500, color: 'bg-pink-400' },
    { id: 'gift', name: 'מתנה', icon: '🎁', price: 600, color: 'bg-teal-500' }
  ];

  const defaultPassiveIncomes = [
    { id: 'birthday', name: 'מתנת יום הולדת', icon: '🎂', amount: 200, unit: '₪', isOneTime: true, isCustom: false, color: 'bg-pink-500' },
    { id: 'allowance', name: 'דמי כיס', icon: '💰', amount: 100, unit: '₪', isOneTime: false, isCustom: false, color: 'bg-green-500' },
    { id: 'holidays', name: 'דמי חגים', icon: '🎉', amount: 300, unit: '₪', isOneTime: true, isCustom: false, color: 'bg-purple-500' },
    { id: 'grandparents', name: 'כסף סבא/סבתא', icon: '👴', amount: 100, unit: '₪', isOneTime: true, isCustom: false, color: 'bg-orange-500' },
    { id: 'other_passive', name: 'אחר', icon: '❓', amount: 0, unit: '₪', isOneTime: true, isCustom: true, color: 'bg-indigo-600' }
  ];

  const defaultActiveIncomes = [
    { id: 'babysitter', name: 'בייביסיטר', icon: '👶', amount: 30, unit: '₪ לשעה', timesPerWeek: 0, isCustom: false, color: 'bg-pink-500' },
    { id: 'tutoring', name: 'שיעורים פרטיים', icon: '📚', amount: 50, unit: '₪ לשיעור', timesPerWeek: 0, isCustom: false, color: 'bg-blue-500' },
    { id: 'carwash', name: 'שטיפת רכבים', icon: '🚗', amount: 50, unit: '₪ לרכב', timesPerWeek: 0, isCustom: false, color: 'bg-cyan-500' },
    { id: 'bottles', name: 'איסוף בקבוקים', icon: '♻️', amount: 0.30, unit: "₪ לבקבוק", timesPerWeek: 0, isCustom: false, color: 'bg-pink-400' },
    { id: 'dogsitter', name: 'דוגיסיטר', icon: '🐕', amount: 25, unit: '₪ לסיבוב', timesPerWeek: 0, isCustom: false, color: 'bg-yellow-500' },
    { id: 'petcare', name: 'טיפול בחיות והשקיית עציצים', icon: '🐾', amount: 100, unit: '₪ ליום', timesPerWeek: 0, isCustom: false, color: 'bg-teal-500' },
    { id: 'housework', name: 'עזרה בבית', icon: '🏠', amount: 10, unit: '₪ לפעולה', timesPerWeek: 0, isCustom: false, color: 'bg-indigo-500' },
    { id: 'partjob', name: 'עבודות חוץ (קיוסק/פיצה/מלצרות)', icon: '🍕', amount: 30, unit: '₪ לשעה', timesPerWeek: 0, isCustom: false, color: 'bg-orange-500' },
    { id: 'other_active', name: 'אחר', icon: '❓', amount: 0, unit: '₪', timesPerWeek: 0, isCustom: true, color: 'bg-indigo-600' }
  ];

  const [passiveIncomes, setPassiveIncomes] = useState(defaultPassiveIncomes);

  const [activeIncomes, setActiveIncomes] = useState(defaultActiveIncomes);

  const [selectedPassiveIncomes, setSelectedPassiveIncomes] = useState([]);
  const [selectedActiveIncomes, setSelectedActiveIncomes] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [otherExpenseAmount, setOtherExpenseAmount] = useState(0);
  const [editingExpense, setEditingExpense] = useState(false);
  const [customExpense, setCustomExpense] = useState('');
  const [showAnimation, setShowAnimation] = useState(true);
  const [editingIncome, setEditingIncome] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [customPassiveIncomeCounter, setCustomPassiveIncomeCounter] = useState(0);
  const [customActiveIncomeCounter, setCustomActiveIncomeCounter] = useState(0);

  const [goals, setGoals] = useState(defaultGoals);

  const expenseOptions = [30, 50, 100, 120, 200];

  const playSound = (type) => {
    if (isMuted) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;

    if (type === 'income') {
      // Positive coin/chime sound - ascending notes
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator1.frequency.setValueAtTime(523.25, now); // C5
      oscillator2.frequency.setValueAtTime(659.25, now); // E5
      oscillator1.type = 'sine';
      oscillator2.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      oscillator1.start(now);
      oscillator2.start(now);
      oscillator1.stop(now + 0.3);
      oscillator2.stop(now + 0.3);

    } else if (type === 'expense') {
      // Negative sound - descending tone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(300, now);
      oscillator.frequency.exponentialRampToValueAtTime(150, now + 0.2);
      oscillator.type = 'triangle';

      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      oscillator.start(now);
      oscillator.stop(now + 0.2);

    } else if (type === 'continue') {
      // Continue button sound - smooth progression
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(392, now); // G4
      oscillator.frequency.setValueAtTime(523.25, now + 0.1); // C5
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.25, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      oscillator.start(now);
      oscillator.stop(now + 0.25);

    } else if (type === 'start') {
      // Start game sound - exciting fanfare
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const oscillator3 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      oscillator3.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator1.frequency.setValueAtTime(523.25, now); // C5
      oscillator2.frequency.setValueAtTime(659.25, now + 0.1); // E5
      oscillator3.frequency.setValueAtTime(783.99, now + 0.2); // G5
      oscillator1.type = 'sine';
      oscillator2.type = 'sine';
      oscillator3.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      oscillator1.start(now);
      oscillator2.start(now + 0.1);
      oscillator3.start(now + 0.2);
      oscillator1.stop(now + 0.4);
      oscillator2.stop(now + 0.4);
      oscillator3.stop(now + 0.4);
    }
  };

  useEffect(() => {
    if (currentStage !== 'opening' && !isMuted) {
      console.log('Starting background music');
    }
  }, [currentStage, isMuted]);

  useEffect(() => {
    // Scroll to top whenever stage changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStage]);

  const calculateOneTimeIncome = () => {
    return selectedPassiveIncomes
        .filter(income => income.isOneTime)
        .reduce((sum, income) => sum + income.amount, 0);
  };

  const calculateWeeklyPassiveIncome = () => {
    return selectedPassiveIncomes
        .filter(income => !income.isOneTime)
        .reduce((sum, income) => sum + income.amount, 0);
  };

  const calculateWeeklyActiveIncome = () => {
    return selectedActiveIncomes.reduce((sum, income) => sum + (income.amount * income.timesPerWeek), 0);
  };

  const calculateTotalWeeklyIncome = () => {
    return calculateWeeklyPassiveIncome() + calculateWeeklyActiveIncome();
  };

  const calculateTotalExpenses = () => {
    if (selectedExpense === 'other') {
      return otherExpenseAmount || 0;
    }
    return selectedExpense || 0;
  };

  const calculateNetWeekly = () => {
    return calculateTotalWeeklyIncome() - calculateTotalExpenses();
  };

  const calculateWeeksNeeded = () => {
    if (!selectedGoal) return 0;
    const remainingAfterOneTime = selectedGoal.price - calculateOneTimeIncome();
    const netWeekly = calculateNetWeekly();
    if (netWeekly <= 0) return Infinity;
    return Math.ceil(remainingAfterOneTime / netWeekly);
  };

  const handlePassiveIncomeSelect = (income) => {
    const exists = selectedPassiveIncomes.find(i => i.id === income.id);
    if (exists) {
      // Remove if already selected (toggle)
      setSelectedPassiveIncomes(selectedPassiveIncomes.filter(i => i.id !== income.id));
    } else {
      // Add if not selected
      setSelectedPassiveIncomes([...selectedPassiveIncomes, income]);
      playSound('income');
    }
  };

  const updateActiveIncomeTimes = (incomeId, delta) => {
    setActiveIncomes(prev => prev.map(income => {
      if (income.id === incomeId) {
        const newTimes = Math.max(0, income.timesPerWeek + delta);
        return { ...income, timesPerWeek: newTimes };
      }
      return income;
    }));

    const updatedIncome = activeIncomes.find(i => i.id === incomeId);
    if (updatedIncome) {
      const newTimes = Math.max(0, updatedIncome.timesPerWeek + delta);
      if (newTimes > 0) {
        const exists = selectedActiveIncomes.find(i => i.id === incomeId);
        if (exists) {
          setSelectedActiveIncomes(prev => prev.map(income =>
              income.id === incomeId ? { ...income, timesPerWeek: newTimes } : income
          ));
        } else {
          setSelectedActiveIncomes([...selectedActiveIncomes, { ...updatedIncome, timesPerWeek: newTimes }]);
        }
      } else {
        setSelectedActiveIncomes(prev => prev.filter(income => income.id !== incomeId));
      }
    }
  };

  const handleExpenseSelect = (amount) => {
    setSelectedExpense(amount);
    playSound('expense');
  };

  const goBack = () => {
    const stages = ['opening', 'info', 'goals', 'passive income', 'active income', 'expenses', 'summary'];
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex > 0) {
      setCurrentStage(stages[currentIndex - 1]);
    }
  };

  const resetGame = () => {
    setCurrentStage('opening');
    setStudentInfo({ firstName: '', lastName: '', school: '', phone: '' });
    setSelectedGoal(null);
    setSelectedPassiveIncomes([]);
    setSelectedActiveIncomes([]);
    setSelectedExpense(null);
    setOtherExpenseAmount(0);
    setCustomExpense('');
    setCustomPassiveIncomeCounter(0);
    setCustomActiveIncomeCounter(0);

    // החזרת ערכי ברירת מחדל מקוריים
    setGoals(JSON.parse(JSON.stringify(defaultGoals)));
    setPassiveIncomes(JSON.parse(JSON.stringify(defaultPassiveIncomes)));
    setActiveIncomes(JSON.parse(JSON.stringify(defaultActiveIncomes)));
  };

  const editGoalPrice = () => {
    if (editingGoalPrice) {
      const newPrice = parseInt(tempGoalPrice);
      if (!isNaN(newPrice) && newPrice > 0) {
        setSelectedGoal({ ...selectedGoal, price: newPrice });
        // Update the goal in the goals array too
        setGoals(prevGoals => prevGoals.map(g =>
            g.id === selectedGoal.id ? { ...g, price: newPrice } : g
        ));
      }
      setEditingGoalPrice(false);
    } else {
      setTempGoalPrice(selectedGoal.price.toString());
      setEditingGoalPrice(true);
    }
  };

  const toggleGoalPriceEdit = (goalId, currentPrice) => {
    if (editingGoalId === goalId) {
      // Save the price
      const newPrice = parseInt(tempPrices[goalId]);
      if (!isNaN(newPrice) && newPrice > 0) {
        setGoals(prevGoals => prevGoals.map(g =>
            g.id === goalId ? { ...g, price: newPrice } : g
        ));
        // Update selected goal if it's the one being edited
        if (selectedGoal?.id === goalId) {
          setSelectedGoal({ ...selectedGoal, price: newPrice });
        }
      }
      setEditingGoalId(null);
    } else {
      // Start editing
      setEditingGoalId(goalId);
      setTempPrices({ ...tempPrices, [goalId]: currentPrice.toString() });
    }
  };

  const saveGoalPriceEdit = (goalId) => {
    const newPrice = parseInt(tempPrices[goalId]);
    if (!isNaN(newPrice) && newPrice > 0) {
      setGoals(prevGoals => prevGoals.map(g =>
          g.id === goalId ? { ...g, price: newPrice } : g
      ));
      // Update selected goal if it's the one being edited
      if (selectedGoal?.id === goalId) {
        setSelectedGoal({ ...selectedGoal, price: newPrice });
      }
    }
    setEditingGoalId(null);
  };

  const editIncomeAmount = (incomeId, newAmount, isPassive) => {
    if (isPassive) {
      setPassiveIncomes(prev => prev.map(income =>
          income.id === incomeId ? { ...income, amount: parseInt(newAmount) || 0 } : income
      ));
      setSelectedPassiveIncomes(prev => prev.map(income =>
          income.id === incomeId ? { ...income, amount: parseInt(newAmount) || 0 } : income
      ));
    } else {
      setActiveIncomes(prev => prev.map(income =>
          income.id === incomeId ? { ...income, amount: parseInt(newAmount) || 0 } : income
      ));
      setSelectedActiveIncomes(prev => prev.map(income =>
          income.id === incomeId ? { ...income, amount: parseInt(newAmount) || 0 } : income
      ));
    }
  };

  const editIncomeName = (incomeId, newName, isPassive) => {
    if (isPassive) {
      setPassiveIncomes(prev => prev.map(income =>
          income.id === incomeId ? { ...income, name: newName } : income
      ));
    } else {
      setActiveIncomes(prev => prev.map(income =>
          income.id === incomeId ? { ...income, name: newName } : income
      ));
    }
  };

  const addCustomPassiveIncome = () => {
    if (customPassiveIncomeCounter >= 5) return;

    const newId = `custom_passive_${Date.now()}`;
    const newIncome = {
      id: newId,
      name: '',
      icon: '💵',
      amount: 0,
      unit: '₪',
      isOneTime: true,
      isCustom: true,
      color: 'bg-red-500'
    };

    setPassiveIncomes(prev => [...prev, newIncome]);
    setCustomPassiveIncomeCounter(prev => prev + 1);
    setEditingIncome(`${newId}-name`);
  };

  const addCustomActiveIncome = () => {
    if (customActiveIncomeCounter >= 5) return;

    const newId = `custom_active_${Date.now()}`;
    const newIncome = {
      id: newId,
      name: '',
      icon: '💵',
      amount: 0,
      unit: 'לפעם',
      timesPerWeek: 0,
      isCustom: true,
      color: 'bg-red-500'
    };

    setActiveIncomes(prev => [...prev, newIncome]);
    setCustomActiveIncomeCounter(prev => prev + 1);
    setEditingIncome(`${newId}-name`);
  };

  // Background gradient for all pages
  const bgGradient = "finance-gradient bg-gradient-to-br from-green-800 via-green-600 to-green-400";

  if (currentStage === 'opening') {
    return (
        <div className={`min-h-screen ${bgGradient}`} dir="rtl">
          <div className="top-0 z-50 bg-white shadow-md p-4">
            <div className="max-w-6xl mx-auto flex justify-center items-center">
              <img
                  src={`./LiatFishelLeadershipLogo.jpg`}
                  alt="לוגו: מנהיגות כלכלית - כסף כן גדל על העצים - חינוך פיננסי | קבוצת ליאת פישל"
                  className="h-40" // ניתן לשנות את הגודל כאן באמצעות Tailwind CSS
              />
            </div>
          </div>

          <div className="flex items-center justify-center main-content-padding finance-viewport">
            <div className="text-center max-w-2xl">
              <div className={`mb-8 ${showAnimation ? 'animate-pulse' : ''}`}>
                <h1 className="font-bold text-white mb-4 drop-shadow-lg finance-title-xl">
                  המרוץ ליעד
                </h1>
                <h2 className="text-white mb-4 drop-shadow-lg finance-title-lg">
                  תכנית ההצלחה הכלכלית שלך
                </h2>
              </div>

              <div className="flex justify-center gap-4 mb-8">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className="w-8 h-8 text-white animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                    />
                ))}
              </div>

              <div className="text-white font-bold mb-8 animate-pulse finance-countdown">
                3... 2... 1... מתחילים!
              </div>

              <button
                  onClick={() => {
                    setCurrentStage('info');
                    setTimeout(() => playSound('start'), 0);
                  }}
                  className="hover:bg-opacity-90 active:bg-opacity-80 text-white font-bold py-4 px-8 rounded-full text-2xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-200 finance-cta-button bg-yellow-600"
              >
                בואו נתחיל!
              </button>
            </div>
          </div>
        </div>
    );
  }

  if (currentStage === 'info') {
    return (
        <div className={`min-h-screen ${bgGradient}`} dir="rtl">
          <div className="sticky top-0 z-50 bg-white shadow-md main-content-padding">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <button onClick={goBack} className="flex items-center gap-2 text-white hover:bg-opacity-90 active:bg-opacity-80 px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 finance-back-button">
                <ArrowRight className="w-5 h-5" />
                חזרה
              </button>
              <div class="flex items-center justify-center h-full">
                <h2 class="text-lg md:text-xl font-bold text-gray-800 text-center md:text-right md:mb-0 px-2">
                  פרטים אישיים
                </h2>
              </div>
              <button onClick={() => setIsMuted(!isMuted)} className="p-2">
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <div className="main-content-padding">
            <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 mt-10">
              <h2 className="font-bold text-center mb-8 text-gray-800 finance-title-lg">
                בואו נכיר! 👋
              </h2>

              <div className="space-y-6">
                <input
                    type="text"
                    placeholder="שם פרטי"
                    value={studentInfo.firstName}
                    onChange={(e) => setStudentInfo({...studentInfo, firstName: e.target.value})}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl text-right focus:border-blue-500 focus:outline-none text-lg"
                />

                <input
                    type="text"
                    placeholder="שם משפחה"
                    value={studentInfo.lastName}
                    onChange={(e) => setStudentInfo({...studentInfo, lastName: e.target.value})}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl text-right focus:border-blue-500 focus:outline-none text-lg"
                />

                <input
                    type="text"
                    placeholder="שם בית הספר"
                    value={studentInfo.school}
                    onChange={(e) => setStudentInfo({...studentInfo, school: e.target.value})}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl text-right focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>

              <button
                  onClick={() => {
                    playSound('continue');
                    setCurrentStage('goals');
                  }}
                  disabled={!studentInfo.firstName || !studentInfo.lastName}
                  className={`w-full mt-8 hover:bg-opacity-90 active:bg-opacity-80 disabled:opacity-50 text-white font-bold py-4 rounded-full text-xl transition-all duration-200 transform hover:scale-105 active:scale-95 finance-cta-button ${!studentInfo.firstName || !studentInfo.lastName ? 'finance-disabled-button' : 'finance-primary-button'}`}
              >
                המשך לבחירת יעד
              </button>
            </div>
          </div>
        </div>
    );
  }

  if (currentStage === 'goals') {
    return (
        <div className={`min-h-screen ${bgGradient}`} dir="rtl">
          <div className="sticky top-0 z-50 bg-white shadow-md main-content-padding">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <button onClick={goBack} className="flex items-center gap-2 text-white hover:bg-opacity-90 active:bg-opacity-80 px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 finance-back-button">
                <ArrowRight className="w-5 h-5" />
                חזרה
              </button>
              <h2 className="text-lg md:text-xl font-bold text-gray-800 text-center md:text-right md:mb-0 px-2">שלב 1 - בחירת היעד שלך</h2>
              <button onClick={() => setIsMuted(!isMuted)} className="p-2">
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <div className="main-content-padding">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8 mt-8">
                {goals.map((goal) => (
                    <div
                        key={goal.id}
                        onClick={() => {
                          if (editingGoalId !== goal.id) {
                            setSelectedGoal(goal);
                            playSound('income');
                          }
                        }}
                        className={`${goal.color} rounded-3xl p-6 text-center cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-2xl ${
                            selectedGoal?.id === goal.id ? 'ring-4 ring-yellow-400' : ''
                        }`}
                    >
                      <div className="text-5xl mb-3">{goal.icon}</div>
                      <h3 className="text-white font-bold text-lg mb-2">{goal.name}</h3>
                      <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleGoalPriceEdit(goal.id, goal.price);
                            }}
                            className="text-yellow-200 hover:text-white transition-colors text-lg"
                        >
                          ✏️
                        </button>
                        {editingGoalId === goal.id ? (
                            <input
                                type="number"
                                value={tempPrices[goal.id] || ''}
                                onChange={(e) => setTempPrices({ ...tempPrices, [goal.id]: e.target.value })}
                                onBlur={() => saveGoalPriceEdit(goal.id)}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    saveGoalPriceEdit(goal.id);
                                  }
                                }}
                                className="w-24 px-2 py-1 text-center rounded text-gray-800 font-semibold"
                                autoFocus
                            />
                        ) : (
                            <p className="text-yellow-200 font-semibold">{goal.price.toLocaleString()} ₪</p>
                        )}
                      </div>
                    </div>
                ))}
              </div>

              {selectedGoal && (
                  <div className="bg-white rounded-3xl p-8 text-center shadow-2xl">
                    <h3 className="font-bold text-gray-800 mb-2 finance-title-lg">
                      היעד שלי:
                    </h3>
                    <p className="text-2xl font-bold text-blue-600 mb-4">
                      {selectedGoal.name} - {selectedGoal.price.toLocaleString()} ₪
                    </p>
                    <p className="text-xl text-gray-600 mb-6">
                      מוכנים? עכשיו נתחיל לפעול כדי להשיג את זה! 💪
                    </p>
                    <button
                        onClick={() => {
                          playSound('continue');
                          setCurrentStage('passive income');
                        }}
                        className="hover:bg-opacity-90 active:bg-opacity-80 text-white font-bold py-4 px-8 rounded-full text-2xl shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 finance-cta-button finance-primary-button"
                    >
                      בואו נתחיל לחשב!
                    </button>
                  </div>
              )}
            </div>
          </div>
        </div>
    );
  }

  if (currentStage === 'passive income') {
    const oneTimeIncome = calculateOneTimeIncome();
    const remaining = selectedGoal.price - oneTimeIncome;

    return (
        <div className={`min-h-screen ${bgGradient}`} dir="rtl">
          <div className="sticky top-0 z-50 bg-white shadow-md">
            <div className="max-w-6xl mx-auto p-4">
              <div className="flex justify-between items-center mb-4 p-4">
                <button onClick={goBack} className="flex items-center gap-2 text-white hover:bg-opacity-90 active:bg-opacity-80 px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 finance-back-button">
                  <ArrowRight className="w-5 h-5" />
                  חזרה
                </button>
                <div className="text-center w-full md:w-auto mb-4 md:mb-0 px-2">
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">שלב 2 – הכנסות פסיביות במהלך השנה</h2>
                </div>
                <button onClick={() => setIsMuted(!isMuted)} className="p-2">
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="space-y-2 text-right">
                  <p className="text-base">
                    <span className="font-semibold">היעד שלי:</span>{' '}
                    <span className="font-bold text-blue-600">{selectedGoal.icon} {selectedGoal.name} - {selectedGoal.price.toLocaleString()} ₪</span>
                  </p>
                  <p className="text-base">
                    <span className="font-semibold">הכנסות פסיביות שנתיות:</span>{' '}
                    <span className="font-bold text-green-600">{oneTimeIncome.toLocaleString()} ₪</span>
                  </p>
                  {calculateWeeklyPassiveIncome() > 0 && (
                      <p className="text-base">
                        <span className="font-semibold">הכנסות פסיביות שבועיות:</span>{' '}
                        <span className="font-bold text-green-600">{calculateWeeklyPassiveIncome().toLocaleString()} ₪</span>
                      </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="main-content-padding">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-3xl p-6 mb-8 shadow-2xl">
                <h3 className="font-bold text-center mb-6 text-gray-800 finance-title-lg">
                  הכנסות פסיביות במהלך השנה
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {passiveIncomes.map((item) => {
                    const isSelected = selectedPassiveIncomes.some(i => i.id === item.id);
                    return (
                        <div
                            key={item.id}
                            onClick={() => {
                              if (!editingIncome || !editingIncome.startsWith(item.id)) {
                                handlePassiveIncomeSelect(item);
                              }
                            }}
                            className={`${item.color} ${isSelected ? 'ring-4 ring-yellow-400 brightness-110' : ''} rounded-3xl p-6 text-center ${(!editingIncome || !editingIncome.startsWith(item.id)) ? 'cursor-pointer hover:scale-105' : ''} transform transition-all duration-200 shadow-2xl`}
                        >
                          <div className="text-5xl mb-3">{item.icon}</div>
                          <div className="mb-2">
                            {item.isCustom && editingIncome === `${item.id}-name` ? (
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => editIncomeName(item.id, e.target.value, true)}
                                    onBlur={() => setEditingIncome(null)}
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        setEditingIncome(null);
                                      }
                                    }}
                                    placeholder="שם ההכנסה"
                                    className="bg-white text-gray-800 px-2 py-1 rounded w-full text-center font-bold text-lg"
                                    autoFocus
                                />
                            ) : (
                                <div className="flex items-center justify-center gap-1">
                                  {item.isCustom && (
                                      <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingIncome(`${item.id}-name`);
                                          }}
                                          className="text-white hover:text-yellow-200 transition-colors text-sm"
                                      >
                                        ✏️
                                      </button>
                                  )}
                                  <h3 className="text-white font-bold text-lg">{item.name || 'הכנסה חדשה'}</h3>
                                </div>
                            )}
                          </div>

                          <div className="flex items-center justify-center gap-2 mb-2">
                            <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingIncome(editingIncome === `${item.id}-amount` ? null : `${item.id}-amount`);
                                }}
                                className="text-yellow-200 hover:text-white transition-colors text-lg"
                            >
                              ✏️
                            </button>
                            {editingIncome === `${item.id}-amount` ? (
                                <input
                                    type="number"
                                    value={item.amount}
                                    onChange={(e) => editIncomeAmount(item.id, e.target.value, true)}
                                    onBlur={() => setEditingIncome(null)}
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        setEditingIncome(null);
                                      }
                                    }}
                                    className="w-20 px-2 py-1 text-center rounded text-gray-800 font-semibold"
                                    autoFocus
                                />
                            ) : (
                                <p className="text-yellow-200 font-semibold">{item.amount} {item.unit}</p>
                            )}
                          </div>
                          <span className="text-xs text-yellow-100">
                        {item.isOneTime ? 'שנתי' : 'שבועי'}
                      </span>
                        </div>
                    );
                  })}

                  {customPassiveIncomeCounter < 5 && (
                      <div
                          onClick={addCustomPassiveIncome}
                          className="bg-red-500 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transform transition-all duration-200 shadow-2xl hover:brightness-110"
                      >
                        <div className="text-6xl mb-3">➕</div>
                        <h3 className="text-white font-bold text-lg text-center">הוסף קטגוריה</h3>
                      </div>
                  )}
                </div>
              </div>

              <div className="text-center">
                <button
                    onClick={() => {
                      playSound('continue');
                      setCurrentStage('active income');
                    }}
                    className="hover:bg-opacity-90 active:bg-opacity-80 text-white font-bold py-4 px-8 rounded-full text-2xl shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 finance-cta-button finance-primary-button"
                >
                  המשך להכנסות אקטיביות
                </button>
              </div>
            </div>
          </div>
        </div>
    );
  }

  if (currentStage === 'active income') {
    const totalWeeklyIncome = calculateTotalWeeklyIncome();

    return (
        <div className={`min-h-screen ${bgGradient}`} dir="rtl">
          <div className="sticky top-0 z-50 bg-white shadow-md">
            <div className="max-w-6xl mx-auto p-4">
              <div className="flex justify-between items-center mb-4 p-4">
                <button onClick={goBack} className="flex items-center gap-2 text-white hover:bg-opacity-90 active:bg-opacity-80 px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 finance-back-button">
                  <ArrowRight className="w-5 h-5" />
                  חזרה
                </button>
                <div className="text-center w-full md:w-auto mb-4 md:mb-0 px-2">
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">שלב 3 – הכנסות אקטיביות שבועיות</h2>
                </div>
                <button onClick={() => setIsMuted(!isMuted)} className="p-2">
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="space-y-2 text-right">
                  <p className="text-base">
                    <span className="font-semibold">היעד שלי:</span>{' '}
                    <span className="font-bold text-blue-600">{selectedGoal.icon} {selectedGoal.name} - {selectedGoal.price.toLocaleString()} ₪</span>
                  </p>
                  <p className="text-base">
                    <span className="font-semibold">הכנסות אקטיביות שבועיות:</span>{' '}
                    <span className="font-bold text-green-600">{calculateWeeklyActiveIncome().toLocaleString()} ₪</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="main-content-padding">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-3xl p-6 mb-8 shadow-2xl">
                <h3 className="font-bold text-center mb-6 text-gray-800 finance-title-lg">
                  עשייה שתלויה בי
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {activeIncomes.map((item) => {
                    const isSelected = item.timesPerWeek > 0;
                    return (
                        <div
                            key={item.id}
                            className={`${item.color} ${isSelected ? 'ring-4 ring-yellow-400 brightness-110' : ''} rounded-3xl p-6 transform transition-all duration-200 shadow-2xl flex flex-col min-h-[320px]`}
                        >
                          <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <div className="text-5xl mb-3">{item.icon}</div>
                            <div className="mb-2">
                              {item.isCustom && editingIncome === `${item.id}-name` ? (
                                  <input
                                      type="text"
                                      value={item.name}
                                      onChange={(e) => editIncomeName(item.id, e.target.value, false)}
                                      onBlur={() => setEditingIncome(null)}
                                      onClick={(e) => e.stopPropagation()}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          setEditingIncome(null);
                                        }
                                      }}
                                      placeholder="שם ההכנסה"
                                      className="bg-white text-gray-800 px-2 py-1 rounded w-full text-center font-bold text-lg"
                                      autoFocus
                                  />
                              ) : (
                                  <div className="flex flex-col items-center justify-center gap-1">
                                    <div className="flex items-center gap-1">
                                      {item.isCustom && (
                                          <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingIncome(`${item.id}-name`);
                                              }}
                                              className="text-white hover:text-yellow-200 transition-colors text-sm"
                                          >
                                            ✏️
                                          </button>
                                      )}
                                      {item.id === 'partjob' ? (
                                          <>
                                            <h3 className="text-white font-bold text-lg">עבודות חוץ</h3>
                                          </>
                                      ) : (
                                          <h3 className="text-white font-bold text-lg">{item.name || 'הכנסה חדשה'}</h3>
                                      )}
                                    </div>
                                    {item.id === 'partjob' && (
                                        <p className="text-white text-xs">(קיוסק/פיצה/מלצרות)</p>
                                    )}
                                  </div>
                              )}
                            </div>

                            <div className="mb-3">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingIncome(editingIncome === `${item.id}-amount` ? null : `${item.id}-amount`);
                                    }}
                                    className="text-yellow-200 hover:text-white transition-colors text-lg"
                                >
                                  ✏️
                                </button>
                                {editingIncome === `${item.id}-amount` ? (
                                    <input
                                        type="number"
                                        value={item.amount}
                                        onChange={(e) => editIncomeAmount(item.id, e.target.value, false)}
                                        onBlur={() => setEditingIncome(null)}
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            setEditingIncome(null);
                                          }
                                        }}
                                        className="w-20 px-2 py-1 text-center rounded text-gray-800 font-semibold"
                                        autoFocus
                                    />
                                ) : (
                                    <p className="text-yellow-200 font-semibold">{item.amount} ₪</p>
                                )}
                              </div>
                              {item.unit.replace('₪ ', '') && item.unit !== '₪' && (
                                  <span className="text-xs text-yellow-100">
                              {item.unit.replace('₪ ', '')}
                            </span>
                              )}
                            </div>
                          </div>

                          <div className="mt-auto">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <button
                                  onClick={() => {
                                    playSound('expense');
                                    updateActiveIncomeTimes(item.id, -1);
                                  }}
                                  className="hover:brightness-110 text-white p-1 rounded-lg transition-all finance-small-button finance-decrement-button"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="text-xl font-bold text-white min-w-[40px] text-center">
                            {item.timesPerWeek}
                          </span>
                              <button
                                  onClick={() => {
                                    playSound('income');
                                    updateActiveIncomeTimes(item.id, 1);
                                  }}
                                  className="hover:brightness-110 text-white p-1 rounded-lg transition-all finance-small-button finance-increment-button"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {item.timesPerWeek > 0 && (
                                <div className="text-center text-white font-bold text-sm bg-white bg-opacity-20 rounded-lg py-1">
                                  {(item.amount * item.timesPerWeek).toLocaleString()} ₪
                                </div>
                            )}
                          </div>
                        </div>
                    );
                  })}

                  {customActiveIncomeCounter < 5 && (
                      <div
                          onClick={addCustomActiveIncome}
                          className="bg-red-500 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transform transition-all duration-200 shadow-2xl hover:brightness-110 min-h-[320px]"
                      >
                        <div className="text-6xl mb-3">➕</div>
                        <h3 className="text-white font-bold text-lg text-center" >הוסף קטגוריה</h3>
                      </div>
                  )}
                </div>
              </div>

              <div className="text-center">
                <button
                    onClick={() => {
                      playSound('continue');
                      setCurrentStage('expenses');
                    }}
                    className="hover:bg-opacity-90 active:bg-opacity-80 text-white font-bold py-4 px-8 rounded-full text-2xl shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 finance-cta-button finance-primary-button"
                >
                  המשך להוצאות
                </button>
              </div>
            </div>
          </div>
        </div>
    );
  }

  if (currentStage === 'expenses') {
    const totalWeeklyIncome = calculateTotalWeeklyIncome();
    const oneTimeIncome = calculateOneTimeIncome();

    return (
        <div className={`min-h-screen ${bgGradient}`} dir="rtl">
          <div className="sticky top-0 z-50 bg-white shadow-md">
            <div className="max-w-6xl mx-auto p-4">
              <div className="flex justify-between items-center mb-4 p-4">
                <button onClick={goBack} className="flex items-center gap-2 text-white hover:bg-opacity-90 active:bg-opacity-80 px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 finance-back-button">
                  <ArrowRight className="w-5 h-5" />
                  חזרה
                </button>
                <div className="text-center w-full md:w-auto md:mb-0 px-2">
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">שלב 4 – הוצאות שבועיות</h2>
                </div>
                <button onClick={() => setIsMuted(!isMuted)} className="p-2">
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="space-y-2 text-right">
                  <p className="text-base">
                    <span className="font-semibold">היעד שלי:</span>{' '}
                    <span className="font-bold text-blue-600">{selectedGoal.icon} {selectedGoal.name} - {selectedGoal.price.toLocaleString()} ₪</span>
                  </p>
                  <p className="text-base">
                    <span className="font-semibold">הוצאות שבועיות:</span>{' '}
                    <span className="font-bold text-red-600">{calculateTotalExpenses().toLocaleString()} ₪</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="main-content-padding">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <h3 className="font-bold text-center mb-6 text-gray-800 finance-title-lg">
                  מתוך כל ההכנסות שלי אני בוחר להוציא בשבוע:
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {expenseOptions.map((amount) => (
                      <button
                          key={amount}
                          onClick={() => handleExpenseSelect(amount)}
                          className={`${
                              selectedExpense === amount
                                  ? 'bg-red-700 ring-4 ring-yellow-400'
                                  : 'bg-red-500 hover:bg-red-600'
                          } text-white font-bold py-6 px-4 rounded-2xl text-2xl transform hover:scale-105 transition-all duration-200 shadow-lg h-[120px] flex items-center justify-center`}
                      >
                        {amount} ₪
                      </button>
                  ))}

                  <button
                      onClick={() => handleExpenseSelect('other')}
                      className={`${
                          selectedExpense === 'other'
                              ? 'bg-red-700 ring-4 ring-yellow-400'
                              : 'bg-red-500 hover:bg-red-600'
                      } text-white font-bold py-6 px-4 rounded-2xl text-2xl transform hover:scale-105 transition-all duration-200 shadow-lg relative h-[120px] flex items-center justify-center`}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span>אחר</span>
                      <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingExpense(!editingExpense);
                            }}
                            className="text-yellow-200 hover:text-white transition-colors"
                        >
                          ✏️
                        </button>
                        {editingExpense ? (
                            <input
                                type="number"
                                value={otherExpenseAmount}
                                onChange={(e) => setOtherExpenseAmount(parseInt(e.target.value) || 0)}
                                onBlur={() => setEditingExpense(false)}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    setEditingExpense(false);
                                  }
                                }}
                                className="w-20 px-2 py-1 text-center rounded text-gray-800 font-semibold text-lg"
                                autoFocus
                            />
                        ) : (
                            <span className={otherExpenseAmount === 0 ? "text-white" : "text-yellow-200"}>{otherExpenseAmount} ₪</span>
                        )}
                      </div>
                    </div>
                  </button>
                </div>

                <div className="text-center">
                  <button
                      onClick={() => {
                        playSound('continue');
                        setCurrentStage('summary');
                      }}
                      disabled={!selectedExpense}
                      className={`hover:bg-opacity-90 active:bg-opacity-80 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-full text-2xl shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 finance-cta-button ${selectedExpense ? 'finance-primary-button' : 'finance-disabled-button'}`}
                  >
                    סיום המשחק
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }

  if (currentStage === 'summary') {
    const oneTimeIncome = calculateOneTimeIncome();
    const weeklyIncome = calculateTotalWeeklyIncome();
    const weeklyExpenses = calculateTotalExpenses();
    const weeklyBalance = weeklyIncome - weeklyExpenses;

    // Check if goal is achieved
    let goalAchieved = false;
    let weeksNeeded = 0;
    let totalSavings = oneTimeIncome;

    if (oneTimeIncome >= selectedGoal.price) {
      // Goal already achieved with passive income alone
      goalAchieved = true;
      weeksNeeded = 0;
    } else if (weeklyBalance > 0) {
      // Need to work weeks to reach goal
      const remainingNeeded = selectedGoal.price - oneTimeIncome;
      weeksNeeded = Math.ceil(remainingNeeded / weeklyBalance);
      totalSavings = oneTimeIncome + (weeklyBalance * weeksNeeded);
      goalAchieved = totalSavings >= selectedGoal.price;
    } else {
      // Weekly balance is 0 or negative - cannot reach goal
      goalAchieved = false;
    }

    // Calculate remaining savings after buying the goal
    const remainingSavings = goalAchieved ? totalSavings - selectedGoal.price : 0;

    // Calculate how long the remaining savings will last (only if there's a deficit)
    let savingsDurationWeeks = 0;
    let savingsDurationYears = 0;
    if (goalAchieved && weeklyBalance < 0 && remainingSavings > 0) {
      savingsDurationWeeks = Math.floor(remainingSavings / Math.abs(weeklyBalance));
      savingsDurationYears = Math.round(savingsDurationWeeks / 52);
    }

    const studentFullName = [studentInfo.firstName, studentInfo.lastName].filter(Boolean).join(' ').trim() || '—';
    const goalPriceText = `${selectedGoal.price.toLocaleString()} ₪`;

    return (
        <div className={`min-h-screen ${bgGradient}`} dir="rtl">
          <div className="sticky top-0 z-50 bg-white shadow-md p-4" style={{padding:'0.5rem'}}>
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <button onClick={goBack} className="flex items-center gap-2 text-white hover:bg-opacity-90 active:bg-opacity-80 px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 finance-back-button">
                <ArrowRight className="w-5 h-5" />
                חזרה
              </button>
              <h2 className="text-lg md:text-xl font-bold text-gray-800 text-center md:text-right md:mb-0 px-2">סיכום</h2>
              <button onClick={() => setIsMuted(!isMuted)} className="p-2">
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <div className="main-content-padding">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="text-8xl mb-4"></div>
                <h2 className="font-bold text-white mb-4 drop-shadow-lg text-4xl">
                  {goalAchieved ? '🏆' : '💪'}                   כל הכבוד!
                </h2>
                <p className="text-yellow-300 font-semibold drop-shadow finance-title-sm">
                  {goalAchieved ? 'יצרת את תכנית ההצלחה להשגת היעד הכלכלי שלך' : 'עשית צעד חשוב קדימה'}
                </p>
                <p className="text-white font-semibold drop-shadow finance-title-sm">
                  שם: {studentFullName} | היעד: {selectedGoal.name} {goalPriceText}
                </p>
                {!goalAchieved && (
                    <p className="text-yellow-200 font-semibold drop-shadow mt-2 finance-title-md">
                      חזרו לתקן את התכנית כדי להגיע ליעד
                    </p>
                )}
              </div>

              {/* הודעת סיכום דינמית */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
                {goalAchieved && weeklyBalance >= 0 && (
                    <div className="text-center space-y-4">
                      <h3 className="text-xl font-bold text-green-600 mb-3">🎉 מזל טוב! הגעת ליעד שלך!</h3>
                      <div className="bg-green-50 rounded-2xl p-6 text-right space-y-3">
                        <p className="text-lg font-bold text-green-700">
                          {selectedGoal.icon} יש לך מספיק כסף כדי לקנות {selectedGoal.name}
                        </p>
                        <p className="text-lg text-green-600">
                          💰 יתרת חיסכון לאחר הקנייה: {remainingSavings.toLocaleString()} ₪
                        </p>
                        <p className="text-lg text-green-600">
                          ✅ רווח שבועי: {weeklyBalance.toLocaleString()}{weeklyBalance > 0 ? '+ ' : ' '}₪
                        </p>
                        {weeksNeeded > 0 && (
                            <div className="">
                              <h4 className="text-lg text-green-700">
                                ⏱️ זמן הגעה ליעד <span className="font-bold">{weeksNeeded} {weeksNeeded === 1 ? 'שבוע' : 'שבועות'}</span>
                              </h4>
                              
                                
                              
                              <p className="text-lg text-green-700">
                                בהנחה שתפעל על פי תכנית זו ! 🎯
                              </p>
                            </div>
                        )}
                      </div>
                      
                    </div>
                )}

                {goalAchieved && weeklyBalance < 0 && (
                    <div className="text-center space-y-4">
                      <h3 className="text-4xl font-bold text-green-600 mb-6">🎉 מזל טוב! הגעת ליעד שלך!</h3>
                      <div className="bg-gradient-to-b from-green-50 to-yellow-50 rounded-2xl p-6 text-right space-y-4">
                        <p className="text-2xl font-bold text-green-700">
                          {selectedGoal.icon} יש לך מספיק כסף כדי לקנות את {selectedGoal.name}
                        </p>
                        <p className="text-xl text-green-600">
                          💰 יתרת חיסכון לאחר הקנייה: {remainingSavings.toLocaleString()} ₪
                        </p>
                        <div className="border-t-2 border-yellow-300 pt-4">
                          <p className="text-xl font-bold text-orange-600 mb-2">
                            ⚠️ גירעון שבועי: {Math.abs(weeklyBalance).toLocaleString()}- ₪
                          </p>
                          {remainingSavings > 0 && (
                              <p className="text-lg text-gray-700 mb-3">
                                ⏰ היתרה שלך תחזיק ל-{savingsDurationWeeks} שבועות (~{savingsDurationYears} שנים)
                              </p>
                          )}
                          <div className="bg-yellow-100 rounded-xl p-4 mt-3">
                            <p className="text-lg font-semibold text-gray-800">
                              💡 כדי לשמור על החיסכון, הקטן הוצאות או הגדל הכנסות
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                )}

                {!goalAchieved && (
                    <div className="text-center space-y-4">
                      <h3 className="text-3xl font-bold text-orange-600 mb-6">❗ היעד עדיין לא הושג</h3>
                      <div className="bg-orange-50 rounded-2xl p-6 text-right space-y-3">
                        <p className="text-xl text-orange-700 font-semibold">
                          💡 המשך לחסוך ולעקוב אחרי ההוצאות וההכנסות כדי להגיע אליו!
                        </p>
                        <div className="bg-white rounded-xl p-4 mt-3">
                          <p className="text-lg text-gray-700">
                            ✅ הקטן את ההוצאות השבועיות
                          </p>
                          <p className="text-lg text-gray-700">
                            ✅ הגדל את ההכנסות השבועיות
                          </p>
                          <p className="text-lg text-gray-700">
                            ✅ או שניהם ביחד!
                          </p>
                        </div>
                      </div>
                    </div>
                )}
              </div>

              {goalAchieved && (
                  <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
                    {/* פירוט הכנסות והוצאות */}
                    
                      <h4 className="text-2xl font-bold text-center mb-6 text-gray-800">
                        📊 פירוט הכנסות והוצאות
                      </h4>

                      <div className="space-y-6 text-right">
                        {/* הכנסות פסיביות */}
                        <div className="bg-green-50 rounded-2xl p-6">
                          <h5 className="text-lg font-bold mb-4 text-green-700">💰 הכנסות פסיביות (שנתיות):</h5>
                          {selectedPassiveIncomes.filter(i => i.isOneTime).length > 0 ? (
                              <>
                                {selectedPassiveIncomes.filter(i => i.isOneTime).map((income) => (
                                    <p key={income.id} className="text-gray-700 text-lg mb-2">
                                      • {income.name || 'הכנסה'}: {income.amount.toLocaleString()} ₪
                                    </p>
                                ))}
                                <p className="font-bold text-green-600 text-lg mt-3 pt-3 border-t-2 border-green-200">
                                  סה״כ: {oneTimeIncome.toLocaleString()} ₪
                                </p>
                              </>
                          ) : (
                              <p className="text-gray-500 text-lg">אין הכנסות פסיביות</p>
                          )}
                        </div>

                        {/* הכנסות שבועיות */}
                        <div className="bg-blue-50 rounded-2xl p-6">
                          <h5 className="text-lg font-bold mb-4 text-blue-700">📊 הכנסות שבועיות:</h5>
                          {selectedPassiveIncomes.filter(i => !i.isOneTime).length > 0 || selectedActiveIncomes.length > 0 ? (
                              <>
                                {selectedPassiveIncomes.filter(i => !i.isOneTime).map((income) => (
                                    <p key={income.id} className="text-gray-700 text-lg mb-2">
                                      • {income.name || 'הכנסה'}: {income.amount.toLocaleString()} ₪
                                    </p>
                                ))}
                                {selectedActiveIncomes.map((income) => (
                                    <p key={income.id} className="text-gray-700 text-lg mb-2">
                                      • {income.name || 'הכנסה'}: {income.amount.toLocaleString()} ₪ × {income.timesPerWeek} פעמים = {(income.amount * income.timesPerWeek).toLocaleString()} ₪
                                    </p>
                                ))}
                                <p className="font-bold text-blue-600 text-lg mt-3 pt-3 border-t-2 border-blue-200">
                                  סה״כ: {weeklyIncome.toLocaleString()} ₪ בשבוע
                                </p>
                              </>
                          ) : (
                              <p className="text-gray-500 text-lg">אין הכנסות שבועיות</p>
                          )}
                        </div>

                        {/* הוצאות */}
                        <div className="bg-red-50 rounded-2xl p-6">
                          <h5 className="text-lg font-bold mb-4 text-red-700">💸 הוצאות שבועיות:</h5>
                          <p className="text-gray-700 text-lg mb-2">
                            • הוצאות אישיות: {weeklyExpenses.toLocaleString()} ₪
                          </p>
                          <p className="font-bold text-red-600 text-lg mt-3 pt-3 border-t-2 border-red-200">
                            סה״כ: {weeklyExpenses.toLocaleString()} ₪ בשבוע
                          </p>
                        </div>

                        {/* מאזן שבועי */}
                        <div className={`${weeklyBalance >= 0 ? 'bg-green-100' : 'bg-orange-100'} rounded-2xl p-6`}>
                          <p className={`font-bold text-lg ${weeklyBalance >= 0 ? 'text-green-700' : 'text-orange-700'}`}>
                            {weeklyBalance >= 0 ? '✅' : '⚠️'} מאזן שבועי: {Math.abs(weeklyBalance).toLocaleString()}{weeklyBalance > 0 ? '+ ' : weeklyBalance < 0 ? '- ' : ' '}₪
                          </p>
                          {weeklyBalance >= 0 ? (
                              <p className="text-green-600 text-lg mt-2">
                                🌟 ההכנסות שלך גבוהות מההוצאות
                              </p>
                          ) : (
                              <p className="text-orange-600 text-lg mt-2">
                                💡 שים לב: יש לך גירעון שבועי - כדאי לשקול הגדלת הכנסות או הקטנת הוצאות
                              </p>
                          )}
                        </div>
                      </div>
                    
                    <div className="bg-blue-50 rounded-2xl p-6">
                      
                      <p className="text-lg font-bold text-center text-blue-800 mb-4">
                        💪 מה עכשיו? הזמן לפעול!
                      </p>
                      <div className="text-lg space-y-2 text-right">
                        <p>1️⃣ להשיג את העבודות (מומלץ להתייעץ עם המשפחה, לרתום את הסביבה)</p>
                        <p>2️⃣ ניהול זמן נכון (תוך שמירה על איזון עם הלימודים ושיעורי הבית)</p>
                      </div>
                      <p className="text-lg font-bold text-center text-blue-600 mt-4">בהצלחה! 🎉</p>
                    </div>
                  </div>
              )}

              {!goalAchieved && (
                  <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="text-center p-6 bg-blue-50 rounded-2xl">
                        <h4 className="text-xl font-bold mb-3 text-blue-800">פרטי השחקן</h4>
                        <p className="text-lg mb-1">{studentInfo.firstName} {studentInfo.lastName}</p>
                        <p className="text-base text-gray-600">{studentInfo.school}</p>
                        {studentInfo.phone && <p className="text-base text-gray-600">{studentInfo.phone}</p>}
                      </div>

                      <div className="text-center p-6 bg-orange-50 rounded-2xl">
                        <h4 className="text-xl font-bold mb-3 text-orange-800">היעד שלך</h4>
                        <div className="text-5xl mb-2">{selectedGoal.icon}</div>
                        <p className="text-lg font-bold">{selectedGoal.name}</p>
                        <p className="text-base text-gray-600">{selectedGoal.price.toLocaleString()} ₪</p>
                      </div>
                    </div>

                    {/* פירוט הכנסות והוצאות */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h4 className="text-2xl font-bold text-center mb-6 text-gray-800">
                        📊 פירוט הכנסות והוצאות
                      </h4>

                      <div className="space-y-6 text-right">
                        {/* הכנסות פסיביות */}
                        <div className="bg-green-50 rounded-2xl p-6">
                          <h5 className="text-lg font-bold mb-4 text-green-700">💰 הכנסות פסיביות (שנתיות):</h5>
                          {selectedPassiveIncomes.filter(i => i.isOneTime).length > 0 ? (
                              <>
                                {selectedPassiveIncomes.filter(i => i.isOneTime).map((income) => (
                                    <p key={income.id} className="text-gray-700 text-lg mb-2">
                                      • {income.name || 'הכנסה'}: {income.amount.toLocaleString()} ₪
                                    </p>
                                ))}
                                <p className="font-bold text-green-600 text-lg mt-3 pt-3 border-t-2 border-green-200">
                                  סה״כ: {oneTimeIncome.toLocaleString()} ₪
                                </p>
                              </>
                          ) : (
                              <p className="text-gray-500 text-lg">אין הכנסות פסיביות</p>
                          )}
                        </div>

                        {/* הכנסות שבועיות */}
                        <div className="bg-blue-50 rounded-2xl p-6">
                          <h5 className="text-xl font-bold mb-4 text-blue-700">📊 הכנסות שבועיות:</h5>
                          {selectedPassiveIncomes.filter(i => !i.isOneTime).length > 0 || selectedActiveIncomes.length > 0 ? (
                              <>
                                {selectedPassiveIncomes.filter(i => !i.isOneTime).map((income) => (
                                    <p key={income.id} className="text-gray-700 text-lg mb-2">
                                      • {income.name || 'הכנסה'}: {income.amount.toLocaleString()} ₪
                                    </p>
                                ))}
                                {selectedActiveIncomes.map((income) => (
                                    <p key={income.id} className="text-gray-700 text-lg mb-2">
                                      • {income.name || 'הכנסה'}: {income.amount.toLocaleString()} ₪ × {income.timesPerWeek} פעמים = {(income.amount * income.timesPerWeek).toLocaleString()} ₪
                                    </p>
                                ))}
                                <p className="font-bold text-blue-600 text-lg mt-3 pt-3 border-t-2 border-blue-200">
                                  סה״כ: {weeklyIncome.toLocaleString()} ₪ בשבוע
                                </p>
                              </>
                          ) : (
                              <p className="text-gray-500 text-lg">אין הכנסות שבועיות</p>
                          )}
                        </div>

                        {/* הוצאות */}
                        <div className="bg-red-50 rounded-2xl p-6">
                          <h5 className="text-lg font-bold mb-4 text-red-700">💸 הוצאות שבועיות:</h5>
                          <p className="text-gray-700 text-lg mb-2">
                            • הוצאות אישיות: {weeklyExpenses.toLocaleString()} ₪
                          </p>
                          <p className="font-bold text-red-600 text-lg mt-3 pt-3 border-t-2 border-red-200">
                            סה״כ: {weeklyExpenses.toLocaleString()} ₪ בשבוע
                          </p>
                        </div>

                        {/* מאזן שבועי */}
                        <div className={`${weeklyBalance >= 0 ? 'bg-green-100' : 'bg-orange-100'} rounded-2xl p-6`}>
                          <p className={`font-bold text-2xl ${weeklyBalance >= 0 ? 'text-green-700' : 'text-orange-700'}`}>
                            {weeklyBalance >= 0 ? '✅' : '⚠️'} מאזן שבועי: {Math.abs(weeklyBalance).toLocaleString()}{weeklyBalance > 0 ? '+ ' : weeklyBalance < 0 ? '- ' : ' '}₪
                          </p>
                          {weeklyBalance >= 0 ? (
                              <p className="text-green-600 text-lg mt-2">
                                🌟 ההכנסות שלך גבוהות מההוצאות
                              </p>
                          ) : (
                              <p className="text-orange-600 text-lg mt-2">
                                💡 שים לב: יש לך גירעון שבועי - כדאי לשקול הגדלת הכנסות או הקטנת הוצאות
                              </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              <div className="text-center space-y-4 mb-8">
                <button
                    onClick={() => {
                      playSound('start');
                      resetGame();
                    }}
                    className="hover:bg-opacity-90 active:bg-opacity-80 text-white font-bold py-4 px-8 rounded-full text-2xl shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 finance-cta-button finance-primary-button"
                >
                  <RotateCcw className="w-6 h-6 inline ml-2" />
                  התחילו מחדש
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md p-4 mt-8">
            <div className="max-w-6xl mx-auto flex justify-center items-center">
              <img
                  src={`./LiatFishelLeadershipLogo.jpg`}
                  alt="לוגו: מנהיגות כלכלית - כסף כן גדל על העצים - חינוך פיננסי | קבוצת ליאת פישל"
                  className="h-40" // ניתן לשנות את הגודל כאן באמצעות Tailwind CSS
              />
            </div>
          </div>
        </div>
    );
  }

  return null;
};

export default FinancialSuccessGame;
