#!/bin/bash

# Configuration
PORT=3000
APP_DIR="/Users/chiru/Desktop/globestrat_full/application/video-pwa"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔═══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   Video PWA - Restart & Tunnel Tool   ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════╝${NC}\n"

# Kill all related processes
echo -e "${YELLOW}🔍 Cleaning up existing processes...${NC}"

# Kill processes on port 3000
echo -e "${BLUE}   Checking port ${PORT}...${NC}"
PID_PORT=$(lsof -ti:${PORT} 2>/dev/null)
if [ -n "$PID_PORT" ]; then
    echo -e "${RED}   Found process(es) on port ${PORT}: $PID_PORT${NC}"
    kill -9 $PID_PORT 2>/dev/null
    echo -e "${GREEN}   ✓ Killed process on port ${PORT}${NC}"
else
    echo -e "${GREEN}   ✓ Port ${PORT} is free${NC}"
fi

# Kill any existing cloudflared processes
echo -e "${BLUE}   Checking for cloudflared tunnels...${NC}"
PID_CLOUDFLARED=$(pgrep -f "cloudflared.*localhost:${PORT}" 2>/dev/null)
if [ -n "$PID_CLOUDFLARED" ]; then
    echo -e "${RED}   Found cloudflared process(es): $PID_CLOUDFLARED${NC}"
    kill -9 $PID_CLOUDFLARED 2>/dev/null
    echo -e "${GREEN}   ✓ Killed existing tunnel${NC}"
else
    echo -e "${GREEN}   ✓ No existing tunnels${NC}"
fi

# Kill any vite processes for this project
echo -e "${BLUE}   Checking for vite dev servers...${NC}"
PID_VITE=$(pgrep -f "vite.*--port ${PORT}" 2>/dev/null)
if [ -n "$PID_VITE" ]; then
    echo -e "${RED}   Found vite process(es): $PID_VITE${NC}"
    kill -9 $PID_VITE 2>/dev/null
    echo -e "${GREEN}   ✓ Killed existing vite server${NC}"
else
    echo -e "${GREEN}   ✓ No vite servers running${NC}"
fi

# Wait for cleanup
sleep 2

# Navigate to app directory
cd "$APP_DIR" || exit 1

# Start the Vite dev server in the background
echo -e "\n${CYAN}🚀 Starting Vite dev server...${NC}"
npm run dev -- --port $PORT --host > /tmp/vite-${PORT}.log 2>&1 &
VITE_PID=$!

# Wait for server to start
echo -e "${YELLOW}   Waiting for server to initialize...${NC}"
sleep 5

# Check if Vite is running
if ! ps -p $VITE_PID > /dev/null 2>&1; then
    echo -e "${RED}   ✗ Failed to start Vite server${NC}"
    echo -e "${YELLOW}   Check logs: cat /tmp/vite-${PORT}.log${NC}"
    exit 1
fi

# Verify server is responding
for i in {1..10}; do
    if curl -s http://localhost:${PORT} > /dev/null 2>&1; then
        echo -e "${GREEN}   ✓ Server is responding${NC}"
        break
    fi
    if [ $i -eq 10 ]; then
        echo -e "${RED}   ✗ Server not responding${NC}"
        exit 1
    fi
    sleep 1
done

echo -e "\n${GREEN}✓ Local server running:${NC}"
echo -e "  ${BLUE}→${NC} http://localhost:${PORT}"
echo -e "  ${BLUE}→${NC} http://$(ipconfig getifaddr en0 2>/dev/null || echo "local-ip"):${PORT}\n"

# Set up tunnel
echo -e "${CYAN}🌐 Setting up Cloudflare Tunnel...${NC}"

if command -v cloudflared >/dev/null 2>&1; then
    cloudflared tunnel --url http://localhost:${PORT} 2>&1 | while IFS= read -r line; do
        if [[ $line =~ https://[a-zA-Z0-9-]+\.trycloudflare\.com ]]; then
            URL="${BASH_REMATCH[0]}"
            echo -e "\n${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
            echo -e "${GREEN}║  🎉 TUNNEL ACTIVE!                                        ║${NC}"
            echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
            echo -e "${CYAN}Public URL:${NC} ${YELLOW}${URL}${NC}\n"
            echo -e "${BLUE}Press Ctrl+C to stop the server and tunnel${NC}\n"
        fi
        echo "$line"
    done
else
    echo -e "${RED}✗ cloudflared not found!${NC}"
    echo -e "${YELLOW}Install with: brew install cloudflare/cloudflare/cloudflared${NC}"
    echo -e "\n${BLUE}Server is running locally at http://localhost:${PORT}${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
    wait $VITE_PID
fi

# Cleanup on exit
trap "echo -e '\n${YELLOW}🛑 Shutting down...${NC}'; kill $VITE_PID 2>/dev/null; pkill -f 'cloudflared.*localhost:${PORT}' 2>/dev/null; exit" INT TERM
