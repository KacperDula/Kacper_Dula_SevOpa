📅 Booking Management Dashboard

A full-stack booking management platform built with a Spring Boot backend and a React (Vite) frontend.
The application runs fully locally using PostgreSQL and supports the complete booking flow from authentication to service management.

✨ Features

🔐 Secure REST API
Spring Boot 3.2 with JWT authentication, BCrypt password hashing, and role-based access (admin / user).

🛠️ Service & Booking Management

Admins manage services (create, update, delete)

Users create, update, cancel, and view their bookings

🗄️ PostgreSQL + Flyway
Automatic database migrations with seed data (default admin + example services).

📘 Swagger API Docs
Interactive API documentation available at:
http://localhost:8080/swagger-ui/index.html

💻 React Dashboard
Built with Vite, React Router, and Axios. Includes protected routes and a responsive layout.

🧰 Tech Stack
Layer	Technologies
Backend	Java 21, Spring Boot 3.2, Spring Security, JPA, Hibernate
Frontend	React (Vite), React Router, Axios
Database	PostgreSQL, Flyway
📋 Requirements

Java 21

Maven 3.9+

Node.js 18+

PostgreSQL (running locally)

📁 Project Structure
Kacper_SevOpa/
├── backend/      # Spring Boot API
├── frontend/     # React dashboard
├── README.md

⚙️ Setup & Installation
1️⃣ Backend
cd backend
mvn clean package

2️⃣ Database
CREATE DATABASE booking_db;
CREATE USER booking WITH PASSWORD 'booking';
GRANT ALL PRIVILEGES ON DATABASE booking_db TO booking;

3️⃣ Frontend
cd frontend
npm install

▶️ Running the Application
Start Backend
cd backend
mvn spring-boot:run


API: http://localhost:8080

Swagger: http://localhost:8080/swagger-ui/index.html

Default admin account

Username: admin

Password: AdminPass123!

Start Frontend
cd frontend
npm run dev


Frontend: http://localhost:5173
