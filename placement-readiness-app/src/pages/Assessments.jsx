import { ClipboardList, Clock, Play } from 'lucide-react';

const assessments = [
  {
    id: 1,
    title: 'Frontend Developer Assessment',
    description: 'Test your knowledge of React, JavaScript, and CSS.',
    duration: '45 min',
    questions: 30,
    difficulty: 'Intermediate',
  },
  {
    id: 2,
    title: 'Data Structures & Algorithms',
    description: 'Comprehensive assessment covering arrays, trees, graphs, and more.',
    duration: '60 min',
    questions: 25,
    difficulty: 'Advanced',
  },
  {
    id: 3,
    title: 'System Design Basics',
    description: 'Evaluate your understanding of scalable system architecture.',
    duration: '30 min',
    questions: 20,
    difficulty: 'Intermediate',
  },
];

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Beginner':
      return 'text-green-600 bg-green-50';
    case 'Intermediate':
      return 'text-yellow-600 bg-yellow-50';
    case 'Advanced':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export default function Assessments() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Assessments</h2>
        <p className="text-gray-600 mt-1">Take assessments to evaluate your skills and track improvement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((assessment) => (
          <div
            key={assessment.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(assessment.difficulty)}`}>
                {assessment.difficulty}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{assessment.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{assessment.description}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{assessment.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <ClipboardList className="w-4 h-4" />
                <span>{assessment.questions} questions</span>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
              <Play className="w-4 h-4" />
              Start Assessment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
