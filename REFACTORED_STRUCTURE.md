# CleverStudy - Refactored Project Structure

## 📁 Project Overview

CleverStudy is an AI-powered study platform with a feature-based architecture for improved maintainability and scalability.

---

## 🏗️ Architecture

### Frontend (React + TypeScript)

**Feature-Based Structure** - Each feature is self-contained with its own pages, components, services, and types.

```
frontend/src/
├── features/              # Feature modules (independent & cohesive)
│   ├── auth/             # Authentication feature
│   │   ├── pages/        # Login, Signup, Auth
│   │   ├── components/   # Auth-specific components
│   │   ├── services/     # authApi.ts
│   │   ├── types.ts      # Auth type definitions
│   │   └── index.ts      # Barrel export
│   │
│   ├── flashcards/       # Flashcard study feature
│   │   ├── pages/        # Flashcards
│   │   ├── services/     # flashcardsApi.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── quiz/             # Quiz feature
│   │   ├── pages/        # Quiz, Results
│   │   ├── services/     # quizApi.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── library/          # File management feature
│   │   ├── pages/        # Library, Topics, Processing, Home
│   │   ├── services/     # libraryApi.ts
│   │   └── index.ts
│   │
│   └── profile/          # User profile feature
│       ├── pages/        # Profile
│       ├── services/     # profileApi.ts
│       └── index.ts
│
├── shared/               # Shared resources (reusable across features)
│   ├── components/       # Navbar, Modal, Toast, PdfViewer, etc.
│   ├── contexts/         # AuthContext, ThemeContext, ToastContext
│   ├── config/           # constants.ts
│   ├── types/            # Global type definitions
│   ├── hooks/            # Custom React hooks
│   └── index.ts          # Barrel export
│
├── App.tsx               # Main application component
└── main.tsx              # Application entry point

```

### Backend (Python FastAPI)

**Hybrid Architecture** - Feature modules for routes/services, shared repository and domain layers.

```
backend/
├── features/             # Feature modules (business logic by feature)
│   ├── auth/            # Authentication feature
│   │   ├── routes.py    # Auth API endpoints
│   │   ├── service.py   # Auth business logic
│   │   └── __init__.py
│   │
│   ├── flashcards/      # Flashcards feature
│   │   ├── routes.py
│   │   ├── service.py
│   │   └── __init__.py
│   │
│   ├── quiz/            # Quiz feature
│   │   ├── routes.py
│   │   ├── service.py
│   │   └── __init__.py
│   │
│   ├── files/           # File management
│   │   ├── routes.py
│   │   ├── service.py
│   │   └── __init__.py
│   │
│   └── annotations/     # PDF annotations
│       ├── routes.py
│       ├── service.py
│       └── __init__.py
│
├── domain/              # Shared domain models (entities)
│   ├── user.py
│   ├── file.py
│   ├── flashcard.py
│   ├── quiz.py
│   └── annotation.py
│
├── repository/          # Shared data access layer
│   ├── base.py
│   ├── user_repository.py
│   ├── file_repository.py
│   ├── flashcard_repository.py
│   ├── quiz_repository.py
│   └── annotation_repository.py
│
├── services/            # Shared AI services
│   └── ai/
│       ├── gemini_client.py
│       └── pdf_processor.py
│
├── core/                # Shared infrastructure
│   ├── config.py        # Application configuration
│   ├── exceptions.py    # Custom exceptions
│   ├── logging.py       # Logging setup
│   └── __init__.py
│
├── api/
│   └── dependencies.py  # FastAPI dependencies
│
├── routers/             # Legacy routers (being phased out)
│   └── admin.py         # Admin routes (to be moved)
│
├── main.py              # FastAPI application entry
├── database.py          # Database initialization
└── requirements.txt
```

---

## ✨ Key Improvements

### 🎯 Frontend

1. **Feature Isolation** - Each feature is independent with minimal cross-dependencies
2. **Better Scalability** - Easy to add new features without affecting existing ones
3. **Clear Ownership** - Teams can own entire features (pages + logic + API)
4. **Easier Testing** - Test features in isolation
5. **Reduced Coupling** - Changes in one feature don't break others

### 🎯 Backend

1. **Feature Cohesion** - Routes and services grouped by feature
2. **Shared Infrastructure** - Repository and domain layers remain centralized to avoid duplication
3. **Clean Imports** - Clear separation between feature-specific and shared code
4. **Maintainability** - Easy to locate and modify feature-specific logic

---

## 📦 Feature Module Pattern

### Frontend Feature Structure

Each feature follows this pattern:

```typescript
features/[feature-name]/
├── pages/           # Feature-specific pages
├── components/      # Feature-specific components (optional)
├── services/        # API client for this feature
├── types.ts         # Feature-specific types
└── index.ts         # Barrel export (clean imports)
```

**Example Usage:**

```typescript
// Instead of:
import { Login } from './pages/Login';
import { authApi } from './services/authApi';

// Use barrel export:
import { Login, authApi } from './features/auth';
```

### Backend Feature Structure

Each feature follows this pattern:

```python
features/[feature-name]/
├── routes.py        # FastAPI router endpoints
├── service.py       # Business logic
└── __init__.py      # Module exports
```

**Example Usage:**

```python
# In main.py
from features.auth import router as auth_router
app.include_router(auth_router, tags=["Authentication"])
```

---

## 🔄 Migration Status

✅ **Completed:**
- Frontend feature-based refactoring (auth, flashcards, quiz, library, profile)
- Shared components moved to `/shared`
- Backend feature modules created
- Updated imports in App.tsx and main.py

⚠️ **Remaining:**
- Old `/pages`, `/components`, `/routers`, `/services` folders can be removed
- Admin router needs to be moved to features structure
- Test files need to be updated with new imports

---

## 🚀 Running the Application

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

---

## 📝 Development Guidelines

### Adding a New Feature (Frontend)

1. Create feature folder: `frontend/src/features/[feature-name]/`
2. Add subdirectories: `pages/`, `services/`, `components/` (if needed)
3. Create API service: `services/[feature]Api.ts`
4. Define types: `types.ts`
5. Create barrel export: `index.ts`
6. Import in App.tsx

### Adding a New Feature (Backend)

1. Create feature folder: `backend/features/[feature-name]/`
2. Add `routes.py` with APIRouter
3. Add `service.py` with business logic
4. Create `__init__.py` to export router
5. Register router in `main.py`

---

## 🧹 Code Quality Rules

- ✅ No file > 300 lines
- ✅ Single Responsibility Principle
- ✅ Feature modules are independent
- ✅ Shared code goes in `/shared` (frontend) or `/core`, `/domain`, `/repository` (backend)
- ✅ Use barrel exports (index.ts) for clean imports
- ✅ Type everything (TypeScript/Python type hints)

---

## 📚 Further Reading

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

**Last Updated:** April 13, 2026  
**Architecture:** Feature-Based (Frontend) + Hybrid Layered (Backend)
