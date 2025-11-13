# Kubernetes Specs for FinlyzerApp

This directory contains Kubernetes manifests for deploying the FinlyzerApp Node.js application on a kubeadm cluster.

## Files
- `deployment.yaml`: Deploys the app with 2 replicas, readiness/liveness probes.
- `service.yaml`: Exposes the app via NodePort on port 80 (maps to container 3000).
- `ingress.yaml`: Ingress resource for routing traffic (host: finlyzer.local).
- `configmap.yaml`: Non-sensitive environment variables.
- `secret.yaml`: Sensitive environment variables (base64 encoded).

## Usage
1. Build and push your Docker image to a registry accessible by your cluster (or use local images).
2. Apply manifests:
   ```sh
   kubectl apply -f k8-spec/configmap.yaml
   kubectl apply -f k8-spec/secret.yaml
   kubectl apply -f k8-spec/deployment.yaml
   kubectl apply -f k8-spec/service.yaml
   kubectl apply -f k8-spec/ingress.yaml
   ```
3. Update `/etc/hosts` to point `finlyzer.local` to your cluster IP for local testing.
4. Ensure NGINX Ingress Controller is installed if using ingress.

## Notes
- Edit `configmap.yaml` and `secret.yaml` for your environment variables.
- For production, use a real domain and TLS (cert-manager).
- You can scale replicas in `deployment.yaml` as needed.
