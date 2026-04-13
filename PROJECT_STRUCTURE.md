# CleverStudy - Project Structure Documentation

## 📁 Project Overview

CleverStudy is an AI-powered study platform that helps students analyze PDFs, generate quizzes, create flashcards, and track their learning progress. This document explains the complete project structure and architecture.

---

## 🏗️ Architecture Principles

### Backend Architecture
- **Clean Architecture** - Separation into layers (Domain, Repository, Service, API)
- **Repository Pattern** - Abstract data access from business logic
- **Dependency Injection** - Services receive dependencies, not hardcoded
- **Type Safety** - Pydantic models for all data transfer
- **Single Responsibility** - Each module has one clear purpose

### Frontend Architecture
- **Feature-Based Organization** - Related code grouped by feature
- **Component Composition** - Small, reusable components
- **Centralized State** - React Context for global state
- **Type Safety** - TypeScript strict mode
- **API Abstraction** - API client separates HTTP concerns from UI

---

## 📂 Backend Structure

```
backend/
├── core/                          # Core infrastructure
│   ├── config.py                  # Configuration management (Pydantic settings)
│   ├── logging.py                 # Logging setup with colored output
│   └── exceptions.py              # Custom exception hierarchy
│
├── domain/                        # Domain models (Business entities)
│   ├── user.py                    # User model, UserCreate, UserResponse, UserStats
│   ├── file.py                    # File model, QuestionModel, FileStatus enum
│   ├── quiz.py                    # Quiz models, StudySession models
│   ├── flashcard.py               # Flashcard models
│   └── annotation.py              # Annotation, Highlight, Bookmark models
│
├── repository/                    # Data access layer
│   ├── base.py                    # BaseRepository with CRUD operations
│   ├── user_repository.py         # User database operations
│   ├── file_repository.py         # File database operations
│   ├── quiz_repository.py         # Quiz/study session operations
│   ├── flashcard_repository.py    # Flashcard database operations
│   └── annotation_repository.py   # Annotation database operations
│
├── services/                      # Business logic layer
│   ├── auth_service.py            # Authentication, JWT, password hashing
│   ├── file_service.py            # File upload, processing orchestration
│   ├── quiz_service.py            # Quiz logic, scoring, stats calculation
│   ├── flashcard_service.py       # Flashcard generation and review logic
│   ├── ai/
│   │   ├── gemini_client.py       # AI API client with retry logic
│   │   └── pdf_processor.py       # PDF text extraction
│
├── api/                           # API layer (FastAPI routes)
│   ├── dependencies.py            # FastAPI dependencies (auth, repos, services)
│   ├── middleware.py              # Custom middleware (logging, error handling)
│   └── v1/                        # API version 1
│       ├── auth.py                # /api/auth/* routes
│       ├── files.py               # /api/files/* routes
│       ├── quiz.py                # /api/quiz/*, /api/study/* routes
│       ├── flashcards.py          # /api/flashcards/* routes
│       └── annotations.py         # /api/annotations/* routes
│
├── database/                      # Database infrastructure
│   ├── connection.py              # Connection pooling and management
│   ├── migrations.py              # Database migration utilities
│   └── schema.py                  # Schema definitions
│
├── utils/                         # Utility functions
│   ├── security.py                # Security helpers
│   └── validators.py              # Input validators
│
└── main.py                        # Application entry point

```

### Layer Responsibilities

#### 1. Core Layer (`core/`)
- **Purpose**: Application-wide infrastructure
- **Contains**: Configuration, logging, custom exceptions
- **Dependencies**: None (foundation layer)

#### 2. Domain Layer (`domain/`)
- **Purpose**: Business entities and their rules
- **Contains**: Pydantic models representing real-world concepts
- **Dependencies**: None (pure business logic)
- **Example**:
  ```python
  # domain/user.py
  class UserModel(BaseModel):
      id: str
      email: EmailStr
      name: str
      created_at: datetime
  ```

#### 3. Repository Layer (`repository/`)
- **Purpose**: Data access abstraction
- **Contains**: Database queries, CRUD operations
- **Dependencies**: Domain models, Core (config, logging, exceptions)
- **Example**:
  ```python
  # repository/user_repository.py
  class UserRepository(BaseRepository[UserModel]):
      def find_by_email(self, email: str) -> Optional[UserModel]:
          return self.find_one_by(email=email)
  ```

#### 4. Service Layer (`services/`)
- **Purpose**: Business logic and orchestration
- **Contains**: Complex operations, validations, external service calls
- **Dependencies**: Repositories, Domain models, External APIs
- **Example**:
  ```python
  # services/file_service.py
  class FileService:
      def __init__(self, file_repo: FileRepository, ai_client: GeminiClient):
          self.file_repo = file_repo
          self.ai_client = ai_client
      
      async def process_document(self, file_id: str) -> ProcessingResult:
          # 1. Get file from repository
          # 2. Extract text
          # 3. Send to AI for analysis
          # 4. Update file with results
  ```

#### 5. API Layer (`api/`)
- **Purpose**: HTTP request/response handling
- **Contains**: FastAPI routes, request validation, response formatting
- **Dependencies**: Services, Domain models (for response types)
- **Example**:
  ```python
  # api/v1/files.py
  @router.post("/api/files/{file_id}/process")
  async def process_file(
      file_id: str,
      user_id: str = Depends(get_current_user),
      file_service: FileService = Depends()
  ):
      result = await file_service.process_document(file_id, user_id)
      return result.model_dump()
  ```

---

## 📂 Frontend Structure

```
frontend/src/
├── api/                           # API client layer
│   ├── client.ts                  # Base HTTP client with auth and error handling
│   ├── endpoints/                 # API endpoint definitions
│   │   ├── auth.ts                # Authentication API calls
│   │   ├── files.ts               # File management API calls
│   │   ├── quiz.ts                # Quiz API calls
│   │   ├──flashcards.ts          # Flashcards API calls
│   │   └── annotations.ts         # Annotations API calls
│   └── types/                     # API types
│       ├── requests.ts            # Request types
│       └── responses.ts           # Response types
│
├── components/                    # Reusable components
│   ├── common/                    # Generic UI components
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   └── LoadingSpinner.tsx
│   ├── layout/                    # Layout components
│   │   ├── Navbar.tsx
│   │   └── ErrorBoundary.tsx
│   ├── pdf/                       # PDF-related components
│   │   ├── PdfViewer.tsx
│   │   ├── PdfViewerWithAnnotations.tsx
│   │   └── AnnotationSidebar.tsx
│   └── study/                     # Study feature components
│       ├── StudyTimer.tsx
│       ├── Chat.tsx
│       └── ProgressTracker.tsx
│
├── features/                      # Feature modules
│   ├── auth/                      # Authentication feature
│   │   ├── components/            # Auth-specific components
│   │   ├── hooks/                 # Auth hooks (useAuth, useLogin)
│   │   ├── context/               # AuthContext
│   │   └── types.ts               # Auth types
│   ├── files/                     # File management feature
│   │   ├── components/            # File components (FileUpload, FileList)
│   │   ├── hooks/                 # File hooks (useFileUpload, useFileList)
│   │   └── types.ts
│   ├── quiz/                      # Quiz feature
│   │   ├── components/            # Quiz components
│   │   ├── hooks/                 # Quiz hooks
│   │   └── types.ts
│   └── flashcards/                # Flashcards feature
│       ├── components/
│       ├── hooks/
│       └── types.ts
│
├── hooks/                         # Shared custom hooks
│   ├── useApi.ts                  # Generic API hook with loading/error states
│   ├── useLocalStorage.ts         # LocalStorage hook
│   └── useDebounce.ts             # Debounce hook for search
│
├── store/                         # State management
│   └── contexts/                  # React contexts
│       ├── AuthContext.tsx        # Authentication state
│       ├── ThemeContext.tsx       # Theme (dark/light mode)
│       └── ToastContext.tsx       # Toast notifications
│
├── utils/                         # Utility functions
│   ├── constants.ts               # App constants
│   ├── formatters.ts              # Data formatting (dates, numbers)
│   ├── validators.ts              # Form validators
│   └── errors.ts                  # Error handling utilities
│
├── types/                         # Global TypeScript types
│   ├── global.ts                  # Global type definitions
│   └── enums.ts                   # Enums (AppView, FileStatus, etc.)
│
├── pages/                         # Page components (routes)
│   ├── Home.tsx
│   ├── Auth.tsx
│   ├── Library.tsx
│   ├── Profile.tsx
│   ├── Quiz.tsx
│   ├── Topics.tsx
│   ├── Results.tsx
│   └── Processing.tsx
│
├── App.tsx                        # Main app component (routing)
└── main.tsx                       # App entry point
```

---

## 🔄 Data Flow

### Backend Request Flow
```
1. HTTP Request
   ↓
2. API Layer (FastAPI route)
   - Validate request (Pydantic)
   - Extract dependencies (auth, services)
   ↓
3. Service Layer
   - Business logic
   - Orchestrate operations
   ↓
4. Repository Layer
   - Database queries
   - Data transformation
   ↓
5. Database
   - SQL execution
   ↓
6. Response (back up the chain)
   - Domain model → API response model → JSON
```

### Frontend Request Flow
```
1. User Action (button click, form submit)
   ↓
2. Component Event Handler
   ↓
3. Custom Hook (optional)
   - Loading state management
   - Error handling
   ↓
4. API Client
   - HTTP request
   - Auth headers
   ↓
5. Backend API
   ↓
6. Response Handling
   - Update local state
   - Show toast notification
   - Trigger re-render
```

---

## 🎯 Key Design Patterns

### 1. Repository Pattern
**Purpose**: Separate data access from business logic  
**Files**: `repository/base.py`, `repository/*_repository.py`  
**Benefit**: Testable, swappable data sources

### 2. Service Layer Pattern
**Purpose**: Encapsulate complex business logic  
**Files**: `services/*_service.py`  
**Benefit**: Reusable logic, separation of concerns

### 3. Dependency Injection
**Purpose**: Provide dependencies to functions/classes  
**Files**: `api/dependencies.py`  
**Benefit**: Testable, flexible, loosely coupled

### 4. Domain-Driven Design
**Purpose**: Model business concepts accurately  
**Files**: `domain/*.py`  
**Benefit**: Clear business rules, type safety

### 5. Custom Exception Hierarchy
**Purpose**: Meaningful error messages with proper HTTP codes  
**Files**: `core/exceptions.py`  
**Benefit**: Consistent error handling, better debugging

---

## 📊 Database Schema

All tables are created in `/data/smart_study_platform.db` (SQLite).

### Tables
1. **users** - User accounts
2. **files** - Uploaded PDF files
3. **quiz_attempts** - Quiz completion records
4. **flashcards** - Generated flashcards
5. **flashcard_reviews** - Flashcard review history
6. **highlights** - PDF highlights
7. **annotations** - PDF annotations
8. **bookmarks** - PDF bookmarks
9. **study_sessions** - Study time tracking

---

## 🔒 Security

### Backend Security
- **JWT Authentication**: Tokens expire after 7 days
- **Password Hashing**: bcrypt with salt
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Whitelist allowed origins
- **Input Validation**: Pydantic models validate all inputs

### Frontend Security
- **XSS Protection**: React escapes by default
- **Token Storage**: localStorage with automatic expiry
- **HTTPS Only**: Production uses TLS
- **CSP Headers**: Content Security Policy enforced

---

## 🚀 Getting Started

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create `.env` file in project root:
```env
# Backend
JWT_SECRET=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key
DATABASE_PATH=./data/smart_study_platform.db

# Frontend
VITE_API_BASE_URL=http://localhost:8000
```

---

## 📝 Code Standards

### Python (Backend)
- **Type hints**: All functions have type annotations
- **Docstrings**: Google-style docstrings for all public functions
- **Line length**: Maximum 100 characters
- **Imports**: Organized (stdlib → third-party → local)
- **Naming**: snake_case for variables/functions, PascalCase for classes

### TypeScript (Frontend)
- **Strict mode**: TypeScript strict mode enabled
- **ESLint**: Code linting enforced
- **Prettier**: Code formatting automated
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **File organization**: One component per file

---

## 🧪 Testing Strategy

### Backend Tests
- **Unit tests**: Test repositories and services in isolation
- **Integration tests**: Test API endpoints end-to-end
- **Fixtures**: Shared test data and mocks

### Frontend Tests
- **Component tests**: React Testing Library
- **Hook tests**: Test custom hooks
- **Integration tests**: Test full user flows

---

## 📈 Performance Optimizations

### Backend
- **Database connection pooling** (planned)
- **PDF text caching**: Store extracted text to avoid re-processing
- **AI context limiting**: Reduce token usage
- **Async operations**: Non-blocking AI calls

### Frontend
- **Code splitting**: Lazy load routes
- **Memo optimization**: React.memo for expensive components
- **Debouncing**: Search inputs
- **LocalStorage caching**: Reduce API calls

---

## 🔄 Migration from Old Structure

The refactored architecture maintains full compatibility with the existing database and API contracts. Key migrations:

1. **database.py** → Repositories (data access abstracted)
2. **auth.py** → `services/auth_service.py` (business logic separated)
3. **Routers** → Thinner, delegate to services
4. **Frontend `api.ts`** → Class-based API client
5. **App state** → Enum-based instead of string literals

---

*This structure provides a solid foundation for future growth, testing, and team collaboration.*
