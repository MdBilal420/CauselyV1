# syntax=docker/dockerfile:1

# Use an official Python runtime
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install pipx and poetry/pdm (replace with your actual tool)
RUN pip install pipx && pipx install poetry

# Copy pyproject.toml and install dependencies
COPY pyproject.toml poetry.lock* ./
RUN pipx run poetry install --no-root

# Copy the rest of your application
COPY . .

# Expose port
EXPOSE 8080

# Start server (make sure to use host/port for Cloud Run)
CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
