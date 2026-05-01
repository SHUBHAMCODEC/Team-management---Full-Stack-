# Team Task Manager

A professional, full-stack task management application for teams.

## 🚀 Key Features
- **Authentication**: JWT-based secure signup and login.
- **Project Management**: Create and manage projects (Admin only).
- **Task Tracking**: Assign tasks, set priorities, and track status (Todo, In Progress, Completed).
- **Role-Based Access**: Specialized views and permissions for Admins and Members.
- **Dashboard**: Real-time overview of task statistics.
- **Modern UI**: Clean, professional design with smooth animations.

## 🛠 Tech Stack
- **Frontend**: React, Vite, TypeScript, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Styling**: Vanilla CSS (Custom Design System).

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Setup

1. **Clone the repository**
2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file with:
   # PORT=5000
   # MONGO_URI=your_mongodb_uri
   # JWT_SECRET=your_secret
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 📐 Architecture
- **Backend**: MVC-like structure with clean route/controller separation.
- **Frontend**: Context API for state management, component-based architecture.

## 🔒 Security
- Password hashing with Bcrypt.
- Protected routes using JWT.
- RBAC (Role-Based Access Control) enforced on both frontend and backend.
