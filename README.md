
# 🎓 CleverStudy - AI-Powered Study Platform

<div align="center">

**Transform PDFs into Interactive Learning Experiences**

[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19+-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

CleverStudy is an intelligent study platform that leverages Google's Gemini AI to help students learn more effectively from PDF documents. Upload your study materials and get instant access to:

- 🎯 **AI-Generated Quizzes** - Test your knowledge with auto-generated questions
- 📝 **Smart Flashcards** - Key concepts extracted and formatted for review
- 💬 **Interactive Chat** - Ask questions about your documents and get AI-powered answers
- 📊 **Progress Tracking** - Monitor your study time, scores, and improvement over time
- ✍️ **PDF Annotations** - Highlight, annotate, and bookmark important sections
- ⏱️ **Study Timer** - Track time spent on each document

---

## ✨ Features

### 📚 Document Processing
- **PDF Upload & Analysis** - Upload PDFs and get instant AI analysis
- **Text Extraction Caching** - Fast performance with intelligent caching
- **Topic Extraction** - Automatically identify key topics and themes
- **Question Generation** - Create comprehensive quiz questions with explanations

### 🧠 Learning Tools
- **Interactive Quizzes** - Multiple-choice questions with instant feedback
- **Adaptive Flashcards** - Spaced repetition algorithm for effective memorization
- **AI Chat Assistant** - Get explanations for complex concepts
- **Progress Dashboard** - Visualize your learning journey

### 🎨 User Experience
- **Dark/Light Mode** - Easy on the eyes, day or night
- **Smooth Animations** - Professional transitions using Framer Motion
- **Toast Notifications** - Non-intrusive feedback for all actions
- **Draggable Timer** - Flexible study timer you can position anywhere
- **Responsive Design** - Works beautifully on all screen sizes

### 🔒 Security & Privacy
- **JWT Authentication** - Secure token-based authentication
- **Password Encryption** - bcrypt hashing for all passwords
- **User Isolation** - Complete data privacy between users
- **Input Validation** - Comprehensive validation using Pydantic

---

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- Google Gemini API key

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/muridabuhamed/CleverStudy.git
cd CleverStudy
```

#### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

Create `.env` file in project root:
```env
JWT_SECRET=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
ALLOWED_ORIGINS=http://localhost:3000
```

Start the backend server:
```bash
python -m uvicorn main:app --reload
```

Server runs at: `http://localhost:8000`

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:3000`

---

## 🏗️ Architecture

CleverStudy follows **Clean Architecture** principles with clear separation of concerns:

### Backend Architecture

```
┌─────────────────────────────────────────────────┐
│              API Layer (FastAPI)                 │
│  HTTP Request Handling, Validation, Response    │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│            Service Layer                         │
│  Business Logic, Orchestration, Validation      │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│          Repository Layer (Data Access)          │
│  Database Queries, Data Transformation          │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│            Domain Models (Pydantic)              │
│  Business Entities, Validation Rules            │
└──────────────────────────────────────────────────┘
```

**Key Components:**
- **Core**: Configuration, logging, custom exceptions
- **Domain**: Business models (User, File, Quiz, Flashcard)
- **Repository**: Database abstraction layer (BaseRepository pattern)
- **Services**: Business logic (AuthService, FileService, QuizService)
- **API**: FastAPI routes organized by version
- **AI Services**: Gemini integration for document analysis and chat

### Frontend Architecture

```
┌─────────────────────────────────────────────────┐
│           Pages (Route Components)               │
│  Home, Library, Quiz, Profile, etc.             │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│      Components & Features (UI Layer)            │
│  Reusable Components, Feature Modules           │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│       Hooks & State Management                   │
│  Custom Hooks, React Context                    │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│            API Client Layer                      │
│  HTTP Requests, Error Handling, Auth            │
└──────────────────────────────────────────────────┘
```

**Key Components:**
- **API**: Type-safe API client with endpoints
- **Components**: Reusable UI components (Modal, Toast, Timer, etc.)
- **Features**: Feature-based organization (auth, files, quiz, flashcards)
- **Hooks**: Custom React hooks for reusable logic
- **Store**: React Context for global state (Auth, Theme, Toast)
- **Utils**: Formatters, validators, constants

---

## 📂 Project Structure

```
CleverStudy/
├── backend/                    # Python FastAPI backend
│   ├── core/                   # Core infrastructure
│   │   ├── config.py           # Configuration management
│   │   ├── logging.py          # Logging setup
│   │   └── exceptions.py       # Custom exceptions
│   ├── domain/                 # Business models
│   │   ├── user.py
│   │   ├── file.py
│   │   ├── quiz.py
│   │   └── flashcard.py
│   ├── repository/             # Data access layer
│   │   ├── base.py
│   │   ├── user_repository.py
│   │   └── file_repository.py
│   ├── services/               # Business logic
│   │   ├── auth_service.py
│   │   ├── file_service.py
│   │   └── ai/
│   │       ├── gemini_client.py
│   │       └── pdf_processor.py
│   ├── api/                    # FastAPI routes
│   │   └── v1/
│   │       ├── auth.py
│   │       ├── files.py
│   │       └── quiz.py
│   └── main.py                 # App entry point
│
├── frontend/                   # React TypeScript frontend
│   ├── src/
│   │   ├── api/                # API client
│   │   ├── components/         # Reusable components
│   │   ├── features/           # Feature modules
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Route components
│   │   ├── store/              # State management
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Utilities
│   │   ├── App.tsx             # Main component
│   │   └── main.tsx            # Entry point
│   └── package.json
│
├── data/                       # SQLite database
├── uploads/                    # Uploaded PDF files
├── .env                        # Environment variables
├── PROJECT_STRUCTURE.md        # Architecture documentation
├── REFACTORING_PLAN.md         # Refactoring strategy
├── REFACTORING_SUMMARY.md      # What changed and why
└── README.md                   # This file
```

---

## 🛠️ Technology Stack

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern Python web framework
- **[Pydantic](https://pydantic-docs.helpmanual.io/)** - Data validation using type hints
- **[SQLite](https://www.sqlite.org/)** - Lightweight database
- **[Google Gemini](https://ai.google.dev/)** - AI for document analysis and chat
- **[pypdf](https://pypdf.readthedocs.io/)** - PDF text extraction
- **[bcrypt](https://github.com/pyca/bcrypt/)** - Password hashing
- **[PyJWT](https://pyjwt.readthedocs.io/)** - JWT token management

### Frontend
- **[React 19](https://reactjs.org/)** - UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Fast build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon set

---

## 📊 Database Schema

### Core Tables
- **users** - User accounts and authentication
- **files** - Uploaded PDF files and metadata
- **quiz_attempts** - Quiz completion records
- **flashcards** - Generated flashcards
- **study_sessions** - Study time tracking
- **annotations** - PDF annotations and highlights
- **bookmarks** - PDF bookmarks

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed schema.

---

## 📚 Documentation

- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Complete architecture guide
- **[REFACTORING_PLAN.md](REFACTORING_PLAN.md)** - Refactoring strategy and roadmap
- **[REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md)** - Before/after comparison
- **API Documentation** - Available at `/docs` when backend is running

---

## 🧪 Testing

### Backend Tests (Planned)
```bash
cd backend
pytest tests/
```

### Frontend Tests (Planned)
```bash
cd frontend
npm test
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` file in project root:

```env
# Backend Configuration
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=7

# Database
DATA_DIR=./data
DB_NAME=smart_study_platform.db

# File Upload
UPLOADS_DIR=./uploads
MAX_UPLOAD_SIZE_MB=50

# AI Service
GEMINI_API_KEY=your-gemini-api-key-here
AI_MAX_CONTEXT_LENGTH=20000
AI_CHAT_CONTEXT_LENGTH=15000

# PDF Processing
PDF_MAX_PAGES=100

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Logging
LOG_LEVEL=INFO

# Frontend
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🚦 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Files
- `GET /api/files` - List user's files
- `POST /api/upload` - Upload PDF file
- `POST /api/process/{file_id}` - Process file with AI
- `DELETE /api/files/{file_id}` - Delete file

### Quiz
- `POST /api/quiz/submit` - Submit quiz attempt
- `GET /api/quiz/attempts` - Get recent attempts
- `GET /api/study/time/{file_id}` - Get study time for file
- `POST /api/study/session` - Save study session

### Flashcards
- `GET /api/flashcards/{file_id}` - Get flashcards for file
- `POST /api/flashcards/generate/{file_id}` - Generate flashcards
- `POST /api/flashcards/review` - Save flashcard review

### Admin
- `GET /api/admin/stats` - Get user statistics

Full API documentation: `http://localhost:8000/docs`

---

## 🎯 Development Workflow

### Adding New Features

1. **Backend**:
   - Add domain model in `domain/`
   - Create repository in `repository/`
   - Implement service in `services/`
   - Add API routes in `api/v1/`
   - Update tests

2. **Frontend**:
   - Add types in `types/` or `api/types/`
   - Create API endpoint in `api/endpoints/`
   - Build components in `components/` or `features/`
   - Add page in `pages/` if needed
   - Update routing in `App.tsx`

### Code Style

**Backend (Python)**:
- Follow PEP 8
- Use type hints everywhere
- Add docstrings (Google style)
- Max line length: 100
- Use Black for formatting
- Use Pylint for linting

**Frontend (TypeScript)**:
- Follow Airbnb style guide
- Strict TypeScript mode
- Use ESLint + Prettier
- Max line length: 100
- Functional components + hooks

---

## 🌟 Key Features in Detail

### AI Document Analysis
Upload a PDF and get:
- **Topics**: Automatically extracted key themes
- **Questions**: 8 multiple-choice questions with explanations
- **Flashcards**: 15 question-answer pairs for review
- **Chat**: Ask follow-up questions about the content

### Study Tracking
- **Timer**: Draggable, closable timer tracks study duration
- **Sessions**: All study sessions saved to database
- **Statistics**: View total time, average scores, quiz attempts
- **Achievements**: Unlock badges for milestones

### Smart Caching
- **PDF Text**: Extracted once, cached forever
- **Fast Processing**: Subsequent operations are 3-5x faster
- **AI Quota Management**: Fallback models prevent quota errors

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write tests for new features
- Update documentation
- Follow existing code style
- Add type hints and docstrings

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini** for powerful AI capabilities
- **FastAPI** for excellent Python web framework
- **React Team** for amazing frontend library
- **All contributors** who make this project better

---

## 📧 Contact

**Murid Abu Hamed** - [@muridabuhamed](https://github.com/muridabuhamed)

Project Link: [https://github.com/muridabuhamed/CleverStudy](https://github.com/muridabuhamed/CleverStudy)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ for students everywhere

</div>

