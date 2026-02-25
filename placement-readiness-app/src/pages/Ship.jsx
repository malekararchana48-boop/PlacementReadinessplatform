import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Lock, CheckCircle2, AlertTriangle, ArrowLeft, ExternalLink, Github, Package } from 'lucide-react';
import { areAllTestsPassed, getPassedCount, TEST_ITEMS } from '../utils/testChecklist';

export default function Ship() {
  const navigate = useNavigate();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passedCount, setPassedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if all tests are passed
    const passed = areAllTestsPassed();
    const count = getPassedCount();
    setIsUnlocked(passed);
    setPassedCount(count);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // LOCKED STATE
  if (!isUnlocked) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ship Page Locked</h2>
          <p className="text-gray-600">Complete all tests to unlock shipping.</p>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">Tests Incomplete</h3>
              <p className="text-red-700">
                {passedCount} of {TEST_ITEMS.length} tests passed
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">
                {Math.round((passedCount / TEST_ITEMS.length) * 100)}%
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${(passedCount / TEST_ITEMS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-red-200 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Remaining tests:</strong> {TEST_ITEMS.length - passedCount}
            </p>
            <p className="text-sm text-gray-600">
              Go to the Test Checklist page and complete all manual verification steps.
            </p>
          </div>

          <button
            onClick={() => navigate('/prp/07-test')}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Go to Test Checklist
          </button>
        </div>
      </div>
    );
  }

  // UNLOCKED STATE
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Rocket className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Ship!</h2>
        <p className="text-gray-600">All tests passed. The platform is ready for deployment.</p>
      </div>

      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">All Systems Go</h3>
            <p className="text-green-700">
              {TEST_ITEMS.length} of {TEST_ITEMS.length} tests passed
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Validation Complete</span>
            <span className="font-medium text-green-700">100%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full w-full" />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-white rounded-lg border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-gray-900">Build Status</h4>
            </div>
            <p className="text-sm text-gray-600">
              All core features validated and ready for production.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <Github className="w-5 h-5 text-gray-700" />
              <h4 className="font-medium text-gray-900">Repository</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Code is pushed to GitHub and version controlled.
            </p>
            <a 
              href="https://github.com/malekararchana48-boop/PlacementReadinessplatform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View Repository
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="p-4 bg-green-100 rounded-lg mb-6">
          <p className="text-sm text-green-800 text-center font-medium">
            The Placement Readiness Platform is production-ready!
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/prp/07-test')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Tests
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>

      {/* Reset Option */}
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/prp/07-test')}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Need to re-run tests? Go to Test Checklist
        </button>
      </div>
    </div>
  );
}
