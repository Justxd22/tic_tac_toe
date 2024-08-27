# Tic-Tac-Toe Backend Deployment Guide

This guide outlines the steps to deploy the Tic-Tac-Toe backend using Docker and MongoDB.

## Prerequisites

- Docker and Docker Compose installed on your system
- Git installed on your system

## Deployment Steps

1. Clone the repository:

   ```sh
   git clone https://github.com/Justxd22/tic_tac_toe.git
   cd tic-tac-toe
   ```

2. Create a `.env` file in the project root with the following content:

   ```text
   FLASK_ENV=production
   CORS_ORIGINS=http://localhost:3000,https://s1cario.tech
   DEBUG=FLASK
   HOST_NAME=localhost
   APP_PORT=3000
   MONGO_DB_NAME=tic_tac_toe
   SECRET_KEY=FLASK-tic_tac_toe-APP
   MONGO_USERNAME=mongodb-username
   MONGO_PASSWORD=mongodb-password
   MONGO_URI=mongodb://mongodb-username:mongodb-password@mongodb:27017
   ```

   Adjust the values as needed, especially `MONGO_USERNAME`, `MONGO_PASSWORD`, and `SECRET_KEY`.

3. Ensure your `docker-compose.yml` file is in the project root and contains the provided configuration.

4. Build and start the Docker containers:

   ```sh
   docker-compose up --build -d
   ```

5. The backend should now be running on `http://localhost:3000` (or the host and port you specified).

## Configuration

The application uses different configuration classes based on the environment:

- `BaseConfig`: Default configuration
- `ProductionConfig`: Production-specific configuration

These are defined in `config/__init__.py`. The application will use `ProductionConfig` when `FLASK_ENV` is set to `production` in the `.env` file.

## MongoDB

MongoDB is running in a separate container and is accessible to the backend service. The database name is set to `tic_tac_toe` by default.

## Ports

- Backend: 3000
- MongoDB: 27017

## Volumes

- MongoDB data is persisted using a named volume `mongodb_data`

## Logging

Logs can be viewed using:

```sh
docker-compose logs
```

To follow logs in real-time:

```sh
docker-compose logs -f
```

## Stopping the Application

To stop the application:

```sh
docker-compose down
```

To stop the application and remove volumes:

```sh
docker-compose down -v
```

## Updating the Application

1. Pull the latest changes from the repository
2. Rebuild and restart the containers:

   ```sh
   docker-compose up --build -d
   ```

## Troubleshooting

1. If the backend can't connect to MongoDB, ensure the `MONGO_URI` in the `.env` file is correct.
2. For any changes in the `.env` file, you need to rebuild the containers.
3. Ensure the ports 3000 and 27017 are not being used by other applications on your host machine.

## Security Notes

- In a production environment, ensure to use strong, unique passwords for MongoDB.
- The `SECRET_KEY` should be a long, random string in production.
- Consider using a reverse proxy like Nginx in front of the backend for additional security.
- Restrict CORS origins to only the domains you trust.

## Scaling

This setup uses a single backend instance. For scaling:

1. Consider using a container orchestration system like Kubernetes.
2. Implement a load balancer in front of multiple backend instances.
3. Use a managed MongoDB service for better scalability and management.
