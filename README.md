# Roses & Clovers Properties

A property management web application for managing rental properties, tenants, and leases.

## Features

- **Public Website**: Browse available properties, view details, contact form
- **Admin Dashboard**: Manage properties, tenants, and lease agreements
- **Lease Management**: Track active, upcoming, and ended leases with overlapping prevention
- **Responsive Design**: Works on desktop and mobile with dark mode support

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **TanStack Query** - Data fetching and caching

### Backend
- **Go 1.21+** - REST API server
- **MySQL** - Database
- **Token-based auth** - Admin authentication

## Project Structure

```
roses-clovers-properties/
├── frontend/              # Next.js frontend
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   ├── data/            # Types and site config
│   └── lib/             # API client and utilities
├── backend/              # Go backend
│   ├── main.go          # API server
│   └── sql/             # Database schema
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Go 1.21+
- MySQL 8.0+

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE roses_clovers;
```

2. Run the schema migration:
```bash
mysql -u root -p roses_clovers < backend/sql/001_create_tables.sql
```

3. (Optional) Load seed data:
```bash
mysql -u root -p roses_clovers < backend/sql/002_seed_data.sql
```

### Backend Setup

1. Set environment variables:
```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_USER=root
export DB_PASSWORD=yourpassword
export DB_NAME=roses_clovers
export ADMIN_PASSWORD=admin123  # Change in production!
```

2. Run the server:
```bash
cd backend
go run main.go
```

The API will be available at `http://localhost:8080`

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Public
- `GET /api/properties` - List available properties (supports filters)
- `GET /api/properties/:id` - Get property details

### Admin (requires auth token)
- `POST /api/admin/login` - Login with password
- `POST /api/admin/logout` - Logout
- `GET /api/admin/me` - Check auth status
- `GET /api/admin/dashboard/stats` - Dashboard statistics

#### Properties
- `GET /api/admin/properties` - List all properties
- `POST /api/admin/properties` - Create property
- `PUT /api/admin/properties/:id` - Update property
- `DELETE /api/admin/properties/:id` - Delete property

#### Tenants
- `GET /api/admin/tenants` - List all tenants
- `POST /api/admin/tenants` - Create tenant
- `PUT /api/admin/tenants/:id` - Update tenant
- `DELETE /api/admin/tenants/:id` - Delete tenant

#### Leases
- `GET /api/admin/leases` - List all leases (supports status filter)
- `POST /api/admin/leases` - Create lease
- `PUT /api/admin/leases/:id` - Update lease
- `DELETE /api/admin/leases/:id` - Delete lease

## Admin Access

Default admin password: `admin123` (set via `ADMIN_PASSWORD` env var)

Access the admin panel at `/admin/login`

## Development

### Running Both Services

**Terminal 1 - Backend:**
```bash
cd backend && go run main.go
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

**Backend:**
```bash
cd backend
go build -o server main.go
./server
```

## License

MIT
