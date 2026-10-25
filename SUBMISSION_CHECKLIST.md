# Submission checklist

- [ ] Open `camunda/leave-request.bpmn` in Camunda Modeler and confirm no validation errors.
- [ ] Confirm your Camunda 8 version matches the `8.8.9` starter and image tags, or change them together.
- [ ] Run `docker compose up -d` and wait for the stack to start.
- [ ] Run `cd backend && mvn clean package`.
- [ ] Run `cd frontend && npm install && npm run build`.
- [ ] Open the UI at http://localhost:5173 (local development) or http://localhost:3000 (Docker).
- [ ] Submit a valid annual-leave request and confirm it appears in My Requests and Manager Inbox.
- [ ] Approve one request and reject another; verify status and annual balance.
- [ ] Test insufficient balance, invalid dates, sick leave, and unpaid leave.
- [ ] Check Camunda Operate at http://localhost:8082 and Tasklist at http://localhost:8083.
- [ ] Push the repository to GitHub and submit its URL in Classroom.

## API routes
- `POST /api/leaves`
- `GET /api/leaves?employeeEmail=student@example.com`
- `GET /api/leaves/pending`
- `GET /api/leaves/balance?employeeEmail=student@example.com`
- `POST /api/leaves/{id}/decision` with `{"approved":true,"comment":"Looks good"}`
