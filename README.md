# Sentinel Project

Sentinel is a real-time messaging and moderation platform designed to facilitate secure and clean communication. It is composed of several independent services that work together to provide a robust and scalable solution.

## Project Structure

The project is organized into the following main directories:

-   `apps/`: Contains the core applications of the Sentinel platform.
    -   `api/`: The RESTful API service for handling user authentication, channel management, and message persistence.
    -   `gateway/`: The WebSocket gateway responsible for real-time communication between clients and the backend services.
    -   `worker/`: A background worker service for processing tasks like message moderation and event handling.
-   `packages/`: Contains shared libraries and utilities used across different applications.
    -   `common/`: A package for shared types, constants, and event definitions.
-   `infra/`: Contains infrastructure-related configurations, such as Docker files and orchestration.
-   `docs/`: Documentation files related to the project architecture, moderation flow, and other aspects.

## Getting Started

To get started with the Sentinel project, follow these steps:

### Prerequisites

-   Node.js (v20 or higher recommended)
-   npm or Yarn (npm is used in the examples)
-   Docker and Docker Compose (for running local databases and services)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/sentinel.git
    cd sentinel
    ```

2.  **Install dependencies for each application and package:**

    ```bash
    # For the API application
    cd apps/api
    npm install
    cd ../..

    # For the Gateway application
    cd apps/gateway
    npm install
    cd ../..

    # For the Worker application
    cd apps/worker
    npm install
    cd ../..

    # For the Common package
    cd packages/common
    npm install
    cd ../../..
    ```

## Running the Applications

Each application can be run independently.

### API Service

The API service handles user authentication, channel management, and message persistence.

```bash
cd apps/api
npm run dev # For development with hot-reloading
# Or
npm start # For production build
```

### Gateway Service

The Gateway service manages WebSocket connections for real-time communication.

```bash
cd apps/gateway
npm run dev # For development with hot-reloading
# Or
npm start # For production build
```

### Worker Service

The Worker service processes background tasks, such as message moderation.

```bash
cd apps/worker
npm run dev # For development with hot-reloading
# Or
npm start # For production build
```

## Build Instructions

To build the TypeScript source code for each application:

```bash
# For the API application
cd apps/api
npm run build
cd ../..

# For the Gateway application
cd apps/gateway
npm run build
cd ../..

# For the Worker application
cd apps/worker
npm run build
cd ../..
```

## Docker Setup (Optional)

You can use Docker Compose to set up local instances of PostgreSQL and Redis, which are used by the Sentinel services.

```bash
cd infra
docker-compose up -d
```

This will start PostgreSQL and Redis containers in the background.

## Contributing

We welcome contributions! Please see our `CONTRIBUTING.md` (if available) for guidelines on how to contribute to this project.

## License

This project is licensed under the ISC License.

