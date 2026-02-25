import { Code2, CheckCircle, Circle } from 'lucide-react';

const problems = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Arrays', completed: true },
  { id: 2, title: 'Reverse Linked List', difficulty: 'Easy', category: 'Linked List', completed: true },
  { id: 3, title: 'Binary Tree Level Order', difficulty: 'Medium', category: 'Trees', completed: false },
  { id: 4, title: 'Merge Intervals', difficulty: 'Medium', category: 'Arrays', completed: false },
  { id: 5, title: 'LRU Cache', difficulty: 'Hard', category: 'Design', completed: false },
];

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Easy':
      return 'text-green-600 bg-green-50';
    case 'Medium':
      return 'text-yellow-600 bg-yellow-50';
    case 'Hard':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export default function Practice() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Practice Problems</h2>
        <p className="text-gray-600 mt-1">Sharpen your coding skills with curated problems.</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
          <span className="text-sm text-gray-600">2 of 5 completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
        </div>
      </div>

      {/* Problems List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
            <div className="col-span-1">Status</div>
            <div className="col-span-5">Problem</div>
            <div className="col-span-3">Category</div>
            <div className="col-span-3">Difficulty</div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1">
                  {problem.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <div className="col-span-5">
                  <span className="font-medium text-gray-900">{problem.title}</span>
                </div>
                <div className="col-span-3">
                  <span className="text-sm text-gray-600">{problem.category}</span>
                </div>
                <div className="col-span-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
