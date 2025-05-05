# Smart Issue Tracker - Architecture Overview

## 1. Product Vision & Scope

A **Smart Issue Tracker** that lets users enter just a short, free-text description of a problem.  
Behind the scenes an AI service (OpenAI/Gemini) automatically:

- Classifies the issue (bug, feature, support, etc.)
- Infers priority, affected product area and best-fit team
- Enriches the ticket with a concise summary and suggested next steps

The goal is to minimize manual ticket triage while keeping the overall architecture _small + composable_.

## 2. Technology Stack

| Concern                  | Technology                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| **UI**                   | React + Vite + TypeScript, Redux, TailwindCSS                                              |
| **Services**             | Java 21 + Spring Boot + Hibernate (via Spring Data JPA)                                    |
| **APIs**                 | REST (external), gRPC (service-to-service), GraphQL gateway                                |
| **Persistence**          | PostgreSQL (relational domain data), MongoDB (search & analytics), Redis (caching/session) |
| **Messaging / Eventing** | Apache Kafka (AMQP)                                                                        |
| **AI**                   | OpenAI / Gemini API                                                                        |
| **Storage**              | AWS S3 (file attachments)                                                                  |
| **CI & Packaging**       | Jenkins → Docker                                                                           |
| **Runtime**              | Kubernetes (AWS EKS) + ingress-nginx                                                       |

## 3. Microservice Landscape

| Service                  | Key Responsibilities                                                  | Data Store               | Interfaces                                  |
| ------------------------ | --------------------------------------------------------------------- | ------------------------ | ------------------------------------------- |
| **api-gateway**          | Single edge entrypoint, GraphQL resolver, rate-limit, auth forwarding | –                        | **REST** in, **GraphQL** out, **gRPC** down |
| **auth-service**         | JWT issuance/validation, OAuth2 login                                 | PostgreSQL               | REST                                        |
| **issue-service**        | Core CRUD, status workflow                                            | PostgreSQL               | gRPC, publishes Kafka events                |
| **ai-service**           | Calls OpenAI/Gemini, maps raw text → structured labels                | –                        | gRPC, consumes Kafka                        |
| **notification-service** | Email/WebSocket/Slack notices                                         | Redis (ephemeral queues) | gRPC, consumes Kafka                        |
| **file-service**         | Presigned S3 URLs, metadata                                           | PostgreSQL               | REST                                        |
| **search-service**       | Denormalised searchable copy of tickets                               | MongoDB                  | gRPC                                        |
| **report-service**       | Aggregates analytics                                                  | MongoDB + PostgreSQL     | gRPC                                        |
| **infra-observability**  | Logs/metrics/traces (Spring Boot Actuator, Grafana stack)             | –                        | –                                           |

Kafka topics (AMQP): `issue.created`, `issue.categorized`, `issue.updated`, `notification.sent`.

## 4. End-to-End Data & Event Flow (Happy Path)

1. **User ↔ UI**  
   _React + Redux_ posts a **GraphQL `createIssue`** mutation to **api-gateway**.
2. **api-gateway**  
   _Validates JWT via `auth-service`_ → translates GraphQL → **gRPC** call to **issue-service**.
3. **issue-service**  
   _Writes provisional ticket_ in **PostgreSQL** → emits **`issue.created`** event on **Kafka**.
4. **ai-service** (Kafka consumer)  
   _Calls OpenAI/Gemini_ → gets category, priority, summary → emits **`issue.categorized`**.
5. **issue-service** (Kafka consumer)  
   _Enriches ticket_ with AI fields, moves status to `TRIAGED`.
6. **search-service** (Kafka consumer)  
   _Indexes/updates_ MongoDB for full-text search.
7. **notification-service** (Kafka consumer)  
   _Sends "Issue triaged" email & WebSocket push_; result goes to Redis for quick read-back.
8. **UI** subscribes to a WebSocket feed (proxied by **api-gateway**) and shows live updates.

## 5. Domain Models

### PostgreSQL (issue-service)

| Table         | Columns (essential)                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| `issues`      | `id PK`, `title`, `description`, `status`, `category`, `priority`, `team`, `created_at`, `updated_at` |
| `users`       | `id PK`, `email`, `name`, `role`                                                                      |
| `attachments` | `id PK`, `issue_id FK`, `s3_key`, `filename`, `size`                                                  |

### MongoDB (search-service)

One **`tickets`** collection storing denormalised documents:

```json
{
  "_id": "…",
  "title": "…",
  "description": "…",
  "category": "bug",
  "priority": "high",
  "team": "payments",
  "status": "TRIAGED",
  "updatedAt": "…"
}
```

Redis holds ephemeral **`notification:{issueId}`** lists and short-lived **session tokens**.

## 6. API Contracts

- **GraphQL** (`POST /graphql`)
  ```graphql
  type Mutation {
    createIssue(input: CreateIssueInput!): Issue!
  }
  ```
- **REST** (`POST /files/presign`)
  ```
  Authorization: Bearer <jwt>
  { "filename": "screenshot.png", "mimeType": "image/png" }
  ```
- **gRPC** (`IssueService.proto`)
  ```proto
  rpc CreateIssue (CreateIssueRequest) returns (IssueResponse);
  rpc EnrichIssue  (EnrichIssueRequest)  returns (google.protobuf.Empty);
  ```

Kafka topics follow **AMQP** naming; key = `issueId`, value = Avro/Protobuf payload.

## 7. Operational Notes

- **Schema migration:** Flyway for PostgreSQL (invoked in the entry-point script) — within Spring Boot.
- **Fail-fast local dev:** `docker-compose up` spins Kafka, Postgres, Mongo, Redis and a single instance of each service.
- **Secrets:** Pull from AWS Secrets Manager via IRSA; no hard-coded credentials.
- **Zero downtime deploys:** Kubernetes rolling updates + readiness/liveness probes.
