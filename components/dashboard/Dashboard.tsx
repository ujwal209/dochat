"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/firebase";
import { collection, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc } from "firebase/firestore";

// --- Component Imports ---
// Make sure your file structure matches these imports!
import { Sidebar } from "@/components/Sidebar";
import { ChatArea } from "@/components/ChatArea";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { PDFViewer } from "@/components/PDFViewer";

// --- TypeScript Definitions ---
// Exported so child components (Sidebar/ChatArea) can use them
export type Folder = { 
  id: string; 
  name: string; 
  createdAt: any; 
  fileCount?: number 
};

export type FileDoc = { 
  id: string; 
  name: string; 
  url: string; 
  createdAt: any; 
  size?: string 
};

export type ChatSession = { 
  id: string; 
  folderId: string; 
  folderName: string; 
  lastMessage: string; 
  createdAt: any; 
  updatedAt: any 
};

export type Message = { 
  role: 'user' | 'ai'; 
  content: string; 
  createdAt: any 
};

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  
  // --- UI State ---
  const [activeTab, setActiveTab] = useState<"chats" | "folders" | "discover">("chats");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pdfViewerUrl, setPdfViewerUrl] = useState<string | null>(null);
  
  // --- Data State ---
  const [folders, setFolders] = useState<Folder[]>([]);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [folderFiles, setFolderFiles] = useState<FileDoc[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // --- Selection State ---
  const [activeFolder, setActiveFolder] = useState<Folder | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  // --- Input & Upload State ---
  const [input, setInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // --- Refs ---
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // 1. DATA LOADING (Real-time Firebase)
  // ==========================================

  // Load Folders & Chats (Global)
  useEffect(() => {
    if (!user) return;
    
    // Listen for Folders (Newest first)
    const unsubFolders = onSnapshot(
      query(collection(db, "users", user.id, "folders"), orderBy("createdAt", "desc")), 
      (snap) => setFolders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Folder)))
    );
    
    // Listen for Chats (Most recently active first)
    const unsubChats = onSnapshot(
      query(collection(db, "users", user.id, "chats"), orderBy("updatedAt", "desc")), 
      (snap) => setChats(snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatSession)))
    );

    return () => { unsubFolders(); unsubChats(); };
  }, [user]);

  // Load Files (When a specific Folder is active)
  useEffect(() => {
    if (!user || !activeFolder) {
      setFolderFiles([]);
      return;
    }
    
    const unsubFiles = onSnapshot(
      query(collection(db, "users", user.id, "folders", activeFolder.id, "files"), orderBy("createdAt", "desc")), 
      (snap) => setFolderFiles(snap.docs.map(d => ({ id: d.id, ...d.data() } as FileDoc)))
    );

    return () => unsubFiles();
  }, [user, activeFolder]);

  // Load Messages (When a specific Chat is active)
  useEffect(() => {
    if (!user || !activeChatId) {
      setMessages([]);
      return;
    }
    
    const unsubMessages = onSnapshot(
      query(collection(db, "users", user.id, "chats", activeChatId, "messages"), orderBy("createdAt", "asc")), 
      (snap) => setMessages(snap.docs.map(d => d.data() as Message))
    );

    return () => unsubMessages();
  }, [user, activeChatId]);

  // ==========================================
  // 2. EFFECTS & HELPERS
  // ==========================================

  // Auto-scroll to bottom when new messages appear
  useEffect(() => { 
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatting]);

  // Update chat timestamp when new messages arrive (pushes chat to top of list)
  useEffect(() => {
    if (messages.length > 0 && activeChatId && user) {
      updateDoc(doc(db, "users", user.id, "chats", activeChatId), {
        updatedAt: serverTimestamp()
      }).catch(err => console.error("Error updating timestamp:", err));
    }
  }, [messages.length, activeChatId, user]);

  // Filter lists based on Search Query
  const filteredChats = chats.filter(chat => 
    chat.folderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ==========================================
  // 3. RENDER
  // ==========================================

  if (!isLoaded) return <LoadingScreen />;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative selection:bg-blue-100 selection:text-blue-900">
      
      {/* SIDEBAR 
        Handles Navigation, Folders list, Chats list, and Uploads 
      */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        folders={folders}
        activeFolder={activeFolder}
        setActiveFolder={setActiveFolder}
        folderFiles={folderFiles}
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        uploadFile={uploadFile}
        setUploadFile={setUploadFile}
        isUploading={isUploading}
        setIsUploading={setIsUploading}
        fileInputRef={fileInputRef}
        filteredChats={filteredChats}
        filteredFolders={filteredFolders}
        setPdfViewerUrl={setPdfViewerUrl}
        user={user}
      />

      {/* MAIN CHAT AREA 
        Handles the conversation view, input, and empty states
      */}
      <ChatArea
        activeChatId={activeChatId}
        chats={chats}
        messages={messages}
        input={input}
        setInput={setInput}
        isChatting={isChatting}
        setIsChatting={setIsChatting}
        messagesEndRef={messagesEndRef}
        setActiveTab={setActiveTab}
        user={user}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      {/* PDF VIEWER OVERLAY 
        Shows when a user clicks the 'eye' icon on a file
      */}
      <PDFViewer 
        pdfViewerUrl={pdfViewerUrl} 
        setPdfViewerUrl={setPdfViewerUrl} 
      />
      
    </div>
  );
}