import { useEffect, useState } from 'react';

export default function CircularProgress({ score, maxScore = 100, size = 200, strokeWidth = 12 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / maxScore) * circumference;
  const offset = circumference - progress;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Determine color based on score
  const getColor = () => {
    if (score >= 80) return '#22c55e'; // green-500
    if (score >= 60) return '#eab308'; // yellow-500
    return '#ef4444'; // red-500
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1.5s ease-out',
            }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-gray-900">
            {animatedScore}
          </span>
          <span className="text-sm text-gray-500 mt-1">/ {maxScore}</span>
        </div>
      </div>
      <p className="text-lg font-medium text-gray-700 mt-4">Readiness Score</p>
    </div>
  );
}
