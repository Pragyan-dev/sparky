#!/bin/bash

# Configuration
PORT=3000
APP_DIR="/Users/chiru/Desktop/globestrat_full/application/video-pwa"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Video PWA Launcher ===${NC}\n"

# Function to kill process on port
kill_port() {
    local port=$1
    echo -e "${YELLOW}Checking for processes on port ${port}...${NC}"

    # Find PID using lsof (works on macOS and Linux)
    PID=$(lsof -ti:${port})

    if [ -n "$PID" ]; then
        echo -e "${RED}Found process(es) on port ${port}: $PID${NC}"
        echo -e "${YELLOW}Killing process(es)...${NC}"
        kill -9 $PID 2>/dev/null
        sleep 1
        echo -e "${GREEN}Port ${port} is now free${NC}"
    else
        echo -e "${GREEN}Port ${port} is already free${NC}"
    fi
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Kill any process on the port
kill_port $PORT

# Navigate to app directory
cd "$APP_DIR" || exit 1

# Start the Vite dev server in the background
echo -e "\n${BLUE}Starting Vite dev server on port ${PORT}...${NC}"
npm run dev -- --port $PORT --host &
VITE_PID=$!

# Wait for server to start
echo -e "${YELLOW}Waiting for server to start...${NC}"
sleep 5

# Check if Vite is running
if ! ps -p $VITE_PID > /dev/null; then
    echo -e "${RED}Failed to start Vite server${NC}"
    exit 1
fi

echo -e "${GREEN}Vite server is running on http://localhost:${PORT}${NC}"
echo -e "${GREEN}Local network: http://$(ipconfig getifaddr en0):${PORT}${NC}\n"

# Set up tunnel
echo -e "${BLUE}Setting up tunnel...${NC}"

if command_exists cloudflared; then
    echo -e "${GREEN}Using Cloudflare Tunnel...${NC}"
    cloudflared tunnel --url http://localhost:${PORT}
elif command_exists ngrok; then
    echo -e "${GREEN}Using ngrok...${NC}"
    ngrok http ${PORT}
elif command_exists lt; then
    echo -e "${GREEN}Using localtunnel...${NC}"
    lt --port ${PORT}
else
    echo -e "${YELLOW}No tunnel tool found. Installing localtunnel...${NC}"
    npm install -g localtunnel
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Using localtunnel...${NC}"
        lt --port ${PORT}
    else
        echo -e "${RED}Failed to install localtunnel. Please install one of:${NC}"
        echo -e "${YELLOW}  - cloudflared: brew install cloudflare/cloudflare/cloudflared${NC}"
        echo -e "${YELLOW}  - ngrok: brew install ngrok${NC}"
        echo -e "${YELLOW}  - localtunnel: npm install -g localtunnel${NC}"
        echo -e "\n${BLUE}Server is still running locally at http://localhost:${PORT}${NC}"
        echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
        wait $VITE_PID
    fi
fi

# Cleanup on exit
trap "echo -e '\n${YELLOW}Shutting down...${NC}'; kill $VITE_PID 2>/dev/null; kill_port $PORT; exit" INT TERM
