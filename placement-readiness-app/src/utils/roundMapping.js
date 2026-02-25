import { COMPANY_SIZE } from './companyIntel';
import { getAllSkillsFlat } from './skillExtractor';

/**
 * Round types with descriptions
 */
const ROUND_TYPES = {
  ONLINE_TEST: {
    name: 'Online Assessment',
    icon: 'Monitor',
    whyItMatters: 'Filters candidates based on fundamental aptitude and coding skills before investing interviewer time.'
  },
  TECHNICAL_DSA: {
    name: 'Technical Interview - DSA',
    icon: 'Code',
    whyItMatters: 'Validates your problem-solving approach, coding efficiency, and ability to optimize solutions under pressure.'
  },
  TECHNICAL_CORE: {
    name: 'Technical Interview - Core CS',
    icon: 'Cpu',
    whyItMatters: 'Tests depth of computer science knowledge crucial for building robust, scalable systems.'
  },
  SYSTEM_DESIGN: {
    name: 'System Design Discussion',
    icon: 'Layers',
    whyItMatters: 'Evaluates your ability to architect scalable solutions and think through trade-offs.'
  },
  PROJECT_DEEP_DIVE: {
    name: 'Project Deep Dive',
    icon: 'FolderOpen',
    whyItMatters: 'Assesses your practical experience, technical decisions, and ability to articulate complex work.'
  },
  PRACTICAL_CODING: {
    name: 'Live Coding / Pair Programming',
    icon: 'Terminal',
    whyItMatters: 'Demonstrates real-time coding ability, collaboration, and how you handle feedback.'
  },
  CULTURE_FIT: {
    name: 'Culture & Values Fit',
    icon: 'Heart',
    whyItMatters: 'Ensures alignment with company values and team dynamics for long-term success.'
  },
  MANAGERIAL: {
    name: 'Managerial Round',
    icon: 'Users',
    whyItMatters: 'Evaluates leadership potential, conflict resolution, and cross-functional collaboration.'
  },
  HR: {
    name: 'HR Discussion',
    icon: 'MessageCircle',
    whyItMatters: 'Final alignment on expectations, compensation, and organizational fit.'
  }
};

/**
 * Generate round mapping based on company size and detected skills
 * @param {string} companySize - Company size category
 * @param {Object} extractedSkills - Extracted skills from JD
 * @returns {Array} - Array of rounds with details
 */
export function generateRoundMapping(companySize, extractedSkills) {
  const skills = getAllSkillsFlat(extractedSkills);
  const hasSkill = (keyword) => skills.some(s => s.toLowerCase().includes(keyword.toLowerCase()));
  const hasDSA = hasSkill('DSA') || hasSkill('Data Structures') || hasSkill('Algorithms');
  const hasWeb = hasSkill('React') || hasSkill('Node') || hasSkill('Angular') || hasSkill('Vue');
  const hasSystemDesign = hasSkill('System Design') || hasSkill('Architecture');

  // Enterprise Round Mapping
  if (companySize === COMPANY_SIZE.ENTERPRISE) {
    const rounds = [
      {
        round: 1,
        ...ROUND_TYPES.ONLINE_TEST,
        description: 'Aptitude + Basic Coding',
        focus: hasDSA 
          ? 'DSA problems (arrays, strings) + Logical reasoning + Quantitative aptitude'
          : 'Logical reasoning + Quantitative aptitude + Basic programming concepts',
        duration: '60-90 minutes'
      },
      {
        round: 2,
        ...ROUND_TYPES.TECHNICAL_DSA,
        description: 'Data Structures & Algorithms',
        focus: hasDSA
          ? 'Medium-hard DSA problems: trees, graphs, DP, with code optimization'
          : 'Problem-solving with basic data structures, code quality focus',
        duration: '45-60 minutes'
      }
    ];

    // Add Core CS round if relevant skills detected
    if (hasSkill('DBMS') || hasSkill('OS') || hasSkill('Networks')) {
      rounds.push({
        round: rounds.length + 1,
        ...ROUND_TYPES.TECHNICAL_CORE,
        description: 'Computer Science Fundamentals',
        focus: 'Deep dive into DBMS, OS, Networks concepts with real-world applications',
        duration: '45 minutes'
      });
    }

    // Add System Design for senior roles or if explicitly mentioned
    if (hasSystemDesign || hasSkill('Senior') || hasSkill('Lead')) {
      rounds.push({
        round: rounds.length + 1,
        ...ROUND_TYPES.SYSTEM_DESIGN,
        description: 'Scalable System Architecture',
        focus: 'Design scalable systems: discuss trade-offs, scalability, fault tolerance',
        duration: '45-60 minutes'
      });
    }

    // Add Project round
    rounds.push({
      round: rounds.length + 1,
      ...ROUND_TYPES.PROJECT_DEEP_DIVE,
      description: 'Past Experience Discussion',
      focus: 'Deep dive into your projects: architecture, challenges, your contributions, learnings',
      duration: '30-45 minutes'
    });

    // Add Managerial for enterprise
    rounds.push({
      round: rounds.length + 1,
      ...ROUND_TYPES.MANAGERIAL,
      description: 'Leadership & Collaboration',
      focus: 'Behavioral questions, conflict resolution, leadership examples, cross-team collaboration',
      duration: '30-45 minutes'
    });

    // HR round
    rounds.push({
      round: rounds.length + 1,
      ...ROUND_TYPES.HR,
      description: 'Final Discussion',
      focus: 'Compensation, role expectations, company culture, joining formalities',
      duration: '15-30 minutes'
    });

    return rounds;
  }

  // Startup Round Mapping
  if (companySize === COMPANY_SIZE.STARTUP) {
    const rounds = [
      {
        round: 1,
        ...ROUND_TYPES.PRACTICAL_CODING,
        description: 'Hands-on Problem Solving',
        focus: hasDSA
          ? 'Solve 2-3 practical problems: focus on working solution first, then optimize'
          : 'Build a small feature or solve practical coding challenges',
        duration: '60 minutes'
      }
    ];

    // Add technical discussion about stack
    if (hasWeb || hasSkill('Python') || hasSkill('Java')) {
      rounds.push({
        round: rounds.length + 1,
        ...ROUND_TYPES.TECHNICAL_CORE,
        description: 'Stack Deep Dive',
        focus: `Deep discussion on ${hasWeb ? 'web technologies' : 'your primary language'}: best practices, common pitfalls, recent developments`,
        duration: '45 minutes'
      });
    }

    // System design discussion (lighter than enterprise)
    rounds.push({
      round: rounds.length + 1,
      ...ROUND_TYPES.SYSTEM_DESIGN,
      description: 'Architecture Discussion',
      focus: 'High-level design of a feature or product: database choice, API design, trade-offs',
      duration: '30-45 minutes'
    });

    // Project discussion
    rounds.push({
      round: rounds.length + 1,
      ...ROUND_TYPES.PROJECT_DEEP_DIVE,
      description: 'Portfolio Review',
      focus: 'Showcase your best work: live demo if possible, discuss technical decisions',
      duration: '30 minutes'
    });

    // Culture fit (crucial for startups)
    rounds.push({
      round: rounds.length + 1,
      ...ROUND_TYPES.CULTURE_FIT,
      description: 'Team & Values Alignment',
      focus: 'Why this startup? Ownership mindset, adaptability, passion for the problem space',
      duration: '30-45 minutes'
    });

    // Founders/CTO round for startups
    rounds.push({
      round: rounds.length + 1,
      ...ROUND_TYPES.MANAGERIAL,
      description: 'Founder/CTO Discussion',
      focus: 'Vision alignment, your growth trajectory, equity discussion (if applicable)',
      duration: '30 minutes'
    });

    return rounds;
  }

  // Mid-size (balanced approach)
  const rounds = [
    {
      round: 1,
      ...ROUND_TYPES.ONLINE_TEST,
      description: 'Screening Assessment',
      focus: hasDSA
        ? 'DSA + Aptitude: moderate difficulty, focus on correctness'
        : 'Aptitude + Basic coding concepts',
      duration: '60 minutes'
    },
    {
      round: 2,
      ...ROUND_TYPES.TECHNICAL_DSA,
      description: 'Problem Solving',
      focus: hasDSA
        ? 'DSA problems: emphasis on clean code and explanation'
        : 'Logical problem-solving with pseudocode',
      duration: '45 minutes'
    }
  ];

  if (hasWeb || hasSkill('DBMS')) {
    rounds.push({
      round: rounds.length + 1,
      ...ROUND_TYPES.TECHNICAL_CORE,
      description: 'Domain Knowledge',
      focus: 'Deep dive into relevant technologies and frameworks',
      duration: '45 minutes'
    });
  }

  rounds.push(
    {
      round: rounds.length + 1,
      ...ROUND_TYPES.PROJECT_DEEP_DIVE,
      description: 'Experience Review',
      focus: 'Your past work and how it relates to this role',
      duration: '30 minutes'
    },
    {
      round: rounds.length + 1,
      ...ROUND_TYPES.CULTURE_FIT,
      description: 'Team Fit',
      focus: 'Collaboration style, working in agile teams, handling feedback',
      duration: '30 minutes'
    },
    {
      round: rounds.length + 1,
      ...ROUND_TYPES.HR,
      description: 'Final Discussion',
      focus: 'Role expectations, compensation, growth opportunities',
      duration: '20-30 minutes'
    }
  );

  return rounds;
}

/**
 * Get round icon component name
 * @param {string} iconName - Icon name from ROUND_TYPES
 * @returns {string} - Lucide icon name
 */
export function getRoundIcon(iconName) {
  const iconMap = {
    'Monitor': 'Monitor',
    'Code': 'Code',
    'Cpu': 'Cpu',
    'Layers': 'Layers',
    'FolderOpen': 'FolderOpen',
    'Terminal': 'Terminal',
    'Heart': 'Heart',
    'Users': 'Users',
    'MessageCircle': 'MessageCircle'
  };
  return iconMap[iconName] || 'Circle';
}
