import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, MessageSquare, CheckCircle, Zap, TrendingUp } from 'lucide-react';


interface ProgressStats {
  filesStudied: number;
  annotationsCount: number;
  quizzesTaken: number;
  flashcardsReviewed: number;
}

export const ProgressTracker: React.FC = () => {
  const [stats, setStats] = React.useState<ProgressStats>({
    filesStudied: 0,
    annotationsCount: 0,
    quizzesTaken: 0,
    flashcardsReviewed: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // For now, we'll use mock data since the backend doesn't have a stats endpoint yet
      // In production, you'd call: const data = await api.getProgressStats();
      
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - you can replace this with real API call
      setStats({
        filesStudied: 3,
        annotationsCount: 12,
        quizzesTaken: 2,
        flashcardsReviewed: 8,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Files Studied',
      value: stats.filesStudied,
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Annotations',
      value: stats.annotationsCount,
      icon: MessageSquare,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      label: 'Quizzes Taken',
      value: stats.quizzesTaken,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: 'Flashcards',
      value: stats.flashcardsReviewed,
      icon: Zap,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-slate-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-slate-200 p-8 shadow-xl hover:shadow-2xl transition-all overflow-hidden"
    >
      {/* Decorative Gradient Orbs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-violet-400/10 to-pink-400/10 rounded-full blur-3xl"></div>

      <div className="relative flex items-center gap-4 mb-6">
        <motion.div 
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg"
        >
          <TrendingUp className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <h3 className="text-xl font-black text-slate-900">Your Study Progress</h3>
          <p className="text-sm text-slate-600 font-medium">You're doing amazing! Keep it up 🚀</p>
        </div>
      </div>

      <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            whileHover={{ y: -5, scale: 1.03 }}
            className="relative group bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-indigo-300 shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden"
          >
            {/* Subtle Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
            
            <div className="relative flex flex-col items-center text-center gap-3">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:shadow-2xl transition-shadow`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </motion.div>
              <motion.div 
                className="text-3xl font-black text-slate-900"
                whileHover={{ scale: 1.1 }}
              >
                {stat.value}
              </motion.div>
              <div className={`text-xs font-bold ${stat.textColor} uppercase tracking-wide`}>
                {stat.label}
              </div>
            </div>

            {/* Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              style={{ transform: 'skewX(-20deg)' }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
