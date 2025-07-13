# Pokemon Catalog API

A REST API for browsing Pokemon catalogs, managing user favorites, and providing authentication services.

## Prerequisites

- **Docker** and **Docker Compose** installed
- **Node.js** >= 20.0.0 (for local development)
- **Yarn** >= 1.0.0 (for local development)

## Development Setup

### Start the Application (Dev Mode)

```bash
# Start all services (API + PostgreSQL)
yarn docker:dev

# Or run in background
yarn docker:up

# View logs
yarn docker:logs
```

The API will be available at: **http://localhost:3000**

**API Documentation:** http://localhost:3000/api/docs

## Quick Start

Once your application is running at `http://localhost:3000`, you can start using the API:

### 1. Create Account
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourpassword",
    "name": "Your Name"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Your Name"
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourpassword"
  }'
```

**Response:** Same as register (token + user data)

### 3. Use the API

**Get Pokemon List:**
```bash
curl -X GET "http://localhost:3000/api/pokemon?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Search Pokemon:**
```bash
curl -X GET "http://localhost:3000/api/pokemon?q=charizard" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Filter by Type:**
```bash
curl -X GET "http://localhost:3000/api/pokemon?type=fire" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Get Your Favorites:**
```bash
curl -X GET "http://localhost:3000/api/pokemon?favorites=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Add to Favorites:**
```bash
curl -X POST http://localhost:3000/api/pokemon/25/favorite \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Remove from Favorites:**
```bash
curl -X DELETE http://localhost:3000/api/pokemon/25/favorite \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Get Pokemon Details:**
```bash
curl -X GET http://localhost:3000/api/pokemon/25 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Tech Stack

- **Framework**: Fastify
- **Database**: PostgreSQL with MikroORM
- **Authentication**: JWT + bcrypt
- **Testing**: Jest