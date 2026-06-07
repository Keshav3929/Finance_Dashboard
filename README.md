                                                        Finance Dashboard Backend
A backend system for managing financial records, user roles, dashboard analytics, and secure access control using Spring Boot, JWT Authentication, MySQL, and Swagger.
________________________________________
Features
Authentication & Security
•	JWT Authentication 
•	Secure login system 
•	Password encryption using BCrypt 
•	Role-based access control 
User Management
•	Register users 
•	Login users 
•	Assign roles: 
o	ADMIN 
o	ANALYST 
o	VIEWER 
•	Activate/Deactivate users 
Financial Records Management
•	Create transactions 
•	Update transactions 
•	Delete transactions (Soft Delete) 
•	Restore deleted transactions 
•	Filter records 
•	Pagination support 
Dashboard Analytics
•	Total Income 
•	Total Expenses 
•	Net Balance 
•	Category-wise totals 
•	Monthly trends 
•	Recent transactions 
API Documentation
•	Swagger UI Integration 
________________________________________
Tech Stack
Technology	Purpose
Java 25	Programming Language
Spring Boot 4	Backend Framework
Spring Security	Authentication & Authorization
JWT	Secure Token Authentication
MySQL	Database
Hibernate/JPA	ORM
Swagger OpenAPI	API Documentation
Maven	Dependency Management
IntelliJ IDEA	IDE
________________________________________
Project Structure
com.finance.dashboard
│
├── config/
│   ├── SecurityConfig.java
│   └── SwaggerConfig.java
│
├── controller/
│   ├── AuthController.java
│   ├── DashboardController.java
│   ├── RecordController.java
│   └── UserController.java
│
├── dto/
│   └── request/
│       ├── LoginRequest.java
│       └── RegisterRequest.java
│
├── exception/
│   ├── DuplicateResourceException.java
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── UnauthorizedException.java
│
├── model/
│   ├── Record.java
│   ├── Role.java
│   ├── Type.java
│   └── User.java
│
├── repository/
│   ├── RecordRepository.java
│   └── UserRepository.java
│
├── security/
│   ├── JwtFilter.java
│   ├── JwtUtil.java
│   └── UserDetailsService.java
│
├── service/
│   ├── RecordService.java
│   └── UserService.java
│
└── resources/
    └── application.properties
________________________________________
Setup Instructions
1️⃣ Clone Project
git clone <repository-url>
________________________________________
2️⃣ Open in IntelliJ IDEA
•	Open IntelliJ IDEA 
•	Click: 
o	Open Project 
•	Select project folder 
________________________________________
3️⃣ Configure MySQL
Create database:
CREATE DATABASE finance_db;
________________________________________
4️⃣ Configure application.properties
Location:
src/main/resources/application.properties
Add:
spring.application.name=dashboard

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/finance_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root@123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Server
server.port=8081

# JWT
jwt.secret=my-very-strong-secret-key-of-at-least-32-characters!
jwt.expiration=36000000

# Swagger
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.api-docs.path=/v3/api-docs
________________________________________
5️⃣ Install Maven Dependencies
Reload Maven project from IntelliJ.
Required dependencies include:
Spring Web
Spring Data JPA
Spring Security
MySQL Driver
Lombok
JWT
Swagger OpenAPI
Validation
________________________________________
6️⃣ Run Project
Run:
DashboardApplication.java
Server starts at:
http://localhost:8081
________________________________________
📘 Swagger API Documentation
Open:
http://localhost:8081/swagger-ui.html
________________________________________
Authentication Flow
Register
POST:
/api/auth/register
Example Request:
{
  "username": "admin",
  "email": "admin@gmail.com",
  "password": "admin123"
}
________________________________________
Login
POST:
/api/auth/login
Example Request:
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
Example Response:
{
  "token": "JWT_TOKEN",
  "role": "VIEWER",
  "email": "admin@gmail.com"
}
________________________________________
Using JWT Token
After login:
1.	Copy token 
2.	Open Swagger 
3.	Click Authorize 
4.	Enter: 
Bearer YOUR_TOKEN
________________________________________
Main APIs
________________________________________
Authentication APIs
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user
________________________________________
User APIs
Method	Endpoint	Description
GET	/api/users	Get all users
PUT	/api/users/{id}/role	Update role
PUT	/api/users/{id}/status	Activate/Deactivate
DELETE	/api/users/{id}	Delete user
________________________________________
Transaction APIs
Method	Endpoint	Description
POST	/api/transactions	Create record
GET	/api/transactions	Get all records
GET	/api/transactions/{id}	Get by ID
PUT	/api/transactions/{id}	Update record
DELETE	/api/transactions/{id}	Soft delete
POST	/api/transactions/restore/{id}	Restore record
________________________________________
Dashboard APIs
Method	Endpoint	Description
GET	/api/dashboard/summary	Income/Expense Summary
GET	/api/dashboard/category-totals	Category totals
GET	/api/dashboard/monthly-trends	Monthly analytics
GET	/api/dashboard/recent	Recent transactions
________________________________________
Access Control
Role	Permissions
VIEWER	Read dashboard and records
ANALYST	Read + create/update records
ADMIN	Full access
________________________________________
Example Transaction JSON
{
  "amount": 5000,
  "type": "INCOME",
  "category": "Salary",
  "date": "2026-05-14",
  "description": "Monthly salary",
  "userId": 1
}
________________________________________
Implemented Features
•	JWT Authentication 
•	BCrypt Password Encryption 
•	Role-Based Authorization 
•	Swagger Documentation 
•	Pagination 
•	Filtering 
•	Search 
•	Soft Delete 
•	Dashboard Analytics 
•	Exception Handling 
•	Validation 
•	MySQL Integration 
________________________________________
Common Errors & Fixes
403 Forbidden
Cause:
•	JWT token missing 
Fix:
•	Add token in Authorization header 
Bearer TOKEN
________________________________________
401 Unauthorized
Cause:
•	Invalid token 
Fix:
•	Login again and generate new token 
________________________________________
Database Connection Error
Cause:
•	MySQL not running 
Fix:
•	Start MySQL Workbench/XAMPP/MySQL Server 
________________________________________
Author
Developed using:
•	Java 
•	Spring Boot 
•	MySQL 
•	IntelliJ IDEA 
________________________________________
License
This project is for internship assessment and educational purposes only.
