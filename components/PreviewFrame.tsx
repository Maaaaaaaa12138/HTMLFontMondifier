import React, { useEffect, useRef } from 'react';

interface PreviewFrameProps {
  htmlContent: string;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ htmlContent }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      // We use srcDoc for immediate rendering of the string content
      // Note: sandbox attribute is crucial for security if this were a public app allowing arbitrary user content
      // For a local tool, 'allow-scripts' is often needed if the user's HTML has interactivity.
      // However, to be safe, we might restrict it.
    }
  }, [htmlContent]);

  if (!htmlContent) {
    return (
      <div className="w-full h-full bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
        <p>No preview available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <span className="text-xs font-medium text-slate-500 ml-2">Preview</span>
      </div>
      <iframe
        ref={iframeRef}
        srcDoc={htmlContent}
        title="HTML Preview"
        className="w-full flex-1 border-none"
        sandbox="allow-same-origin allow-scripts allow-forms" 
      />
    </div>
  );
};
