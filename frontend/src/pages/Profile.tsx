import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Trophy, FileText, Target, TrendingUp, Award, LogOut, Loader2, Flame, Calendar, Brain, Zap, BookOpen, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getUserStats();
      setStats(data.stats);
      setRecentAttempts(data.recentAttempts);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const avgScore = stats?.avg_score ? Math.round(stats.avg_score) : 0;

  // Calculate achievements
  const achievements = [
    {
      id: 1,
      name: 'First Steps',
      description: 'Uploaded your first PDF',
      icon: <Upload className="w-5 h-5" />,
      unlocked: (stats?.files_studied || 0) >= 1,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Quiz Master',
      description: 'Completed 5 quizzes',
      icon: <Trophy className="w-5 h-5" />,
      unlocked: (stats?.quizzes_taken || 0) >= 5,
      color: 'bg-amber-500'
    },
    {
      id: 3,
      name: 'High Achiever',
      description: 'Scored 90% or higher',
      icon: <Award className="w-5 h-5" />,
      unlocked: avgScore >= 90,
      color: 'bg-emerald-500'
    },
    {
      id: 4,
      name: 'Dedicated Learner',
      description: 'Studied 10+ documents',
      icon: <BookOpen className="w-5 h-5" />,
      unlocked: (stats?.files_studied || 0) >= 10,
      color: 'bg-violet-500'
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white mb-8 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">{user?.name}</h1>
              <p className="text-indigo-100">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition-all flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<FileText className="w-6 h-6 text-indigo-600" />}
          label="Files Studied"
          value={stats?.files_studied || 0}
          bgColor="bg-indigo-50"
        />
        <StatCard
          icon={<Trophy className="w-6 h-6 text-amber-600" />}
          label="Quizzes Taken"
          value={stats?.quizzes_taken || 0}
          bgColor="bg-amber-50"
        />
        <StatCard
          icon={<Target className="w-6 h-6 text-emerald-600" />}
          label="Average Score"
          value={`${avgScore}%`}
          bgColor="bg-emerald-50"
        />
        <StatCard
          icon={<Award className="w-6 h-6 text-violet-600" />}
          label="Total Correct"
          value={`${stats?.total_correct || 0}/${stats?.total_questions || 0}`}
          bgColor="bg-violet-50"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-3xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Achievements</h2>
                  <p className="text-sm text-slate-500">{unlockedCount}/{achievements.length} unlocked</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    achievement.unlocked
                      ? 'border-slate-200 bg-gradient-to-br from-white to-slate-50'
                      : 'border-dashed border-slate-200 bg-slate-50/30 opacity-40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${achievement.color} rounded-xl flex items-center justify-center text-white shrink-0 ${!achievement.unlocked && 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm mb-1">
                        {achievement.name}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-3xl border border-slate-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Study Insights</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <InsightCard
                icon={<Flame className="w-5 h-5 text-orange-500" />}
                label="Study Streak"
                value={stats?.quizzes_taken > 0 ? `${Math.min(stats?.quizzes_taken, 7)} days` : '0 days'}
                description="Keep it up!"
                color="bg-orange-50"
              />
              <InsightCard
                icon={<Zap className="w-5 h-5 text-yellow-500" />}
                label="Best Score"
                value={stats?.quizzes_taken > 0 ? `${avgScore}%` : '—'}
                description="Personal best"
                color="bg-yellow-50"
              />
              <InsightCard
                icon={<Target className="w-5 h-5 text-emerald-500" />}
                label="Accuracy"
                value={stats?.total_questions > 0 ? `${Math.round((stats?.total_correct / stats?.total_questions) * 100)}%` : '—'}
                description="Overall performance"
                color="bg-emerald-50"
              />
              <InsightCard
                icon={<Calendar className="w-5 h-5 text-violet-500" />}
                label="This Week"
                value={`${stats?.quizzes_taken || 0} quizzes`}
                description="Keep learning!"
                color="bg-violet-50"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl border border-slate-200 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-slate-900">Recent Quizzes</h2>
        </div>

        {recentAttempts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-full mb-6">
              <Trophy className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Start Learning?</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Upload your first study document and take a quiz to see your progress and achievements here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2 justify-center">
                <Upload className="w-5 h-5" />
                Upload Document
              </button>
              <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all flex items-center gap-2 justify-center">
                <BookOpen className="w-5 h-5" />
                Browse Library
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentAttempts.map((attempt: any) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{attempt.file_name}</h3>
                    <p className="text-sm text-slate-500">
                      {new Date(attempt.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">
                    {attempt.score}/{attempt.total}
                  </div>
                  <div className={`text-sm font-semibold ${(attempt.score / attempt.total) >= 0.7 ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                    {Math.round((attempt.score / attempt.total) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon, label, value, bgColor }: { icon: React.ReactNode; label: string; value: string | number; bgColor: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all"
  >
    <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
    <div className="text-sm text-slate-500 font-medium">{label}</div>
  </motion.div>
);

const InsightCard = ({ icon, label, value, description, color }: { icon: React.ReactNode; label: string; value: string; description: string; color: string }) => (
  <div className={`${color} rounded-2xl p-4 border border-slate-200`}>
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </div>
    <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
    <div className="text-xs text-slate-600">{description}</div>
  </div>
);
