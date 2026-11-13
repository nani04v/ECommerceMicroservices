# 🛒 E-Commerce Microservices Platform

A full-stack E-Commerce application built using **.NET 10, React, SQL Server, Podman, Kubernetes, and GitHub Actions**.

## 🚀 Project Overview

This project implements an E-Commerce platform using a microservices architecture. It separates business functionality into independent services and provides a React-based frontend for customers and administrators.

## 🏗️ Technology Stack

| Component | Technology |
|---|---|
| Backend | ASP.NET Core .NET 10 |
| Frontend | React 19, Vite |
| Database | Microsoft SQL Server |
| Authentication | JWT |
| ORM | Entity Framework Core |
| Containerization | Podman |
| Orchestration | Kubernetes (Kind) |
| API Gateway | Envoy Gateway |
| CI/CD | GitHub Actions |
| Container Registry | GitHub Container Registry |

## 📁 Project Structure

```text
ECommerceMicroservices/
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml
│
├── OrderService/
├── PaymentService/
├── ProductService/
├── UserService/
│
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── Containerfile
│   └── package.json
│
├── AdminPasswordResetTool/
│
├── k8s/
│   └── ghcr/
│
├── scripts/
├── docs/
├── tests/
│
├── .gitignore
└── README.md
```

## ⚙️ Microservices

- **User Service:** User registration, authentication, and JWT-based authorization.
- **Product Service:** Product and category management, inventory operations, and bulk Excel import.
- **Order Service:** Order processing and order-related operations.
- **Payment Service:** Payment processing functionality.

## 🖥️ Frontend Features

- Customer registration and login.
- Product listing and product details.
- Shopping cart.
- Checkout.
- Order management.
- Admin dashboard.
- Product, category, and inventory management.
- Bulk product import.

## ☸️ Kubernetes and Deployment

The application uses Kubernetes to deploy and manage its microservices.

The repository includes Kubernetes manifests for backend services and the React frontend, along with GHCR deployment manifests.

The local development environment uses:

- Podman
- Kind Kubernetes cluster
- Envoy Gateway
- Kubernetes Secrets

## 🔄 CI/CD Pipeline

GitHub Actions is configured to:

1. Build backend microservices.
2. Install and build the React frontend.
3. Build and publish container images to GitHub Container Registry.
4. Deploy application manifests to Kubernetes using a self-hosted runner.

## 🛠️ Local Setup

### Prerequisites

Install the following tools:

- .NET 10 SDK
- Node.js 22 or later
- SQL Server
- Podman
- Kind
- kubectl
- Git

### Clone the repository

```powershell
git clone https://github.com/nani04v/ECommerceMicroservices.git

cd ECommerceMicroservices
```

### Run the frontend

```powershell
cd Frontend

npm install

npm run dev
```

### Build the backend

From the project root, build each service using its respective project file:

```powershell
dotnet build
```

If the root does not contain a solution file, build the individual service projects separately.

## 🔐 Security

- JWT-based authentication.
- Role-based authorization.
- Password hashing using BCrypt.
- Kubernetes Secrets for sensitive configuration.
- Environment-based application configuration.

Do not commit passwords, JWT signing keys, database credentials, or other secrets.

## 📦 GitHub Repository

**Repository:** https://github.com/nani04v/ECommerceMicroservices

## 👩‍💻 Project

E-Commerce Microservices Platform

Developed using modern full-stack technologies and containerized microservices architecture.
