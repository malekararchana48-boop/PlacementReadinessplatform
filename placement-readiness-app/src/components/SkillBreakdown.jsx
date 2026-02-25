import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { skill: 'DSA', score: 75, fullMark: 100 },
  { skill: 'System Design', score: 60, fullMark: 100 },
  { skill: 'Communication', score: 80, fullMark: 100 },
  { skill: 'Resume', score: 85, fullMark: 100 },
  { skill: 'Aptitude', score: 70, fullMark: 100 },
];

export default function SkillBreakdown() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            tickCount={5}
          />
          <Radar
            name="Skills"
            dataKey="score"
            stroke="hsl(245, 58%, 51%)"
            strokeWidth={2}
            fill="hsl(245, 58%, 51%)"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
