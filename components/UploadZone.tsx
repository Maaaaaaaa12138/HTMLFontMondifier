import React, { useRef, useState } from 'react';
import { UploadCloud, FileCode } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndPassFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  const validateAndPassFile = (file: File) => {
    if (file.type === 'text/html' || file.name.endsWith('.html') || file.name.endsWith('.htm')) {
      onFileSelect(file);
    } else {
      alert('Please upload a valid HTML file.');
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer
        flex flex-col items-center justify-center
        w-full h-48 rounded-xl border-2 border-dashed
        transition-all duration-200 ease-in-out
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-50' 
          : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'}
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept=".html,.htm"
        className="hidden"
      />
      
      <div className="flex flex-col items-center space-y-3 text-center p-4">
        <div className={`
          p-3 rounded-full 
          ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-500'}
        `}>
          {isDragging ? <UploadCloud size={32} /> : <FileCode size={32} />}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-slate-500">
            HTML files only (max 5MB)
          </p>
        </div>
      </div>
    </div>
  );
};
