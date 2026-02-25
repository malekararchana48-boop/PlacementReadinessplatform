import { Calendar, Clock } from 'lucide-react';

const assessments = [
  {
    id: 1,
    title: 'DSA Mock Test',
    date: 'Tomorrow',
    time: '10:00 AM',
    type: 'technical',
  },
  {
    id: 2,
    title: 'System Design Review',
    date: 'Wed',
    time: '2:00 PM',
    type: 'technical',
  },
  {
    id: 3,
    title: 'HR Interview Prep',
    date: 'Friday',
    time: '11:00 AM',
    type: 'behavioral',
  },
];

export default function UpcomingAssessments() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Assessments</h3>
          <p className="text-sm text-gray-500">Stay prepared</p>
        </div>
      </div>

      <div className="space-y-3">
        {assessments.map((assessment) => (
          <div
            key={assessment.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div>
              <p className="font-medium text-gray-900">{assessment.title}</p>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span>{assessment.date}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {assessment.time}
                </span>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                assessment.type === 'technical'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-purple-100 text-purple-600'
              }`}
            >
              {assessment.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
