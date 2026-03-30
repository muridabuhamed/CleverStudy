import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, MessageSquare, CheckCircle, Zap, TrendingUp } from 'lucide-react';
import { api } from '../services/api';

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
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Your Progress Today</h3>
          <p className="text-xs text-slate-500">Keep up the great work! 🎉</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-xl p-4 border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all group cursor-default`}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <div className={`text-xs font-semibold ${stat.textColor}`}>{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
