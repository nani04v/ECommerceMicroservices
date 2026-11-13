# E-Commerce Microservices Architecture

## Overview
An E-Commerce application built using a microservices architecture.

## Technology Stack
- Backend: ASP.NET Core / .NET 10
- Frontend: React 19 and Vite
- Database: Microsoft SQL Server
- ORM: Entity Framework Core
- Authentication: JWT
- Password Hashing: BCrypt
- Containerization: Podman
- Orchestration: Kubernetes (Kind)
- API Gateway: Envoy Gateway
- CI/CD: GitHub Actions and Azure Pipelines

## Microservices

### User Service
Handles user management, authentication, and authorization.

### Product Service
Manages products, categories, and inventory.

### Order Service
Handles customer orders and order management.

### Payment Service
Handles payment-related operations.

### Admin Password Reset Tool
Provides an administrator password utility.

## Frontend
The React frontend supports product browsing, login, cart management, checkout, orders, and administration.

## Database
Backend services use Entity Framework Core and SQL Server.

## Security
- JWT-based authentication.
- BCrypt password hashing.
- Protected API endpoints.
- Role-based authorization where configured.
- Sensitive configuration should be stored securely.

## Deployment
Backend services include Containerfiles. Kubernetes manifests are maintained in the `k8s` directory.

## CI/CD
GitHub Actions workflows are maintained in `.github/workflows`. Azure Pipelines configuration is also included.

## Request Flow
1. User interacts with the React frontend.
2. Frontend sends a request to the backend or configured gateway.
3. The relevant microservice processes the request.
4. The service accesses its database.
5. The API returns a response.

## High-Level Architecture

```text
          React Frontend
                |
                v
           API Gateway
                |
      +---------+---------+
      |         |         |
      v         v         v
    User     Product    Order
   Service   Service   Service
                         |
                         v
                   Payment Service

                    SQL Server
```

Note: This is a conceptual diagram. Actual routing and database connections depend on deployment configuration.
