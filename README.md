# Dashen AI Business Consultant System

MERN stack MVP for an AI-powered financial advisory and business consulting platform for Dashen Bank customers.

## What Is Included

- React + Vite frontend with customer, SME, advisor, and admin workflows
- Node.js + Express backend with JWT authentication and role-based access
- Demo data repositories for accounts, transactions, savings goals, investments, consultations, alerts, reports, and admin analytics
- MongoDB-ready Mongoose schemas for production persistence
- Docker and Docker Compose deployment files
- Production frontend build verified with Vite

## Main Modules

- Authentication and profile preferences
- Customer financial dashboard
- AI recommendations
- AI chat assistant
- Savings goals
- Investment portfolio
- SME business insights
- Human consultation requests
- Notifications center
- Monthly reports
- Admin analytics, users, services, and audit logs

## Demo Users

| Role | Email | Password |
| --- | --- | --- |
| Customer | customer@dashen.ai | password123 |
| SME Customer | sme@dashen.ai | password123 |
| Advisor | advisor@dashen.ai | password123 |
| Admin | admin@dashen.ai | password123 |

## Local Development

```bash
npm install
npm run dev
```

Frontend: http://127.0.0.1:5173

Backend: http://127.0.0.1:5000/api/health

If you run client and server separately:

```bash
npm run dev --workspace server
npm run dev --workspace client
```

## Production Build

```bash
npm run build
npm run start
```

## Docker Deployment

```bash
docker compose up --build
```

Frontend: http://localhost:8080

Backend: http://localhost:5000/api/health

## Production Notes

This version runs immediately with demo data. The next production step is replacing the demo repositories with Mongoose repositories, connecting Dashen core banking APIs, and wiring the AI adapter to a reviewed AI service.
