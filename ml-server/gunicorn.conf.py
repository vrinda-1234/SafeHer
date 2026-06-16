# gunicorn.conf.py
# Place this file in the same directory as app.py

import os

# --- Worker settings ---
workers = 1          # Free tier has ~512MB RAM; YAMNet alone is ~200MB, so keep 1 worker
threads = 2          # Use threads for concurrent requests instead of more workers
worker_class = "gthread"

# --- Timeout ---
# Default is 30s — way too short for YAMNet to load.
# 300s gives the model time to download + initialise on cold start.
timeout = 300
graceful_timeout = 30
keepalive = 5

# --- Preload app ---
# Loads app.py (and therefore YAMNet + classifier) in the MASTER process
# before forking workers. Workers inherit the loaded model via fork(),
# so they start instantly and share the same memory pages.
preload_app = True

# --- Binding ---
bind = f"0.0.0.0:{os.environ.get('PORT', '8000')}"

# --- Logging ---
loglevel = "info"
accesslog = "-"   # stdout
errorlog = "-"    # stdout