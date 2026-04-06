# ALX Files Manager

A simple yet complete file management platform built with **Node.js**, **Express**, **MongoDB**, and **Redis**. It provides user authentication, file uploading, folder management, and token-based session handling — following a REST API design.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [License](#license)

---

## Features

- **User Registration & Authentication** — Sign up, sign in with Basic Auth, and receive a session token.
- **Token-based Sessions** — Auth tokens stored in Redis with a 24-hour TTL.
- **File Uploads** — Upload files and images (Base64-encoded) stored on disk.
- **Folder Management** — Create nested folder hierarchies.
- **File Listing with Pagination** — List files per folder with page-based pagination.
- **Status & Stats Endpoints** — Check Redis/MongoDB health and count users/files.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | HTTP server and routing |
| MongoDB | Persistent storage for users and file metadata |
| Redis | Ephemeral storage for authentication tokens |
| Babel | ES module transpilation |
| Mocha / Chai | Testing framework |

---

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v12.x or later)
- **MongoDB** (v3.6 or later)
- **Redis** (v5.0 or later)
- **npm** (Node Package Manager)

---

## Environment Variables

Create a `.env` file in the project root (or export variables in your shell). The application reads the following variables:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port the Express server listens on |
| `DB_HOST` | `localhost` | MongoDB host |
| `DB_PORT` | `27017` | MongoDB port |
| `DB_DATABASE` | `files_manager` | MongoDB database name |
| `REDIS_HOST` | `localhost` | Redis host |
| `REDIS_PORT` | `6379` | Redis port |
| `FOLDER_PATH` | `/tmp/files_manager` | Local folder for uploaded file storage |

Example `.env`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=27017
DB_DATABASE=files_manager
REDIS_HOST=localhost
REDIS_PORT=6379
FOLDER_PATH=/tmp/files_manager
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Elsmoil/alx-files_manager.git
cd alx-files_manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example values above into a `.env` file at the project root, or export them in your current shell session.

### 4. Start MongoDB and Redis

Make sure both services are running before starting the application:

```bash
# Start MongoDB (varies by OS/installation)
mongod --dbpath /data/db

# Start Redis
redis-server
```

---

## Running the Application

### Development (with auto-reload)

```bash
npm run start-server
```

### Run a Background Worker

```bash
npm run start-worker
```

### Lint the Code

```bash
npm run check-lint
```

### Run Tests

```bash
npm test
```

---

## API Endpoints

All routes are prefixed with `/api`.

### Application

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/status` | Returns Redis and MongoDB connection status |
| `GET` | `/api/stats` | Returns total number of users and files |

**Example response — `GET /api/status`:**
```json
{ "redis": true, "db": true }
```

**Example response — `GET /api/stats`:**
```json
{ "users": 12, "files": 34 }
```

---

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/users` | None | Register a new user |
| `GET` | `/api/users/me` | Token | Get the currently authenticated user |

**`POST /api/users` — Request body:**
```json
{ "email": "user@example.com", "password": "secret" }
```

**`POST /api/users` — Response `201`:**
```json
{ "id": "<user_id>", "email": "user@example.com" }
```

---

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/connect` | Basic Auth | Sign in and receive an auth token |
| `GET` | `/api/disconnect` | Token (`X-Token`) | Sign out and invalidate the token |

**`GET /api/connect`** — Requires `Authorization: Basic <base64(email:password)>` header.

**Response `200`:**
```json
{ "token": "91865dce-3b97-42e2-bf3b-3b9e8d4b9e0f" }
```

> The token is a randomly generated UUID v4 string. Include it in subsequent authenticated requests as the `X-Token` header.

---

### Files

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/files` | Token | Upload a file or create a folder |
| `GET` | `/api/files/:id` | Token | Retrieve metadata for a specific file |
| `GET` | `/api/files` | Token | List files (paginated, 20 per page) |
| `PUT` | `/api/files/:id/publish` | Token | Make a file public |
| `PUT` | `/api/files/:id/unpublish` | Token | Make a file private |
| `GET` | `/api/files/:id/data` | Optional | Get the content of a file |

**`POST /api/files` — Request body:**
```json
{
  "name": "myFile.txt",
  "type": "file",
  "data": "<Base64-encoded content>",
  "parentId": 0,
  "isPublic": false
}
```

Valid `type` values: `file`, `image`, `folder`.  
`data` is required for `file` and `image` types (Base64-encoded).  
`parentId` defaults to `0`, which represents the root directory. Pass an existing folder's ID to nest files inside it.

**List files — query parameters:**
- `parentId` (default `0`) — Filter by parent folder ID.
- `page` (default `0`) — Page number (20 items per page).

---

## Project Structure

```
alx-files_manager/
├── controllers/
│   ├── AppController.js      # Status and stats endpoints
│   ├── AuthController.js     # Sign in / sign out
│   ├── FilesController.js    # File CRUD operations
│   └── UsersController.js    # User registration and profile
├── routes/
│   └── index.js              # Route definitions
├── utils/
│   ├── db.js                 # MongoDB client wrapper
│   └── redis.js              # Redis client wrapper
├── .env                      # Environment variables (not committed)
├── .eslintrc.js              # ESLint configuration
├── babel.config.js           # Babel configuration
├── package.json              # Project metadata and scripts
└── server.js                 # Application entry point
```

---

## License

This project is open-source and available under the [ISC License](https://opensource.org/licenses/ISC).
