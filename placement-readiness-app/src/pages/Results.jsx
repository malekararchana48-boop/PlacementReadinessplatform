import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Briefcase, Calendar, CheckCircle, Target, HelpCircle, Award, Clock, Download, Copy, Check, Zap, AlertCircle, Monitor, Code, Cpu, Layers, FolderOpen, Terminal, Heart, Users, MessageCircle, Info } from 'lucide-react';
import { getHistoryEntry, formatDate, updateHistoryEntry } from '../utils/storage';
import { getScoreCategory } from '../utils/readinessScore';
import { generateCompanyIntel } from '../utils/companyIntel';
import { generateRoundMapping } from '../utils/roundMapping';
import CircularProgress from '../components/CircularProgress';

// Icon mapping for round types
const roundIcons = {
  Monitor, Code, Cpu, Layers, FolderOpen, Terminal, Heart, Users, MessageCircle
};

export default function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skillConfidence, setSkillConfidence] = useState({});
  const [liveScore, setLiveScore] = useState(0);
  const [copiedSection, setCopiedSection] = useState(null);
  const [companyIntel, setCompanyIntel] = useState(null);
  const [roundMapping, setRoundMapping] = useState([]);

  const id = searchParams.get('id');

  // Initialize skill confidence from stored data or default to "practice"
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
    
    // Generate company intel if company name provided
    const intel = generateCompanyIntel(entry.company, entry.jdText);
    setCompanyIntel(intel);
    
    // Generate round mapping based on company size and skills
    const rounds = generateRoundMapping(intel?.size || 'startup', entry.extractedSkills);
    setRoundMapping(rounds);
    
    // Initialize skill confidence from stored data or default all to "practice"
    const initialConfidence = entry.skillConfidenceMap || {};
    
    // Handle both old format (with skills array) and new format (direct arrays)
    const allSkills = Object.values(entry.extractedSkills).flatMap(cat => 
      Array.isArray(cat) ? cat : (cat.skills || [])
    );
    
    allSkills.forEach(skill => {
      if (!initialConfidence[skill]) {
        initialConfidence[skill] = 'practice';
      }
    });
    
    setSkillConfidence(initialConfidence);
    // Use finalScore if available, otherwise fall back to readinessScore or baseScore
    setLiveScore(entry.finalScore || entry.readinessScore || entry.baseScore || 35);
    setLoading(false);
  }, [id, navigate]);

  // Calculate live score based on skill confidence
  const calculateLiveScore = useCallback((confidenceMap, baseScore) => {
    let adjustment = 0;
    Object.values(confidenceMap).forEach(confidence => {
      if (confidence === 'know') {
        adjustment += 2;
      } else {
        adjustment -= 2;
      }
    });
    
    // Bounds: 0-100
    return Math.max(0, Math.min(100, baseScore + adjustment));
  }, []);

  // Handle skill confidence toggle
  const toggleSkillConfidence = (skill) => {
    const newConfidence = { ...skillConfidence };
    newConfidence[skill] = newConfidence[skill] === 'know' ? 'practice' : 'know';
    
    setSkillConfidence(newConfidence);
    
    // Calculate and update live score based on baseScore (never changes)
    const baseScore = analysis.baseScore || analysis.readinessScore || 35;
    const newScore = calculateLiveScore(newConfidence, baseScore);
    setLiveScore(newScore);
    
    // Persist to localStorage - finalScore will be recalculated
    updateHistoryEntry(id, {
      skillConfidenceMap: newConfidence
    });
  };

  // Copy text to clipboard
  const copyToClipboard = async (text, section) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Generate export text for 7-day plan
  const generatePlanText = () => {
    return analysis.plan.map(day => 
      `Day ${day.day}: ${day.title}\n${day.tasks.map(t => `- ${t}`).join('\n')}`
    ).join('\n\n');
  };

  // Generate export text for checklist
  const generateChecklistText = () => {
    return analysis.checklist.map(round =>
      `Round ${round.round}: ${round.title}\n${round.items.map(i => `- ${i}`).join('\n')}`
    ).join('\n\n');
  };

  // Generate export text for questions
  const generateQuestionsText = () => {
    return analysis.questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
  };

  // Download full analysis as TXT
  const downloadAsTxt = () => {
    const allSkills = Object.values(analysis.extractedSkills).flatMap(cat => cat.skills);
    const weakSkills = allSkills.filter(skill => skillConfidence[skill] === 'practice');
    
    const content = `PLACEMENT READINESS ANALYSIS
=============================

Company: ${analysis.company || 'N/A'}
Role: ${analysis.role || 'N/A'}
Date: ${formatDate(analysis.createdAt)}
Base Readiness Score: ${analysis.readinessScore}/100
Adjusted Score: ${liveScore}/100

SKILLS EXTRACTED
================
${Object.entries(analysis.extractedSkills).map(([key, cat]) => 
  `${cat.label}:\n${cat.skills.map(s => `  - ${s} (${skillConfidence[s] === 'know' ? 'I know this' : 'Need practice'})`).join('\n')}`
).join('\n\n')}

7-DAY PREPARATION PLAN
======================
${generatePlanText()}

ROUND-WISE CHECKLIST
====================
${generateChecklistText()}

LIKELY INTERVIEW QUESTIONS
==========================
${generateQuestionsText()}

FOCUS AREAS (Need Practice)
===========================
${weakSkills.slice(0, 3).map(s => `- ${s}`).join('\n')}

Generated by Placement Readiness Platform
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement-analysis-${analysis.company || 'unknown'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get weak skills for Action Next box
  const getWeakSkills = () => {
    const allSkills = Object.values(analysis.extractedSkills).flatMap(cat => cat.skills);
    return allSkills.filter(skill => skillConfidence[skill] === 'practice');
  };

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

  const scoreCategory = getScoreCategory(liveScore);
  const weakSkills = getWeakSkills();

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

      {/* Company Intel */}
      {companyIntel && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Company Intel
            </h3>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Demo Mode: Generated heuristically
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Company</p>
              <p className="font-semibold text-gray-900">{companyIntel.name}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Industry</p>
              <p className="font-semibold text-gray-900">{companyIntel.industry}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Size</p>
              <p className="font-semibold text-gray-900">{companyIntel.sizeLabel}</p>
              <p className="text-xs text-gray-500">{companyIntel.sizeRange}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Typical Hiring Focus</h4>
            <p className="text-gray-600 mb-3">{companyIntel.hiringFocus.description}</p>
            <div className="flex flex-wrap gap-2">
              {companyIntel.hiringFocus.keyAreas.map((area, idx) => (
                <span key={idx} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Round Mapping */}
      {roundMapping.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Interview Round Mapping
          </h3>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {roundMapping.map((round, idx) => {
                const IconComponent = roundIcons[round.icon] || Monitor;
                return (
                  <div key={idx} className="relative flex gap-4">
                    {/* Icon circle */}
                    <div className="relative z-10 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-primary">Round {round.round}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{round.duration}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{round.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{round.description}</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mb-2">
                        <span className="font-medium">Focus:</span> {round.focus}
                      </p>
                      <p className="text-xs text-gray-500 italic">
                        <span className="font-medium not-italic">Why this matters:</span> {round.whyItMatters}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Readiness Score */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Readiness Score
          </h3>
          <span className="text-sm text-gray-500">
            Base: {analysis.readinessScore} | Adjusted: {liveScore}
          </span>
        </div>
        <div className="flex justify-center">
          <CircularProgress score={liveScore} />
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Toggle skills below to update your score (+2 for "I know this", -2 for "Need practice")
        </p>
      </div>

      {/* Extracted Skills with Toggles */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Key Skills Extracted
          <span className="text-sm font-normal text-gray-500 ml-2">(Click to toggle confidence)</span>
        </h3>
        <div className="space-y-4">
          {Object.entries(analysis.extractedSkills).map(([key, category]) => (
            <div key={key}>
              <h4 className="text-sm font-medium text-gray-600 mb-2">{category.label}</h4>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, idx) => {
                  const confidence = skillConfidence[skill] || 'practice';
                  const isKnown = confidence === 'know';
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleSkillConfidence(skill)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                        isKnown
                          ? 'bg-green-100 text-green-700 border-2 border-green-300'
                          : 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {isKnown ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                        {skill}
                        <span className="text-xs opacity-75">
                          {isKnown ? 'I know this' : 'Need practice'}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Tools */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-primary" />
          Export Tools
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => copyToClipboard(generatePlanText(), 'plan')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
          >
            {copiedSection === 'plan' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            <span className="text-sm">Copy 7-Day Plan</span>
          </button>
          <button
            onClick={() => copyToClipboard(generateChecklistText(), 'checklist')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
          >
            {copiedSection === 'checklist' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            <span className="text-sm">Copy Checklist</span>
          </button>
          <button
            onClick={() => copyToClipboard(generateQuestionsText(), 'questions')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
          >
            {copiedSection === 'questions' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            <span className="text-sm">Copy 10 Questions</span>
          </button>
          <button
            onClick={downloadAsTxt}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Download as TXT</span>
          </button>
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

      {/* Action Next Box */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Action Next</h3>
            
            {weakSkills.length > 0 ? (
              <>
                <p className="text-gray-600 mb-3">Focus on these top weak areas:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {weakSkills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white border border-amber-300 text-amber-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="bg-white rounded-lg p-4 border border-primary-100">
                  <p className="text-gray-800 font-medium mb-1">Suggested next step:</p>
                  <p className="text-gray-600">Start Day 1 of your preparation plan now. Focus on reviewing the fundamentals of your weakest skill first.</p>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-3">Great job! You feel confident about all detected skills.</p>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-gray-800 font-medium mb-1">Suggested next step:</p>
                  <p className="text-gray-600">Review the interview questions and take a mock assessment to test your knowledge.</p>
                </div>
              </>
            )}
          </div>
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
