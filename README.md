# Leave Application System

A web-based Leave Application System that allows employees to apply for leave and track requests while managers approve or reject applications.

## Features
- Submit leave applications
- View personal leave requests and their status
- Manager inbox for pending approvals
- Approve or reject leave requests with optional comments
- Track annual leave balance
- Camunda workflow integration

## Technologies
- React, TypeScript, Vite
- Java and Spring Boot
- H2 Database
- Camunda 8, Zeebe, Operate, and Tasklist
- Docker Compose

## Run locally

Start Docker Desktop, then open a terminal in the project folder:

```bash
docker compose up -d
```

Start the backend in a separate terminal:

```bash
cd backend
mvn spring-boot:run
```

Start the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite, usually http://localhost:5173/.

Keep Docker and both application terminals running while testing.
