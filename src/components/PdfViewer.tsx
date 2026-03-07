import React from 'react';
import { Loader2 } from 'lucide-react';

interface PdfViewerProps {
    url: string;
    filename?: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url, filename }) => {
    const [isLoading, setIsLoading] = React.useState(true);

    return (
        <div className="h-full w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative flex flex-col">
            <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
                <h3 className="font-semibold text-slate-700 truncate max-w-xs" title={filename}>{filename || 'Document'}</h3>
            </div>

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
                    src={`${url}#toolbar=1&navpanes=0&scrollbar=1`}
                    className="w-full h-full border-none"
                    onLoad={() => setIsLoading(false)}
                    title="PDF Viewer"
                />
            </div>
        </div>
    );
};
