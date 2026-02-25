/**
 * Test Checklist Storage and Management
 * Persists test completion status to localStorage
 */

const TEST_CHECKLIST_KEY = 'placement_readiness_test_checklist';

export const TEST_ITEMS = [
  {
    id: 'jd-required',
    label: 'JD required validation works',
    hint: 'Go to /analyze, try submitting empty JD. Should show error blocking submission.',
    page: '/analyze'
  },
  {
    id: 'short-jd-warning',
    label: 'Short JD warning shows for <200 chars',
    hint: 'Type less than 200 characters in JD field. Amber warning should appear below textarea.',
    page: '/analyze'
  },
  {
    id: 'skills-extraction',
    label: 'Skills extraction groups correctly',
    hint: 'Paste a JD with React, Node.js, SQL. Verify skills appear in correct categories on Results.',
    page: '/analyze'
  },
  {
    id: 'round-mapping',
    label: 'Round mapping changes based on company + skills',
    hint: 'Try "Google" (enterprise) vs "StartupXYZ" (startup). Round timeline should differ.',
    page: '/analyze'
  },
  {
    id: 'score-deterministic',
    label: 'Score calculation is deterministic',
    hint: 'Analyze same JD twice. Base score should be identical both times.',
    page: '/analyze'
  },
  {
    id: 'skill-toggles',
    label: 'Skill toggles update score live',
    hint: 'On Results page, toggle skills between "Know" and "Practice". Score should update immediately.',
    page: '/results'
  },
  {
    id: 'persist-after-refresh',
    label: 'Changes persist after refresh',
    hint: 'Toggle some skills, refresh page. Toggles and score should remain.',
    page: '/results'
  },
  {
    id: 'history-save-load',
    label: 'History saves and loads correctly',
    hint: 'Create analysis, go to /history. Entry should appear. Click to view details.',
    page: '/history'
  },
  {
    id: 'export-buttons',
    label: 'Export buttons copy the correct content',
    hint: 'On Results page, click Copy buttons. Paste elsewhere to verify content matches.',
    page: '/results'
  },
  {
    id: 'no-console-errors',
    label: 'No console errors on core pages',
    hint: 'Open browser DevTools, navigate through /analyze, /results, /history. Check for red errors.',
    page: 'all'
  }
];

/**
 * Get current checklist state from localStorage
 * @returns {Object} - Map of testId -> boolean
 */
export function getTestChecklist() {
  try {
    const data = localStorage.getItem(TEST_CHECKLIST_KEY);
    if (!data) {
      // Initialize with all false
      const initial = {};
      TEST_ITEMS.forEach(item => {
        initial[item.id] = false;
      });
      return initial;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading test checklist:', error);
    const initial = {};
    TEST_ITEMS.forEach(item => {
      initial[item.id] = false;
    });
    return initial;
  }
}

/**
 * Save checklist state to localStorage
 * @param {Object} checklist - Map of testId -> boolean
 */
export function saveTestChecklist(checklist) {
  try {
    localStorage.setItem(TEST_CHECKLIST_KEY, JSON.stringify(checklist));
  } catch (error) {
    console.error('Error saving test checklist:', error);
  }
}

/**
 * Toggle a test item's completion status
 * @param {string} testId - Test item ID
 * @returns {Object} - Updated checklist
 */
export function toggleTestItem(testId) {
  const checklist = getTestChecklist();
  checklist[testId] = !checklist[testId];
  saveTestChecklist(checklist);
  return checklist;
}

/**
 * Get count of passed tests
 * @returns {number} - Number of passed tests
 */
export function getPassedCount() {
  const checklist = getTestChecklist();
  return Object.values(checklist).filter(Boolean).length;
}

/**
 * Check if all tests are passed
 * @returns {boolean} - True if all 10 tests passed
 */
export function areAllTestsPassed() {
  return getPassedCount() === TEST_ITEMS.length;
}

/**
 * Reset all test items to unchecked
 */
export function resetTestChecklist() {
  const initial = {};
  TEST_ITEMS.forEach(item => {
    initial[item.id] = false;
  });
  saveTestChecklist(initial);
  return initial;
}

/**
 * Get test item by ID
 * @param {string} testId - Test item ID
 * @returns {Object|null} - Test item or null
 */
export function getTestItem(testId) {
  return TEST_ITEMS.find(item => item.id === testId) || null;
}
