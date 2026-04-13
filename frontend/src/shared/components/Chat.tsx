import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Sparkles, Loader2, MessageSquare, ChevronRight } from 'lucide-react';
import { libraryApi } from '../../features/library/services/libraryApi';

interface Message {
    role: 'user' | 'model';
    parts: string;
}

interface ChatProps {
    fileId: string;
}

export const Chat: React.FC<ChatProps> = ({ fileId }) => {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const scrollRef = React.useRef<HTMLDivElement>(null);
    // Keep a ref to always have the latest messages for the API call
    const messagesRef = React.useRef<Message[]>([]);

    React.useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    // Listen for askAI events from PDF viewer
    React.useEffect(() => {
        const handleAskAI = (event: CustomEvent) => {
            const selectedText = event.detail?.text;
            if (selectedText) {
                setInput(`Explain this: "${selectedText}"`);
            }
        };
        
        window.addEventListener('askAI', handleAskAI as EventListener);
        return () => window.removeEventListener('askAI', handleAskAI as EventListener);
    }, []);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        // Capture full history including the new user message for the API call
        const historyForApi = [...messagesRef.current, { role: 'user' as const, parts: userMessage }];
        setMessages(historyForApi);
        setIsLoading(true);

        try {
            const response = await libraryApi.chatWithDocument(fileId, userMessage, historyForApi);
            setMessages(prev => [...prev, { role: 'model', parts: response }]);
        } catch (error: any) {
            console.error('Chat error:', error);
            const errorMessage = error.message || "I'm sorry, I encountered an error while processing your request. Please try again.";
            setMessages(prev => [...prev, {
                role: 'model',
                parts: errorMessage
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (isCollapsed) {
        return (
            <div className="h-full bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg rotate-180"
                    title="Expand Chat"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-white to-slate-50 rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-md">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-tight">Smart Assistant</h3>
                        <p className="text-xs text-slate-500">Ask me anything about this document</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsCollapsed(true)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Collapse Chat"
                >
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth bg-white"
            >
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center px-4 py-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <div className="text-center space-y-3 max-w-md mt-6">
                            <h4 className="text-lg font-bold text-slate-900">Ask me anything!</h4>
                            <p className="text-sm text-slate-600">I've analyzed your document and I'm ready to help you study.</p>
                            
                            {showSuggestions && (
                            <div className="space-y-2 mt-5">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Try asking:</p>
                                <div className="space-y-2">
                                    {[
                                        { icon: "📝", text: "Summarize this page", query: "Can you summarize this page for me?" },
                                        { icon: "❓", text: "Generate quiz questions", query: "Generate 5 quiz questions from this content" },
                                        { icon: "🎴", text: "Create flashcards", query: "Create flashcards for the key concepts" },
                                        { icon: "💡", text: "Explain a concept", query: "Explain [concept] in simple terms" },
                                    ].map((prompt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setInput(prompt.query)}
                                            className="w-full text-left px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all group shadow-sm hover:shadow"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{prompt.icon}</span>
                                                <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">{prompt.text}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                )}

                {messages.map((message, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex gap-2.5 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${message.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                                }`}>
                                {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${message.role === 'user'
                                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-tr-md'
                                : 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-slate-900 dark:text-slate-100 border border-indigo-100 dark:border-indigo-800 rounded-tl-md'
                                }`}>
                                {message.parts}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex gap-2.5 max-w-[85%] items-center">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-slate-100 px-4 py-2.5 rounded-2xl rounded-tl-md flex items-center gap-2 shadow-sm">
                                <Loader2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
                                <span className="text-sm text-slate-600">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form
                onSubmit={handleSend}
                className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        disabled={isLoading}
                        placeholder="Ask about the document..."
                        className="w-full pl-4 pr-12 py-3.5 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm shadow-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};
