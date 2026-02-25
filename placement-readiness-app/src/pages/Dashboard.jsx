import CircularProgress from '../components/CircularProgress';
import SkillBreakdown from '../components/SkillBreakdown';
import ContinuePractice from '../components/ContinuePractice';
import WeeklyGoals from '../components/WeeklyGoals';
import UpcomingAssessments from '../components/UpcomingAssessments';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Welcome back! Here's your progress overview.</p>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Overall Readiness - Circular Progress */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Overall Readiness</h3>
            <div className="flex justify-center">
              <CircularProgress score={72} />
            </div>
          </div>

          {/* Continue Practice */}
          <ContinuePractice />

          {/* Weekly Goals */}
          <WeeklyGoals />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Skill Breakdown - Radar Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Breakdown</h3>
            <SkillBreakdown />
          </div>

          {/* Upcoming Assessments */}
          <UpcomingAssessments />
        </div>
      </div>
    </div>
  );
}
