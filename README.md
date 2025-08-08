# MERN Stack Portfolio Application

This is a comprehensive, production-ready portfolio web application built using the MERN stack (MongoDB, Express.js, React, Node.js). The application serves as a personal portfolio with both public-facing content and a private, secure admin dashboard for the portfolio owner.

The entire development process followed Feature-Driven Development (FDD) principles and general coding best practices, including a scalable project structure, SCSS for styling, and JWT for authentication.

## Features

### 1. Public-Facing Portfolio
- **Profile/Homepage:** Displays a professional summary, bio, and social links.
- **Blog:** A fully functional blog where published articles are displayed.
- **Contributions:** A section to showcase projects, open-source work, and other contributions.

### 2. Secure Admin Dashboard
- **JWT Authentication:** A secure login system for the admin user.
- **Content Management:** Full CRUD (Create, Read, Update, Delete) functionality for all public content (Profile, Blog Posts, Contributions).
- **Private Dashboard Tools:** A suite of private tools for the admin, including:
  - Todo List
  - Habit Tracker
  - Goal Manager
  - Mind Map Editor
  - Future Plan Manager

### 3. Automated CV Generation
- A "Download CV" feature in the admin dashboard that automatically generates a professional PDF from the user's profile and contribution data.

### 4. Progressive Web App (PWA)
- The application is configured to be a PWA, with a `manifest.json` and a service worker for offline access.
- The service worker uses a network-first strategy for API data and a cache-first strategy for static assets.

## Tech Stack

### Backend
- **Node.js:** JavaScript runtime environment.
- **Express.js:** Web framework for Node.js.
- **MongoDB:** NoSQL database for data storage.
- **Mongoose:** Object Data Modeling (ODM) library for MongoDB.
- **JSON Web Tokens (JWT):** For secure user authentication.
- **bcryptjs:** For password hashing.
- **pdfkit:** For PDF generation.
- **cors, dotenv**

### Frontend
- **React:** JavaScript library for building user interfaces.
- **React Router:** For client-side routing.
- **Axios:** For making HTTP requests to the backend.
- **Sass (SCSS):** For advanced and modular styling.

## Project Structure
```
/
├── client/         # React Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.js
│       └── index.js
│
└── server/         # Node.js & Express Backend
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── .env        # Environment variables (needs to be created)
    └── server.js
```

## Local Setup and Installation

### Prerequisites
- Node.js and npm (or yarn)
- MongoDB installed and running locally, or a MongoDB Atlas connection string.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Backend Setup
```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create the environment variables file
# In the /server directory, create a file named .env and add the following content:
```
```.env
# MongoDB Connection String (replace with your local or Atlas URI)
MONGO_URI=mongodb://localhost:27017/mern_portfolio

# JSON Web Token Secret (replace with a long, random string)
JWT_SECRET=your_super_secret_jwt_key

# Server Port
PORT=5001
```
```bash
# Start the backend server
npm start
# The server will be running on http://localhost:5001
```

### 3. Frontend Setup
```bash
# Navigate to the client directory from the root
cd client

# Install dependencies
npm install

# Start the React development server
npm start
# The application will open on http://localhost:3000
```

### 4. Create an Admin User
To use the admin dashboard, you must first register an admin user.

1.  Use a tool like Postman or `curl` to make a `POST` request to the registration endpoint.
2.  **Endpoint:** `http://localhost:5001/api/auth/register`
3.  **Body (raw JSON):**
    ```json
    {
        "username": "your_admin_username",
        "password": "your_strong_password"
    }
    ```
4.  Once registered, you can log in using these credentials at `http://localhost:3000/login`.
