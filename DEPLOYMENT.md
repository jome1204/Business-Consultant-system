# Deployment Runbook

## 1. Required Environment Variables

Create production environment variables for the API:

```bash
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-domain.example
JWT_SECRET=replace-with-a-long-random-secret
MONGODB_URI=mongodb://mongodb:27017/dashen_ai_consultant
```

Create the frontend build variable:

```bash
VITE_API_URL=https://your-api-domain.example/api
```

## 2. Local Verification

Run the production build:

```bash
npm run build
```

Start the API:

```bash
npm run start
```

Check health:

```bash
curl http://127.0.0.1:5000/api/health
```

## 3. Docker Deployment

Build and run all services:

```bash
docker compose up --build
```

Expected services:

- `client` on port `8080`
- `server` on port `5000`
- `mongodb` on port `27017`

## 4. Production Hardening Checklist

- Replace demo data repositories with MongoDB-backed repositories.
- Rotate `JWT_SECRET` and store it in a secret manager.
- Configure production CORS origins explicitly.
- Enable HTTPS at the load balancer or reverse proxy.
- Add SMS, email, and push notification providers.
- Connect core banking, KYC, AML, and payment APIs through secure adapters.
- Add advisor review workflows for high-risk AI recommendations.
- Add automated API, UI, security, and accessibility tests to CI.
- Configure monitoring, logs, alerts, backups, and disaster recovery.

## 5. Release Smoke Test

After deployment:

1. Open the frontend.
2. Log in with a customer account.
3. Confirm dashboard metrics load.
4. Send an AI assistant message.
5. Create a savings goal.
6. Request a consultation.
7. Log in as admin and confirm analytics load.
