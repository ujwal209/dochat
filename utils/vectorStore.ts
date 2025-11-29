import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

export const getVectorStore = async (namespace?: string) => {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
  });

  return await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    maxRecordCount: 5,
    namespace: namespace, // CRITICAL: This separates the data
  });
};

export const addDocumentsToStore = async (docs: any[], namespace: string) => {
  const store = await getVectorStore(namespace);
  await store.addDocuments(docs);
};