# NC News API

A RESTful API for a social news aggregation and discussion platform, similar to Reddit. Built with Node.js, Express, and PostgreSQL.

[Live API](https://nc-project-news.onrender.com/api) | [GitHub Repository](https://github.com/Alsamri/nc_project_news)

## Features

- Browse and filter articles by topic
- View article comments
- Post comments on articles
- Vote on articles and comments
- User authentication system
- Full CRUD operations for articles and comments

## API Endpoints

View all available endpoints at `/api` or see the [full endpoint documentation](./endpoints.json).

Key endpoints include:
- `GET /api/articles` - Get all articles with filtering and sorting
- `GET /api/articles/:article_id` - Get a specific article
- `POST /api/articles` - Create a new article
- `GET /api/articles/:article_id/comments` - Get comments for an article
- `POST /api/articles/:article_id/comments` - Add a comment
- `PATCH /api/articles/:article_id` - Update article votes
- `DELETE /api/comments/:comment_id` - Delete a comment

## Tech Stack

- **Runtime:** Node.js v23.3.0
- **Framework:** Express.js
- **Database:** PostgreSQL v15
- **Testing:** Jest, Supertest
- **Containerization:** Docker

## Getting Started

### Prerequisites

- Node.js v18 or higher
- PostgreSQL v14 or higher
- Docker (optional, for containerized setup)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Alsamri/nc_project_news.git
   cd nc_project_news
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create two files in the project root:
   
   `.env.development`
   ```
   PGDATABASE=nc_news
   ```
   
   `.env.test`
   ```
   PGDATABASE=nc_news_test
   ```

4. **Set up the database**
   ```bash
   npm run setup-dbs
   npm run seed
   ```

5. **Run the server**
   ```bash
   npm start
   ```
   
   The API will be available at `http://localhost:9000`

### Docker Setup

1. **Start the containers**
   ```bash
   docker compose up --build
   ```

2. **Set up and seed the database**
   ```bash
   docker compose exec db psql -U postgres -f /docker-db/setup.sql
   docker compose exec server npm run seed
   ```

   The API will be available at `http://localhost:9000`

3. **Stop the containers**
   ```bash
   docker compose down
   ```

## Running Tests

```bash
npm test
```

## Project Structure

```
├── db/
│   ├── data/          # Seed data
│   ├── seeds/         # Seeding scripts
│   └── setup.sql      # Database setup
├── models/            # Database queries
├── controllers/       # Route handlers
├── routes/            # API routes
├── __tests__/         # Test files
├── Dockerfile         # Docker configuration
└── docker.yaml        # Docker Compose configuration
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PGDATABASE` | PostgreSQL database name | `nc_news` |
| `PGHOST` | Database host | `localhost` or `db` (Docker) |
| `PGUSER` | Database user | `postgres` |
| `PGPASSWORD` | Database password | `password` |
| `PGPORT` | Database port | `5432` |



---

**Portfolio Project:** This was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/).
