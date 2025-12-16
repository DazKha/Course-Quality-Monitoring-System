#!/bin/bash

# Start script for Render deployment
echo "Starting MOOC Quality Monitor API..."

# Run with uvicorn
uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}

