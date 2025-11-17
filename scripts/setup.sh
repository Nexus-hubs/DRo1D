#!/bin/bash

# DRo1D Setup Script
# Quick deployment and development setup

set -e

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${CYAN}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Banner
echo -e "${CYAN}"
cat << "EOF"
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ██████╗ ██████╗  ██████╗  ██╗██████╗                 ║
║   ██╔══██╗██╔══██╗██╔═══██╗███║██╔══██╗                ║
║   ██║  ██║██████╔╝██║   ██║╚██║██║  ██║                ║
║   ██║  ██║██╔══██╗██║   ██║ ██║██║  ██║                ║
║   ██████╔╝██║  ██║╚██████╔╝ ██║██████╔╝                ║
║   ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚═╝╚═════╝                 ║
║                                                          ║
║              Quick Setup & Deployment                    ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Check prerequisites
log_info "Checking prerequisites..."

# Check for Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    log_success "Node.js $NODE_VERSION detected"
else
    log_warning "Node.js not found (optional for development tools)"
fi

# Check for Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    log_success "$PYTHON_VERSION detected"
else
    log_warning "Python 3 not found (needed for local server)"
fi

# Check for Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    log_success "$DOCKER_VERSION detected"
else
    log_warning "Docker not found (needed for containerized deployment)"
fi

echo ""

# Setup menu
echo -e "${CYAN}Select setup option:${NC}"
echo "  1) Development setup (install npm dependencies)"
echo "  2) Start local development server"
echo "  3) Build Docker image"
echo "  4) Run with Docker"
echo "  5) Run tests"
echo "  6) Run all checks (lint, test, format)"
echo "  7) Complete setup (all of the above)"
echo "  8) Exit"
echo ""
read -p "Enter option [1-8]: " option

case $option in
    1)
        log_info "Installing npm dependencies..."
        npm install
        log_success "Dependencies installed"
        ;;

    2)
        log_info "Starting development server..."
        if command -v python3 &> /dev/null; then
            log_info "Server running at http://localhost:8000"
            log_info "Press Ctrl+C to stop"
            python3 -m http.server 8000
        else
            log_error "Python 3 required for development server"
            exit 1
        fi
        ;;

    3)
        log_info "Building Docker image..."
        docker build -t dro1d:latest .
        log_success "Docker image built: dro1d:latest"
        ;;

    4)
        log_info "Running with Docker..."
        docker run -d -p 8080:80 --name dro1d dro1d:latest
        log_success "Container started"
        log_info "Access at http://localhost:8080"
        log_info "Stop with: docker stop dro1d"
        ;;

    5)
        log_info "Running tests..."
        npm test
        log_success "Tests complete"
        ;;

    6)
        log_info "Running all checks..."
        npm run validate
        log_success "All checks passed"
        ;;

    7)
        log_info "Running complete setup..."

        # Install dependencies
        log_info "Installing dependencies..."
        npm install
        log_success "Dependencies installed"

        # Run checks
        log_info "Running lint..."
        npm run lint
        log_success "Lint passed"

        log_info "Running tests..."
        npm test
        log_success "Tests passed"

        log_info "Checking formatting..."
        npm run format:check
        log_success "Formatting check passed"

        # Build Docker image
        if command -v docker &> /dev/null; then
            log_info "Building Docker image..."
            docker build -t dro1d:latest .
            log_success "Docker image built"
        fi

        log_success "Complete setup finished!"
        echo ""
        log_info "Next steps:"
        echo "  - Start development: npm run dev"
        echo "  - Run with Docker: docker run -p 8080:80 dro1d:latest"
        echo "  - View docs: open docs/ARCHITECTURE.md"
        ;;

    8)
        log_info "Setup cancelled"
        exit 0
        ;;

    *)
        log_error "Invalid option"
        exit 1
        ;;
esac

log_success "Done!"
