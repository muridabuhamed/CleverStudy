import React from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { FileUpload } from './components/FileUpload';
import { Processing } from './pages/Processing';
import { Quiz } from './pages/Quiz';
import { Results } from './pages/Results';
import { Topics } from './pages/Topics';
import { Library } from './pages/Library';
import { Profile } from './pages/Profile';
import { AppState, Question, QuizResult } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { api, ApiError, FileRecord } from './services/api';
import { ERROR_MESSAGES, APP_CONFIG } from './config/constants';
import { PdfViewer } from './components/PdfViewer';
import { Chat } from './components/Chat';
import { useAuth } from './contexts/AuthContext';

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
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loading && !isAuthenticated && state !== 'SIGNUP') {
      setState('LOGIN');
    }
  }, [isAuthenticated, loading, state]);

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

      const baseUrl = APP_CONFIG.API_BASE_URL.replace('/api', '');
      const url = `${baseUrl}/uploads/${uploadResult.fileId}`;

      setPdfUrl(url);
      setCurrentFileId(uploadResult.fileId);
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
    const baseUrl = APP_CONFIG.API_BASE_URL.replace('/api', '');
    setPdfUrl(`${baseUrl}/uploads/${file.id}`);
    setTopics(file.topics);
    setQuestions(file.questions);
    setCurrentFileId(file.id);
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

  const renderContent = () => {
    // Show authentication screens first
    if (!isAuthenticated && !loading) {
      if (state === 'SIGNUP') {
        return <Signup onSwitchToLogin={() => setState('LOGIN')} />;
      }
      return <Login onSwitchToSignup={() => setState('SIGNUP')} />;
    }

    switch (state) {
      case 'HOME':
        return <Home onStart={handleStart} onNavigate={setState} />;
      case 'PROFILE':
        return <Profile />;
      case 'UPLOAD':
        return (
          <div className="max-w-4xl mx-auto py-20 px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Upload Study Material</h2>
              <p className="text-slate-500">Upload your lecture notes in PDF format to begin analysis.</p>
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
        );
      case 'PROCESSING':
        return <Processing />;
      case 'TOPICS':
        return <Topics topics={topics} onStartQuiz={() => setState('QUIZ')} />;
      case 'QUIZ':
        return <Quiz questions={questions} onComplete={handleQuizComplete} />;
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar currentState={state} onNavigate={setState} />

      <main className="relative flex-1 flex flex-col min-h-0">
        <div className={`flex-1 flex min-h-0 ${['PROCESSING', 'TOPICS', 'QUIZ', 'RESULTS'].includes(state) && pdfUrl ? 'flex-row' : 'flex-col'}`}>
          {/* Main Content Area */}
          <div className={`flex-1 overflow-y-auto ${['PROCESSING', 'TOPICS', 'QUIZ', 'RESULTS'].includes(state) && pdfUrl ? 'w-1/2' : 'w-full'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={state}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* PDF Viewer & Chat Area */}
          {['PROCESSING', 'TOPICS', 'QUIZ', 'RESULTS'].includes(state) && pdfUrl && (
            <div className="w-1/2 h-[calc(100vh-64px)] sticky top-0 border-l border-slate-200 bg-slate-50 flex flex-col overflow-hidden">
              <div className="flex-1 min-h-0 bg-white">
                <PdfViewer url={pdfUrl} />
              </div>
              <div className="h-[400px] p-6 pt-0 border-t border-slate-200 bg-slate-50/50">
                {currentFileId && <Chat fileId={currentFileId} />}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 Smart Study Platform. Empowering students to achieve academic excellence.
          </p>
        </div>
      </footer>
    </div>
  );
}
