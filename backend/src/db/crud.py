from sqlalchemy.orm import Session
from .models import Document

def create_document(db: Session, document: Document):
    db.add(document)
    db.commit()
    db.refresh(document)
    return document

def get_documents(db: Session):
    return db.query(Document).all()