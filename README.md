# Leave Application System

Full-stack student project based on the supplied assignment guides: Camunda 8 BPMN workflow, React + TypeScript frontend, Spring Boot REST backend, H2 database, and Docker Compose.

## Features
- Employee submits leave request (Annual, Sick, Unpaid)
- My Requests view and annual leave balance
- Manager inbox with approve/reject and comment
- BPMN workflow with validation and finalisation workers
- H2 persistence for local development
- Camunda Operate/Tasklist and REST/gRPC ports documented in the compose setup

## Important
This is a coursework starter implementation. You must run it locally and verify it before submission. Camunda 8 images and Spring Boot starter APIs can change between releases; if your environment uses a different Camunda minor version, align the starter version and Docker images. Do not claim the application was tested unless you run the checks below.

## Requirements
- Java 21
- Maven 3.9+
- Node.js 20+
- Docker Desktop with Compose

## Run locally
1. Start Camunda stack: `docker compose up -d` from the repository root. Wait until containers are healthy.
2. In terminal 1: `cd backend && mvn spring-boot:run`
3. In terminal 2: `cd frontend && npm install && npm run dev`
4. Open http://localhost:5173

Spring Boot API: http://localhost:8081  
Camunda REST: http://localhost:8080  
Camunda gRPC: localhost:26500  
H2 console: http://localhost:8081/h2-console (JDBC URL `jdbc:h2:file:./data/leavedb`, user `sa`, blank password)

## GitHub submission
Create a new GitHub repository, extract this ZIP, put the contents (the `README.md`, `backend`, `frontend`, `camunda`, and `docker-compose.yml`) in the repository root, commit and push. Copy the repository URL into Classroom.

## Workflow
The BPMN process ID is `leave-request`. Service task job types are `validate-leave` and `finalize-leave`. The manager task uses form key `leave-approval`.
