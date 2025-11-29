"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/firebase";
import { collection, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { PDFViewer } from "@/components/common/PDFViewer";

// --- Types ---
export type Folder = { id: string; name: string; createdAt: any; fileCount?: number };
export type FileDoc = { id: string; name: string; url: string; createdAt: any; size?: string };
export type ChatSession = { id: string; folderId: string; folderName: string; lastMessage: string; createdAt: any; updatedAt: any };
export type Message = { role: string; content: string; createdAt: any };

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  
  // --- State ---
  const [activeTab, setActiveTab] = useState<"chats" | "folders" | "discover">("chats");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolder, setActiveFolder] = useState<Folder | null>(null);
  const [folderFiles, setFolderFiles] = useState<FileDoc[]>([]);
  
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [pdfViewerUrl, setPdfViewerUrl] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [input, setInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Data Loading ---
  
  // Load Folders & Chats
  useEffect(() => {
    if (!user) return;
    const unsubFolders = onSnapshot(query(collection(db, "users", user.id, "folders"), orderBy("createdAt", "desc")), 
      (snap) => setFolders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Folder))));
    
    const unsubChats = onSnapshot(query(collection(db, "users", user.id, "chats"), orderBy("updatedAt", "desc")), 
      (snap) => setChats(snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatSession))));

    return () => { unsubFolders(); unsubChats(); };
  }, [user]);

  // Load Files when Folder Active
  useEffect(() => {
    if (!user || !activeFolder) return;
    const q = query(collection(db, "users", user.id, "folders", activeFolder.id, "files"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => setFolderFiles(snap.docs.map(d => ({ id: d.id, ...d.data() } as FileDoc))));
  }, [user, activeFolder]);

  // Load Messages when Chat Active
  useEffect(() => {
    if (!user || !activeChatId) return;
    const q = query(collection(db, "users", user.id, "chats", activeChatId, "messages"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snap) => setMessages(snap.docs.map(d => d.data() as Message)));
  }, [user, activeChatId]);

  // Scroll to bottom
  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages]);

  // Update chat timestamp when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && activeChatId && user) {
      updateDoc(doc(db, "users", user.id, "chats", activeChatId), {
        updatedAt: serverTimestamp()
      });
    }
  }, [messages, activeChatId, user]);

  // --- Filtered Data ---
  const filteredChats = chats.filter(chat => 
    chat.folderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoaded) return <LoadingScreen />;

  return (
    <div className="flex h-screen bg-slate-900 font-sans text-slate-100 overflow-hidden">
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
        setFolderFiles={setFolderFiles}
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

      <PDFViewer 
        pdfViewerUrl={pdfViewerUrl} 
        setPdfViewerUrl={setPdfViewerUrl} 
      />
    </div>
  );
}