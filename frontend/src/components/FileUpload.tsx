import React from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';

interface FileUploadProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  progress: number;
  error?: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload, isUploading, progress, error }) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);

  // Reset file on error
  React.useEffect(() => {
    if (error) {
      setFile(null);
    }
  }, [error]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all ${
          dragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-indigo-400"
        } ${file ? "bg-slate-50" : "bg-white"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept=".pdf"
        />
        
        <div className="flex flex-col items-center text-center">
          {!file ? (
            <>
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Click or drag PDF to upload</h3>
              <p className="text-sm text-slate-500 mt-1">Maximum file size 10MB</p>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{file.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="mt-4 text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {file && !isUploading && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onUpload(file)}
          className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
        >
          Start Analysis
        </motion.button>
      )}

      {isUploading && (
        <div className="mt-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Uploading...</span>
            <span className="text-sm font-medium text-indigo-600">{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <motion.div 
              className="bg-indigo-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex items-center justify-center gap-2 text-emerald-600 font-medium"
            >
              <CheckCircle2 className="w-5 h-5" />
              Upload complete!
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
