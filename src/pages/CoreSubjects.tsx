import { useState, useEffect } from 'react';
import { CheckCircle, Circle, BookOpen, Trophy } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { CoreSubjectsService } from '../services/coreSubjectsService';
import { CoreSubject } from '../types';

export function CoreSubjects() {
  const { currentUser } = useAuth();
  const [subjects, setSubjects] = useState<CoreSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, [currentUser]);

  const loadSubjects = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      await CoreSubjectsService.initializeUserProgress(currentUser.uid);
      const data = await CoreSubjectsService.getUserProgress(currentUser.uid);
      setSubjects(data);
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicToggle = async (topicId: string, completed: boolean) => {
    if (!currentUser) return;
    
    try {
      await CoreSubjectsService.updateTopicProgress(currentUser.uid, topicId, completed);
      await loadSubjects();
    } catch (error) {
      console.error('Error updating topic progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Core Subjects</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Master fundamental computer science concepts for your interviews
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Overall Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((subject) => {
            const progress = CoreSubjectsService.getSubjectProgress(subject);
            const completedTopics = subject.topics.filter(topic => topic.completed).length;
            
            return (
              <div key={subject.id} className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 relative">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200 dark:text-gray-700"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-primary-600"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${progress}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                  {subject.name.split(' ')[0]}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {completedTopics}/{subject.topics.length} topics
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subjects List */}
      <div className="grid gap-6">
        {subjects.map((subject) => {
          const progress = CoreSubjectsService.getSubjectProgress(subject);
          const completedTopics = subject.topics.filter(topic => topic.completed).length;
          
          return (
            <div key={subject.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {completedTopics}/{subject.topics.length} topics completed
                    </p>
                  </div>
                </div>
                
                {progress === 100 && (
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <Trophy className="w-5 h-5" />
                    <span className="text-sm font-medium">Completed!</span>
                  </div>
                )}
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {subject.topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <button
                      onClick={() => handleTopicToggle(topic.id, !topic.completed)}
                      className="flex-shrink-0"
                    >
                      {topic.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      )}
                    </button>
                    
                    <span className={`text-sm ${
                      topic.completed 
                        ? 'text-gray-500 dark:text-gray-400 line-through' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {topic.name}
                    </span>
                    
                    {topic.completed && topic.dateCompleted && (
                      <span className="text-xs text-gray-400 ml-auto">
                        {new Date(topic.dateCompleted).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Section */}
      <div className="mt-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          Keep Learning!
        </h3>
        <p className="text-green-100">
          Consistent practice in core subjects builds a strong foundation for technical interviews.
        </p>
      </div>
    </div>
  );
}