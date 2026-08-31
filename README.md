# ⚡ ContentForge AI

An all-in-one AI-powered content creation suite designed to streamline content generation, image editing, and resume analysis with high speed and modern UI.

---

## 🚀 Features

- ✍️ **Article Generator**: Create long-form, well-structured articles on any topic.
- 💡 **Blog Title & Outline Generator**: Generate high-converting blog ideas and outlines.
- 🎨 **AI Image Generation**: Transform text prompts into striking visuals.
- ✂️ **Image Background Removal**: Clean background removal for product and portrait photos.
- 🔍 **Object Removal**: Erase unwanted objects from images seamlessly.
- 📄 **AI Resume Reviewer**: Upload PDF resumes for in-depth ATS-friendly analysis and improvement feedback.
- 🔐 **Secure Authentication**: JWT-based session management, password hashing with bcrypt, and Google OAuth support.
- 🗄️ **Database Support**: Built for Neon PostgreSQL with automatic local fallback support.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS & Modern UI Components
- **Icons & UI**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5
- **AI Engine**: Groq SDK / OpenAI-compatible LLM (`llama-3.3-70b-versatile`)
- **Database**: Neon Serverless PostgreSQL (`@neondatabase/serverless`) / SQLite fallback
- **File & PDF Processing**: Multer, pdf-parse-fork
- **Security**: JSON Web Tokens (JWT), bcrypt

---

## 📁 Project Structure

```plaintext
ContentForge-AI/
├── backend/
│   ├── configs/          # Database, Multer, Cloudinary configurations
│   ├── controllers/      # AI, Auth, and User business logic
│   ├── middlewares/      # JWT authentication middleware
│   ├── models/           # Data models and queries
│   ├── routes/           # Express API endpoints
│   ├── utils/            # Helper utilities
│   ├── init_db.js        # Automatic DB schema initializer
│   ├── server.js         # Express server entry point
│   └── .env.example      # Backend environment template
├── client/
│   ├── public/           # Static assets
│   ├── src/              # React components, pages, and hooks
│   └── .env.example      # Frontend environment template
├── start-app.bat         # 1-Click Windows launch script
├── package.json          # Root orchestration script
└── README.md
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)

### 2. Clone the Repository
```bash
git clone https://github.com/iamshakshikumari/ContentForge-AI.git
cd ContentForge-AI
```

### 3. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install client dependencies
cd ../client && npm install

# Return to root directory
cd ..
```

---

## 🔐 Environment Variables Setup

### Backend Configuration
Create a `.env` file inside the `backend/` directory:
```bash
cp backend/.env.example backend/.env
```
Populate `backend/.env` with your credentials:
```env
# PostgreSQL connection string (Neon or standard Postgres)
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require

# Groq API Key (Get free key from https://console.groq.com)
GROQ_API_KEY=your_groq_api_key_here

# JWT Secret for token signing
JWT_SECRET=your_jwt_secret_key_here

# Server Port (default: 3000)
PORT=3000
```

### Frontend Configuration
Create a `.env` file inside the `client/` directory:
```bash
cp client/.env.example client/.env
```
Populate `client/.env`:
```env
VITE_BASE_URL=http://localhost:3000
```

---

## 🏃 Running the Application

### Option 1: 1-Click Windows Launcher
Double-click `start-app.bat` or run:
```cmd
start-app.bat
```

### Option 2: Concurrently via Root NPM Script
```bash
npm run dev
```

### Option 3: Separate Terminals
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:3000`

---

## 🛡️ Security Notes
- Never commit `.env` or files containing live credentials.
- All secrets are excluded via `.gitignore`.
