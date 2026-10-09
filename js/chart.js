// ─── chart.js ─────────────────────────────────────────────────────────────────
// Manages the Chart.js weekly bar chart — init & live updates.
// Depends on Chart.js loaded globally via CDN in index.html.
// ──────────────────────────────────────────────────────────────────────────────

import { getHabits } from './storage.js';
import { getWeeklyData } from './habits.js';

/** @type {Chart|null} */
let weeklyChart = null;

/**
 * Builds an array of short day labels for the last 7 days.
 * @returns {string[]} e.g. ["Mon", "Tue", ..., "Sun"]
 */
function getWeekLabels() {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return dayNames[d.getDay()];
    });
}

/**
 * Sums completions across all habits for each of the last 7 days.
 * @returns {number[]} Array of 7 total completion counts
 */
function getWeeklyCompletions() {
    const habits = getHabits();
    const totals = new Array(7).fill(0);
    habits.forEach(habit => {
        getWeeklyData(habit).forEach((val, i) => {
            totals[i] += val;
        });
    });
    return totals;
}

/**
 * Initialises the Chart.js bar chart on the canvas #weeklyChart.
 * Should be called once on DOMContentLoaded.
 */
function initChart() {
    const canvas = document.getElementById('weeklyChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Gradient fill for bars
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, 'rgba(124, 58, 237, 0.9)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0.5)');

    weeklyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: getWeekLabels(),
            datasets: [{
                label: 'Habits Completed',
                data: getWeeklyCompletions(),
                backgroundColor: gradient,
                borderColor: 'rgba(124, 58, 237, 1)',
                borderWidth: 2,
                borderRadius: 10,
                borderSkipped: false,
                hoverBackgroundColor: 'rgba(139, 92, 246, 0.95)',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 800,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 10, 40, 0.92)',
                    titleColor: '#a78bfa',
                    bodyColor: '#e2e8f0',
                    borderColor: 'rgba(124, 58, 237, 0.4)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 10,
                    callbacks: {
                        label: (ctx) => {
                            const v = ctx.raw;
                            return `  ${v} habit${v !== 1 ? 's' : ''} completed`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: 'rgba(203, 213, 225, 0.6)',
                        font: { family: 'Inter', size: 12 }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.06)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(203, 213, 225, 0.7)',
                        font: { family: 'Inter', size: 12, weight: '500' }
                    },
                    grid: { display: false },
                    border: { display: false }
                }
            }
        }
    });
}

/**
 * Refreshes the chart data without re-creating the chart instance.
 * Call this after any habit state change.
 */
function updateChart() {
    if (!weeklyChart) return;
    weeklyChart.data.datasets[0].data = getWeeklyCompletions();
    weeklyChart.data.labels = getWeekLabels();
    weeklyChart.update();
}

export { initChart, updateChart };
