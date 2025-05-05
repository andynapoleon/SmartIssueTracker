# 🧠 Smart Issue Tracker 💡

A modern issue tracking system powered by AI that automatically classifies, prioritizes, and enriches tickets.

## Overview

This project provides an intelligent issue tracking system that uses AI to streamline the ticket management process. Users enter a simple free-text description of a problem, and the system automatically:

- Classifies the issue (bug, feature, support, etc.)
- Infers priority, affected product area, and best-fit team
- Enriches the ticket with a concise summary and suggested next steps

## Architecture

The application uses a microservices architecture:

- Frontend: React + Vite + TypeScript, Redux, TailwindCSS
- Backend: Java 21 + Spring Boot microservices
- APIs: REST, gRPC, GraphQL
- Databases: PostgreSQL, MongoDB, Redis
- Messaging: Apache Kafka
- AI: OpenAI/Gemini API
- Storage: AWS S3
- Deployment: Jenkins, Docker, Kubernetes (AWS EKS)

## Getting Started

### Prerequisites

- Node.js 18+
- Java 21 JDK
- Docker and Docker Compose
- PostgreSQL, MongoDB, Redis
- Kafka

### Development Setup

1. Clone the repository
2. Start the infrastructure services:
   ```
   docker-compose up -d
   ```
3. Start the frontend:
   ```
   cd client
   npm install
   npm run dev
   ```
4. Start the backend services (each service separately):
   ```
   cd server/services/[service-name]
   ./gradlew bootRun
   ```

For full documentation, see the `docs` directory.
