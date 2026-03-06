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
  CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    topics TEXT,
    questions TEXT,
    status TEXT DEFAULT 'pending'
  )
`);

export interface FileRecord {
    id: string;
    filename: string;
    original_name: string;
    created_at: string;
    topics: string; // JSON string
    questions: string; // JSON string
    status: 'pending' | 'completed';
}

export const dbService = {
    addFile(id: string, filename: string, originalName: string) {
        const stmt = db.prepare('INSERT INTO files (id, filename, original_name) VALUES (?, ?, ?)');
        return stmt.run(id, filename, originalName);
    },

    updateFileAnalysis(id: string, topics: string[], questions: any[]) {
        const stmt = db.prepare('UPDATE files SET topics = ?, questions = ?, status = ? WHERE id = ?');
        return stmt.run(JSON.stringify(topics), JSON.stringify(questions), 'completed', id);
    },

    getAllFiles(): FileRecord[] {
        const stmt = db.prepare('SELECT * FROM files ORDER BY created_at DESC');
        return stmt.all() as FileRecord[];
    },

    getFileById(id: string): FileRecord | undefined {
        const stmt = db.prepare('SELECT * FROM files WHERE id = ?');
        return stmt.get(id) as FileRecord | undefined;
    },

    deleteFile(id: string) {
        const stmt = db.prepare('DELETE FROM files WHERE id = ?');
        return stmt.run(id);
    }
};
