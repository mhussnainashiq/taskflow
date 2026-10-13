# TaskFlow — Manage Your Projects

A modern, full-stack project & task management application with Kanban boards, team collaboration, progress tracking, and a beautiful dark theme.

![TaskFlow](https://img.shields.io/badge/MERN-Stack-blue) ![React](https://img.shields.io/badge/React-18-61DAFB) ![Node.js](https://img.shields.io/badge/Node.js-LTS-339933) ![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248)

## Features

- **Kanban Boards** — Drag-style status columns (To Do → In Progress → Review → Done)
- **Projects** — Create and manage multiple projects
- **Tasks** — Full CRUD with priority, due dates, and assignees
- **Team Dashboard** — Member overview, progress bar, pie chart, recent activity
- **Authentication** — JWT-based register / login with protected routes
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Dark Theme** — Professional navy/blue design matching modern product standards

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, React Router, Context API, Lucide React, Recharts |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB + Mongoose                 |
| Auth      | JWT + bcryptjs                      |
| Styling   | Custom CSS (no Tailwind)            |

## Project Structure

```
taskflow/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # UI, layout, common components
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Route pages
│   │   ├── services/       # API client
│   │   └── utils/          # Helpers
│   └── package.json
├── server/                 # Express API
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth + error handler
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Seed script
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18+ 
- MongoDB running locally (or MongoDB Atlas URI)
- npm or yarn

## Installation (Windows PowerShell)

### 1. Clone / extract the project

```powershell
cd path\to\taskflow
```

### 2. Backend setup

```powershell
cd server
npm install
copy .env.example .env
# Edit .env if needed (MongoDB URI, JWT secret)
npm run seed          # Loads demo data
npm run dev           # Starts API on http://localhost:5000
```

### 3. Frontend setup (new terminal)

```powershell
cd client
npm install
npm run dev           # Starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## Demo Accounts

After running the seed script:

| Email               | Password    |
|---------------------|-------------|
| alex@taskflow.com   | password123 |
| sarah@taskflow.com  | password123 |
| mike@taskflow.com   | password123 |
| emily@taskflow.com  | password123 |
| david@taskflow.com  | password123 |

## Environment Variables

**server/.env**

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## API Endpoints

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| POST   | /api/auth/register              | Register                 |
| POST   | /api/auth/login                 | Login                    |
| GET    | /api/auth/me                    | Current user             |
| GET    | /api/projects                   | List projects            |
| POST   | /api/projects                   | Create project           |
| GET    | /api/projects/:id               | Get project              |
| PUT    | /api/projects/:id               | Update project           |
| DELETE | /api/projects/:id               | Delete project           |
| GET    | /api/projects/:id/stats         | Project stats + activity |
| GET    | /api/projects/:projectId/tasks  | List tasks               |
| POST   | /api/projects/:projectId/tasks  | Create task              |
| PUT    | /api/tasks/:id                  | Update task              |
| DELETE | /api/tasks/:id                  | Delete task              |

## Screenshots

Add screenshots of:
1. Login page
2. Kanban board (Website Redesign)
3. Team Dashboard with chart
4. Mobile view

Place images in a `/screenshots` folder and reference them here.

## GitHub Setup

```powershell
git init
git add .
git commit -m "Initial commit: TaskFlow MERN project management app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/taskflow.git
git push -u origin main
```

**Suggested repository topics:** `mern`, `react`, `nodejs`, `mongodb`, `kanban`, `project-management`, `task-tracker`, `jwt-auth`

## Portfolio Description

> **TaskFlow** is a full-stack project management application built with the MERN stack. It features Kanban boards, task prioritization, team collaboration views, progress tracking with charts, and JWT authentication. Designed with a modern dark UI and fully responsive layout.

## License

MIT
