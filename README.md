# Booking Management Dashboard

A full-stack booking management platform with a Spring Boot API and a Vite-powered React dashboard. It comes with JWT authentication, role-aware authorization, Flyway migrations, and a responsive UI for browsing services, creating bookings, and overseeing inventory. Everything runs locally with PostgreSQL so you can demo the entire flow end to end.

## Features
- **Secure REST API** – Spring Boot 3.2 with JWT login/register endpoints, BCrypt passwords, and role gates for admins vs. members.
- **Service & Booking Management** – Admins handle service CRUD while users schedule, update, cancel, or review their bookings.
- **PostgreSQL + Flyway** – Reproducible schema migrations, auditing columns, and seed data (default admin + example services).
- **Swagger/OpenAPI UI** – Auto-generated docs at `http://localhost:8080/swagger-ui/index.html` with JWT support baked in.
- **React Dashboard** – Vite, React Router, and Axios power a responsive shell with protected routes and form-driven workflows.
- **Configurable CORS & Env Overrides** – Ready for local dev (localhost / LAN) yet easy to retarget by tweaking `application.yml` or Vite env files.

## Tech Stack
| Layer | Technologies |
| --- | --- |
| Backend | Java 21 (Amazon Corretto), Spring Boot 3.2, Spring Web, Spring Data JPA, Hibernate, Spring Security, springdoc-openapi |
| Data | PostgreSQL 14+ (tested on 16 via Homebrew), Flyway migrations |
| Frontend | React 19 (Vite), React Router, Axios |

## Prerequisites
- Java 21 (Corretto or matching JDK)
- Maven 3.9+
- Node.js 18+ and npm
- PostgreSQL running locally (user must be able to create DBs)

## Project Structure
```
Kacper_SevOpa/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/example/booking/... (controllers, services, security, entities)
├── frontend/
│   ├── package.json
│   └── src/ (React app, hooks, pages, styles)
├── README.md
└── backend.log / frontend.log (runtime logs)
```

## Installation & Setup
1. **Clone / open the repo** on your machine (already in `/Users/kacperdula/Desktop/Kacper_SevOpa`).
2. **Install backend deps**
   ```bash
   cd backend
   mvn clean package
   ```
3. **Provision PostgreSQL**
   ```sql
   CREATE DATABASE booking_db;
   CREATE USER booking WITH PASSWORD 'booking';
   GRANT ALL PRIVILEGES ON DATABASE booking_db TO booking;
   ```
4. **Install frontend deps**
   ```bash
   cd ../frontend
   npm install
   ```

## Running Locally
### 1. Start PostgreSQL
Ensure the database service is running (e.g., `brew services start postgresql@16`).

### 2. Launch the Spring Boot API
```bash
cd backend
mvn spring-boot:run
```
The API listens on `http://localhost:8080` and registers Swagger + Flyway migrations. A default admin is created automatically:
- Username: `admin`
- Password: `AdminPass123!`

### 3. Launch the React Dashboard
```bash
cd frontend
npm run dev
```
- Dev server: `http://localhost:5173`
- If you change the API host/port, create `frontend/.env` with `VITE_API_URL=<your-backend-url>`.

## Available Scripts
| Location | Command | Description |
| --- | --- | --- |
| backend | `mvn spring-boot:run` | Run API with hot reload |
| backend | `mvn clean package` | Build shaded JAR |
| frontend | `npm run dev` | Start Vite dev server |
| frontend | `npm run build` | Production bundle in `dist/` |
| frontend | `npm run preview` | Preview the prod build locally |

## API Overview
- `POST /api/auth/register` – Signup + JWT response.
- `POST /api/auth/login` – Login + JWT.
- `GET /api/services` – Public service listing.
- `POST/PUT/DELETE /api/services` – Admin-only service management.
- `GET /api/bookings` – Authenticated list (admin sees all, member sees own).
- `POST /api/bookings` – Create booking.
- `PUT /api/bookings/{id}` – Update booking details/status.
- `POST /api/bookings/{id}/cancel` – User or admin cancellation shortcut.
- `DELETE /api/bookings/{id}` – Admin delete.

Swagger UI (`/swagger-ui.html`) includes a `bearerAuth` scheme so you can authorize with a JWT directly inside the docs.

## Customization Tips
- **Database & Admin Seed** – Adjust credentials and seed data in `backend/src/main/resources/application.yml` (`app.admin.*`, `spring.datasource.*`).
- **Migrations** – Add SQL files under `backend/src/main/resources/db/migration` (e.g., `V2__add_duration.sql`). Flyway auto-runs them at startup.
- **JWT Settings** – Update `jwt.secret` and `jwt.expiration` in `application.yml` or via env vars.
- **Frontend API URL** – Set `VITE_API_URL` for staging/prod endpoints.
- **CORS Rules** – Update the allowed origins list inside `SecurityConfig.corsConfigurationSource()` when deploying beyond localhost.

## Deployment
1. Build backend: `cd backend && mvn clean package` → deploy `target/booking-backend-0.0.1-SNAPSHOT.jar` to your Java host with appropriate env variables.
2. Build frontend: `cd frontend && npm run build` → upload `dist/` to static hosting or behind Nginx.
3. Configure reverse proxy / HTTPS and set `VITE_API_URL` + backend datasource creds for the deployed environment.

## Troubleshooting
- **Database errors** – Ensure PostgreSQL is running and credentials match `application.yml`.
- **CORS issues** – Verify frontend origin (host:port) is included in the allowed patterns in `SecurityConfig`.
- **JWT 401s** – Make sure the frontend persists the token (`localStorage`) and Axios interceptor attaches it to requests.

## License
No license specified yet. Consider adding MIT, Apache-2.0, or a proprietary license before publishing publicly.
