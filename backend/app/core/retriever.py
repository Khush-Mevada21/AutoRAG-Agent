from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.config import VECTORSTORE_DIR
import os

def get_retriever():
    persist_dir = os.path.join(os.path.dirname(__file__), "..", "..", "vectorstore")
    embeddings = OllamaEmbeddings(model="mistral")
    vectorstore = FAISS.load_local(VECTORSTORE_DIR, embeddings, allow_dangerous_deserialization=True)
    return vectorstore.as_retriever()
