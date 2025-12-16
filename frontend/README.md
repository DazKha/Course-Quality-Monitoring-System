# MOOC Quality Monitor - Frontend

React + Vite frontend for the MOOC Course Quality Prediction system.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Features

- Dark mode UI (Slate-950 theme)
- Responsive design
- Two view modes:
  - Historical Analysis (Scatter Plot)
  - Ongoing Prediction (Time Series)
- Real-time API integration
- Interactive charts with tooltips
- Smooth transitions between views

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx       # Main dashboard with stats cards
│   ├── HistoricalView.jsx  # Scatter plot for historical data
│   ├── OngoingView.jsx     # Time series for ongoing courses
│   └── AboutUs.jsx         # Team information page
├── App.jsx                 # Main app component with navigation
├── main.jsx                # Entry point
└── index.css               # Global styles with Tailwind
```

## Dependencies

- `react` & `react-dom`: UI framework
- `recharts`: Chart library
- `lucide-react`: Icon library
- `tailwindcss`: Utility-first CSS
- `vite`: Build tool

## Environment

The frontend proxies API requests to `http://localhost:8000` (FastAPI backend).
Make sure the backend is running before starting the frontend.


