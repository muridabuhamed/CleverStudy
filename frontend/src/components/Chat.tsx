import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Sparkles, Loader2, MessageSquare } from 'lucide-react';
import { api } from '../services/api';

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
            const response = await api.chatWithDocument(fileId, userMessage, historyForApi);
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

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-xl">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 leading-tight">Smart Assistant</h3>
                        <p className="text-xs text-slate-500">Only answering about this document</p>
                    </div>
                </div>
                <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
            >
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                        <div className="bg-slate-100 p-4 rounded-full">
                            <Sparkles className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div className="max-w-xs">
                            <p className="text-slate-900 font-semibold mb-1">Ask me anything!</p>
                            <p className="text-sm text-slate-500">I've analyzed your document and I'm ready to help you study. Try asking for a summary or an explanation of a concept.</p>
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
                        <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-indigo-600 text-white'
                                }`}>
                                {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${message.role === 'user'
                                ? 'bg-slate-100 text-slate-900 rounded-tr-none'
                                : 'bg-indigo-50 text-indigo-900 border border-indigo-100 rounded-tl-none'
                                }`}>
                                {message.parts}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex gap-3 max-w-[85%] items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                                <span className="text-sm text-slate-500">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form
                onSubmit={handleSend}
                className="p-4 border-t border-slate-100 bg-white"
            >
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        placeholder="Ask about the document..."
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};
