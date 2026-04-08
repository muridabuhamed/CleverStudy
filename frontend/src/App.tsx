import React from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { FileUpload } from './components/FileUpload';
import { Processing } from './pages/Processing';
import { Quiz } from './pages/Quiz';
import { Results } from './pages/Results';
import { Topics } from './pages/Topics';
import { Library } from './pages/Library';
import { Profile } from './pages/Profile';
import { Flashcards } from './pages/Flashcards';
import { AppState, Question, QuizResult } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { api, ApiError, FileRecord } from './services/api';
import { ERROR_MESSAGES, APP_CONFIG } from './config/constants';
import { PdfViewer } from './components/PdfViewer';
import { PdfViewerWithAnnotations } from './components/PdfViewerWithAnnotations';
import { Chat } from './components/Chat';
import { useAuth } from './contexts/AuthContext';
import { Book, BookOpen, FileText, Pencil, GraduationCap, Notebook } from 'lucide-react';

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const [state, setState] = React.useState<AppState>('HOME');
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const [quizResult, setQuizResult] = React.useState<QuizResult | null>(null);
  const [topics, setTopics] = React.useState<string[]>([]);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [currentFileId, setCurrentFileId] = React.useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = React.useState<string>('');
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);

  // Clear all state when user logs out
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Reset all document state so it doesn't leak to the next user
      setCurrentFileId(null);
      setCurrentFileName('');
      setPdfUrl(null);
      setTopics([]);
      setQuestions([]);
      setQuizResult(null);
      setError(null);
      // Stay on HOME page to show landing page to visitors
      if (state !== 'SIGNUP' && state !== 'LOGIN' && state !== 'HOME') {
        setState('HOME');
      }
    }
  }, [isAuthenticated, loading]);

  const handleStart = () => {
    setError(null);
    setState('UPLOAD');
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Upload file with real progress tracking
      const uploadResult = await api.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      const apiUrl = new URL(APP_CONFIG.API_BASE_URL);
      const baseUrl = `${apiUrl.protocol}//${apiUrl.host}`;
      const url = `${baseUrl}/uploads/${uploadResult.fileId}.pdf`;

      setPdfUrl(url);
      setCurrentFileId(uploadResult.fileId);
      setCurrentFileName(file.name);
      setIsUploading(false);
      setState('PROCESSING');

      // Process document with AI
      const processResult = await api.processDocument(uploadResult.fileId);

      setTopics(processResult.topics);
      setQuestions(processResult.questions);
      setState('TOPICS');

    } catch (err) {
      setIsUploading(false);
      const errorMessage = err instanceof ApiError
        ? err.message
        : ERROR_MESSAGES.UPLOAD_FAILED;
      setError(errorMessage);
      setState('UPLOAD'); // Go back to the upload screen to show the error
      console.error('Upload/Process error:', err);
    }
  };

  const handleStudyFile = (file: FileRecord) => {
    const apiUrl = new URL(APP_CONFIG.API_BASE_URL);
    const baseUrl = `${apiUrl.protocol}//${apiUrl.host}`;
    setPdfUrl(`${baseUrl}/uploads/${file.id}.pdf`);
    setTopics(file.topics);
    setQuestions(file.questions);
    setCurrentFileId(file.id);
    setCurrentFileName(file.original_name);
    setState('TOPICS');
  };

  const handleQuizComplete = async (answers: { questionId: string; selectedAnswer: number }[]) => {
    const results = answers.map(ans => {
      const question = questions.find(q => q.id === ans.questionId);
      return {
        questionId: ans.questionId,
        selectedAnswer: ans.selectedAnswer,
        isCorrect: question?.correctAnswer === ans.selectedAnswer
      };
    });

    const score = results.filter(r => r.isCorrect).length;
    setQuizResult({
      score,
      total: questions.length,
      answers: results
    });

    // Save quiz attempt to database
    if (currentFileId) {
      try {
        await api.submitQuizAttempt(currentFileId, score, questions.length);
      } catch (error) {
        console.error('Failed to save quiz attempt:', error);
      }
    }

    setState('RESULTS');
  };

  const getPageTransition = (currentState: AppState) => {
    // Ultra-lightweight transitions - just opacity + minimal movement
    return {
      initial: { opacity: 0, y: 5 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -5 }
    };
  };

  const renderContent = () => {
    // Show authentication screens when explicitly requested
    if (!isAuthenticated && !loading && (state === 'LOGIN' || state === 'SIGNUP')) {
      return <Auth defaultTab={state === 'SIGNUP' ? 'signup' : 'login'} />;
    }

    // Protected routes - redirect to login if not authenticated
    if (!isAuthenticated && !loading && state !== 'HOME') {
      setState('LOGIN');
      return <Auth defaultTab="login" />;
    }

    switch (state) {
      case 'HOME':
        return <Home onStart={handleStart} onNavigate={setState} />;
      case 'PROFILE':
        return <Profile />;
      case 'UPLOAD':
        return (
          <div className="max-w-4xl mx-auto py-20 px-4 relative">
            {/* Floating Books and Papers Background */}
            <motion.div
                className="absolute top-16 left-12 text-indigo-400 opacity-30 pointer-events-none"
                animate={{
                    y: [0, -25, 0],
                    rotate: [0, 15, 0]
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <BookOpen size={60} />
            </motion.div>
            
            <motion.div
                className="absolute top-1/3 right-20 text-violet-400 opacity-35 pointer-events-none"
                animate={{
                    y: [0, 30, 0],
                    rotate: [0, -20, 0]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                }}
            >
                <Book size={52} />
            </motion.div>
            
            <motion.div
                className="absolute bottom-20 left-16 text-indigo-500 opacity-32 pointer-events-none"
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, 0]
                }}
                transition={{
                    duration: 6.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.2
                }}
            >
                <FileText size={48} />
            </motion.div>
            
            <motion.div
                className="absolute top-1/2 left-1/4 text-violet-400 opacity-28 pointer-events-none"
                animate={{
                    y: [0, 25, 0],
                    rotate: [0, -15, 0]
                }}
                transition={{
                    duration: 7.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
            >
                <Notebook size={56} />
            </motion.div>
            
            <motion.div
                className="absolute top-2/3 right-1/3 text-indigo-400 opacity-30 pointer-events-none"
                animate={{
                    y: [0, -30, 0],
                    rotate: [0, 20, 0]
                }}
                transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.8
                }}
            >
                <GraduationCap size={64} />
            </motion.div>
            
            <motion.div
                className="absolute bottom-32 right-16 text-violet-500 opacity-35 pointer-events-none"
                animate={{
                    y: [0, 20, 0],
                    rotate: [0, -25, 0]
                }}
                transition={{
                    duration: 8.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5
                }}
            >
                <Pencil size={44} />
            </motion.div>
            
            <motion.div
                className="absolute top-1/4 left-1/3 text-indigo-300 opacity-28 pointer-events-none"
                animate={{
                    y: [0, -22, 0],
                    rotate: [0, 12, 0]
                }}
                transition={{
                    duration: 7.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3
                }}
            >
                <Book size={50} />
            </motion.div>

            <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Upload Study Material</h2>
              <p className="text-slate-500 dark:text-slate-400">Upload your lecture notes in PDF format to begin analysis.</p>
            </div>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-center">
                {error}
              </div>
            )}
            <FileUpload
              onUpload={handleUpload}
              isUploading={isUploading}
              progress={uploadProgress}
              error={error}
            />
            </div>
          </div>
        );
      case 'PROCESSING':
        return <Processing />;
      case 'TOPICS':
        return <Topics
          topics={topics}
          fileId={currentFileId}
          onStartQuiz={() => setState('QUIZ')}
          onStartFlashcards={() => setState('FLASHCARDS')}
        />;
      case 'FLASHCARDS':
        return currentFileId ? (
          <Flashcards
            fileId={currentFileId}
            fileName={currentFileName}
            onBack={() => setState('TOPICS')}
          />
        ) : null;
      case 'QUIZ':
        return <Quiz questions={questions} fileId={currentFileId} onComplete={handleQuizComplete} />;
      case 'RESULTS':
        return quizResult ? (
          <Results
            questions={questions}
            result={quizResult}
            onRestart={() => setState('QUIZ')}
            onNewUpload={() => {
              setError(null);
              setTopics([]);
              setQuestions([]);
              setState('UPLOAD');
            }}
          />
        ) : null;
      case 'LIBRARY':
        return <Library onStudy={handleStudyFile} onNavigate={setState} />;
      default:
        return <Home onStart={handleStart} onNavigate={setState} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar currentState={state} onNavigate={setState} />

      <main className="relative flex-1 flex flex-col min-h-0">

        {/* PDF with Annotations + Chat side by side — shown on PROCESSING/TOPICS/QUIZ/RESULTS */}
        {['PROCESSING', 'TOPICS', 'QUIZ', 'RESULTS'].includes(state) && pdfUrl && currentFileId && (
          <div className="flex w-full h-[calc(100vh-64px)] border-b border-slate-200 bg-slate-100 shadow-inner">
            {/* PDF Viewer with Annotations — takes 70% width */}
            <div className="flex-1 min-w-0 border-r-2 border-slate-300 overflow-hidden shadow-2xl">
              <PdfViewerWithAnnotations url={pdfUrl} filename={currentFileName} fileId={currentFileId} />
            </div>
            {/* Chat — takes 30% width */}
            <div className="w-[30%] shrink-0 h-full overflow-hidden bg-white dark:bg-slate-800 shadow-xl">
              <Chat fileId={currentFileId} />
            </div>
          </div>
        )}

        {/* Page Content below */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={state}
              initial={getPageTransition(state).initial}
              animate={getPageTransition(state).animate}
              exit={getPageTransition(state).exit}
              transition={{ 
                duration: 0.25,
                ease: "easeOut"
              }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}
