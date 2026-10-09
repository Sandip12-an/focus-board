// ─── app.js ───────────────────────────────────────────────────────────────────
// Entry point — wires up DOM events, renders habit cards, updates stats.
// ──────────────────────────────────────────────────────────────────────────────

import { getHabits } from './storage.js';
import {
    addHabit,
    deleteHabit,
    toggleHabitToday,
    calculateStreak,
    isCompletedToday
} from './habits.js';
import { initChart, updateChart } from './chart.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns a formatted long date string for the header. */
function formatDate() {
    return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/** Triggers a quick pop animation on an element. */
function popAnimate(el) {
    el.classList.remove('pop');
    void el.offsetWidth; // reflow
    el.classList.add('pop');
}

// ── Card Builder ─────────────────────────────────────────────────────────────

/**
 * Creates and returns a habit card DOM element.
 * @param {Object} habit
 * @returns {HTMLElement}
 */
function createHabitCard(habit) {
    const streak = calculateStreak(habit);
    const done = isCompletedToday(habit);

    const card = document.createElement('div');
    card.className = `habit-card${done ? ' completed' : ''}`;
    card.dataset.id = habit.id;
    card.setAttribute('role', 'listitem');

    card.innerHTML = `
        <div class="habit-left">
            <button class="check-btn${done ? ' checked' : ''}"
                    data-id="${habit.id}"
                    aria-label="${done ? 'Mark incomplete' : 'Mark complete'}"
                    title="${done ? 'Mark as incomplete' : 'Mark as done'}">
                <svg class="check-icon" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="3"
                     stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            </button>
            <div class="habit-info">
                <span class="habit-name">${escapeHtml(habit.name)}</span>
                <span class="habit-status ${done ? 'done' : 'pending'}">
                    ${done ? '✅ Done today' : '⏳ Pending'}
                </span>
            </div>
        </div>
        <div class="habit-right">
            <div class="streak-badge" title="${streak} day streak">
                <span class="streak-fire">${streak > 0 ? '🔥' : '💤'}</span>
                <span class="streak-count">${streak}</span>
                <span class="streak-label">day${streak !== 1 ? 's' : ''}</span>
            </div>
            <button class="delete-btn"
                    data-id="${habit.id}"
                    aria-label="Delete habit: ${escapeHtml(habit.name)}"
                    title="Delete habit">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                </svg>
            </button>
        </div>
    `;

    return card;
}

/** Safely escapes HTML to prevent XSS from user input. */
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ── Render ────────────────────────────────────────────────────────────────────

/** Re-renders the entire habit list and updates stats + chart. */
function renderHabits() {
    const list = document.getElementById('habitList');
    const empty = document.getElementById('emptyState');
    const habits = getHabits();

    list.innerHTML = '';

    if (habits.length === 0) {
        empty.style.display = 'flex';
        updateStats([], 0);
        updateChart();
        return;
    }

    empty.style.display = 'none';

    habits.forEach((habit, index) => {
        const card = createHabitCard(habit);
        // Stagger entrance animations
        card.style.animationDelay = `${index * 60}ms`;
        list.appendChild(card);
    });

    const doneCount = habits.filter(h => isCompletedToday(h)).length;
    updateStats(habits, doneCount);
    updateChart();
}

/** Updates the three stat cards and the progress bar. */
function updateStats(habits, doneCount) {
    const total = habits.length;
    const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statDone').textContent = doneCount;
    document.getElementById('statPct').textContent = `${pct}%`;
    document.getElementById('progressFill').style.width = `${pct}%`;

    // Colour the progress bar based on completion
    const fill = document.getElementById('progressFill');
    fill.className = 'progress-fill';
    if (pct === 100) fill.classList.add('full');
    else if (pct >= 50) fill.classList.add('half');
}

// ── Events ────────────────────────────────────────────────────────────────────

function setupEvents() {
    const form = document.getElementById('addHabitForm');
    const input = document.getElementById('habitInput');

    // ── Add habit ──
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = input.value.trim();
        if (!name) {
            input.classList.add('shake');
            input.addEventListener('animationend', () => input.classList.remove('shake'), { once: true });
            return;
        }

        addHabit(name);
        input.value = '';
        input.focus();
        renderHabits();

        // Animate the freshly added card
        const cards = document.querySelectorAll('.habit-card');
        const last = cards[cards.length - 1];
        if (last) {
            last.style.animationDelay = '0ms';
            last.classList.add('slide-in');
        }
    });

    // ── Toggle & Delete — event delegation ──
    document.getElementById('habitList').addEventListener('click', (e) => {
        const checkBtn = e.target.closest('.check-btn');
        const deleteBtn = e.target.closest('.delete-btn');

        if (checkBtn) {
            const id = checkBtn.dataset.id;
            toggleHabitToday(id);
            popAnimate(checkBtn);
            renderHabits();
        }

        if (deleteBtn) {
            const id = deleteBtn.dataset.id;
            const card = deleteBtn.closest('.habit-card');
            card.classList.add('slide-out');
            card.addEventListener('animationend', () => {
                deleteHabit(id);
                renderHabits();
            }, { once: true });
        }
    });

    // ── Keyboard shortcut: focus input with "/" ──
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== input) {
            e.preventDefault();
            input.focus();
        }
    });
}

// ── Init ──────────────────────────────────────────────────────────────────────

function init() {
    document.getElementById('currentDate').textContent = formatDate();
    setupEvents();
    renderHabits();
    initChart();
}

document.addEventListener('DOMContentLoaded', init);
