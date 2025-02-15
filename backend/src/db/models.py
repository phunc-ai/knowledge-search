import datetime

from sqlalchemy import Column, Integer, String, Sequence, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship
from sqlalchemy.types import Unicode

Base = declarative_base()

class Document(Base):
    __tablename__ = 'document'
    id = Column(Integer, Sequence('document_id_seq'), primary_key=True)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    file_path = Column(String(255))
    uploaded_by = Column(String(50))
    title = Column(Unicode(100))
    description = Column(Unicode(255))
    content = Column(JSON)
    document_metadata = Column(JSON)
    chunks = relationship("DocumentChunk", back_populates="document")

class DocumentChunk(Base):
    __tablename__ = 'document_chunk'
    id = Column(Integer, Sequence('document_chunk_id_seq'), primary_key=True)
    document_id = Column(Integer, ForeignKey('document.id'), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    chunk_content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    document = relationship("Document", back_populates="chunks")

class Category(Base):
    __tablename__ = 'category'
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, unique=True, nullable=False)
    subcategories = relationship("Subcategory", back_populates="category")

class Subcategory(Base):
    __tablename__ = 'subcategory'
    id = Column(Integer, primary_key=True, index=True)
    subcategory = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey('category.id'), nullable=False)
    created_user = Column(String, nullable=False)
    created_time = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    category = relationship("Category", back_populates="subcategories")