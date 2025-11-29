import { NextRequest, NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { addDocumentsToStore } from "@/utils/vectorStore";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folderId = formData.get("folderId") as string;

    if (!file || !folderId) {
      return NextResponse.json({ error: "Missing file or folder ID" }, { status: 400 });
    }

    // 2. Upload PDF to Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // We wrap Cloudinary's callback-style API in a Promise
    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          resource_type: "raw", // Important for PDFs
          folder: `study-buddy/${userId}/${folderId}`,
          public_id: file.name.replace(/\.[^/.]+$/, "") // Remove extension for ID
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // 3. Process Text for AI (Pinecone)
    const blob = new Blob([arrayBuffer]);
    const loader = new WebPDFLoader(blob);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments(docs);

    // 4. Save to Pinecone (Namespace = FolderId)
    await addDocumentsToStore(splitDocs, folderId);

    return NextResponse.json({ 
      success: true, 
      pdfUrl: uploadResult.secure_url, 
      fileName: file.name 
    });

  } catch (error: any) {
    console.error("Ingest Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}