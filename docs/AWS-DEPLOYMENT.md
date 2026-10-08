# AWS deployment path

Recommended production path: Route 53 -> ALB -> EKS -> frontend/backend pods -> RDS PostgreSQL.
Use ECR for images, Secrets Manager for secrets, CloudWatch for logs/metrics, and S3/Cloudinary for images.

## ECR
```powershell
$REGION="ap-south-1"
$ACCOUNT_ID=(aws sts get-caller-identity --query Account --output text)
aws ecr create-repository --repository-name ya-basa-backend --region $REGION
aws ecr create-repository --repository-name ya-basa-frontend --region $REGION
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
docker build -t ya-basa-backend:1.0 ./backend
docker build -t ya-basa-frontend:1.0 ./frontend
docker tag ya-basa-backend:1.0 "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/ya-basa-backend:1.0"
docker tag ya-basa-frontend:1.0 "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/ya-basa-frontend:1.0"
docker push "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/ya-basa-backend:1.0"
docker push "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/ya-basa-frontend:1.0"
```

## EKS
```powershell
eksctl create cluster --name ya-basa --region ap-south-1 --nodes 2
aws eks update-kubeconfig --region ap-south-1 --name ya-basa
kubectl get nodes
```
Replace local image names in the Kubernetes manifests with the ECR URIs, then apply the manifests.
For production, use RDS PostgreSQL instead of the sample in-cluster PostgreSQL deployment.
