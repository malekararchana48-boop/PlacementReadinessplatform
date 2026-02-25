import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Square, HelpCircle, RotateCcw, AlertTriangle, CheckCircle2, ArrowRight, ClipboardCheck } from 'lucide-react';
import { TEST_ITEMS, getTestChecklist, toggleTestItem, resetTestChecklist, getPassedCount, areAllTestsPassed } from '../utils/testChecklist';

export default function TestChecklist() {
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState({});
  const [passedCount, setPassedCount] = useState(0);
  const [allPassed, setAllPassed] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    loadChecklist();
  }, []);

  const loadChecklist = () => {
    const current = getTestChecklist();
    setChecklist(current);
    setPassedCount(getPassedCount());
    setAllPassed(areAllTestsPassed());
  };

  const handleToggle = (testId) => {
    const updated = toggleTestItem(testId);
    setChecklist(updated);
    setPassedCount(getPassedCount());
    setAllPassed(areAllTestsPassed());
  };

  const handleReset = () => {
    resetTestChecklist();
    loadChecklist();
    setShowResetConfirm(false);
  };

  const handleGoToShip = () => {
    if (allPassed) {
      navigate('/prp/08-ship');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardCheck className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">Test Checklist</h2>
        </div>
        <p className="text-gray-600">Complete all tests before shipping. Check each item after manual verification.</p>
      </div>

      {/* Summary Card */}
      <div className={`rounded-xl border-2 p-6 mb-8 ${allPassed ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {allPassed ? (
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-amber-600" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Tests Passed: {passedCount} / {TEST_ITEMS.length}
              </h3>
              <p className="text-sm text-gray-600">
                {allPassed 
                  ? 'All tests passed! Ready to ship.' 
                  : `${TEST_ITEMS.length - passedCount} tests remaining.`}
              </p>
            </div>
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${(passedCount / TEST_ITEMS.length) * 175.9} 175.9`}
                className={allPassed ? 'text-green-500' : 'text-primary'}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-700">
              {Math.round((passedCount / TEST_ITEMS.length) * 100)}%
            </span>
          </div>
        </div>

        {!allPassed && (
          <div className="flex items-center gap-2 p-3 bg-amber-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <p className="text-sm text-amber-800 font-medium">
              Fix issues before shipping. Complete all tests to unlock the ship page.
            </p>
          </div>
        )}

        {allPassed && (
          <button
            onClick={handleGoToShip}
            className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Go to Ship Page
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Test Items */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Manual Test Items</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {TEST_ITEMS.map((item, index) => {
            const isChecked = checklist[item.id] || false;
            return (
              <div 
                key={item.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${isChecked ? 'bg-green-50/50' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggle(item.id)}
                    className="flex-shrink-0 mt-0.5 text-primary hover:text-primary/80 transition-colors"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-6 h-6" />
                    ) : (
                      <Square className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-medium text-gray-400">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                      <span className={`font-medium ${isChecked ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {item.label}
                      </span>
                    </div>
                    
                    <div className="flex items-start gap-2 mt-2 text-sm text-gray-500">
                      <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{item.hint}</span>
                    </div>
                    
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Page: {item.page}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Reset Checklist</h3>
            <p className="text-sm text-gray-500 mt-1">Clear all checkmarks and start over.</p>
          </div>
          
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
