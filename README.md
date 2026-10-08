# Ya Basa – Kitchen & Bar

Connected React + Express + PostgreSQL/Prisma restaurant website, prepared for Docker, Kubernetes and AWS.

**Contact:** 7058485934

## Local
Terminal 1:
```powershell
cd backend
npm install
copy .env.example .env
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

Terminal 2:
```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Docker
From project root:
```powershell
docker compose up --build
```
Open http://localhost:8080

## Minikube
```powershell
docker build -t ya-basa-backend:1.0 ./backend
docker build -t ya-basa-frontend:1.0 ./frontend
minikube image load ya-basa-backend:1.0
minikube image load ya-basa-frontend:1.0
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl get pods
minikube service ya-basa-frontend
```

## AWS
See `docs/AWS-DEPLOYMENT.md`. The production architecture is ECR + EKS + ALB + RDS PostgreSQL + Secrets Manager + CloudWatch + Route 53.

Live Razorpay credentials, cloud credentials and production secrets are intentionally not included.
