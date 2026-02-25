const STORAGE_KEY = 'placement_readiness_history';

/**
 * Generate unique ID
 * @returns {string} - Unique ID
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all history entries from localStorage
 * @returns {Array} - Array of history entries
 */
export function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

/**
 * Save a new analysis entry to localStorage
 * @param {Object} entry - Analysis entry to save
 * @returns {Object} - Saved entry with ID
 */
export function saveAnalysis(entry) {
  try {
    const history = getHistory();
    const newEntry = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...entry
    };
    
    // Add to beginning of array (newest first)
    history.unshift(newEntry);
    
    // Keep only last 50 entries to prevent storage issues
    const trimmedHistory = history.slice(0, 50);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    return newEntry;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw new Error('Failed to save analysis. Storage may be full.');
  }
}

/**
 * Get a specific history entry by ID
 * @param {string} id - Entry ID
 * @returns {Object|null} - History entry or null if not found
 */
export function getHistoryEntry(id) {
  const history = getHistory();
  return history.find(entry => entry.id === id) || null;
}

/**
 * Delete a history entry by ID
 * @param {string} id - Entry ID to delete
 * @returns {boolean} - Success status
 */
export function deleteHistoryEntry(id) {
  try {
    const history = getHistory();
    const filtered = history.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
    return false;
  }
}

/**
 * Update a history entry by ID
 * @param {string} id - Entry ID to update
 * @param {Object} updates - Object with fields to update
 * @returns {Object|null} - Updated entry or null if not found
 */
export function updateHistoryEntry(id, updates) {
  try {
    const history = getHistory();
    const entryIndex = history.findIndex(entry => entry.id === id);
    
    if (entryIndex === -1) {
      return null;
    }
    
    // Update the entry
    history[entryIndex] = {
      ...history[entryIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return history[entryIndex];
  } catch (error) {
    console.error('Error updating localStorage:', error);
    return null;
  }
}

/**
 * Clear all history
 * @returns {boolean} - Success status
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

/**
 * Format date for display
 * @param {string} isoDate - ISO date string
 * @returns {string} - Formatted date
 */
export function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
