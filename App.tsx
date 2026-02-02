import React, { useState, useEffect, useMemo } from 'react';
import { UploadZone } from './components/UploadZone';
import { PreviewFrame } from './components/PreviewFrame';
import { Button } from './components/Button';
import { FONT_OPTIONS } from './constants';
import { UploadedFile, FontOption } from './types';
import { Type, Download, Trash2, RefreshCw, Smartphone, Monitor, MoveHorizontal } from 'lucide-react';

const App: React.FC = () => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  
  // Font State
  const [availableFonts, setAvailableFonts] = useState<FontOption[]>(FONT_OPTIONS);
  const [selectedFont, setSelectedFont] = useState<FontOption>(FONT_OPTIONS[0]);
  const [fontSize, setFontSize] = useState<number>(16);
  
  // Table Width State (Pixels)
  const [tableWidth, setTableWidth] = useState<number>(800);
  const [maxTableWidth, setMaxTableWidth] = useState<number>(1200);

  const [isLoadingFonts, setIsLoadingFonts] = useState(false);
  const [supportsLocalFonts, setSupportsLocalFonts] = useState(false);

  const [modifiedHtml, setModifiedHtml] = useState<string>('');

  // Check browser support for local fonts and handle window resize for max width
  useEffect(() => {
    // @ts-ignore
    if (window.queryLocalFonts) {
      setSupportsLocalFonts(true);
    }

    const updateMaxWidth = () => {
      const width = window.innerWidth;
      setMaxTableWidth(width);
    };

    // Initial set
    updateMaxWidth();
    // Set a reasonable default for table width based on screen if it's too small
    setTableWidth(prev => Math.min(prev, window.innerWidth - 40));

    window.addEventListener('resize', updateMaxWidth);
    return () => window.removeEventListener('resize', updateMaxWidth);
  }, []);

  const loadLocalFonts = async () => {
    setIsLoadingFonts(true);
    try {
      // @ts-ignore
      const localFonts = await window.queryLocalFonts();
      
      // Filter unique families
      const uniqueFamilies = new Set();
      const formattedFonts: FontOption[] = [];

      for (const font of localFonts) {
        if (!uniqueFamilies.has(font.family)) {
          uniqueFamilies.add(font.family);
          formattedFonts.push({
            label: font.family,
            value: `"${font.family}", sans-serif`, // Fallback to sans-serif
            category: 'System / Local'
          });
        }
      }

      // Sort alphabetically
      formattedFonts.sort((a, b) => a.label.localeCompare(b.label));
      
      setAvailableFonts(formattedFonts);
      if (formattedFonts.length > 0) {
        setSelectedFont(formattedFonts[0]);
      }
    } catch (err) {
      console.error("Error loading local fonts:", err);
      alert("Could not load system fonts. Permissions might have been denied.");
    } finally {
      setIsLoadingFonts(false);
    }
  };

  // Handle File Reading
  const handleFileSelect = (uploadedFile: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFile({
        name: uploadedFile.name,
        content: content,
      });
    };
    reader.readAsText(uploadedFile);
  };

  // Logic to inject the font into the HTML string
  const injectStyles = (html: string, fontValue: string, size: number, width: number): string => {
    if (!html) return '';

    // Create the style tag to inject
    // 1. Set base font size on html/body.
    // 2. Force font-family on all elements.
    // 3. Specifically target .gt_table to ensure overrides apply to it and its children.
    const styleTag = `<style>
      html, body {
        font-size: ${size}px !important;
      }
      body, body * {
        font-family: ${fontValue} !important;
      }
      
      /* Specific overrides for .gt_table as requested */
      .gt_table, 
      .gt_table th, 
      .gt_table td,
      .gt_table tr {
        font-size: ${size}px !important;
      }
      
      .gt_table {
        width: ${width}px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
    </style>`;

    let newHtml = html;

    // Strategy:
    // 1. Try to find closing </head> and insert before it.
    // 2. If no head, try to find opening <body> and insert after it.
    // 3. If neither, just prepend to the whole string.
    
    if (newHtml.toLowerCase().includes('</head>')) {
      newHtml = newHtml.replace(/<\/head>/i, `${styleTag}\n</head>`);
    } else if (newHtml.toLowerCase().includes('<body')) {
      newHtml = newHtml.replace(/(<body[^>]*>)/i, `$1\n${styleTag}`);
    } else {
      newHtml = `${styleTag}\n${newHtml}`;
    }

    return newHtml;
  };

  // Update modified HTML whenever file, font, size, or width changes
  useEffect(() => {
    if (file) {
      const updated = injectStyles(file.content, selectedFont.value, fontSize, tableWidth);
      setModifiedHtml(updated);
    } else {
      setModifiedHtml('');
    }
  }, [file, selectedFont, fontSize, tableWidth]);

  const handleDownload = () => {
    if (!modifiedHtml || !file) return;

    const blob = new Blob([modifiedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Add prefix to original filename
    const newFileName = `font-modified-${file.name}`;
    
    link.href = url;
    link.download = newFileName;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetApp = () => {
    setFile(null);
    setModifiedHtml('');
    setSelectedFont(availableFonts[0]);
    setFontSize(16);
    setTableWidth(Math.min(800, window.innerWidth - 40));
  };

  // Group fonts for Select UI
  const groupedFonts = useMemo(() => {
    const groups: Record<string, FontOption[]> = {};
    availableFonts.forEach(font => {
      const cat = font.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(font);
    });
    return groups;
  }, [availableFonts]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Type className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">HTML Font Modifier</h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Modify local HTML files instantly
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-8rem)]">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200">
            
            {/* Upload Section */}
            {!file ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">1. Upload File</h2>
                <UploadZone onFileSelect={handleFileSelect} />
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-800">File Selected</h2>
                  <button onClick={resetApp} className="text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-700">
                  <Type size={20} />
                  <span className="font-medium truncate">{file.name}</span>
                </div>
              </div>
            )}

            {/* Controls Section */}
            <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-opacity duration-300 ${!file ? 'opacity-50 pointer-events-none' : ''}`}>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">2. Customize</h2>
              
              {/* Font Source Button (If supported) */}
              {supportsLocalFonts && (
                <div className="mb-6">
                  <Button
                    variant="secondary" 
                    className="w-full text-xs" 
                    onClick={loadLocalFonts}
                    isLoading={isLoadingFonts}
                    icon={<Monitor size={14} />}
                  >
                    Load Installed System Fonts
                  </Button>
                  <p className="mt-2 text-[10px] text-slate-400 text-center">
                    Requires browser permission (Chrome/Edge only)
                  </p>
                </div>
              )}

              {/* Font Family Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Font Family
                </label>
                <div className="relative">
                  <select
                    value={selectedFont.label}
                    onChange={(e) => {
                      const font = availableFonts.find(f => f.label === e.target.value);
                      if (font) setSelectedFont(font);
                    }}
                    className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {Object.entries(groupedFonts).map(([category, fonts]) => (
                      <optgroup key={category} label={category.charAt(0).toUpperCase() + category.slice(1)}>
                        {(fonts as FontOption[]).map(font => (
                          <option key={font.label} value={font.label}>
                            {font.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Font Size Control */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                   <label className="block text-sm font-medium text-slate-600">
                    Base Font Size
                  </label>
                  <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                    {fontSize}px
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="8"
                    max="72"
                    step="1"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
                 <p className="mt-2 text-xs text-slate-400">
                  Sets size for text and .gt_table content
                </p>
              </div>

              {/* Table Width Control */}
              <div>
                <div className="flex items-center justify-between mb-2">
                   <label className="block text-sm font-medium text-slate-600 flex items-center gap-2">
                    <MoveHorizontal size={14} />
                    Table Width (px)
                  </label>
                  <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                    {tableWidth}px
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="100"
                    max={maxTableWidth}
                    step="10"
                    value={tableWidth}
                    onChange={(e) => setTableWidth(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
                 <p className="mt-2 text-xs text-slate-400">
                  Adjusts absolute width of .gt_table elements (Max: {maxTableWidth}px)
                </p>
              </div>

            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col gap-3 transition-opacity duration-300 ${!file ? 'opacity-50 pointer-events-none' : ''}`}>
              <Button 
                onClick={handleDownload}
                className="w-full shadow-lg shadow-indigo-200"
                icon={<Download size={18} />}
              >
                Download Modified HTML
              </Button>
              <Button 
                variant="outline"
                onClick={resetApp}
                icon={<RefreshCw size={18} />}
              >
                Start Over
              </Button>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-[500px]">
             <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              Preview
              {selectedFont && (
                <span className="text-xs font-normal px-2 py-1 bg-slate-100 rounded-md text-slate-500 flex items-center gap-1">
                   {selectedFont.label} <span className="text-slate-300">|</span> {fontSize}px <span className="text-slate-300">|</span> {tableWidth}px
                </span>
              )}
             </h2>
             <div className="flex-1 relative">
                <PreviewFrame htmlContent={modifiedHtml} />
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;