from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from langchain.chains import RetrievalQA
from langchain_ollama import OllamaLLM
from app.core.retriever import get_retriever
from typing import Optional
import os

from app.core.retriever import get_retriever  

router = APIRouter()

class QueryRequest(BaseModel):
    question: Optional[str] = None
    filename: Optional[str] = None

@router.post("/query")
async def query(request: QueryRequest):
    try:
        llm = OllamaLLM(model="mistral")
        retriever = get_retriever()
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True
        )

  
        if request.question:
            result = qa_chain.invoke({"query": request.question})
            return {
                "answer": result["result"],
                "sources": [doc.metadata.get("source", "") for doc in result["source_documents"]]
            }

        
        elif request.filename:
    
            file_path = os.path.join("uploads", request.filename)
            if not os.path.exists(file_path):
                raise HTTPException(status_code=404, detail="File not found")

          
            default_question = "Summarize the content of this PDF."

            result = qa_chain.invoke({"query": default_question})
            return {
                "answer": f"PDF '{request.filename}' processed. {result['result']}",
                "sources": [doc.metadata.get("source", "") for doc in result["source_documents"]]
            }

        else:
            raise HTTPException(status_code=400, detail="Invalid request: no question or filename provided")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))