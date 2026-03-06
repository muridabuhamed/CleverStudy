import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports that need them
dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback to .env if .env.local doesn't exist

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { analyzeDocument, chatWithDocument } from './services/gemini.js';
import { extractTextFromPDF } from './services/pdf-parser.js';
import { dbService } from './db.js';
import { authenticateToken, generateToken, AuthRequest } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, uploadsDir);
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Authentication endpoints
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user exists
    const existingUser = dbService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // Create user
    dbService.createUser(userId, email, hashedPassword, name);

    // Generate token
    const token = generateToken(userId);

    res.json({
      success: true,
      token,
      user: { id: userId, email, name }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = dbService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res) => {
  try {
    const user = dbService.getUserById(req.userId!);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Upload and process PDF endpoint
app.post('/api/upload', authenticateToken, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;

    // Send initial response
    // Save to database with user_id
    dbService.addFile(req.file.filename, req.file.filename, req.file.originalname, req.userId!);

    res.json({
      success: true,
      fileId: req.file.filename,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Process PDF and extract topics
app.post('/api/process/:fileId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { fileId } = req.params;
    const filePath = path.join(uploadsDir, fileId);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Extract text from PDF
    const text = await extractTextFromPDF(filePath);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from PDF' });
    }

    // Analyze document content
    const analysis = await analyzeDocument(text);

    // Clean up file after processing - Disabled to allow PDF viewing in frontend
    // fs.unlinkSync(filePath);

    // Update database with analysis
    dbService.updateFileAnalysis(fileId, analysis.topics, analysis.questions);

    res.json({
      success: true,
      topics: analysis.topics,
      questions: analysis.questions
    });

  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({
      error: 'Failed to process document',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/chat/:fileId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { fileId } = req.params;
    const { message, history } = req.body;
    const filePath = path.join(uploadsDir, fileId);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Extract text from PDF for context
    const text = await extractTextFromPDF(filePath);

    // Generate response using document context
    const response = await chatWithDocument(text, message, history || []);

    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File is too large. Maximum size is 10MB' });
    }
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Library endpoints
app.get('/api/files', authenticateToken, (req: AuthRequest, res) => {
  try {
    const files = dbService.getFilesByUser(req.userId!).map(f => ({
      ...f,
      topics: JSON.parse(f.topics || '[]'),
      questions: JSON.parse(f.questions || '[]')
    }));
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

app.delete('/api/files/:fileId', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { fileId } = req.params;
    const filePath = path.join(uploadsDir, fileId);

    // Delete from filesystem if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    dbService.deleteFile(fileId);

    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Quiz attempt tracking
app.post('/api/quiz/submit', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { fileId, score, total } = req.body;
    const attemptId = uuidv4();

    dbService.addQuizAttempt(attemptId, req.userId!, fileId, score, total);

    res.json({ success: true, attemptId });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Failed to save quiz attempt' });
  }
});

// User stats and progress
app.get('/api/user/stats', authenticateToken, (req: AuthRequest, res) => {
  try {
    const stats = dbService.getUserStats(req.userId!);
    const recentAttempts = dbService.getRecentAttempts(req.userId!, 5);

    res.json({
      stats: stats || {
        files_studied: 0,
        quizzes_taken: 0,
        avg_score: 0,
        total_correct: 0,
        total_questions: 0
      },
      recentAttempts
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get user stats' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
});
