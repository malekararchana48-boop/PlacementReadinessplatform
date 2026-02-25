import { TrendingUp, Target, Award, Clock } from 'lucide-react';

const stats = [
  { label: 'Problems Solved', value: '42', icon: Target, color: 'bg-blue-100 text-blue-600' },
  { label: 'Current Streak', value: '7 days', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
  { label: 'Mock Interviews', value: '5', icon: Award, color: 'bg-purple-100 text-purple-600' },
  { label: 'Hours Practiced', value: '24h', icon: Clock, color: 'bg-orange-100 text-orange-600' },
];

const recentActivity = [
  { title: 'Completed Array Sorting Problem', time: '2 hours ago', type: 'practice' },
  { title: 'Finished Mock Interview - Frontend', time: 'Yesterday', type: 'interview' },
  { title: 'Started React Fundamentals Course', time: '2 days ago', type: 'learning' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Welcome back! Here's your progress overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500 capitalize">{activity.type}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Continue Practicing</h3>
          <p className="text-gray-600 mb-4">You have 3 problems left in your daily goal.</p>
          <button className="bg-primary hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Start Practice
          </button>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Mock Interview</h3>
          <p className="text-gray-600 mb-4">Practice with AI-powered mock interviews.</p>
          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors">
            Schedule Now
          </button>
        </div>
      </div>
    </div>
  );
}
