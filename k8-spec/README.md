# Kubernetes Specs for FinlyzerApp

This directory contains Kubernetes manifests for deploying the FinlyzerApp Node.js application on a kubeadm cluster.


## Files
- `deployment.yaml`: Deploys the app with 2 replicas, readiness/liveness probes, resource requests/limits, and persistent volume mount.
- `service.yaml`: Exposes the app via NodePort on port 80 (maps to container 3000).
- `ingress.yaml`: Ingress resource for routing traffic (host: finlyzer.local).
- `configmap.yaml`: Non-sensitive environment variables.
- `secret.yaml`: Sensitive environment variables (base64 encoded).
- `persistent-volume.yaml`: Defines PersistentVolume and PersistentVolumeClaim for app data storage.
- `network-policy.yaml`: Restricts pod network access for security.

## Usage
1. Build and push your Docker image to a registry accessible by your cluster (or use local images).
2. Apply manifests:
   ```sh
   kubectl apply -f k8-spec/persistent-volume.yaml
   kubectl apply -f k8-spec/configmap.yaml
   kubectl apply -f k8-spec/secret.yaml
   kubectl apply -f k8-spec/deployment.yaml
   kubectl apply -f k8-spec/service.yaml
   kubectl apply -f k8-spec/ingress.yaml
   kubectl apply -f k8-spec/network-policy.yaml
   ```
3. Update `/etc/hosts` to point `finlyzer.local` to your cluster IP for local testing.
4. Ensure NGINX Ingress Controller is installed if using ingress.


## Notes
- Edit `configmap.yaml` and `secret.yaml` for your environment variables.
- For production, use a real domain and TLS (cert-manager).
- You can scale replicas in `deployment.yaml` as needed.
- Persistent storage is mounted at `/usr/src/app/data` in the container.
- Network policy restricts traffic to only allowed pods in the namespace.
