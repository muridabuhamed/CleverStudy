import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Trophy, FileText, Target, TrendingUp, Award, LogOut, Loader2 } from 'lucide-react';
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
          <div className="text-center py-12 text-slate-500">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No quiz attempts yet. Start studying to see your progress here!</p>
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
