# Jones County XC

A full-stack web application with React frontend and Go backend.

## Project Structure

```
jones-county-xc/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Go HTTP server
├── docs/             # Documentation
└── README.md         # This file
```

## Prerequisites

- **Node.js** (v18 or higher) - for frontend
- **Go** (v1.21 or higher) - for backend
- **npm** or **yarn** - package manager

## Getting Started

### Frontend Setup

The frontend is built with React, Vite, and Tailwind CSS.

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### Frontend Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Setup

The backend is a Go HTTP server with CORS enabled.

```bash
cd backend
go run main.go
```

The backend will be available at `http://localhost:8080`

#### API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/hello` - Hello world endpoint

#### Backend Commands

- `go run main.go` - Start development server
- `go build` - Build binary
- `go test ./...` - Run tests

## Development

### Running Both Services

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
go run main.go
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Making API Calls from Frontend

The backend has CORS enabled, so you can make requests from the frontend:

```javascript
fetch('http://localhost:8080/api/hello')
  .then(res => res.json())
  .then(data => console.log(data))
```

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Go** - Programming language
- **net/http** - Standard library HTTP server

## Project Information

This project uses a monorepo structure with separate frontend and backend directories.

## License

MIT
