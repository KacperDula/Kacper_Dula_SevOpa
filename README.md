Booking Management Dashboard

A simple full-stack booking system with a Spring Boot backend, React frontend, and PostgreSQL database.

What It Does

Users can register and log in

Users can view services and create bookings

Users can update or cancel their bookings

Admins can manage services and view all bookings

Tech Stack

Backend: Java 21, Spring Boot, Spring Security

Frontend: React (Vite), Axios

Database: PostgreSQL, Flyway

Requirements

Java 21

Maven

Node.js (18+)

PostgreSQL

How to Run
Backend
cd backend
mvn spring-boot:run

Frontend
cd frontend
npm install
npm run dev


Backend: http://localhost:8080

Frontend: http://localhost:5173

Default admin

Username: admin

Password: AdminPass123!

API Docs

Swagger UI:
http://localhost:8080/swagger-ui/index.html

Notes

Database and security settings are in application.yml

Frontend API URL can be set in frontend/.env
