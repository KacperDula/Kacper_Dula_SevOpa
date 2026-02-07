Booking Management Dashboard

This project is a full-stack booking management system consisting of a Spring Boot backend API and a React (Vite) frontend dashboard.
The application runs entirely locally using PostgreSQL and demonstrates a complete booking workflow, including authentication, service management, and booking operations.

Features

Secure REST API
Implemented using Spring Boot 3.2 with JWT-based authentication, BCrypt password hashing, and role-based authorization (admin and user roles).

Service and Booking Management
Administrators can create, update, and delete services, while authenticated users can create, update, cancel, and view their bookings.

Database and Migrations
PostgreSQL is used for persistent data storage, with Flyway handling automatic schema migrations and initial seed data.

API Documentation
Swagger/OpenAPI documentation is available at:
http://localhost:8080/swagger-ui/index.html

Frontend Dashboard
A responsive React application built with Vite, React Router, and Axios, featuring protected routes and form-based interactions.

Technology Stack
Layer	Technologies
Backend	Java 21, Spring Boot 3.2, Spring Security, JPA, Hibernate
Frontend	React (Vite), React Router, Axios
Database	PostgreSQL, Flyway
Prerequisites

Java 21

Maven 3.9+

Node.js 18+

PostgreSQL (running locally)

Setup and Installation
Backend
cd backend
mvn clean package

Database
CREATE DATABASE booking_db;
CREATE USER booking WITH PASSWORD 'booking';
GRANT ALL PRIVILEGES ON DATABASE booking_db TO booking;

Frontend
cd frontend
npm install

Running the Application
Start the Backend
cd backend
mvn spring-boot:run


API available at: http://localhost:8080

Swagger UI available at: http://localhost:8080/swagger-ui/index.html

Default administrator account

Username: admin

Password: AdminPass123!

Start the Frontend
cd frontend
npm run dev


Frontend available at: http://localhost:5173
