import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { DSAService } from '../services/dsaService';
import { CoreSubjectsService } from '../services/coreSubjectsService';
import questionsData from '../data/dsaQuestions';
import type { CoreSubject } from '../types';
import { Code, Target, Trophy, Clock, BookOpen } from 'lucide-react';

export function Dashboard() {
  const { currentUser } = useAuth();
  const userName = currentUser?.displayName ?? currentUser?.email ?? 'User';

  const totalQuestions = Object.values(questionsData).flat().length;
  const [completedCount, setCompletedCount] = useState(0);
  const [subjects, setSubjects] = useState<CoreSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!currentUser) return;
      setLoading(true);

      const progressMap = await DSAService.getProgressMap(currentUser.uid);
      setCompletedCount(Object.values(progressMap).filter(s => s === 'Completed').length);

      await CoreSubjectsService.initializeUserProgress(currentUser.uid);
      setSubjects(await CoreSubjectsService.getUserProgress(currentUser.uid));

      setLoading(false);
    })();
  }, [currentUser]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
  }

  const remaining = totalQuestions - completedCount;
  const dsaPercent = totalQuestions ? Math.round((completedCount / totalQuestions) * 100) : 0;
  const COLORS = ['#4CAF50', '#E0E0E0'];
  const dsaData = [
    { name: 'Completed', value: completedCount },
    { name: 'Remaining', value: remaining },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-12">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Welcome, {userName}!</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[ 
            { label: 'Total Problems', value: totalQuestions, icon: <Code className="w-6 h-6 text-blue-600" /> },
            { label: 'Completed', value: completedCount, icon: <Target className="w-6 h-6 text-green-600" /> },
            { label: 'Current Streak (days)', value: 0, icon: <Trophy className="w-6 h-6 text-orange-600" /> },
            { label: 'Focus Time', value: '0h', icon: <Clock className="w-6 h-6 text-purple-600" /> },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded shadow border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="text-3xl font-bold">{item.value}</p>
                </div>
                <div className="bg-gray-100 p-2 rounded">{item.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow border">
          <h2 className="text-xl font-semibold mb-4">DSA Progress</h2>
          <div style={{ height: 240, width: '100%' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={dsaData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={2}
                >
                  {dsaData.map((_, idx) => <Cell key={idx} fill={COLORS[idx]} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 font-medium text-center">
            {completedCount} of {totalQuestions} solved ({dsaPercent}%)
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border">
        <h2 className="text-xl font-semibold mb-6">Core Subjects Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(subject => {
            const done = subject.topics.filter(t => t.completed).length;
            const total = subject.topics.length;
            const percent = total ? Math.round((done / total) * 100) : 0;
            return (
              <div key={subject.id}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold">{subject.name}</h3>
                  </div>
                  <span className="text-sm font-medium">{percent}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded h-2">
                  <div className="bg-blue-600 h-2 rounded" style={{ width: `${percent}%` }} />
                </div>
                <p className="mt-1 text-xs text-gray-500">{done}/{total} topics completed</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
