# PrismaPress Backend

<p align="center">
  <strong>TypeScript backend for a publishing platform with JWT authentication, post management, profile workflows, PostgreSQL persistence, and Stripe subscriptions.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white" alt="Stripe" />
</p>

---

## Overview

PrismaPress is a backend project for a content publishing platform. It currently supports account registration, JWT login and token refresh, authenticated profile management, post CRUD workflows, post search/filtering/pagination, administrative post statistics, and Stripe subscription checkout with webhook-based persistence.

The codebase uses a modular Express + TypeScript structure and split Prisma schema files backed by PostgreSQL.

> **Project status:** active development. The comments domain is scaffolded with routes and Prisma models, but its controller/service implementation is still in progress.

## Implemented Features

- **User registration** with bcrypt password hashing
- **JWT authentication** with access and refresh tokens
- **Refresh-token endpoint** backed by an HTTP-only cookie
- **Authenticated profile retrieval and update**
- **Role-aware authorization** using `USER`, `AUTHOR`, and `ADMIN`
- **Post CRUD** with ownership checks and admin override
- **Post search and filtering** by title/content, author, tags, featured flag, and status
- **Pagination and sorting** for post listings
- **Post view counter** incremented transactionally on detail retrieval
- **Admin post statistics** for post/comment counts and total views
- **Stripe subscription checkout**
- **Stripe webhook verification** and subscription persistence
- **Central not-found and global error middleware**
- **Prisma + PostgreSQL relational data modeling**

## Current In-Progress Area

The comments module currently includes:

- Prisma `Comment` model
- comment status enum
- route definitions
- controller/service scaffolding

The business logic for comment CRUD and moderation is not yet implemented.

## Architecture

```text
Client
  │
  ▼
Express API
  │
  ├── Users / Profiles
  ├── Authentication
  ├── Posts
  ├── Comments (in progress)
  └── Subscriptions
  │
  ▼
Prisma ORM
  │
  ▼
PostgreSQL

Stripe Checkout ──► Subscription service ──► Prisma/PostgreSQL
       │
       └───────────► Verified webhook flow
```

## Project Structure

```text
prisma_press/
├── prisma/
│   ├── migrations/
│   └── schema/
│       ├── base.prisma
│       ├── comments.prisma
│       ├── enums.prisma
│       ├── post.prisma
│       ├── profile.prisma
│       ├── subscription.prisma
│       └── user.prisma
├── src/
│   ├── config/
│   ├── lib/
│   ├── middleware/
│   ├── modules/
│   │   ├── auth/
│   │   ├── comments/
│   │   ├── posts/
│   │   ├── subscription/
│   │   └── user/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── prisma.config.ts
├── package.json
└── tsconfig.json
```

## Data Model

### User
Stores identity, credentials, role, active status, profile, posts, comments, and subscription relation.

### Profile
One-to-one user profile with optional photo and bio.

### Post
Stores title, content, thumbnail, feature state, publication status, tags, views, premium flag, author, and related comments.

### Comment
Links an author to a post and includes moderation state. The schema and routes exist, while the application logic is still under development.

### Subscription
One-to-one subscription record storing Stripe customer/subscription IDs, status, and the current subscription period end.

## API Surface

### Users

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/users/register` | Register a user |
| `GET` | `/api/users/me` | Get authenticated profile |
| `PUT` | `/api/users/my-profile` | Update authenticated profile |

### Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Log in and issue access/refresh tokens |
| `POST` | `/api/auth/refresh-token` | Refresh access token from refresh cookie |

### Posts

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/posts` | List/search/filter posts |
| `GET` | `/api/posts/stats` | Admin post statistics |
| `GET` | `/api/posts/my-posts` | List authenticated user's posts |
| `GET` | `/api/posts/:postId` | Get post and increment views |
| `POST` | `/api/posts` | Create post |
| `PATCH` | `/api/posts/:postId` | Update owned post or admin-managed post |
| `DELETE` | `/api/posts/:postId` | Delete owned post or admin-managed post |

### Subscriptions

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/subscription/checkout` | Create Stripe subscription Checkout session |
| `POST` | `/api/subscription/webhook` | Receive and verify Stripe webhook events |

### Comments — In Progress

Routes are scaffolded under `/api/comments`, but the controller/service methods are currently placeholders and should not be treated as production-ready endpoints.

## Post Query Capabilities

The post listing service supports:

- `searchTerm`
- `title`
- `content`
- `authorid`
- `isFeatured`
- `tags`
- `status`
- `page`
- `limit`
- `sortBy`
- `sortOrder`

## Stripe Subscription Flow

```text
Authenticated user
      │
      ▼
Create Checkout session
      │
      ▼
Stripe hosted checkout
      │
      ▼
checkout.session.completed webhook
      │
      ▼
Retrieve Stripe subscription
      │
      ▼
Upsert local Subscription record
```

The webhook verifies Stripe's signature before processing the event.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Language | TypeScript |
| Runtime | Node.js |
| API | Express.js 5 |
| ORM | Prisma 7 |
| Database | PostgreSQL |
| Authentication | JWT + bcrypt |
| Payments | Stripe subscriptions |
| Local development | tsx |
| Build | TypeScript compiler |

## Local Development

### 1. Clone

```bash
git clone https://github.com/harunhira69/prisma_press.git
cd prisma_press
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy `.env.example` to `.env` and provide your own values.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Apply migrations

```bash
npx prisma migrate dev
```

### 6. Start development server

```bash
npm run dev
```

The default configured port is `5000` unless `PORT` is overridden.

## Stripe Webhook Development

With the Stripe CLI authenticated:

```bash
npm run stripe:webhook
```

The script forwards events to:

```text
http://localhost:5000/api/subscription/webhook
```

Use the webhook signing secret reported by Stripe CLI as `STRIPE_WEBHOOK_SECRET`.

## Build & Start

```bash
npm run build
npm start
```

## Development Notes

- The project uses split Prisma schemas under `prisma/schema/`.
- Access and refresh tokens are created separately.
- Post updates/deletes enforce ownership unless the authenticated user is an admin.
- Post detail retrieval increments the view count inside a transaction.
- Subscription persistence is currently driven by the `checkout.session.completed` Stripe event.
- Comments are intentionally documented as work in progress until their controller/service logic is implemented.

---

## Author

**Harun Hira**  
Backend-Focused Full Stack Developer

- GitHub: https://github.com/harunhira69
- LinkedIn: https://www.linkedin.com/in/harunmern/
- Portfolio: https://portfolio-harun-liard.vercel.app/
