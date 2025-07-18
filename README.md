# Mentorship Matching Platform

This is a full-stack, production-ready web application designed to connect mentors with mentees in an incubator or accelerator program. The platform is built with a modern tech stack and has been scaled with performance, security, and user experience in mind.

It features real-time chat, a persistent notification system, role-based access control, advanced search, and a fully containerized environment for easy deployment.

## Features

### For Mentees
-   **👤 Rich User Profiles:** Create and manage detailed profiles with job titles, company, social links, and skills.
-   **🔍 Advanced Mentor Discovery:** Search for mentors using full-text search on names and bios, and filter by skills or availability.
-   **♾️ Infinite Scroll:** Mentor list is paginated with a "Load More" feature for a smooth, fast user experience.
-   **📨 Mentorship Requests:** Send mentorship requests directly to mentors.
-   **💬 Real-Time Chat:** Once a request is accepted, a private chat room is created, powered by WebSockets.
-   **🗓️ Session Booking:** Book sessions based on a mentor's specified availability.
-   **📅 Calendar Integration:** Download `.ics` files for booked sessions to easily add them to Google Calendar, Outlook, etc.
-   **⭐ Feedback & Ratings:** Provide ratings and comments on past sessions.

### For Mentors
-   ** availability management:** Easily set and update weekly availability slots.
-   **📩 Request Management:** Review and accept/reject incoming mentorship requests.
-   **🔔 Real-Time Notifications:** Receive instant notifications for new requests and booked sessions.
-   **📊 Personalized Dashboard:** See key stats at a glance, like pending requests and upcoming sessions.

### For Admins
-   **⚙️ Full User Management:** View a paginated list of all users and update their roles (Mentee, Mentor, Admin).
-   **🤝 Manual Matching:** Manually create a mentorship connection between any mentor and mentee.
-   **📊 System Oversight:** View dashboards of all requests and sessions in the system.
-   **🔒 Secure & Restricted Access:** All admin routes are protected and require the `ADMIN` role.

---

## Technical Stack

This project is a monorepo containing two main packages: `client` and `server`.

### Backend (`server/`)
-   **Framework:** Node.js with Express.js
-   **Language:** TypeScript
-   **Database:** PostgreSQL
-   **ORM:** Prisma
-   **Authentication:** JWT (JSON Web Tokens)
-   **Real-time Communication:** Socket.IO
-   **Validation:** Zod
-   **Testing:** Jest & Supertest
-   **Containerization:** Docker

### Frontend (`client/`)
-   **Framework:** React
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **State Management:** TanStack Query (React Query) for server state
-   **Forms:** React Hook Form with Zod for validation
-   **Real-time Communication:** Socket.IO Client
-   **Deployment:** Nginx (within Docker)

---

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose
-   A PostgreSQL instance (can be run via Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/JayJay247in/mentorship-platform.git
cd mentorship-platform
```

### 2. Local Setup (Without Docker)

This is useful for isolated development on the frontend or backend.

#### Backend Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file and configure your database URL and JWT secret
cp .env.example .env

# Edit the .env file with your local database credentials
# Example:
# DATABASE_URL="postgresql://user:password@localhost:5432/mentorship_dev?schema=public"
# JWT_SECRET="your_super_secret_key"

# Apply database migrations
npx prisma migrate dev

# Run the development server
npm run dev
```

#### Frontend Setup

```bash
# Navigate to the client directory from the root
cd client

# Install dependencies
npm install

# Run the React development server
npm start
```

### 3. Dockerized Setup (Recommended)

This is the simplest and most reliable way to run the entire application stack.

#### Step 1: Create the Root `.env` File
At the root of the project, create a `.env` file and add the necessary environment variables. You can copy the example:

```bash
cp .env.example .env
```
Now, **edit the `.env` file** to ensure `JWT_SECRET` is a long, secure, random string. You can leave the database credentials as they are, as they will be used to create the new Docker database.

#### Step 2: Launch the Application
From the root directory, run the following command:

```bash
docker-compose up --build
```
-   `--build`: This flag is only needed the first time you run the command, or after you've made changes to a `Dockerfile` or source code.

The application will be available at:
-   **Frontend:** `http://localhost:3000`
-   **Backend API:** `http://localhost:5000`

To stop the application, press `Ctrl + C` and then run:
```bash
docker-compose down
```

---

## Running the Test Suite

The backend is equipped with a comprehensive integration test suite.

To run the tests, navigate to the `server` directory and use the `npm test` command. This will use a separate test database (`.env.test`) to avoid interfering with development data.

```bash
# Navigate to the server directory
cd server

# Run all tests
npm test```
```