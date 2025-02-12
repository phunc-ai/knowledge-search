from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse
import os
import tempfile
from sqlalchemy.orm import Session
from backend.src.db.models import Document
from backend.src.db.session import SessionLocal
from backend.src.parsers.llama_parser import LlamaParser

router = APIRouter()

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/parse")
async def parse_file(
    file: UploadFile = File(...),
):
    # Get the file extension
    _, file_extension = os.path.splitext(file.filename)
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # Parse the document using LlamaParser
    parser = LlamaParser()
    parsed_content = await parser.aload_data(tmp_path)

    # Delete the temporary file
    os.remove(tmp_path)

    return JSONResponse(content={
        "message": "File uploaded successfully",
        "parsed_content": parsed_content  # Return parsed content
    })

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),  # Correctly handle file upload
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    subcategory: str = Form(...),
    tags: str = Form(...),
    parsed_content: str = Form(...)
):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
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
        "message": "Document submitted successfully",
        "document_id": new_document.id
    })