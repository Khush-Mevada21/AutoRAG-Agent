from fastapi import FastAPI, Request
from app.api import query
from app.state import user_vectors
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile, HTTPException
from app.api import routes 
from pathlib import Path
import shutil
import uuid
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi.responses import JSONResponse
from app.limiter import limiter 
from app import models, schemas, database
from app.database import engine
from app.api.routes import router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AutoRAG Agent",
    description="A RAG-based local research assistant powered by Ollama",
)

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"error": "Limits Reached ! Too many requests, Please slow down."},
    )

app.include_router(routes.router, prefix="/api")



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)



@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files allowed.")

        filename = f"{uuid.uuid4()}.pdf"
        file_path = os.path.join(UPLOAD_DIR, filename)

  
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

   
        loader = PyPDFLoader(file_path)
        pages = loader.load_and_split()

 
        try:
            embeddings = OllamaEmbeddings(model="nomic-embed-text")
        except Exception as embed_err:
            raise HTTPException(status_code=500, detail=f"Embedding model failed: {str(embed_err)}")

        try:
            vectorstore = FAISS.from_documents(pages, embeddings)
        except Exception as vector_err:
            raise HTTPException(status_code=500, detail=f"Vectorstore creation failed: {str(vector_err)}")

        user_vectors[filename] = vectorstore

        return {"message": "Uploaded and indexed", "session_id": filename}

    except Exception as e:
        print("Upload failed:", str(e))
        raise HTTPException(status_code=500, detail=f"Upload error: {str(e)}")
    


