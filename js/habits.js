// ─── habits.js ────────────────────────────────────────────────────────────────
// Core habit logic: create, delete, toggle, streak calc, weekly data.
// ──────────────────────────────────────────────────────────────────────────────

import { getHabits, saveHabits } from './storage.js';

/**
 * Returns today's date as a YYYY-MM-DD string.
 */
function getTodayStr() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Creates a new habit object with default values.
 * @param {string} name - The habit name
 * @returns {Object} New habit object
 */
function createHabit(name) {
    return {
        id: Date.now().toString(),
        name: name.trim(),
        completedDates: [],
        createdAt: getTodayStr()
    };
}

/**
 * Adds a new habit and persists it.
 * @param {string} name - Habit name
 * @returns {Object} The newly created habit
 */
function addHabit(name) {
    if (!name || !name.trim()) return null;
    const habits = getHabits();
    const habit = createHabit(name);
    habits.push(habit);
    saveHabits(habits);
    return habit;
}

/**
 * Deletes a habit by id.
 * @param {string} id - Habit id to remove
 */
function deleteHabit(id) {
    const habits = getHabits().filter(h => h.id !== id);
    saveHabits(habits);
}

/**
 * Toggles today's completion for a habit.
 * @param {string} id - Habit id
 */
function toggleHabitToday(id) {
    const habits = getHabits();
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const today = getTodayStr();
    const idx = habit.completedDates.indexOf(today);
    if (idx === -1) {
        habit.completedDates.push(today);
    } else {
        habit.completedDates.splice(idx, 1);
    }

    saveHabits(habits);
}

/**
 * Calculates the current streak (consecutive days) for a habit.
 * Streak counts today or yesterday as the anchor point.
 * @param {Object} habit
 * @returns {number} Streak count in days
 */
function calculateStreak(habit) {
    if (!habit.completedDates.length) return 0;

    // Sort dates descending
    const sorted = [...habit.completedDates].sort((a, b) => (a < b ? 1 : -1));

    const today = getTodayStr();
    const yesterday = (() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return d.toISOString().split('T')[0];
    })();

    // Streak must start from today or yesterday
    if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

    let streak = 1;
    for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1]);
        const curr = new Date(sorted[i]);
        const diffDays = Math.round((prev - curr) / 86400000);
        if (diffDays === 1) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

/**
 * Returns whether a habit was completed today.
 * @param {Object} habit
 * @returns {boolean}
 */
function isCompletedToday(habit) {
    return habit.completedDates.includes(getTodayStr());
}

/**
 * Returns a 7-element array (last 7 days) of 0/1 completion flags.
 * Index 0 = 6 days ago, index 6 = today.
 * @param {Object} habit
 * @returns {number[]}
 */
function getWeeklyData(habit) {
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const str = d.toISOString().split('T')[0];
        return habit.completedDates.includes(str) ? 1 : 0;
    });
}

export {
    addHabit,
    deleteHabit,
    toggleHabitToday,
    calculateStreak,
    isCompletedToday,
    getWeeklyData,
    getTodayStr
};
