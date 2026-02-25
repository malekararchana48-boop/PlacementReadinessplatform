// Skill categories with keywords for extraction (matches schema structure)
const skillCategories = {
  coreCS: {
    label: 'Core CS',
    keywords: ['DSA', 'OOP', 'DBMS', 'OS', 'Networks', 'Data Structures', 'Algorithms', 'Object Oriented', 'Database', 'Operating System', 'Computer Networks']
  },
  languages: {
    label: 'Languages',
    keywords: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go', 'Golang', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Rust', 'Scala']
  },
  web: {
    label: 'Web Development',
    keywords: ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL', 'Angular', 'Vue', 'Svelte', 'HTML', 'CSS', 'Bootstrap', 'Tailwind', 'Webpack', 'Vite']
  },
  data: {
    label: 'Data & Databases',
    keywords: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB', 'Firebase', 'Prisma', 'Sequelize']
  },
  cloud: {
    label: 'Cloud & DevOps',
    keywords: ['AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Terraform', 'Ansible', 'Linux', 'Ubuntu', 'CentOS', 'Nginx']
  },
  testing: {
    label: 'Testing',
    keywords: ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest', 'Jest', 'Mocha', 'Chai', 'Testing Library', 'Postman', 'JMeter']
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
    return getEmptySkillStructure();
  }

  const text = jdText.toLowerCase();
  const detectedSkills = getEmptySkillStructure();
  const detectedCategories = new Set();

  // Detect skills
  allKeywords.forEach(({ keyword, category, original }) => {
    // Use word boundary for single characters (C, R), otherwise match as substring
    const isSingleChar = keyword.length === 1;
    const pattern = isSingleChar
      ? new RegExp(`\\b${keyword}\\b`, 'i')
      : new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    if (pattern.test(text)) {
      if (!detectedSkills[category].includes(original)) {
        detectedSkills[category].push(original);
        detectedCategories.add(category);
      }
    }
  });

  return detectedSkills;
}

/**
 * Get empty skill structure matching schema
 */
function getEmptySkillStructure() {
  return {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloud: [],
    testing: [],
    other: []
  };
}

/**
 * Get detected categories for scoring
 * @param {Object} extractedSkills - Skills extracted from JD
 * @returns {number} - Number of categories with skills
 */
export function getDetectedCategoryCount(extractedSkills) {
  return Object.values(extractedSkills).filter(cat => Array.isArray(cat) && cat.length > 0).length;
}

/**
 * Get all skills as flat array
 * @param {Object} extractedSkills - Skills extracted from JD
 * @returns {Array} - Flat array of all skills
 */
export function getAllSkillsFlat(extractedSkills) {
  return Object.values(extractedSkills).flatMap(cat => Array.isArray(cat) ? cat : []);
}
