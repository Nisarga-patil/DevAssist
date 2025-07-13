// src/components/CoreSubjects.tsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, BookOpen, Trophy } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { CoreSubjectsService } from '../services/coreSubjectsService';
import { CoreSubject } from '../types';

export function CoreSubjects() {
  const { currentUser } = useAuth();
  const [subjects, setSubjects] = useState<CoreSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!currentUser) return;
      setLoading(true);
      await CoreSubjectsService.initializeUserProgress(currentUser.uid);
      const data = await CoreSubjectsService.getUserProgress(currentUser.uid);
      setSubjects(data);
      setLoading(false);
    })();
  }, [currentUser]);

  const handleTopicToggle = async (topicId: string, completed: boolean) => {
    if (!currentUser) return;
    await CoreSubjectsService.updateTopicProgress(currentUser.uid, topicId, completed);
    const data = await CoreSubjectsService.getUserProgress(currentUser.uid);
    setSubjects(data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center">Core Subjects</h1>

      {subjects.map(subject => {
        const progress = CoreSubjectsService.getSubjectProgress(subject);
        const completedTopics = subject.topics.filter(t => t.completed).length;

        return (
          <div key={subject.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">{subject.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {completedTopics}/{subject.topics.length} topics
                  </p>
                </div>
              </div>
              {progress === 100 && (
                <div className="flex items-center space-x-1 text-green-600">
                  <Trophy className="w-5 h-5" />
                  <span>Completed!</span>
                </div>
              )}
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded mb-4">
              <div
                className="bg-blue-600 h-2 rounded transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {subject.topics.map(topic => {
                const dt = topic.dateCompleted
                  ? topic.dateCompleted instanceof Date
                    ? topic.dateCompleted
                    : topic.dateCompleted.toDate()
                  : null;

                return (
                  <div
                    key={topic.id}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <button
                      onClick={() => handleTopicToggle(topic.id, !topic.completed)}
                      className="flex-shrink-0"
                    >
                      {topic.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {topic.link ? (
                      <a
                        href={topic.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 text-sm ${
                          topic.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-200'
                        }`}
                      >
                        {topic.name}
                      </a>
                    ) : (
                      <span
                        className={`flex-1 text-sm ${
                          topic.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-200'
                        }`}
                      >
                        {topic.name}
                      </span>
                    )}

                    {dt && (
                      <span className="text-xs text-gray-400">
                        {dt.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded p-6 text-center">
        <h3 className="text-lg sm:text-xl font-semibold">Keep Learning!</h3>
        <p>Consistent practice builds a strong foundation for your technical interviews.</p>
      </div>
    </div>
  );
}
