#!/bin/bash

# Stop script on error
set -e

IMAGE_TAG=$1

if [ -z "$IMAGE_TAG" ]; then
  echo "Error: Image tag is required."
  exit 1
fi

echo "Deploying version: $IMAGE_TAG"

# Export variables for docker-compose
export IMAGE_TAG=$IMAGE_TAG

# Login to Docker Hub (optional if public, but good practice)
# echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin

# Pull the new image
docker pull giovacaluna96/tata:$IMAGE_TAG

# Update the running service
# We use docker-compose up -d to recreate containers with the new image
# Note: This assumes docker-compose.yml is present in the same directory
docker compose up -d --no-deps --build app

# Prune old images to save space
docker image prune -f

echo "Deployment successful!"
