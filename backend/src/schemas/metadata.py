from pydantic import BaseModel

class MetadataCreate(BaseModel):
    category: str
    subcategory: str
    createdUser: str
    createdTime: str
