# Smart Study Platform

An AI-powered study assistant that helps students learn effectively by analyzing their study materials and generating custom quiz questions.

## ✨ Features

### 🔐 **User Authentication & Accounts**
- **User Registration & Login** - Secure account creation with email/password
- **Personal Study Library** - Each user has their own collection of study materials
- **Progress Tracking** - Track quiz attempts, scores, and improvement over time
- **User Profile** - View statistics, recent quizzes, and learning progress

### 📚 **Study Features**
- **PDF Upload** - Upload lecture notes, textbooks, or research papers (up to 10MB)
- **AI Content Analysis** - Automatic extraction of 6-8 key topics using Google Gemini AI
- **Custom Quiz Generation** - 10 personalized multiple-choice questions per document
- **PDF Viewer** - Read your notes side-by-side with quiz questions
- **AI Chat Assistant** - Ask questions about your study material in real-time

### 📊 **Progress & Analytics**
- **Quiz History** - Track all your quiz attempts
- **Performance Metrics**:
  - Files studied count
  - Total quizzes taken
  - Average score percentage
  - Correct/total questions ratio
- **Recent Activity** - View your last 5 quiz attempts with scores

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/muridabuhamed/AI-Study-Helper.git
   cd AI-Study-Helper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env.local
   
   # Edit .env.local and add your credentials
   ```

   Required variables in `.env.local`:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   JWT_SECRET=your-random-secret-key-for-jwt-tokens
   ```

4. **Start the application**
   
   **Option 1: Using PowerShell (Windows)**
   ```powershell
   .\start.ps1
   ```

   **Option 2: Manual start**
   ```bash
   # Terminal 1: Start backend server (port 3001)
   npm run dev:server
   
   # Terminal 2: Start frontend (port 3000)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📖 How to Use

### 1. Create an Account
- Click "Get Started Free" on the home page
- Enter your name, email, and password
- You'll be automatically logged in

### 2. Upload Study Material
- Click "Upload PDF Now" or navigate to Upload
- Drag and drop or click to select a PDF file
- Wait for the AI to analyze your document (usually 10-30 seconds)

### 3. Review Topics
- View the key topics extracted from your document
- Click "Start Practice Quiz" when ready

### 4. Take the Quiz
- Answer 10 multiple-choice questions
- Progress is saved automatically
- See immediate feedback on completion

### 5. View Results
- See your score and detailed explanations
- Review correct and incorrect answers
- Track your progress in your Profile

### 6. Chat with Your Documents
- Ask questions about the study material
- Get contextual answers based on the document content
- Build deeper understanding through conversation

## 🏗️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS 4** - Modern styling
- **Motion** (Framer Motion) - Smooth animations
- **Lucide React** - Beautiful icons

### Backend
- **Express.js** - Fast, minimalist web framework
- **Better SQLite3** - Embedded database
- **JWT (jsonwebtoken)** - Secure authentication  
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Google Generative AI SDK** - AI-powered analysis
- **pdf-parse** - PDF text extraction

### Authentication
- JWT (JSON Web Tokens) for session management
- bcrypt for secure password hashing
- Token stored in localStorage on client
- Protected routes with authentication middleware

## 📁 Project Structure

```
Smart-Study-Platform/
├── src/                      # Frontend React app
│   ├── components/          # Reusable UI components
│   │   ├── Chat.tsx        # AI chat interface
│   │   ├── FileUpload.tsx  # File upload component
│   │   ├── Navbar.tsx      # Navigation bar
│   │   └── PdfViewer.tsx   # PDF display component
│   ├── pages/              # Main application pages
│   │   ├── Home.tsx        # Landing page
│   │   ├── Login.tsx       # User login
│   │   ├── Signup.tsx      # User registration
│   │   ├── Profile.tsx     # User stats & progress
│   │   ├── Library.tsx     # User's document library
│   │   ├── Topics.tsx      # Extracted topics view
│   │   ├── Quiz.tsx        # Interactive quiz
│   │   └── Results.tsx     # Quiz results & review
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication state
│   ├── services/           # API client
│   │   └── api.ts          # Backend API calls
│   └── config/             # Configuration
│       └── constants.ts    # App constants
├── server/                  # Backend Node.js server
│   ├── middleware/         # Express middleware
│   │   └── auth.ts         # JWT authentication
│   ├── services/           # Business logic
│   │   ├── gemini.ts       # AI document analysis
│   │   └── pdf-parser.ts   # PDF text extraction
│   ├── db.ts               # Database operations
│   └── index.ts            # Express server setup
├── data/                    # SQLite database storage
├── uploads/                 # Uploaded PDF files
└── .env.local              # Environment variables (not in git)
```

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt before storage
- **JWT Authentication**: Secure token-based authentication with 7-day expiry
- **Protected Routes**: API endpoints require valid authentication tokens
- **Input Validation**: Server-side validation for all user inputs
- **File Type Validation**: Only PDF files are accepted
- **File Size Limits**: Maximum 10MB per upload

## 📊 Database Schema

```sql
-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Files table  
CREATE TABLE files (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    topics TEXT,              -- JSON array
    questions TEXT,           -- JSON array
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Quiz attempts tracking
CREATE TABLE quiz_attempts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    file_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (file_id) REFERENCES files(id)
);
```

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/me` - Get current user info (requires auth)

### Files
- `POST /api/upload` - Upload PDF file (requires auth)
- `POST /api/process/:fileId` - Analyze document with AI (requires auth)
- `GET /api/files` - Get user's files (requires auth)
- `DELETE /api/files/:fileId` - Delete a file (requires auth)

### Quiz
- `POST /api/quiz/submit` - Save quiz attempt (requires auth)
- `GET /api/user/stats` - Get user statistics (requires auth)

### Chat
- `POST /api/chat/:fileId` - Chat with document (requires auth)

### Health
- `GET /api/health` - Server health check

## 🎨 UI Features

- **Modern Design**: Clean interface with Tailwind CSS
- **Responsive**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion for delightful interactions
- **Dark Mode Ready**: Easy to add dark theme support
- **Accessible**: Semantic HTML and ARIA labels

## 🚀 Deployment

### Environment Variables for Production
```env
GEMINI_API_KEY=your_production_api_key
JWT_SECRET=your_very_long_random_secret_key_change_this
NODE_ENV=production
PORT=3001
```

### Build Commands
```bash
# Build frontend
npm run build

# Build backend  
npm run build:server
```

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for document analysis
- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and users of this project

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for students who want to study smarter, not harder.**
