import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Building2, Briefcase, Trash2, ExternalLink, Award, Search, X } from 'lucide-react';
import { getHistory, deleteHistoryEntry, formatDate } from '../utils/storage';
import { getScoreCategory } from '../utils/readinessScore';

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const entries = getHistory();
    setHistory(entries);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteHistoryEntry(id);
      loadHistory();
    }
  };

  const handleEntryClick = (id) => {
    navigate(`/results?id=${id}`);
  };

  const filteredHistory = history.filter(entry => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (entry.company && entry.company.toLowerCase().includes(searchLower)) ||
      (entry.role && entry.role.toLowerCase().includes(searchLower)) ||
      entry.readinessScore.toString().includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analysis History</h2>
        <p className="text-gray-600 mt-1">View your past job description analyses</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by company, role, or score..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No matching entries found' : 'No history yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Analyze your first job description to see it here'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate('/analyze')}
              className="bg-primary hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Analyze a JD
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((entry) => {
            const scoreCategory = getScoreCategory(entry.readinessScore);
            return (
              <div
                key={entry.id}
                onClick={() => handleEntryClick(entry.id)}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {entry.company && (
                        <span className="flex items-center gap-1 text-gray-700 font-medium">
                          <Building2 className="w-4 h-4" />
                          {entry.company}
                        </span>
                      )}
                      {entry.role && (
                        <span className="flex items-center gap-1 text-gray-600">
                          <Briefcase className="w-4 h-4" />
                          {entry.role}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(entry.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {Object.values(entry.extractedSkills).reduce(
                          (acc, cat) => acc + cat.skills.length, 0
                        )} skills detected
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-lg ${scoreCategory.bgColor}`}>
                      <span className={`text-2xl font-bold ${scoreCategory.color}`}>
                        {entry.readinessScore}
                      </span>
                      <span className={`text-sm ml-1 ${scoreCategory.color}`}>
                        /100
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                      <button
                        onClick={(e) => handleDelete(entry.id, e)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Skills Preview */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.values(entry.extractedSkills)
                    .flatMap(cat => cat.skills)
                    .slice(0, 8)
                    .map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  {Object.values(entry.extractedSkills).reduce(
                    (acc, cat) => acc + cat.skills.length, 0
                  ) > 8 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                      +{Object.values(entry.extractedSkills).reduce(
                        (acc, cat) => acc + cat.skills.length, 0
                      ) - 8} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
