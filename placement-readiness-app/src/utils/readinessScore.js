import { getDetectedCategoryCount } from './skillExtractor';

/**
 * Calculate readiness score based on JD analysis
 * @param {Object} params - Analysis parameters
 * @param {string} params.company - Company name
 * @param {string} params.role - Job role
 * @param {string} params.jdText - Job description text
 * @param {Object} params.extractedSkills - Extracted skills from JD
 * @returns {number} - Readiness score (0-100)
 */
export function calculateReadinessScore({ company, role, jdText, extractedSkills }) {
  let score = 35; // Base score

  // +5 per detected category (max 30)
  const categoryCount = getDetectedCategoryCount(extractedSkills);
  score += Math.min(categoryCount * 5, 30);

  // +10 if company name provided
  if (company && company.trim().length > 0) {
    score += 10;
  }

  // +10 if role provided
  if (role && role.trim().length > 0) {
    score += 10;
  }

  // +10 if JD length > 800 chars
  if (jdText && jdText.length > 800) {
    score += 10;
  }

  // Cap at 100
  return Math.min(score, 100);
}

/**
 * Get score category and color
 * @param {number} score - Readiness score
 * @returns {Object} - Category info with label and color
 */
export function getScoreCategory(score) {
  if (score >= 80) {
    return { label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
  }
  if (score >= 60) {
    return { label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
  }
  if (score >= 40) {
    return { label: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
  }
  return { label: 'Needs Work', color: 'text-red-600', bgColor: 'bg-red-100' };
}
