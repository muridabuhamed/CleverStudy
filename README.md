
# CleverStudy - Smart Study Platform

An AI-powered study platform that helps students master any subject by analyzing PDF materials and generating custom quizzes, flashcards, and interactive study tools.

## ✨ Features

### 📚 Document Management
- Upload PDF study materials (lecture notes, textbooks, research papers)
- Organized library with search functionality
- Multi-document support

### 🤖 AI-Powered Analysis
- Automatic extraction of key topics using Google Gemini AI
- Generation of multiple-choice quiz questions with explanations
- AI-powered flashcard creation
- Intelligent chat assistant for document Q&A

### 📝 Highlights & Annotations (NEW!)
- **PDF Text Highlighting**: Select and highlight important text with multiple colors
- **Personal Notes**: Add notes to specific pages with timestamps
- **Bookmarks**: Quick navigation to important pages
- **Searchable Annotations**: Search across all your highlights and notes
- **Annotation Sidebar**: Organized view of all annotations grouped by page

### 🎯 Quiz System
- Interactive multiple-choice quizzes
- Automatic scoring and performance tracking
- Detailed explanations for correct answers
- Quiz history and analytics

### 🗂️ Flashcards
- AI-generated flashcards with customizable count
- Spaced repetition tracking with difficulty ratings
- Review statistics per document

### 💬 AI Chat Assistant
- Context-aware conversations about your documents
- Chat history tracking
- Document-scoped responses

### 👤 User Management
- Secure authentication with JWT tokens
- Personal library and statistics
- Progress tracking across sessions

## 🛠️ Tech Stack

**Backend:**
- FastAPI (Python web framework)
- SQLite database
- Google Gemini AI integration
- JWT authentication with bcrypt
- PyPDF for text extraction

**Frontend:**
- React 19 with TypeScript
- Vite build tool
- Tailwind CSS 4 for styling
- Motion (Framer Motion) for animations
- Lucide React icons

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- Google Gemini API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_secret_key_here
ALLOWED_ORIGINS=http://localhost:5173
```

4. Run the backend server:
```bash
python main.py
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000/api
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📖 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

## 🎨 Key Features in Detail

### Highlights & Annotations

The annotation system allows you to actively engage with your study materials:

1. **Highlight Text**: Select any text in the PDF and choose from 5 color options to highlight
2. **Add Notes**: Create personal notes on any page with a simple click
3. **Bookmark Pages**: Mark important pages for quick access
4. **Search Everything**: Find specific content across all your annotations
5. **Organized Sidebar**: View all annotations grouped by type and page

### AI-Powered Learning

- **Smart Analysis**: Gemini AI extracts key topics and generates relevant questions
- **Contextual Chat**: Ask questions about your documents and get accurate answers
- **Adaptive Flashcards**: AI creates flashcards tailored to your study material

## 📊 Database Schema

- **users**: User accounts and authentication
- **files**: Uploaded PDF documents
- **quiz_attempts**: Quiz history and scores
- **flashcards**: Generated flashcard sets
- **flashcard_reviews**: Spaced repetition tracking
- **highlights**: Text highlights with colors
- **annotations**: Personal notes on pages
- **bookmarks**: Quick navigation markers

## 🔒 Security

- JWT-based authentication
- Bcrypt password hashing
- User-scoped data access
- CORS protection
- Secure file handling

## 🌐 Deployment

- **Frontend**: Configured for Netlify (see `netlify.toml`)
- **Backend**: Configured for Render (see `render.yaml`)

## 📝 License

This project is available for educational and personal use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📧 Support

For questions or issues, please open a GitHub issue.
