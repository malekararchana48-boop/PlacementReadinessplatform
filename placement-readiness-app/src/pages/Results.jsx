import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Briefcase, Calendar, CheckCircle, Target, HelpCircle, BookOpen, Award, Clock } from 'lucide-react';
import { getHistoryEntry, formatDate } from '../utils/storage';
import { getScoreCategory } from '../utils/readinessScore';
import CircularProgress from '../components/CircularProgress';

export default function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = searchParams.get('id');

  useEffect(() => {
    if (!id) {
      navigate('/analyze');
      return;
    }

    const entry = getHistoryEntry(id);
    if (!entry) {
      navigate('/analyze');
      return;
    }

    setAnalysis(entry);
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const scoreCategory = getScoreCategory(analysis.readinessScore);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/analyze')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Analysis Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {analysis.company && (
                <span className="flex items-center gap-1 text-gray-600">
                  <Building2 className="w-4 h-4" />
                  {analysis.company}
                </span>
              )}
              {analysis.role && (
                <span className="flex items-center gap-1 text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  {analysis.role}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              Analyzed on {formatDate(analysis.createdAt)}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg ${scoreCategory.bgColor}`}>
              <span className={`font-semibold ${scoreCategory.color}`}>
                {scoreCategory.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Readiness Score */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Readiness Score
        </h3>
        <div className="flex justify-center">
          <CircularProgress score={analysis.readinessScore} />
        </div>
      </div>

      {/* Extracted Skills */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Key Skills Extracted
        </h3>
        <div className="space-y-4">
          {Object.entries(analysis.extractedSkills).map(([key, category]) => (
            <div key={key}>
              <h4 className="text-sm font-medium text-gray-600 mb-2">{category.label}</h4>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Round-wise Checklist */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Preparation Checklist
        </h3>
        <div className="space-y-6">
          {analysis.checklist.map((round) => (
            <div key={round.round} className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold text-gray-900">
                Round {round.round}: {round.title}
              </h4>
              <p className="text-sm text-gray-500 mb-3">{round.description}</p>
              <ul className="space-y-2">
                {round.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          7-Day Preparation Plan
        </h3>
        <div className="space-y-4">
          {analysis.plan.map((day) => (
            <div key={day.day} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                Day {day.day}: {day.title}
              </h4>
              <ul className="space-y-1">
                {day.tasks.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Questions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          Likely Interview Questions
        </h3>
        <div className="space-y-3">
          {analysis.questions.map((question, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                {idx + 1}
              </span>
              <p className="text-gray-700">{question}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/analyze')}
          className="flex-1 bg-primary hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Analyze Another JD
        </button>
        <button
          onClick={() => navigate('/history')}
          className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          View History
        </button>
      </div>
    </div>
  );
}
