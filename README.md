# ⚡ Focus Board

> A clean, minimal **personal habit tracker** — built with pure HTML, CSS & Vanilla JavaScript. No frameworks, no backend. Just open and go.

![Focus Board Screenshot](assets/preview.png)

## ✨ Features

| Feature | Description |
|---|---|
| ➕ Add & delete habits | Quickly add named habits, remove ones you no longer need |
| ✅ Daily check-off | Mark habits as done for today with a satisfying click |
| 🔥 Streak counter | Per-habit streak tracking across consecutive days |
| 📊 Weekly bar chart | Visual 7-day completion overview powered by Chart.js |
| 💾 localStorage | All data persists in your browser — no account needed |
| 📱 Responsive | Works great on desktop, tablet, and mobile |
| ⌨️ Keyboard shortcut | Press `/` to instantly focus the habit input |

## 🚀 Getting Started

No build step needed. Just open `index.html` in any modern browser:

```bash
# Option 1: Open directly
double-click index.html

# Option 2: Use a local dev server (recommended)
npx serve .
# or
python -m http.server 8000
```

> ⚠️ The app uses ES Modules (`type="module"`), so it must be served via HTTP — not opened as a `file://` URL directly. Use a local server or deploy to GitHub Pages / Netlify.

## 📁 Folder Structure

```
Focus Board/
├── index.html          ← App shell
├── css/
│   └── style.css       ← All styles (dark theme, glassmorphism, animations)
├── js/
│   ├── app.js          ← Entry point & DOM logic
│   ├── habits.js       ← Add, delete, toggle, streak calculation
│   ├── storage.js      ← localStorage read/write
│   └── chart.js        ← Chart.js weekly bar chart
├── assets/
│   └── favicon.svg     ← App icon
└── README.md
```

## 🌐 Deployment

### GitHub Pages
1. Push this folder to a GitHub repository
2. Go to **Settings → Pages → Source: main branch / root**
3. Your app is live at `https://<username>.github.io/<repo-name>/`

### Netlify
1. Drag & drop the `Focus Board` folder onto [netlify.com/drop](https://netlify.com/drop)
2. Get an instant live URL — done!

## 🛠 Tech Stack

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties, Grid, Flexbox, animations, glassmorphism
- **Vanilla JavaScript (ES6+)** — Modules, localStorage, event delegation
- **[Chart.js 4](https://www.chartjs.org/)** — Weekly bar chart via CDN

## 📄 License

MIT — Free to use and modify.
