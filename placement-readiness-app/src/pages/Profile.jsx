import { User, Mail, Calendar, Trophy, Target, Clock } from 'lucide-react';

const achievements = [
  { id: 1, title: 'First Problem Solved', description: 'Solved your first coding problem', icon: Trophy },
  { id: 2, title: '7-Day Streak', description: 'Practiced for 7 consecutive days', icon: Target },
  { id: 3, title: 'Early Bird', description: 'Completed 5 problems before 8 AM', icon: Clock },
];

export default function Profile() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
        <p className="text-gray-600 mt-1">Manage your account and view your achievements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">John Doe</h3>
            <p className="text-gray-500 mb-4">Computer Science Student</p>

            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">john.doe@example.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Joined January 2024</span>
              </div>
            </div>

            <button className="w-full mt-6 bg-primary hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats & Achievements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">42</p>
                <p className="text-sm text-gray-600">Problems Solved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">7</p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">5</p>
                <p className="text-sm text-gray-600">Mock Interviews</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">85%</p>
                <p className="text-sm text-gray-600">Accuracy</p>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <achievement.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
