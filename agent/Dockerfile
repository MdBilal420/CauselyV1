# syntax=docker/dockerfile:1

# Use an official Python runtime
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install poetry directly
RUN pip install poetry

# Configure poetry to not create virtual environments and install in system
RUN poetry config virtualenvs.create false
RUN poetry config virtualenvs.in-project false

# Copy pyproject.toml and install dependencies
COPY pyproject.toml poetry.lock* ./
RUN poetry lock
RUN poetry install --no-root

# Copy the rest of your application
COPY . .

# Set PYTHONPATH to include the current directory
ENV PYTHONPATH=/app

# Expose port
EXPOSE 8080

# Run your main function directly with python (not poetry run)
CMD ["poetry", "run" ,"python", "-m", "src.my_endpoint.main"]