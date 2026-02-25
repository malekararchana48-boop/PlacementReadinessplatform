// Known enterprise companies list
const enterpriseCompanies = [
  'amazon', 'microsoft', 'google', 'apple', 'meta', 'facebook',
  'infosys', 'tcs', 'tata consultancy', 'wipro', 'accenture',
  'ibm', 'oracle', 'cisco', 'intel', 'qualcomm', 'nvidia',
  'adobe', 'salesforce', 'vmware', 'dell', 'hp', 'hewlett packard',
  'capgemini', 'cognizant', 'hcl', 'tech mahindra', 'larsen & toubro',
  'lti', 'mindtree', 'persistent', 'zoho', 'freshworks',
  'samsung', 'lg', 'sony', 'panasonic', 'toyota', 'honda',
  'jpmorgan', 'goldman sachs', 'morgan stanley', 'wells fargo',
  'bank of america', 'citibank', 'hsbc', 'deutsche bank',
  'deloitte', 'ey', 'ernst & young', 'kpmg', 'pwc', 'pricewaterhouse'
];

// Industry keywords for inference
const industryKeywords = {
  'Finance': ['bank', 'finance', 'fintech', 'payment', 'insurance', 'trading', 'investment'],
  'Healthcare': ['health', 'medical', 'pharma', 'biotech', 'hospital', 'clinical'],
  'E-commerce': ['ecommerce', 'retail', 'shopping', 'marketplace', 'delivery'],
  'Technology': ['software', 'saas', 'cloud', 'ai', 'ml', 'data', 'cybersecurity'],
  'Education': ['education', 'learning', 'edtech', 'training', 'academy'],
  'Entertainment': ['media', 'entertainment', 'gaming', 'streaming', 'content']
};

/**
 * Company size categories
 */
export const COMPANY_SIZE = {
  STARTUP: 'startup',
  MIDSIZE: 'midsize',
  ENTERPRISE: 'enterprise'
};

/**
 * Get company size based on name heuristic
 * @param {string} companyName - Company name
 * @returns {string} - Size category
 */
export function getCompanySize(companyName) {
  if (!companyName || companyName.trim().length === 0) {
    return COMPANY_SIZE.STARTUP;
  }

  const normalized = companyName.toLowerCase().trim();
  
  // Check against known enterprise list
  for (const enterprise of enterpriseCompanies) {
    if (normalized.includes(enterprise)) {
      return COMPANY_SIZE.ENTERPRISE;
    }
  }

  // Default to startup for unknown companies
  return COMPANY_SIZE.STARTUP;
}

/**
 * Get company size display info
 * @param {string} size - Size category
 * @returns {Object} - Display info
 */
export function getCompanySizeInfo(size) {
  switch (size) {
    case COMPANY_SIZE.ENTERPRISE:
      return {
        label: 'Enterprise',
        range: '2000+ employees',
        description: 'Large established organization'
      };
    case COMPANY_SIZE.MIDSIZE:
      return {
        label: 'Mid-size',
        range: '200–2000 employees',
        description: 'Growing organization'
      };
    case COMPANY_SIZE.STARTUP:
    default:
      return {
        label: 'Startup',
        range: '<200 employees',
        description: 'Early stage company'
      };
  }
}

/**
 * Infer industry from company name and JD text
 * @param {string} companyName - Company name
 * @param {string} jdText - Job description text
 * @returns {string} - Industry name
 */
export function inferIndustry(companyName, jdText) {
  const text = `${companyName || ''} ${jdText || ''}`.toLowerCase();
  
  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return industry;
      }
    }
  }
  
  return 'Technology Services';
}

/**
 * Get typical hiring focus based on company size
 * @param {string} size - Company size category
 * @returns {Object} - Hiring focus details
 */
export function getHiringFocus(size) {
  switch (size) {
    case COMPANY_SIZE.ENTERPRISE:
      return {
        title: 'Structured Fundamentals',
        description: 'Emphasis on strong CS fundamentals, structured problem-solving, and scalable system design.',
        keyAreas: [
          'Data Structures & Algorithms (rigorous)',
          'Core CS fundamentals (OS, DBMS, Networks)',
          'System Design at scale',
          'Coding best practices & code review',
          'Behavioral & leadership principles'
        ]
      };
    case COMPANY_SIZE.MIDSIZE:
      return {
        title: 'Balanced Skill Set',
        description: 'Mix of fundamental knowledge and practical implementation skills.',
        keyAreas: [
          'DSA with practical applications',
          'Full-stack or specialized depth',
          'Problem-solving in business context',
          'Collaboration & communication',
          'Adaptability to changing requirements'
        ]
      };
    case COMPANY_SIZE.STARTUP:
    default:
      return {
        title: 'Practical Problem Solving',
        description: 'Focus on hands-on skills, quick learning, and end-to-end ownership.',
        keyAreas: [
          'Practical coding & shipping features',
          'Stack depth in relevant technologies',
          'Problem-solving with limited resources',
          'Ownership & initiative',
          'Cultural fit & adaptability'
        ]
      };
  }
}

/**
 * Generate complete company intel
 * @param {string} companyName - Company name
 * @param {string} jdText - Job description text
 * @returns {Object} - Complete company intel
 */
export function generateCompanyIntel(companyName, jdText) {
  if (!companyName || companyName.trim().length === 0) {
    return null;
  }

  const size = getCompanySize(companyName);
  const sizeInfo = getCompanySizeInfo(size);
  const industry = inferIndustry(companyName, jdText);
  const hiringFocus = getHiringFocus(size);

  return {
    name: companyName,
    size,
    sizeLabel: sizeInfo.label,
    sizeRange: sizeInfo.range,
    sizeDescription: sizeInfo.description,
    industry,
    hiringFocus
  };
}
