from fastapi import APIRouter, Request, UploadFile, File, Depends
from pydantic import BaseModel
from app.services.rag_pipeline import run_query
from app.state import user_vectors
from app.limiter import limiter
from sqlalchemy.orm import Session
from app import models, database, schemas

router = APIRouter()

class QueryRequest(BaseModel):
    question: str
    session_id: str   

@router.post("/query")
@limiter.limit("15/day")   # 15 requests per day 
async def query_rag(request: Request, payload: QueryRequest):
    if payload.session_id not in user_vectors:
        return {"error": "Invalid session. Please upload a PDF first."}

    vectorstore = user_vectors[payload.session_id]
    response = run_query(payload.question, vectorstore)
    return {
        "question": payload.question,
        "answer": response["result"]
    }

@router.post("/api/upload")
@limiter.limit("2/minute")
async def upload_file(request: Request, file: UploadFile = File(...)):
    return {"message": "File uploaded successfully"}

@router.post("/track-email")
def track_email(email_data: schemas.EmailSchema, db: Session = Depends(database.get_db)):
    email = models.EmailEntry(email=email_data.email)
    db.add(email)
    db.commit()
    db.refresh(email)
    return {"message": "Email stored"}