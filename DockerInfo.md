How to build and run


Build the image:
docker build -t finlyzerapp:latest .

Run locally:
docker run --rm -e PORT=3000 -p 3000:3000 --name finlyzerapp finlyzerapp:latest