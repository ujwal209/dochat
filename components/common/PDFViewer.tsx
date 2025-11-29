import { LuFileText, LuX, LuDownload, LuExternalLink } from "react-icons/lu";

interface PDFViewerProps {
  pdfViewerUrl: string | null;
  setPdfViewerUrl: (url: string | null) => void;
}

export const PDFViewer = ({ pdfViewerUrl, setPdfViewerUrl }: PDFViewerProps) => {
  if (!pdfViewerUrl) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full h-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/20 ring-1 ring-black/5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <LuFileText size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-800">Document Viewer</h3>
              <p className="text-xs text-slate-500">Preview Mode</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a 
              href={pdfViewerUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-lg transition-colors hidden sm:flex"
              title="Open in new tab"
            >
              <LuExternalLink size={18} />
            </a>
            <a 
              href={pdfViewerUrl} 
              download
              className="p-2 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-lg transition-colors hidden sm:flex"
              title="Download PDF"
            >
              <LuDownload size={18} />
            </a>
            <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
            <button 
              onClick={() => setPdfViewerUrl(null)} 
              className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
              title="Close"
            >
              <LuX size={20} />
            </button>
          </div>
        </div>

        {/* PDF Frame */}
        <div className="flex-1 bg-slate-100 relative">
          <iframe 
            src={pdfViewerUrl} 
            className="absolute inset-0 w-full h-full" 
            title="PDF Viewer"
          />
        </div>
      </div>
      
      {/* Click outside to close area */}
      <div className="absolute inset-0 -z-10" onClick={() => setPdfViewerUrl(null)} />
    </div>
  );
};