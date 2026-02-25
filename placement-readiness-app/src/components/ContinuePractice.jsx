import { Play, BookOpen } from 'lucide-react';

export default function ContinuePractice() {
  const currentProgress = 3;
  const totalProblems = 10;
  const progressPercentage = (currentProgress / totalProblems) * 100;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Continue Practice</h3>
          <p className="text-sm text-gray-500">Pick up where you left off</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-bold text-gray-900 mb-2">Dynamic Programming</p>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{currentProgress}/{totalProblems} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
        <Play className="w-4 h-4" />
        Continue
      </button>
    </div>
  );
}
