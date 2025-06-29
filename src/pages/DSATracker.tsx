import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ExternalLink, Filter, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { DSAService } from '../services/dsaService';
import { DSAProblem, DSAProblemInput } from '../types';

export function DSATracker() {
  const { currentUser } = useAuth();
  const [problems, setProblems] = useState<DSAProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProblem, setEditingProblem] = useState<DSAProblem | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<DSAProblemInput>({
    title: '',
    difficulty: 'Easy',
    tags: [],
    status: 'Not Started',
    leetcodeUrl: '',
    notes: ''
  });

  useEffect(() => {
    loadProblems();
  }, [currentUser]);

  const loadProblems = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const data = await DSAService.getAllProblems(currentUser.uid);
      setProblems(data);
    } catch (error) {
      console.error('Error loading problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      if (editingProblem) {
        await DSAService.updateProblem(editingProblem.id, formData);
      } else {
        await DSAService.addProblem(currentUser.uid, formData);
      }
      
      await loadProblems();
      resetForm();
    } catch (error) {
      console.error('Error saving problem:', error);
    }
  };

  const handleDelete = async (problemId: string) => {
    if (!confirm('Are you sure you want to delete this problem?')) return;
    
    try {
      await DSAService.deleteProblem(problemId);
      await loadProblems();
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      difficulty: 'Easy',
      tags: [],
      status: 'Not Started',
      leetcodeUrl: '',
      notes: ''
    });
    setShowAddForm(false);
    setEditingProblem(null);
  };

  const startEdit = (problem: DSAProblem) => {
    setFormData({
      title: problem.title,
      difficulty: problem.difficulty,
      tags: problem.tags,
      status: problem.status,
      leetcodeUrl: problem.leetcodeUrl || '',
      notes: problem.notes || ''
    });
    setEditingProblem(problem);
    setShowAddForm(true);
  };

  const filteredProblems = problems.filter(problem => {
    const matchesStatus = filterStatus === 'all' || problem.status === filterStatus;
    const matchesDifficulty = filterDifficulty === 'all' || problem.difficulty === filterDifficulty;
    const matchesSearch = searchTerm === '' || 
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesDifficulty && matchesSearch;
  });

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">DSA Problem Tracker</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your data structures and algorithms practice
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary btn-md flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Problem</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems..."
              className="input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input"
          >
            <option value="all">All Status</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="input"
          >
            <option value="all">All Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Problems List */}
      <div className="grid gap-4">
        {filteredProblems.map((problem) => (
          <div key={problem.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {problem.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {problem.difficulty}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    problem.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    problem.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {problem.status}
                  </span>
                </div>
                
                {problem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {problem.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {problem.notes && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{problem.notes}</p>
                )}
                
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Added: {new Date(problem.dateAdded).toLocaleDateString()}
                  {problem.dateCompleted && (
                    <span className="ml-4">
                      Completed: {new Date(problem.dateCompleted).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {problem.leetcodeUrl && (
                  <a
                    href={problem.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => startEdit(problem)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(problem.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No problems found. Add your first problem to get started!</p>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {editingProblem ? 'Edit Problem' : 'Add New Problem'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Problem Title
                </label>
                <input
                  type="text"
                  required
                  className="input w-full"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    className="input w-full"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    className="input w-full"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  className="input w-full"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  })}
                  placeholder="array, dynamic programming, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  LeetCode URL (optional)
                </label>
                <input
                  type="url"
                  className="input w-full"
                  value={formData.leetcodeUrl}
                  onChange={(e) => setFormData({ ...formData, leetcodeUrl: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  className="input w-full h-20 resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Your thoughts, approach, etc."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn btn-primary btn-md flex-1">
                  {editingProblem ? 'Update' : 'Add'} Problem
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary btn-md flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}