import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { DSAService } from '../services/dsaService';
import questionsData, { QuestionItem } from '../data/dsaQuestions';

type Status = 'Not Started' | 'In Progress' | 'Completed';

export function DSATracker() {
  const { currentUser } = useAuth();
  const [progressMap, setProgressMap] = useState<Record<string, Status>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Status>('all');

  useEffect(() => {
    if (!currentUser) return;
    DSAService.getProgressMap(currentUser.uid)
      .then(map => setProgressMap(map))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const handleStatusChange = async (title: string, newStatus: Status) => {
    if (!currentUser) return;
    await DSAService.setQuestionStatus(currentUser.uid, title, newStatus);
    setProgressMap(prev => ({ ...prev, [title]: newStatus }));
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">DSA Problem Tracker</h2>

      <div className="flex items-center gap-2 mb-4">
        <Search />
        <input
          placeholder="Search questions…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="input"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as any)}
          className="input"
        >
          <option value="all">All</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {Object.entries(questionsData).map(([category, list]) => (
        <section key={category} className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">{category}</h3>
          <ol className="list-decimal ml-6 space-y-2">
            {list
              .filter(q =>
                q.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (filterStatus === 'all' || progressMap[q.title] === filterStatus)
              )
              .map((q, i) => {
                const status = progressMap[q.title] || 'Not Started';
                return (
                  <li key={i} className="flex justify-between items-center">
                    <a
                      href={q.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`hover:underline ${
                        status === 'Completed'
                          ? 'text-green-700'
                          : status === 'In Progress'
                          ? 'text-blue-700'
                          : 'text-gray-800'
                      }`}
                    >
                      {q.title}
                    </a>
                    <select
                      value={status}
                      onChange={e => handleStatusChange(q.title, e.target.value as Status)}
                      className="input input-sm"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </li>
                );
              })}
          </ol>
        </section>
      ))}
    </div>
  );
}
