# Gunicorn configuration for 512MB server
import multiprocessing
import os

# Bind
bind = "0.0.0.0:8000"

# Worker configuration - CRITICAL for 512MB
# Use 2 workers max for 512MB RAM
workers = int(os.getenv("WEB_CONCURRENCY", 2))
worker_class = "uvicorn.workers.UvicornWorker"

# Memory management
max_requests = 1000  # Restart workers after 1000 requests to prevent memory leaks
max_requests_jitter = 50
timeout = 30
keepalive = 5

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Preload app to save memory
preload_app = True

# Worker recycling
worker_tmp_dir = "/dev/shm"  # Use tmpfs for worker heartbeat





