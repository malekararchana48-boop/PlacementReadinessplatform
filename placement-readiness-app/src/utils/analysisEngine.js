import { getAllSkillsFlat, getDetectedCategoryCount } from './skillExtractor';
import { DEFAULT_SKILLS_WHEN_EMPTY } from './schema';

/**
 * Generate round-wise preparation checklist based on detected skills
 * @param {Object} extractedSkills - Extracted skills from JD
 * @returns {Array} - Array of rounds with checklist items
 */
export function generateChecklist(extractedSkills) {
  const skills = getAllSkillsFlat(extractedSkills);
  
  // If no skills detected, use default skills
  const effectiveSkills = skills.length > 0 ? skills : DEFAULT_SKILLS_WHEN_EMPTY;
  const hasSkill = (keyword) => effectiveSkills.some(s => s.toLowerCase().includes(keyword.toLowerCase()));
  const hasCategory = (cat) => extractedSkills[cat] && (extractedSkills[cat].length > 0 || extractedSkills[cat].skills?.length > 0);

  const rounds = [
    {
      round: 1,
      title: 'Aptitude / Basics',
      description: 'Foundation assessment round',
      items: [
        'Practice quantitative aptitude problems (time/speed, percentages, ratios)',
        'Solve logical reasoning puzzles (pattern recognition, series completion)',
        'Review verbal ability (grammar, comprehension, sentence correction)',
        hasSkill('DSA') && 'Brush up on basic data structures concepts',
        hasSkill('OOP') && 'Review OOP principles: encapsulation, inheritance, polymorphism',
        'Practice 10-15 aptitude tests under timed conditions',
        'Review company-specific previous year questions if available'
      ].filter(Boolean)
    },
    {
      round: 2,
      title: 'DSA + Core CS',
      description: 'Technical coding and computer science fundamentals',
      items: [
        hasSkill('DSA') && 'Master arrays, strings, linked lists, stacks, queues',
        hasSkill('DSA') && 'Practice trees, graphs, and advanced data structures',
        hasSkill('DSA') && 'Solve 50+ problems on sorting, searching, and two-pointer techniques',
        hasCategory('coreCS') && 'Review DBMS: normalization, indexing, transactions, ACID properties',
        hasCategory('coreCS') && 'Study OS concepts: processes, threads, memory management, scheduling',
        hasCategory('coreCS') && 'Understand Networks: OSI model, TCP/IP, HTTP, DNS',
        hasSkill('OOP') && 'Practice OOP design problems and SOLID principles',
        'Time yourself: solve easy problems in 15 min, medium in 30 min',
        'Practice writing clean, optimized code with proper edge case handling'
      ].filter(Boolean)
    },
    {
      round: 3,
      title: 'Tech Interview (Projects + Stack)',
      description: 'Deep dive into your tech stack and projects',
      items: [
        hasSkill('React') && 'Master React hooks, context API, and state management patterns',
        hasSkill('Node.js') && 'Understand event loop, streams, and Express middleware',
        hasCategory('data') && 'Practice SQL joins, subqueries, and query optimization',
        hasCategory('web') && 'Review REST API design principles and HTTP methods',
        hasSkill('GraphQL') && 'Understand GraphQL schema, resolvers, and vs REST tradeoffs',
        hasCategory('cloudDevOps') && 'Study Docker containers, basic Kubernetes concepts',
        'Prepare to explain your projects: architecture, challenges, and your contributions',
        'Practice system design basics for your experience level',
        'Review version control with Git: branching, merging, rebasing',
        hasCategory('testing') && 'Understand testing pyramid: unit, integration, e2e tests'
      ].filter(Boolean)
    },
    {
      round: 4,
      title: 'Managerial / HR',
      description: 'Behavioral and culture fit assessment',
      items: [
        'Prepare STAR format answers for common behavioral questions',
        'Practice "Tell me about yourself" - keep it under 2 minutes',
        'Research company values, products, and recent news',
        'Prepare questions to ask the interviewer about team and culture',
        'Review your resume thoroughly - every point should be explainable',
        'Practice salary negotiation basics and know your expectations',
        'Prepare answers for: strengths, weaknesses, why this company, why this role',
        'Plan your attire and test your tech setup for virtual interviews',
        'Prepare a portfolio or GitHub showcase if applicable'
      ]
    }
  ];

  return rounds;
}

/**
 * Generate 7-day preparation plan based on detected skills
 * @param {Object} extractedSkills - Extracted skills from JD
 * @returns {Array} - 7-day plan with daily tasks
 */
export function generatePlan(extractedSkills) {
  const skills = getAllSkillsFlat(extractedSkills);
  
  // If no skills detected, use default skills
  const effectiveSkills = skills.length > 0 ? skills : DEFAULT_SKILLS_WHEN_EMPTY;
  const hasSkill = (keyword) => effectiveSkills.some(s => s.toLowerCase().includes(keyword.toLowerCase()));
  const hasCategory = (cat) => extractedSkills[cat] && (extractedSkills[cat].length > 0 || extractedSkills[cat].skills?.length > 0);

  const plan = [
    {
      day: 1,
      title: 'Basics + Core CS Fundamentals',
      tasks: [
        'Review data structures: arrays, linked lists, stacks, queues',
        hasCategory('coreCS') && 'Study DBMS basics: SQL commands, normalization',
        hasCategory('coreCS') && 'Review OS concepts: processes, threads, scheduling',
        'Practice 5 easy coding problems',
        'Read company-specific aptitude patterns'
      ].filter(Boolean)
    },
    {
      day: 2,
      title: 'Core CS Deep Dive',
      tasks: [
        hasCategory('coreCS') && 'Study DBMS advanced: indexing, transactions, ACID',
        hasCategory('coreCS') && 'Review Networks: OSI layers, TCP/IP, HTTP protocols',
        hasSkill('OOP') && 'Practice OOP design and SOLID principles',
        'Solve 5 medium coding problems on arrays and strings',
        'Take a timed aptitude test'
      ].filter(Boolean)
    },
    {
      day: 3,
      title: 'DSA + Coding Practice',
      tasks: [
        'Master trees: BST, AVL, tree traversals',
        'Practice graph algorithms: BFS, DFS, shortest path',
        'Solve 5 medium-hard problems on trees and graphs',
        hasSkill('React') && 'Review React component lifecycle and hooks',
        hasSkill('Node.js') && 'Practice Node.js async programming patterns'
      ].filter(Boolean)
    },
    {
      day: 4,
      title: 'Advanced DSA + Stack Practice',
      tasks: [
        'Practice dynamic programming: memoization, tabulation',
        'Solve problems on greedy algorithms and backtracking',
        hasCategory('data') && 'Practice complex SQL queries and optimization',
        hasCategory('web') && 'Review API design and authentication methods',
        'Build a small project or component using your stack'
      ].filter(Boolean)
    },
    {
      day: 5,
      title: 'Project + Resume Alignment',
      tasks: [
        'Review and refine your resume - ensure ATS-friendly format',
        'Prepare project explanations: problem, solution, your role, results',
        'Create a portfolio/GitHub README with clear documentation',
        hasCategory('cloudDevOps') && 'Review Docker basics and CI/CD pipelines',
        hasCategory('testing') && 'Practice writing test cases for your projects',
        'Mock present your best project to a friend or record yourself'
      ].filter(Boolean)
    },
    {
      day: 6,
      title: 'Mock Interview Questions',
      tasks: [
        'Practice 10+ technical questions from your skill areas',
        'Conduct a mock coding interview with timer',
        'Review system design basics: scalability, load balancing',
        'Prepare behavioral answers using STAR method',
        'Research the company: products, tech stack, culture, recent news'
      ].filter(Boolean)
    },
    {
      day: 7,
      title: 'Revision + Weak Areas',
      tasks: [
        'Review all mistakes from previous practice sessions',
        'Focus on weak areas identified during the week',
        'Quick revision of key formulas and concepts',
        'Practice 2-3 problems from each major topic',
        'Prepare interview logistics: attire, documents, tech setup',
        'Get good rest - mental clarity is crucial'
      ].filter(Boolean)
    }
  ];

  return plan;
}

/**
 * Generate likely interview questions based on detected skills
 * @param {Object} extractedSkills - Extracted skills from JD
 * @returns {Array} - Array of interview questions
 */
export function generateQuestions(extractedSkills) {
  const skills = getAllSkillsFlat(extractedSkills);
  
  // If no skills detected, use default skills
  const effectiveSkills = skills.length > 0 ? skills : DEFAULT_SKILLS_WHEN_EMPTY;
  const hasSkill = (keyword) => effectiveSkills.some(s => s.toLowerCase().includes(keyword.toLowerCase()));
  const hasCategory = (cat) => extractedSkills[cat] && (extractedSkills[cat].length > 0 || extractedSkills[cat].skills?.length > 0);

  const questions = [];

  // DSA Questions
  if (hasSkill('DSA') || hasSkill('Data Structures')) {
    questions.push(
      'How would you optimize search in a sorted array? Compare linear vs binary search.',
      'Explain the time and space complexity of quicksort and mergesort. When would you use each?',
      'How do you detect a cycle in a linked list? Explain Floyd\'s algorithm.',
      'What is the difference between BFS and DFS? When would you use one over the other?',
      'Explain dynamic programming with an example. What are overlapping subproblems?'
    );
  }

  // OOP Questions
  if (hasSkill('OOP') || hasSkill('Object Oriented')) {
    questions.push(
      'Explain the four pillars of OOP with real-world examples.',
      'What is the difference between abstraction and encapsulation?',
      'Explain polymorphism: compile-time vs runtime with code examples.',
      'What are SOLID principles? Explain each with examples.'
    );
  }

  // Database Questions
  if (hasCategory('data') || hasSkill('DBMS') || hasSkill('SQL')) {
    questions.push(
      'Explain indexing in databases. When does it help and when can it hurt performance?',
      'What are the different types of SQL joins? Provide examples.',
      'Explain database normalization. What are the normal forms?',
      'What is the difference between SQL and NoSQL databases? When would you use each?',
      'Explain ACID properties in database transactions.'
    );
  }

  // React Questions
  if (hasSkill('React')) {
    questions.push(
      'Explain React hooks. What is the difference between useEffect and useLayoutEffect?',
      'How does React\'s virtual DOM work? Why is it beneficial?',
      'What are the different ways to manage state in React applications?',
      'Explain React Context API. When would you use it over Redux?',
      'What is the difference between controlled and uncontrolled components?'
    );
  }

  // Node.js Questions
  if (hasSkill('Node.js')) {
    questions.push(
      'Explain the event loop in Node.js. How does it handle async operations?',
      'What is the difference between process.nextTick() and setImmediate()?',
      'How do you handle errors in Node.js async/await code?',
      'Explain streams in Node.js. What are the different types?'
    );
  }

  // Web/API Questions
  if (hasSkill('REST') || hasSkill('GraphQL')) {
    questions.push(
      'What are RESTful API design principles? Explain HTTP methods.',
      hasSkill('GraphQL') && 'Compare GraphQL vs REST. What are the tradeoffs?',
      'How do you handle authentication in web applications?',
      'Explain CORS and how to handle it in web applications.'
    );
  }

  // Cloud/DevOps Questions
  if (hasCategory('cloudDevOps')) {
    questions.push(
      'What is the difference between Docker containers and virtual machines?',
      'Explain CI/CD pipeline. What tools have you used?',
      hasSkill('AWS') && 'What AWS services have you used? Explain EC2, S3, and Lambda.',
      hasSkill('Kubernetes') && 'Explain Kubernetes architecture: pods, services, deployments.'
    );
  }

  // Testing Questions
  if (hasCategory('testing')) {
    questions.push(
      'What is the testing pyramid? Explain unit, integration, and e2e tests.',
      'What is the difference between TDD and BDD?',
      hasSkill('Jest') && 'How do you mock dependencies in Jest?'
    );
  }

  // OS/Networks Questions
  if (hasSkill('OS') || hasSkill('Operating System')) {
    questions.push(
      'Explain process vs thread. What resources do they share?',
      'What is virtual memory? How does paging work?',
      'Explain deadlock: conditions and prevention strategies.'
    );
  }

  if (hasSkill('Networks') || hasSkill('Computer Networks')) {
    questions.push(
      'Explain the OSI model. What happens at each layer?',
      'What is the difference between TCP and UDP?',
      'How does DNS work? Explain the resolution process.'
    );
  }

  // General questions if list is short
  if (questions.length < 10) {
    questions.push(
      'Tell me about a challenging project you worked on. What was your role?',
      'How do you keep up with new technologies in your field?',
      'Describe a time when you had to debug a difficult issue. How did you approach it?',
      'What is your approach to learning a new technology or framework?'
    );
  }

  // Return first 10 unique questions
  return [...new Set(questions)].slice(0, 10);
}
