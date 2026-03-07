import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'smart_study_platform.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    topics TEXT,
    questions TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS quiz_attempts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    file_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (file_id) REFERENCES files(id)
  );
`);

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    created_at: string;
}

export interface FileRecord {
    id: string;
    filename: string;
    original_name: string;
    user_id: string;
    created_at: string;
    topics: string; // JSON string
    questions: string; // JSON string
    status: 'pending' | 'completed';
}

export interface QuizAttempt {
    id: string;
    user_id: string;
    file_id: string;
    score: number;
    total: number;
    completed_at: string;
}

export const dbService = {
    // User operations
    createUser(id: string, email: string, password: string, name: string) {
        const stmt = db.prepare('INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)');
        return stmt.run(id, email, password, name);
    },

    getUserByEmail(email: string): User | undefined {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        return stmt.get(email) as User | undefined;
    },

    getUserById(id: string): User | undefined {
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        return stmt.get(id) as User | undefined;
    },

    // File operations
    addFile(id: string, filename: string, originalName: string, userId: string) {
        const stmt = db.prepare('INSERT INTO files (id, filename, original_name, user_id) VALUES (?, ?, ?, ?)');
        return stmt.run(id, filename, originalName, userId);
    },

    updateFileAnalysis(id: string, topics: string[], questions: any[]) {
        const stmt = db.prepare('UPDATE files SET topics = ?, questions = ?, status = ? WHERE id = ?');
        return stmt.run(JSON.stringify(topics), JSON.stringify(questions), 'completed', id);
    },

    getAllFiles(): FileRecord[] {
        const stmt = db.prepare('SELECT * FROM files ORDER BY created_at DESC');
        return stmt.all() as FileRecord[];
    },

    getFilesByUser(userId: string): FileRecord[] {
        const stmt = db.prepare('SELECT * FROM files WHERE user_id = ? ORDER BY created_at DESC');
        return stmt.all(userId) as FileRecord[];
    },

    getFileById(id: string): FileRecord | undefined {
        const stmt = db.prepare('SELECT * FROM files WHERE id = ?');
        return stmt.get(id) as FileRecord | undefined;
    },

    deleteFile(id: string) {
        const stmt = db.prepare('DELETE FROM files WHERE id = ?');
        return stmt.run(id);
    },

    // Quiz attempts
    addQuizAttempt(id: string, userId: string, fileId: string, score: number, total: number) {
        const stmt = db.prepare('INSERT INTO quiz_attempts (id, user_id, file_id, score, total) VALUES (?, ?, ?, ?, ?)');
        return stmt.run(id, userId, fileId, score, total);
    },

    getUserStats(userId: string) {
        const stmt = db.prepare(`
            SELECT 
                COUNT(DISTINCT file_id) as files_studied,
                COUNT(*) as quizzes_taken,
                AVG(CAST(score AS FLOAT) / total * 100) as avg_score,
                SUM(score) as total_correct,
                SUM(total) as total_questions
            FROM quiz_attempts 
            WHERE user_id = ?
        `);
        return stmt.get(userId);
    },

    getRecentAttempts(userId: string, limit: number = 10) {
        const stmt = db.prepare(`
            SELECT qa.*, f.original_name as file_name
            FROM quiz_attempts qa
            JOIN files f ON qa.file_id = f.id
            WHERE qa.user_id = ?
            ORDER BY qa.completed_at DESC
            LIMIT ?
        `);
        return stmt.all(userId, limit);
    }
};
