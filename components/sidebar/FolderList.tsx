import { LuFolder, LuPlus, LuTrash2, LuChevronRight, LuFileText, LuEye, LuUpload, LuCheck, LuLoader, LuSparkles } from "react-icons/lu";
import { Folder, FileDoc } from "../dashboard/Dashboard";
import { EmptyState } from "../common/EmptyState";
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/utils/firebase";

interface FolderListProps {
  folders: Folder[];
  activeFolder: Folder | null;
  setActiveFolder: (folder: Folder | null) => void;
  folderFiles: FileDoc[];
  uploadFile: File | null;
  setUploadFile: (file: File | null) => void;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  filteredFolders: Folder[];
  setPdfViewerUrl: (url: string | null) => void;
  user: any;
  setActiveTab: (tab: "chats" | "folders" | "discover") => void;
  setActiveChatId: (id: string | null) => void;
}

export const FolderList = ({
  folders,
  activeFolder,
  setActiveFolder,
  folderFiles,
  uploadFile,
  setUploadFile,
  isUploading,
  setIsUploading,
  fileInputRef,
  filteredFolders,
  setPdfViewerUrl,
  user,
  setActiveTab,
  setActiveChatId
}: FolderListProps) => {
  
  const createFolder = async () => {
    const name = prompt("Name your new Knowledge Base:");
    if (!name || !user) return;
    try {
      await addDoc(collection(db, "users", user.id, "folders"), { 
        name, 
        createdAt: serverTimestamp(),
        fileCount: 0
      });
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const deleteFolder = async (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !confirm("Delete this knowledge base and all its contents?")) return;
    try {
      await deleteDoc(doc(db, "users", user.id, "folders", folderId));
      if (activeFolder?.id === folderId) setActiveFolder(null);
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const createChat = async (folder: Folder) => {
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, "users", user.id, "chats"), {
        folderId: folder.id,
        folderName: folder.name,
        lastMessage: "New conversation started",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setActiveChatId(docRef.id);
      setActiveTab("chats");
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !activeFolder || !user) return;
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("folderId", activeFolder.id);

    try {
      const res = await fetch("/api/ingest", { method: "POST", body: formData });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Upload failed");

      await addDoc(collection(db, "users", user.id, "folders", activeFolder.id, "files"), {
        name: data.fileName,
        url: data.pdfUrl,
        createdAt: serverTimestamp(),
        size: (uploadFile.size / (1024 * 1024)).toFixed(1) + " MB"
      });
      setUploadFile(null);
    } catch (e: any) {
      alert(`Upload Error: ${e.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // --- Render ---

  if (filteredFolders.length === 0 && folders.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <button 
          onClick={createFolder} 
          className="w-full py-6 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 text-sm font-medium hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <LuPlus className="text-slate-400 group-hover:text-blue-600 transition-colors"/>
          </div>
          Create your first Knowledge Base
        </button>
        <EmptyState type="folders" />
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-20">
      {/* Create Button */}
      <button 
        onClick={createFolder} 
        className="w-full py-3 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:border-blue-400 hover:text-blue-600 hover:shadow-sm transition-all flex items-center justify-center gap-2 group mb-4"
      >
        <div className="p-1 bg-slate-100 rounded-md group-hover:bg-blue-100 transition-colors">
          <LuPlus className="w-4 h-4"/>
        </div>
        New Knowledge Base
      </button>

      {/* Folders List */}
      {filteredFolders.map(folder => (
        <div 
          key={folder.id} 
          className={`
            bg-white border rounded-xl overflow-hidden transition-all duration-300
            ${activeFolder?.id === folder.id 
              ? 'border-blue-500/50 shadow-md ring-1 ring-blue-500/20' 
              : 'border-slate-200 hover:border-blue-300/50 hover:shadow-sm'
            }
          `}
        >
          {/* Folder Header */}
          <div 
            onClick={() => setActiveFolder(activeFolder?.id === folder.id ? null : folder)}
            className={`
              p-4 flex items-center justify-between cursor-pointer transition-colors
              ${activeFolder?.id === folder.id ? 'bg-blue-50/30' : 'hover:bg-slate-50'}
            `}
          >
            <div className="flex items-center gap-3.5 overflow-hidden">
              <div className={`
                p-2.5 rounded-lg shrink-0 transition-colors
                ${activeFolder?.id === folder.id 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500'
                }
              `}>
                <LuFolder size={18}/>
              </div>
              <div className="min-w-0">
                <h3 className={`text-sm font-semibold truncate ${activeFolder?.id === folder.id ? 'text-slate-900' : 'text-slate-700'}`}>
                  {folder.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={(e) => deleteFolder(folder.id, e)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Delete Folder"
              >
                <LuTrash2 size={14}/>
              </button>
              <LuChevronRight className={`text-slate-400 transition-transform duration-300 ${activeFolder?.id === folder.id ? 'rotate-90' : ''}`}/>
            </div>
          </div>

          {/* Expanded Content */}
          <div className={`
            transition-all duration-300 ease-in-out overflow-hidden
            ${activeFolder?.id === folder.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
          `}>
            <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/30">
              
              {/* Action: Chat */}
              <button 
                onClick={() => createChat(folder)} 
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium py-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <LuSparkles className="w-4 h-4"/>
                Chat with these docs
              </button>

              {/* Files List */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-slate-400 uppercase tracking-wider px-1">
                  <span>Documents</span>
                  <span>{folderFiles.length} files</span>
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                  {folderFiles.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
                      <p className="text-xs text-slate-400">No documents yet.</p>
                      <p className="text-xs text-slate-500 mt-1">Upload a PDF to get started.</p>
                    </div>
                  ) : (
                    folderFiles.map(file => (
                      <div 
                        key={file.id} 
                        className="group flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md shrink-0">
                            <LuFileText size={14}/>
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-medium text-slate-700 truncate block">{file.name}</span>
                            <span className="text-[10px] text-slate-400 block">{file.size || 'PDF'}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setPdfViewerUrl(file.url)} 
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="View PDF"
                        >
                          <LuEye size={14}/>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Upload Area */}
              <div className="mt-4">
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept=".pdf"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)} 
                    className="hidden"
                  />
                  
                  <div className={`
                    border-2 border-dashed rounded-xl p-3 flex items-center justify-center gap-3 transition-all duration-200
                    ${uploadFile 
                      ? 'border-green-500 bg-green-50/50' 
                      : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 bg-white'
                    }
                  `}>
                    <div className={`p-2 rounded-full ${uploadFile ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                      {isUploading ? <LuLoader className="animate-spin w-4 h-4"/> : (uploadFile ? <LuCheck className="w-4 h-4"/> : <LuUpload className="w-4 h-4"/>)}
                    </div>
                    
                    <div className="text-left">
                      <p className={`text-xs font-semibold ${uploadFile ? 'text-green-700' : 'text-slate-600'}`}>
                        {isUploading ? "Uploading..." : (uploadFile ? "Ready to upload" : "Upload PDF")}
                      </p>
                      {uploadFile && (
                        <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{uploadFile.name}</p>
                      )}
                    </div>

                    {uploadFile && !isUploading && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpload();
                        }}
                        className="ml-auto px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 shadow-sm transition-all"
                      >
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
};