/**
 * Standardized Analysis Entry Schema
 * All history entries must conform to this structure
 */

export const DEFAULT_SKILL_CATEGORIES = {
  coreCS: [],
  languages: [],
  web: [],
  data: [],
  cloud: [],
  testing: [],
  other: []
};

export const DEFAULT_SKILLS_WHEN_EMPTY = [
  'Communication',
  'Problem solving',
  'Basic coding',
  'Projects'
];

/**
 * Create a standardized analysis entry
 * @param {Object} data - Raw analysis data
 * @returns {Object} - Standardized entry conforming to schema
 */
export function createStandardizedEntry(data) {
  const now = new Date().toISOString();
  
  // Ensure extractedSkills has all categories
  const extractedSkills = {
    coreCS: data.extractedSkills?.coreCS || data.extractedSkills?.coreCS || [],
    languages: data.extractedSkills?.languages || [],
    web: data.extractedSkills?.web || [],
    data: data.extractedSkills?.data || [],
    cloud: data.extractedSkills?.cloudDevOps || data.extractedSkills?.cloud || [],
    testing: data.extractedSkills?.testing || [],
    other: data.extractedSkills?.other || []
  };

  // If no skills detected, populate "other" with defaults
  const hasAnySkills = Object.values(extractedSkills).some(arr => arr.length > 0);
  if (!hasAnySkills) {
    extractedSkills.other = [...DEFAULT_SKILLS_WHEN_EMPTY];
  }

  // Standardize round mapping
  const roundMapping = (data.roundMapping || []).map(round => ({
    round: round.round || 0,
    roundTitle: round.name || round.roundTitle || 'Interview Round',
    description: round.description || '',
    focusAreas: Array.isArray(round.focus) 
      ? [round.focus] 
      : (round.focusAreas || []),
    whyItMatters: round.whyItMatters || '',
    duration: round.duration || '30-45 minutes'
  }));

  // Standardize checklist
  const checklist = (data.checklist || []).map(round => ({
    round: round.round || 0,
    roundTitle: round.title || round.roundTitle || `Round ${round.round}`,
    description: round.description || '',
    items: Array.isArray(round.items) ? round.items : []
  }));

  // Standardize 7-day plan
  const plan7Days = (data.plan || data.plan7Days || []).map(day => ({
    day: day.day || 0,
    focus: day.title || day.focus || `Day ${day.day}`,
    tasks: Array.isArray(day.tasks) ? day.tasks : []
  }));

  // Ensure skillConfidenceMap has all skills
  const allSkills = Object.values(extractedSkills).flat();
  const skillConfidenceMap = { ...data.skillConfidenceMap };
  allSkills.forEach(skill => {
    if (!skillConfidenceMap[skill]) {
      skillConfidenceMap[skill] = 'practice';
    }
  });

  // Calculate final score based on confidence map
  const baseScore = data.baseScore || data.readinessScore || 35;
  const finalScore = calculateFinalScore(baseScore, skillConfidenceMap);

  return {
    id: data.id || generateId(),
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    company: (data.company || '').trim(),
    role: (data.role || '').trim(),
    jdText: data.jdText || '',
    extractedSkills,
    roundMapping,
    checklist,
    plan7Days,
    questions: Array.isArray(data.questions) ? data.questions : [],
    baseScore,
    skillConfidenceMap,
    finalScore
  };
}

/**
 * Calculate final score based on base score and skill confidence
 * @param {number} baseScore - Base readiness score
 * @param {Object} skillConfidenceMap - Map of skill to confidence level
 * @returns {number} - Final score (0-100)
 */
function calculateFinalScore(baseScore, skillConfidenceMap) {
  let adjustment = 0;
  Object.values(skillConfidenceMap).forEach(confidence => {
    if (confidence === 'know') {
      adjustment += 2;
    } else {
      adjustment -= 2;
    }
  });
  
  return Math.max(0, Math.min(100, baseScore + adjustment));
}

/**
 * Generate unique ID
 * @returns {string} - Unique ID
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate an analysis entry against schema
 * @param {Object} entry - Entry to validate
 * @returns {Object} - Validation result { isValid, errors }
 */
export function validateEntry(entry) {
  const errors = [];

  if (!entry.id) errors.push('Missing id');
  if (!entry.createdAt) errors.push('Missing createdAt');
  if (typeof entry.jdText !== 'string') errors.push('Invalid jdText');
  if (typeof entry.baseScore !== 'number') errors.push('Invalid baseScore');
  if (typeof entry.finalScore !== 'number') errors.push('Invalid finalScore');
  if (!entry.extractedSkills || typeof entry.extractedSkills !== 'object') {
    errors.push('Invalid extractedSkills');
  }
  if (!Array.isArray(entry.questions)) errors.push('Invalid questions');
  if (!Array.isArray(entry.checklist)) errors.push('Invalid checklist');
  if (!Array.isArray(entry.plan7Days)) errors.push('Invalid plan7Days');
  if (!Array.isArray(entry.roundMapping)) errors.push('Invalid roundMapping');

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize and repair a corrupted entry
 * @param {Object} entry - Potentially corrupted entry
 * @returns {Object|null} - Repaired entry or null if unrecoverable
 */
export function repairEntry(entry) {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  try {
    // Attempt to create a standardized entry with available data
    return createStandardizedEntry({
      id: entry.id,
      createdAt: entry.createdAt,
      company: entry.company,
      role: entry.role,
      jdText: entry.jdText || '',
      extractedSkills: entry.extractedSkills || DEFAULT_SKILL_CATEGORIES,
      roundMapping: entry.roundMapping || [],
      checklist: entry.checklist || entry.checklist || [],
      plan: entry.plan7Days || entry.plan || [],
      questions: entry.questions || [],
      baseScore: entry.baseScore || entry.readinessScore,
      skillConfidenceMap: entry.skillConfidenceMap || {}
    });
  } catch (error) {
    console.error('Failed to repair entry:', error);
    return null;
  }
}
