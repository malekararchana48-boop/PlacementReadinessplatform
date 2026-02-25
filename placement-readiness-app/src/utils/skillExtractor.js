// Skill categories with keywords for extraction
const skillCategories = {
  coreCS: {
    label: 'Core CS',
    keywords: ['DSA', 'OOP', 'DBMS', 'OS', 'Networks', 'Data Structures', 'Algorithms', 'Object Oriented', 'Database', 'Operating System', 'Computer Networks'],
    skills: []
  },
  languages: {
    label: 'Languages',
    keywords: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go', 'Golang', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Rust', 'Scala'],
    skills: []
  },
  web: {
    label: 'Web Development',
    keywords: ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL', 'Angular', 'Vue', 'Svelte', 'HTML', 'CSS', 'Bootstrap', 'Tailwind', 'Webpack', 'Vite'],
    skills: []
  },
  data: {
    label: 'Data & Databases',
    keywords: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB', 'Firebase', 'Prisma', 'Sequelize'],
    skills: []
  },
  cloudDevOps: {
    label: 'Cloud & DevOps',
    keywords: ['AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Terraform', 'Ansible', 'Linux', 'Ubuntu', 'CentOS', 'Nginx'],
    skills: []
  },
  testing: {
    label: 'Testing',
    keywords: ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest', 'Jest', 'Mocha', 'Chai', 'Testing Library', 'Postman', 'JMeter'],
    skills: []
  }
};

// Flatten all keywords for detection
const allKeywords = Object.entries(skillCategories).flatMap(([category, data]) =>
  data.keywords.map(keyword => ({ keyword: keyword.toLowerCase(), category, original: keyword }))
);

/**
 * Extract skills from job description text
 * @param {string} jdText - Job description text
 * @returns {Object} - Extracted skills grouped by category
 */
export function extractSkills(jdText) {
  if (!jdText || jdText.trim().length === 0) {
    return getGeneralFresherStack();
  }

  const text = jdText.toLowerCase();
  const detectedSkills = {};
  const detectedCategories = new Set();

  // Initialize categories
  Object.keys(skillCategories).forEach(key => {
    detectedSkills[key] = {
      label: skillCategories[key].label,
      skills: []
    };
  });

  // Detect skills
  allKeywords.forEach(({ keyword, category, original }) => {
    // Use word boundary for single characters (C, R), otherwise match as substring
    const isSingleChar = keyword.length === 1;
    const pattern = isSingleChar
      ? new RegExp(`\\b${keyword}\\b`, 'i')
      : new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    if (pattern.test(text)) {
      if (!detectedSkills[category].skills.includes(original)) {
        detectedSkills[category].skills.push(original);
        detectedCategories.add(category);
      }
    }
  });

  // If no skills detected, return general fresher stack
  if (detectedCategories.size === 0) {
    return getGeneralFresherStack();
  }

  return detectedSkills;
}

/**
 * Get general fresher stack when no skills detected
 */
function getGeneralFresherStack() {
  return {
    general: {
      label: 'General Fresher Stack',
      skills: ['DSA', 'OOP', 'DBMS', 'Any Programming Language', 'Basic Web Development']
    }
  };
}

/**
 * Get detected categories for scoring
 * @param {Object} extractedSkills - Skills extracted from JD
 * @returns {number} - Number of categories with skills
 */
export function getDetectedCategoryCount(extractedSkills) {
  if (extractedSkills.general) return 1;
  return Object.values(extractedSkills).filter(cat => cat.skills.length > 0).length;
}

/**
 * Get all skills as flat array
 * @param {Object} extractedSkills - Skills extracted from JD
 * @returns {Array} - Flat array of all skills
 */
export function getAllSkillsFlat(extractedSkills) {
  if (extractedSkills.general) {
    return extractedSkills.general.skills;
  }
  return Object.values(extractedSkills).flatMap(cat => cat.skills);
}
