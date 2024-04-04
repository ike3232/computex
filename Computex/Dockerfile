# Use an official Python runtime as a parent image
FROM python

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /code

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client

# Install Python dependencies
COPY requirements.txt /code/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /code
COPY . /code/

# Expose port 8000 to the outside world
EXPOSE 8000

# Apply database migrations and start Django server
CMD python manage.py migrate && python manage.py runserver 0.0.0.0:8000
