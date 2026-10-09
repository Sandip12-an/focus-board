// ─── storage.js ───────────────────────────────────────────────────────────────
// Handles all localStorage read/write for habits data.
// ──────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'focusboard_habits';

/**
 * Retrieves all habits from localStorage.
 * @returns {Array} Array of habit objects
 */
function getHabits() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to load habits from storage:', e);
        return [];
    }
}

/**
 * Saves the full habits array to localStorage.
 * @param {Array} habits - Array of habit objects to persist
 */
function saveHabits(habits) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (e) {
        console.error('Failed to save habits to storage:', e);
    }
}

export { getHabits, saveHabits };
