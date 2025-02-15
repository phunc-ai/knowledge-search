from datetime import datetime
from typing import List

from sqlalchemy.orm import Session
from fastapi import APIRouter, HTTPException, Depends

from backend.src.schemas.metadata import MetadataCreate
from backend.src.db.models import Category as CategoryModel, Subcategory as SubcategoryModel
from backend.src.db.session import get_db

router = APIRouter()

@router.post("/metadata/create")
async def create_metadata(data: MetadataCreate, db: Session = Depends(get_db)):
    category_name = data.category
    subcategory_name = data.subcategory
    created_user = data.createdUser
    created_time = data.createdTime

    # Check if category exists
    category = db.query(CategoryModel).filter(CategoryModel.category == category_name).first()
    
    if not category:
        # Create category
        category = CategoryModel(
            category=category_name
        )
        db.add(category)
        db.commit()
        db.refresh(category)

    # Check if subcategory already exists
    subcategory = db.query(SubcategoryModel).filter(
        SubcategoryModel.subcategory == subcategory_name,
        SubcategoryModel.category_id == category.id
    ).first()
    if subcategory:
        raise HTTPException(status_code=400, detail="Subcategory already exists")
    
    # Create subcategory
    subcategory = SubcategoryModel(
        subcategory=subcategory_name,
        category_id=category.id,
        created_user=created_user,
        created_time=created_time
    )
    db.add(subcategory)
    db.commit()
    db.refresh(subcategory)
    return {"message": "Subcategory created", "subcategory": subcategory}

@router.delete("/metadata/delete/{id}")
async def delete_metadata(id: int, db: Session = Depends(get_db)):
    subcategory = db.query(SubcategoryModel).filter(SubcategoryModel.id == id).first()
    if not subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")

    category_id = subcategory.category_id
    db.delete(subcategory)
    db.commit()

    # Check if the category has any subcategories left
    remaining_subcategories = db.query(SubcategoryModel).filter(SubcategoryModel.category_id == category_id).count()
    if remaining_subcategories == 0:
        category = db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
        if category:
            db.delete(category)
            db.commit()

    return {"message": "Subcategory deleted"}

@router.get("/metadata/fetch", response_model=List[dict])
async def fetch_metadata(db: Session = Depends(get_db)):
    categories = db.query(CategoryModel).all()
    subcategories = db.query(SubcategoryModel).all()
    metadata = [
        {
            "id": subcategory.id,
            "category": next((cat.category for cat in categories if cat.id == subcategory.category_id), ""),
            "subcategory": subcategory.subcategory,
            "createdUser": subcategory.created_user,
            "createdTime": datetime.strftime(subcategory.created_time, '%Y-%m-%d %H:%M:%S'),
        }
        for subcategory in subcategories
    ]
    return metadata


@router.get("/metadata/get", response_model=dict)
async def get_metadate(db: Session = Depends(get_db)):
    categories = db.query(CategoryModel).all()
    subcategories = db.query(SubcategoryModel).all()
    
    result = {}
    for category in categories:
        result[category.category] = [
            sub.subcategory for sub in subcategories if sub.category_id == category.id
        ]
    
    return result
