import { BookOpen, FileText, Video, ExternalLink } from 'lucide-react';

const resources = [
  {
    id: 1,
    title: 'Data Structures Cheat Sheet',
    description: 'Quick reference guide for common data structures and their time complexities.',
    type: 'pdf',
    category: 'Reference',
  },
  {
    id: 2,
    title: 'System Design Interview Guide',
    description: 'Comprehensive guide to approaching system design interviews.',
    type: 'video',
    category: 'Video',
  },
  {
    id: 3,
    title: 'React Best Practices',
    description: 'Learn modern React patterns and performance optimization techniques.',
    type: 'article',
    category: 'Article',
  },
  {
    id: 4,
    title: 'Behavioral Interview Prep',
    description: 'Common questions and strategies for behavioral interviews.',
    type: 'pdf',
    category: 'Reference',
  },
  {
    id: 5,
    title: 'Algorithm Patterns',
    description: 'Master common algorithmic patterns for coding interviews.',
    type: 'video',
    category: 'Video',
  },
  {
    id: 6,
    title: 'Resume Writing Tips',
    description: 'How to craft a standout tech resume that gets noticed.',
    type: 'article',
    category: 'Article',
  },
];

const getIcon = (type) => {
  switch (type) {
    case 'pdf':
      return FileText;
    case 'video':
      return Video;
    case 'article':
      return BookOpen;
    default:
      return BookOpen;
  }
};

const getIconColor = (type) => {
  switch (type) {
    case 'pdf':
      return 'bg-red-100 text-red-600';
    case 'video':
      return 'bg-purple-100 text-purple-600';
    case 'article':
      return 'bg-blue-100 text-blue-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export default function Resources() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Resources</h2>
        <p className="text-gray-600 mt-1">Curated materials to help you prepare for your placement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => {
          const Icon = getIcon(resource.type);
          return (
            <div
              key={resource.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconColor(resource.type)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {resource.category}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{resource.description}</p>

              <button className="flex items-center gap-2 text-primary hover:text-primary-600 font-medium text-sm transition-colors">
                <span>View Resource</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
