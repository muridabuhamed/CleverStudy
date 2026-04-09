import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Trash2, BookOpen, Clock, ChevronRight, Search, Book, Pencil, GraduationCap, Notebook, AlertTriangle } from 'lucide-react';
import { api, FileRecord } from '../services/api';
import { AppState, Question } from '../types';
import { Modal } from '../components/Modal';

interface LibraryProps {
    onStudy: (file: FileRecord) => void;
    onNavigate: (state: AppState) => void;
}

export const Library: React.FC<LibraryProps> = ({ onStudy, onNavigate }) => {
    const [files, setFiles] = React.useState<FileRecord[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [fileToDelete, setFileToDelete] = React.useState<FileRecord | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const loadFiles = async () => {
        try {
            setIsLoading(true);
            const data = await api.getFiles();
            setFiles(data);
        } catch (error) {
            console.error('Failed to load files:', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        loadFiles();
    }, []);

    const handleDelete = (e: React.MouseEvent, file: FileRecord) => {
        e.stopPropagation();
        setFileToDelete(file);
    };

    const confirmDelete = async () => {
        if (!fileToDelete) return;
        
        setIsDeleting(true);
        try {
            await api.deleteFile(fileToDelete.id);
            setFiles(files.filter(f => f.id !== fileToDelete.id));
            setFileToDelete(null);
        } catch (error) {
            console.error('Failed to delete file:', error);
            alert('Failed to delete file. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const cancelDelete = () => {
        if (!isDeleting) {
            setFileToDelete(null);
        }
    };

    const filteredFiles = files.filter(file =>
        file.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.topics.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium">Loading your library...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 relative bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors">
            {/* Floating Books and Papers Background */}
            <motion.div
                className="absolute top-20 left-10 text-indigo-400 dark:text-indigo-500 opacity-25 dark:opacity-30 pointer-events-none"
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
                <BookOpen size={56} />
            </motion.div>
            
            <motion.div
                className="absolute top-1/3 right-16 text-violet-400 dark:text-violet-500 opacity-30 dark:opacity-35 pointer-events-none"
                animate={{
                    y: [0, 30, 0],
                    rotate: [0, -20, 0]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <Book size={48} />
            </motion.div>
            
            <motion.div
                className="absolute bottom-24 left-20 text-indigo-500 dark:text-indigo-600 opacity-28 dark:opacity-35 pointer-events-none"
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, 0]
                }}
                transition={{
                    duration: 6.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
            >
                <FileText size={44} />
            </motion.div>
            
            <motion.div
                className="absolute top-2/3 left-1/4 text-violet-400 opacity-25 pointer-events-none"
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
                <Notebook size={52} />
            </motion.div>
            
            <motion.div
                className="absolute top-1/2 right-1/3 text-indigo-400 opacity-30 pointer-events-none"
                animate={{
                    y: [0, -30, 0],
                    rotate: [0, 20, 0]
                }}
                transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                }}
            >
                <GraduationCap size={60} />
            </motion.div>
            
            <motion.div
                className="absolute bottom-32 right-24 text-violet-500 opacity-32 pointer-events-none"
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
                <Pencil size={40} />
            </motion.div>

            <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">My Library</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage and revisit your analyzed study materials.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search documents or topics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                </div>
            </div>

            {filteredFiles.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-3xl">
                    <div className="bg-slate-50 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        {searchTerm ? 'No matching documents found' : 'Your library is empty'}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                        {searchTerm
                            ? `We couldn't find any documents matching "${searchTerm}"`
                            : "Upload your first PDF to start building your study collection."
                        }
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => onNavigate('UPLOAD')}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                        >
                            <BookOpen className="w-5 h-5" />
                            Upload New PDF
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFiles.map((file, index) => (
                        <motion.div
                            key={file.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.4 }}
                            whileHover={{ 
                                y: -8,
                                transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                            }}
                            onClick={() => onStudy(file)}
                            className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="bg-indigo-50 dark:bg-indigo-900/30 w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                                >
                                    <FileText className="w-6 h-6" />
                                </motion.div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => handleDelete(e, file)}
                                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                                    title="Delete document"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </motion.button>
                            </div>

                            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {file.original_name}
                            </h3>

                            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-6">
                                <Clock className="w-3 h-3" />
                                {new Date(file.created_at).toLocaleDateString()}
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Top Topics</p>
                                <div className="flex flex-wrap gap-2">
                                    {file.topics.slice(0, 3).map((topic, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-medium rounded-lg border border-slate-100 dark:border-slate-600"
                                        >
                                            {topic}
                                        </span>
                                    ))}
                                    {file.topics.length > 3 && (
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center">
                                            +{file.topics.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                <span>Resume Study</span>
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
            </div>

            {/* Delete Confirmation Modal with Smooth Transitions */}
            <Modal
                isOpen={!!fileToDelete}
                onClose={cancelDelete}
                maxWidth="md"
                showCloseButton={!isDeleting}
                closeOnBackdropClick={!isDeleting}
                closeOnEscape={!isDeleting}
            >
                {fileToDelete && (
                    <>
                        {/* Warning Icon with bounce animation */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                delay: 0.2,
                                type: 'spring',
                                stiffness: 200,
                                damping: 15,
                            }}
                            className="mb-6"
                        >
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                        </motion.div>

                        {/* Content with stagger animation */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.3 }}
                            className="text-center mb-8"
                        >
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                                Delete Document?
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                Are you sure you want to delete this document? This action cannot be undone.
                            </p>

                            {/* File info card with slide animation */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                                className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700"
                            >
                                <div className="flex items-start gap-3">
                                    <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-left flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                            {fileToDelete.original_name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            {fileToDelete.topics.length} topics • Created {new Date(fileToDelete.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Actions with stagger */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.3 }}
                            className="flex gap-3"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={cancelDelete}
                                disabled={isDeleting}
                                className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: isDeleting ? 1 : 1.02 }}
                                whileTap={{ scale: isDeleting ? 1 : 0.98 }}
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 px-6 py-3 bg-red-600 dark:bg-red-500 text-white rounded-xl font-semibold hover:bg-red-700 dark:hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    </>
                )}
            </Modal>
        </div>
    );
};
