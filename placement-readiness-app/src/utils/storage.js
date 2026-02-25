import { createStandardizedEntry, validateEntry, repairEntry } from './schema';

const STORAGE_KEY = 'placement_readiness_history';

/**
 * Generate unique ID
 * @returns {string} - Unique ID
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all history entries from localStorage with validation and repair
 * @returns {Object} - { entries: Array, corruptedCount: number, error: string|null }
 */
export function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { entries: [], corruptedCount: 0, error: null };
    }

    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      return { entries: [], corruptedCount: 0, error: null };
    }

    const validEntries = [];
    let corruptedCount = 0;

    parsed.forEach(entry => {
      // Try to validate
      const validation = validateEntry(entry);
      
      if (validation.isValid) {
        validEntries.push(entry);
      } else {
        // Try to repair
        const repaired = repairEntry(entry);
        if (repaired) {
          validEntries.push(repaired);
          corruptedCount++;
        } else {
          corruptedCount++;
        }
      }
    });

    // If any were corrupted, save the cleaned version
    if (corruptedCount > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validEntries));
    }

    const error = corruptedCount > 0 
      ? `One saved entry couldn't be loaded. Create a new analysis.` 
      : null;

    return { entries: validEntries, corruptedCount, error };
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return { entries: [], corruptedCount: 0, error: 'Failed to load history. Please try again.' };
  }
}

/**
 * Save a new analysis entry to localStorage
 * @param {Object} entry - Analysis entry to save
 * @returns {Object} - Saved entry with ID
 */
export function saveAnalysis(entry) {
  try {
    const { entries: history } = getHistory();
    
    // Create standardized entry
    const standardizedEntry = createStandardizedEntry({
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...entry
    });
    
    // Add to beginning of array (newest first)
    history.unshift(standardizedEntry);
    
    // Keep only last 50 entries to prevent storage issues
    const trimmedHistory = history.slice(0, 50);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    return standardizedEntry;
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
  const { entries } = getHistory();
  return entries.find(entry => entry.id === id) || null;
}

/**
 * Delete a history entry by ID
 * @param {string} id - Entry ID to delete
 * @returns {boolean} - Success status
 */
export function deleteHistoryEntry(id) {
  try {
    const { entries } = getHistory();
    const filtered = entries.filter(entry => entry.id !== id);
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
    const { entries } = getHistory();
    const entryIndex = entries.findIndex(entry => entry.id === id);
    
    if (entryIndex === -1) {
      return null;
    }
    
    // Get current entry
    const currentEntry = entries[entryIndex];
    
    // If skillConfidenceMap is being updated, recalculate finalScore
    let finalScore = currentEntry.finalScore;
    if (updates.skillConfidenceMap) {
      const baseScore = currentEntry.baseScore;
      let adjustment = 0;
      Object.values(updates.skillConfidenceMap).forEach(confidence => {
        adjustment += confidence === 'know' ? 2 : -2;
      });
      finalScore = Math.max(0, Math.min(100, baseScore + adjustment));
    }
    
    // Update the entry
    entries[entryIndex] = {
      ...currentEntry,
      ...updates,
      finalScore,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return entries[entryIndex];
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
