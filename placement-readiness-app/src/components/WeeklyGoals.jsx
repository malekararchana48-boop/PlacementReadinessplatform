import { Target } from 'lucide-react';

const days = [
  { day: 'Mon', initial: 'M', active: true },
  { day: 'Tue', initial: 'T', active: true },
  { day: 'Wed', initial: 'W', active: true },
  { day: 'Thu', initial: 'T', active: false },
  { day: 'Fri', initial: 'F', active: true },
  { day: 'Sat', initial: 'S', active: false },
  { day: 'Sun', initial: 'S', active: false },
];

export default function WeeklyGoals() {
  const problemsSolved = 12;
  const weeklyGoal = 20;
  const progressPercentage = (problemsSolved / weeklyGoal) * 100;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <Target className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Weekly Goals</h3>
          <p className="text-sm text-gray-500">Keep up the momentum</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Problems Solved</span>
          <span className="font-semibold text-gray-900">
            {problemsSolved}/{weeklyGoal} this week
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        {days.map(({ day, initial, active }) => (
          <div key={day} className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                active
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
              title={day}
            >
              {initial}
            </div>
            <span className="text-xs text-gray-400">{day.slice(0, 1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
