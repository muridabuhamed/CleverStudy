import React from 'react';
import { Loader2, Highlighter, StickyNote, Bookmark, ChevronLeft, ChevronRight, FileText, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { AnnotationSidebar } from './AnnotationSidebar';

interface PdfViewerWithAnnotationsProps {
    url: string;
    filename?: string;
    fileId: string;
}

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Green', value: '#90EE90' },
  { name: 'Blue', value: '#ADD8E6' },
  { name: 'Pink', value: '#FFB6C1' },
  { name: 'Orange', value: '#FFA500' },
];

export const PdfViewerWithAnnotations: React.FC<PdfViewerWithAnnotationsProps> = ({ 
  url, 
  filename, 
  fileId 
}) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [selectedColor, setSelectedColor] = React.useState(HIGHLIGHT_COLORS[0].value);
    const [showAnnotationTools, setShowAnnotationTools] = React.useState(false);
    const [showSidebar, setShowSidebar] = React.useState(true);
    const [isAddingNote, setIsAddingNote] = React.useState(false);
    const [noteText, setNoteText] = React.useState('');
    const [isAddingBookmark, setIsAddingBookmark] = React.useState(false);
    const [bookmarkTitle, setBookmarkTitle] = React.useState('');
    const [selectedText, setSelectedText] = React.useState('');
    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    // Handle text selection (simplified version - works with iframe limitations)
    const handleTextSelection = () => {
      try {
        const selection = window.getSelection();
        if (selection && selection.toString().trim()) {
          setSelectedText(selection.toString().trim());
          setShowAnnotationTools(true);
        } else {
          setShowAnnotationTools(false);
          setSelectedText('');
        }
      } catch (error) {
        console.log('Selection not available from iframe');
      }
    };

    // Create highlight
    const handleCreateHighlight = async () => {
      if (!selectedText) return;

      try {
        const positionData = {
          page: currentPage,
          timestamp: new Date().toISOString()
        };

        await api.createHighlight(
          fileId,
          currentPage,
          selectedText,
          selectedColor,
          positionData
        );

        setShowAnnotationTools(false);
        setSelectedText('');
        // Trigger reload in sidebar
        window.dispatchEvent(new CustomEvent('annotationAdded'));
      } catch (error) {
        console.error('Failed to create highlight:', error);
      }
    };

    // Create note
    const handleCreateNote = async () => {
      if (!noteText.trim()) return;

      try {
        const positionData = {
          page: currentPage,
          timestamp: new Date().toISOString()
        };

        await api.createAnnotation(
          fileId,
          currentPage,
          noteText,
          positionData
        );

        setIsAddingNote(false);
        setNoteText('');
        window.dispatchEvent(new CustomEvent('annotationAdded'));
      } catch (error) {
        console.error('Failed to create note:', error);
      }
    };

    // Create bookmark
    const handleCreateBookmark = async () => {
      if (!bookmarkTitle.trim()) return;

      try {
        await api.createBookmark(fileId, currentPage, bookmarkTitle);
        setIsAddingBookmark(false);
        setBookmarkTitle('');
        window.dispatchEvent(new CustomEvent('annotationAdded'));
      } catch (error) {
        console.error('Failed to create bookmark:', error);
      }
    };

    const navigateToPage = (page: number) => {
      setCurrentPage(page);
      if (iframeRef.current) {
        // Update iframe with page parameter
        const urlWithPage = `${url}#page=${page}&toolbar=1&navpanes=0&scrollbar=1`;
        iframeRef.current.src = urlWithPage;
      }
    };

    return (
        <div className="h-full w-full flex bg-slate-50">
            {/* Main PDF Viewer Area */}
            <div className="flex-1 flex flex-col">
                {/* Header with filename and tools */}
                <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-semibold text-slate-900 truncate max-w-xs" title={filename}>
                            {filename || 'Document'}
                        </h3>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">Page {currentPage}</span>
                    </div>
                </div>

                {/* Annotation Toolbar */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 p-3 shadow-sm">
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Highlight Tool */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => selectedText && handleCreateHighlight()}
                                disabled={!selectedText}
                                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                                    selectedText
                                        ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500 shadow-sm'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                                title="Highlight selected text"
                            >
                                <Highlighter className="w-4 h-4" />
                                Highlight
                            </button>

                            {/* Color Picker */}
                            <div className="flex gap-1 ml-1">
                                {HIGHLIGHT_COLORS.map(color => (
                                    <button
                                        key={color.value}
                                        onClick={() => setSelectedColor(color.value)}
                                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                                            selectedColor === color.value
                                                ? 'border-slate-700 scale-110'
                                                : 'border-slate-300 hover:scale-105'
                                        }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Note Tool */}
                        <button
                            onClick={() => setIsAddingNote(true)}
                            className="px-4 py-2 bg-amber-100 text-amber-900 rounded-lg font-medium hover:bg-amber-200 transition-colors flex items-center gap-2"
                        >
                            <StickyNote className="w-4 h-4" />
                            Add Note
                        </button>

                        {/* Bookmark Tool */}
                        <button
                            onClick={() => setIsAddingBookmark(true)}
                            className="px-4 py-2 bg-indigo-100 text-indigo-900 rounded-lg font-medium hover:bg-indigo-200 transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <Bookmark className="w-4 h-4" />
                            Bookmark Page
                        </button>

                        {/* Ask AI Button - Appears when text is selected */}
                        {selectedText && (
                            <button
                                onClick={() => {
                                    // Dispatch event to Chat component with selected text
                                    window.dispatchEvent(new CustomEvent('askAI', { 
                                        detail: { text: selectedText } 
                                    }));
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-lg animate-pulse"
                            >
                                <Sparkles className="w-4 h-4" />
                                Ask AI about this
                            </button>
                        )}

                        {/* Toggle Sidebar */}
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="ml-auto px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                        >
                            {showSidebar ? 'Hide' : 'Show'} Annotations
                        </button>
                    </div>

                    {/* Helper text */}
                    {selectedText && (
                        <div className="mt-2 text-xs text-indigo-700 bg-indigo-100 px-3 py-2 rounded">
                            Selected: "{selectedText.substring(0, 50)}{selectedText.length > 50 ? '...' : ''}"
                        </div>
                    )}
                </div>

                {/* Add Note Modal */}
                {isAddingNote && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Add Note to Page {currentPage}</h3>
                            <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Enter your note..."
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                                rows={4}
                                autoFocus
                            />
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={handleCreateNote}
                                    disabled={!noteText.trim()}
                                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    Save Note
                                </button>
                                <button
                                    onClick={() => {
                                        setIsAddingNote(false);
                                        setNoteText('');
                                    }}
                                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Bookmark Modal */}
                {isAddingBookmark && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Bookmark Page {currentPage}</h3>
                            <input
                                type="text"
                                value={bookmarkTitle}
                                onChange={(e) => setBookmarkTitle(e.target.value)}
                                placeholder="Enter bookmark title..."
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                autoFocus
                            />
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={handleCreateBookmark}
                                    disabled={!bookmarkTitle.trim()}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    Save Bookmark
                                </button>
                                <button
                                    onClick={() => {
                                        setIsAddingBookmark(false);
                                        setBookmarkTitle('');
                                    }}
                                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* PDF Viewer */}
                <div className="flex-1 relative bg-slate-200">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                                <p className="text-slate-500 font-medium">Loading PDF...</p>
                            </div>
                        </div>
                    )}

                    <iframe
                        ref={iframeRef}
                        src={`${url}#page=${currentPage}&toolbar=1&navpanes=0&scrollbar=1`}
                        className="w-full h-full border-none"
                        onLoad={() => setIsLoading(false)}
                        onMouseUp={handleTextSelection}
                        title="PDF Viewer"
                    />
                </div>
            </div>

            {/* Annotation Sidebar */}
            {showSidebar && (
                <div className="w-80 flex-shrink-0">
                    <AnnotationSidebar
                        fileId={fileId}
                        currentPage={currentPage}
                        onNavigateToPage={navigateToPage}
                    />
                </div>
            )}
        </div>
    );
};
