from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse
import os
from sqlalchemy.orm import Session
from backend.src.db.models import Document
from backend.src.db.session import SessionLocal
from backend.src.parsers.llama_parser import LlamaParser

router = APIRouter()

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    subcategory: str = Form(...),
    tags: str = Form(...)
):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Parse the document using LlamaParser
    parser = LlamaParser()
    parsed_content = await parser.aload_data(file_path)

    # Create a new Document row in the database
    db: Session = SessionLocal()
    new_document = Document(
        file_path=file_path,
        uploaded_by="user",
        title=title,
        description=description,
        content=parsed_content,
        document_metadata={
            "category": category,
            "subcategory": subcategory,
            "tags": tags.split(",")
        }
    )
    db.add(new_document)
    db.commit()
    db.refresh(new_document)
    db.close()

    return JSONResponse(content={
        "message": "File uploaded successfully",
        "document_id": new_document.id,
        "data": parsed_content  # Return parsed content
    })