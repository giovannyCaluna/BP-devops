#!/bin/bash

HOST=$1

if [ -z "$HOST" ]; then
  echo "Usage: ./scripts/test_endpoint.sh <HOST_IP>"
  exit 1
fi

# Generate a fresh JWT
echo "Generating JWT..."
JWT=$(npx ts-node scripts/generate_token.ts --raw | tail -n 1)

if [ -z "$JWT" ]; then
    echo "Failed to generate JWT"
    exit 1
fi

echo "Testing Endpoint: http://$HOST/DevOps"
echo "Using API Key: 2f5ae96c-b558-4c7b-a590-a501ae1c3f6c"
echo "Using JWT: ${JWT:0:10}..."

# Run curl
curl -v -X POST \
-H "X-Parse-REST-API-Key: 2f5ae96c-b558-4c7b-a590-a501ae1c3f6c" \
-H "X-JWT-KWY: $JWT" \
-H "Content-Type: application/json" \
-d '{ "message" : "This is a test", "to": "Juan Perez", "from": "Rita Asturia", "timeToLifeSec" : 45 }' \
http://${HOST}/DevOps

echo -e "\nDone."
