from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker

from backend.src.db.models import (
    Base,
    Document,
    DocumentChunk,
    Category,
    Subcategory,
)

DATABASE_URL = 'postgresql+psycopg2://phu:phu@localhost/eks'

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
metadata = MetaData()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)