import React from 'react';
import { Loader2, Highlighter, Sparkles } from 'lucide-react';
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
    const [showSidebar, setShowSidebar] = React.useState(false);
    const [hasAnnotations, setHasAnnotations] = React.useState(false);
    const [selectedText, setSelectedText] = React.useState('');
    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    // Listen for annotation updates to check if we have any
    React.useEffect(() => {
        const checkAnnotations = () => {
            // Signal from AnnotationSidebar that annotations exist
            const event = new CustomEvent('hasAnnotations');
            window.dispatchEvent(event);
        };

        const handleHasAnnotations = (e: CustomEvent) => {
            setHasAnnotations(e.detail?.hasAnnotations || false);
            if (e.detail?.hasAnnotations) {
                setShowSidebar(true);
            }
        };

        window.addEventListener('annotationAdded', checkAnnotations);
        window.addEventListener('annotationsStatus', handleHasAnnotations as EventListener);

        return () => {
            window.removeEventListener('annotationAdded', checkAnnotations);
            window.removeEventListener('annotationsStatus', handleHasAnnotations as EventListener);
        };
    }, []);

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

    const navigateToPage = (page: number) => {
      setCurrentPage(page);
      if (iframeRef.current) {
        // Update iframe with page parameter
        const urlWithPage = `${url}#page=${page}&toolbar=1&navpanes=0&scrollbar=1`;
        iframeRef.current.src = urlWithPage;
      }
    };

    return (
        <div className="h-full w-full flex bg-slate-50 relative group">
            {/* Main PDF Viewer Area */}
            <div className="flex-1 flex flex-col relative">
                {/* Floating Toolbar - Only shows when text selected or on hover */}
                <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 ${
                    selectedText ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
                }`}>
                    <div className="bg-white rounded-xl shadow-2xl border border-slate-200 px-5 py-3 flex items-center gap-3 backdrop-blur-sm">
                        {selectedText ? (
                        <>
                        {/* Highlight Tool */}
                        <div className="flex items-center gap-3 pr-3 border-r border-slate-200">
                            <button
                                onClick={() => selectedText && handleCreateHighlight()}
                                disabled={!selectedText}
                                className="px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 bg-yellow-400 text-yellow-900 hover:bg-yellow-500 shadow-sm text-base"
                                title="Highlight selected text"
                            >
                                <Highlighter className="w-5 h-5" />
                                Highlight
                            </button>

                            {/* Color Picker */}
                            <div className="flex gap-1.5">
                                {HIGHLIGHT_COLORS.map(color => (
                                    <button
                                        key={color.value}
                                        onClick={() => setSelectedColor(color.value)}
                                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                                            selectedColor === color.value
                                                ? 'border-slate-700 scale-110 shadow-md'
                                                : 'border-slate-300 hover:scale-105'
                                        }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Ask AI Button */}
                        <button
                            onClick={() => {
                                window.dispatchEvent(new CustomEvent('askAI', { 
                                    detail: { text: selectedText } 
                                }));
                            }}
                            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-base font-medium hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-lg"
                        >
                            <Sparkles className="w-5 h-5" />
                            Ask AI
                        </button>
                        </>
                        ) : null}

                        {/* Toggle Sidebar - Only show if annotations exist */}
                        {hasAnnotations && (
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="px-4 py-2.5 bg-slate-600 text-white rounded-lg text-base hover:bg-slate-700 transition-colors flex items-center gap-2 ml-2 border-l border-slate-300 pl-4"
                        >
                            <Highlighter className="w-5 h-5" />
                            {showSidebar ? 'Hide' : 'Show'}
                        </button>
                        )}
                    </div>
                </div>

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
