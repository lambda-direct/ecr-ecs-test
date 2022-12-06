#!/usr/bin/env bash
set -e

# Get current aws account id and region
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION="us-east-1"

# Authenticate in ECR
aws ecr get-login-password --profile ecs-ecr --region "$AWS_REGION" | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

# Build docker in every folder of containers folder and push to ECR
for d in containers/*; do
  if [ -d "$d" ]; then
    cd "$d"
    # Remove "containers/"
    IMAGE_NAME=${d#*/}
    echo "Building $IMAGE_NAME"
    docker build --platform=linux/amd64 -t "ecr-ecs/$IMAGE_NAME" .
    docker tag "ecr-ecs/$IMAGE_NAME" "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME"
    docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME"
    cd -
  fi
done

# pnpm run deploy
