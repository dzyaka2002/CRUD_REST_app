from pydantic import BaseModel
from decimal import Decimal

class ProductCreate(BaseModel):
    name: str
    price: Decimal

class ProductUpdate(BaseModel):
    name: str
    price: Decimal