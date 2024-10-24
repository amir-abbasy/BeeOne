#!/bin/bash

# Navigate to React app directory
cd ./Frondend

# Install React app dependencies
echo "Installing React app dependencies..."
npm install

# Start React app
echo "Starting React app..."
npm run dev &

# Wait for React app to start
echo "Waiting for React app to launch..."
sleep 10

# Get the React app URL
APP_URL="http://localhost:2024"

# Open the app in the browser
echo "Opening React app in the browser..."
start $APP_URL

# Navigate to Node.js app directory
cd ../Node

# Install Node.js app dependencies
echo "Installing Node.js app dependencies..."
npm install

# Start Node.js app and show logs
echo "Starting Node.js app and showing logs..."
npm start
