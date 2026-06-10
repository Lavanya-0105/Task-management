# Task Management API (RBAC)

A secure, production-grade RESTful backend engineered with Node.js, Express, and MongoDB. This system implements a robust authentication layer alongside strict **Role-Based Access Control (RBAC)** to manage system workflows across three corporate tiers: **Admin**, **Project Manager**, and **Developer**. The entire API architecture is fully documented and instantly interactive using an integrated **Swagger UI** wrapper.

---

## 🚀 Key Features

- **Secure Authentication:** User authentication powered by JSON Web Tokens (JWT) and encrypted database passwords using `bcryptjs`.
- **Role-Based Access Control (RBAC):** Strict endpoint authorization restricts route capability depending on hierarchical system roles (`Admin`, `Project Manager`, `Developer`).
- **Data-Ownership Enforcements:** Business logic layer intercepts resource modification requests to verify explicit workspace assignment before updating statuses.
- **Self-Documenting Architecture:** Completely integrated Swagger UI dashboard rendering the backend specifications into a live, testable interactive web view.
- **Data Consistency:** Strict database structuring and constraints managed seamlessly through Mongoose validation hooks.

---

## 🛠️ Tech Stack & Dependencies

- **Runtime Environment:** Node.js (ES6+ Modules)
- **Backend Framework:** Express.js
- **Database Object Modeling:** Mongoose / MongoDB
- **Security & Encryption:** JsonWebToken, BcryptJS, CORS, Dotenv
- **API Interface Documentation:** Swagger UI Express

---

## 🚦 System Roles & Hierarchy Rules

| Role | Operational Permissions |
| **Admin** | Unrestricted access. Can register users, create/view all master tasks, update statuses, and delete database task entries. |
| **Project Manager** | Can view personal profiles and generate/assign new tasks to designated system developers. |
| **Developer** | Can view a dashboard of explicitly assigned tasks and modify work status (`Pending`, `In Progress`, `Completed`). Intercepted by ownership filters. |

---

## ⚙️ Local Installation & Setup Guide

1. Clone the repository and install dependencies
   git clone https://github.com/Lavanya-0105/Task-management-.git
   cd Task-Management
   npm install
2. Configure Environment Variables
   Create a .env file in the root directory and define the following variables:
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/task_rbac_db
   JWT_SECRET=your_jwt_super_encryption_secret_key
3. Launch Development Server - npm run dev
   The server will boot up and establish a steady link with MongoDB on http://localhost:5000.

📖 Live API Documentation (Interactive UI)
Once the local server is initialized, you can skip external API testing applications like Postman. Navigate directly to the built-in sandbox endpoint in your browser:

👉 http://localhost:5000/api-docs

Testing the endpoints via Swagger UI:
Expand the POST /api/users/login endpoint, click "Try it out", supply valid registration criteria, and hit "Execute".

Extract the returned token text segment from the server response payload.

Scroll to the top of the interface page, click the "Authorize" padlock button, paste the token string, and click save.

Execute any role-restricted operational request to interact natively with your local MongoDB collection!

![alt text](<Screenshot (90).png>)
![alt text](<Screenshot (91).png>)
