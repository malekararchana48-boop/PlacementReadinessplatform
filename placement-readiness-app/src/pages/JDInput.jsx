import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building2, FileText, Sparkles, Loader2 } from 'lucide-react';
import { extractSkills } from '../utils/skillExtractor';
import { generateChecklist, generatePlan, generateQuestions } from '../utils/analysisEngine';
import { calculateReadinessScore } from '../utils/readinessScore';
import { saveAnalysis } from '../utils/storage';

export default function JDInput() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    jdText: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.jdText.trim()) {
      setError('Please enter a job description');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate analysis delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

      // Extract skills
      const extractedSkills = extractSkills(formData.jdText);

      // Generate analysis outputs
      const checklist = generateChecklist(extractedSkills);
      const plan = generatePlan(extractedSkills);
      const questions = generateQuestions(extractedSkills);

      // Calculate readiness score
      const readinessScore = calculateReadinessScore({
        company: formData.company,
        role: formData.role,
        jdText: formData.jdText,
        extractedSkills
      });

      // Save to localStorage
      const savedEntry = saveAnalysis({
        company: formData.company,
        role: formData.role,
        jdText: formData.jdText,
        extractedSkills,
        checklist,
        plan,
        questions,
        readinessScore
      });

      // Navigate to results with the saved entry ID
      navigate(`/results?id=${savedEntry.id}`);
    } catch (err) {
      setError('Failed to analyze JD. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Analyze Job Description</h2>
        <p className="text-gray-600 mt-1">
          Paste a job description to get personalized preparation recommendations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company & Role Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Company Name
              </span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g., Google, Microsoft"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Job Role
              </span>
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g., Frontend Developer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* JD Text Area */}
        <div>
          <label htmlFor="jdText" className="block text-sm font-medium text-gray-700 mb-2">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Job Description
            </span>
          </label>
          <textarea
            id="jdText"
            name="jdText"
            value={formData.jdText}
            onChange={handleChange}
            rows={12}
            placeholder="Paste the job description here... Include requirements, skills, and responsibilities for better analysis."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-y"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{formData.jdText.length} characters</span>
            <span>Minimum 100 characters recommended</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze JD
            </>
          )}
        </button>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Tips for best results:</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Include the complete job description with requirements</li>
            <li>Mention specific technologies (React, Node.js, SQL, etc.)</li>
            <li>Add company and role for better readiness scoring</li>
            <li>Longer JDs provide more accurate skill extraction</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
