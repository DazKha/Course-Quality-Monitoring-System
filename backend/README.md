# MOOC Quality Monitor - Backend

FastAPI backend for the MOOC Course Quality Prediction system.

## Setup

```bash
pip install -r requirements.txt
```

## Run

```bash
python main.py
```

Or with uvicorn:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- `GET /` - API health check
- `GET /api/historical-data` - Get historical analysis data (50 completed courses)
- `GET /api/ongoing-prediction` - Get time-series prediction data (5 at-risk courses)
- `GET /api/stats` - Get summary statistics

## Features

- Feature Engineering: Interaction Index & Sentiment Index
- Mock data generation with realistic patterns
- CORS enabled for frontend integration


