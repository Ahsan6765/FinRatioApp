How to build and run


Build the image:
docker build -t finlyzerapp:latest .

Run locally:
docker run --rm -e PORT=3000 -p 3000:3000 --name finlyzerapp finlyzerapp:latest


 docker images
REPOSITORY    TAG       IMAGE ID       CREATED          SIZE
finlyzerapp   latest    0c223b09f58f   54 minutes ago   1.25GB