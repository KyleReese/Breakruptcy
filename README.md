# Breakruptcy 🕒

**Breakruptcy** is a visually polished, highly customizable productivity timer inspired by chess clocks and the philosophy of deliberate work. The only rule is that the work timer needs to complete before the break timer, otherwise you've gone _Breakrupt_.

This project was inspired by a powerful procrastination beating system shared by author Tim Urban of [Wait But Why](https://waitbutwhy.com/) during an interview on the _Win-Win with Liv Boeree_ podcast.

He describes a daily writing routine where he uses a chess clock to track two banks of time: 4 hours for focused work and 4 hours for break. The key idea is that whenever he’s not actively working, the break timer ticks down. Once he completes his 4 hours of deep work, the rest of the day is his to enjoy guilt-free. Which creates motivation to keep the break timer from ticking down as little as possible during the work day.

[📽️ Watch the moment](https://x.com/Liv_Boeree/status/1901711876318204315) | [🎧 Full interview](https://www.youtube.com/watch?v=YAf6DLiPNj0)

# 🚀 Live Demo

[View Live Application](https://kylereese.org/Breakruptcy/)

# Features

- ⚡ Chess Clock-style Timer: Switch actively between two timers (e.g. "Work" and "Break") with a single click.

- 🛠️ Fully Configurable: Customize labels and durations for both time banks. Comes with helpful presets like Pomodoro, Deep Work, and more.

- 💾 State Persistence: Timer state and configuration are automatically saved to localStorage and persist across refreshes.

- 🧠 UX-First Design: Clean, responsive UI built with React + TailwindCSS for a polished, user-friendly experience.

- ⏯️ Controls: Start, pause, switch, reset, and configure — everything you need to stay on track.

# Tech Stack

- Frontend: React 19 + TypeScript + TailwindCSS

- Tooling: Vite, ESLint, GitHub Actions (for deployment)

- Deployment: Automatically deployed to GitHub Pages via CI

# Quick Start

```
npm install
npm run dev
```

Then open your browser to http://localhost:5173.

# Project Structure

```
breakruptcy-client/
├── src/
│   ├── components/       # Timer UI components
│   ├── utils/            # Time formatting and state logic
│   ├── types/            # TypeScript types
│   └── App.tsx           # App logic and timer state
├── public/               # Static assets
├── index.html            # Main HTML file
└── vite.config.ts        # Vite configuration
```
