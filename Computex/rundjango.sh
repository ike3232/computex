#!/bin/bash

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Collect static files (if needed)
# Uncomment the following line if you have static files to collect
# python manage.py collectstatic --noinput

# Run additional management commands (if needed)
# Uncomment and add any additional management commands you need to run before starting the server

# Start Django server
echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000
