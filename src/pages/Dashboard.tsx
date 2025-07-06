import { useState, useEffect } from 'react';
import { Code, BookOpen, Clock, FileText, Target, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { DSAService } from '../services/dsaService';
import { CoreSubjectsService } from '../services/coreSubjectsService';
import { DSAProblem, CoreSubject, DashboardStats } from '../types';

export function Dashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        
        // Initialize core subjects progress for new users
        await CoreSubjectsService.initializeUserProgress(currentUser.uid);
        
        // Load DSA problems and core subjects
        const [dsaProblems, coreSubjects] = await Promise.all([
          DSAService.getAllProblems(currentUser.uid),
          CoreSubjectsService.getUserProgress(currentUser.uid)
        ]);

        // Calculate dashboard statistics
        const completedProblems = dsaProblems.filter(p => p.status === 'Completed').length;
        const currentStreak = calculateCurrentStreak(dsaProblems);
        const totalFocusTime = dsaProblems.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
        
        const coreSubjectProgress: { [subject: string]: number } = {};
        coreSubjects.forEach(subject => {
          coreSubjectProgress[subject.name] = CoreSubjectsService.getSubjectProgress(subject);
        });

        setStats({
          totalProblems: dsaProblems.length,
          completedProblems,
          currentStreak,
          totalFocusTime,
          coreSubjectProgress
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [currentUser]);

  const calculateCurrentStreak = (problems: DSAProblem[]): number => {
    const completedProblems = problems
      .filter(p => p.status === 'Completed' && p.dateCompleted)
      .sort((a, b) => new Date(b.dateCompleted!).getTime() - new Date(a.dateCompleted!).getTime());

    if (completedProblems.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const problem of completedProblems) {
      const problemDate = new Date(problem.dateCompleted!);
      problemDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((currentDate.getTime() - problemDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === streak || (streak === 0 && daysDiff <= 1)) {
        streak++;
        currentDate = problemDate;
      } else {
        break;
      }
    }

    return streak;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {currentUser?.displayName || currentUser?.email}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your interview preparation progress and stay motivated.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Problems</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalProblems || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats?.completedProblems || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Streak</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats?.currentStreak || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Focus Time</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {Math.floor((stats?.totalFocusTime || 0) / 60)}h
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Core Subjects Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Core Subjects Progress</h2>
          <div className="space-y-4">
            {stats?.coreSubjectProgress && Object.entries(stats.coreSubjectProgress).map(([subject, progress]) => (
              <div key={subject}>
                <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span>{subject.split(' ')[0]}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/dsa"
              className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Code className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Add DSA Problem</span>
            </a>
            
            <a
              href="/core-subjects"
              className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Study Core Topics</span>
            </a>
            
            <a
              href="/pomodoro"
              className="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
            >
              <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Start Timer</span>
            </a>
            
            <a
              href="/resume"
              className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Build Resume</span>
            </a>
          </div>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          "Success is the sum of small efforts repeated day in and day out."
        </h3>
        <p className="text-blue-100">
          Keep pushing forward! Every problem solved brings you closer to your goals.
        </p>
      </div>
    </div>
  );
}