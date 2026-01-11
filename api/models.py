from sqlmodel import SQLModel, Field,Column
from sqlalchemy import JSON 
from decimal import Decimal
from typing import Optional, List
from datetime import datetime

class Product(SQLModel, table=True):
 
    __tablename__ = 'products'
   
    id: Optional[int] = Field(default=None, primary_key=True)
    product_name: str = Field(min_length=1, max_length=30, index=True)
    image_paths: List[str] = Field(default=[], sa_column=Column(JSON))
    gemstone: Optional[str] = Field(default=None, max_length=100)
    materials: Optional[str] = Field(default=None, max_length=200)
    size: Optional[str] = Field(default=None, max_length=100)
    description: Optional[str] = Field(default=None, max_length=1000)
    original_price: Decimal = Field(default=Decimal("0.00"), ge=0, max_digits=8, decimal_places=2)
    discount: Decimal = Field(default=Decimal("0.00"), ge=0, le=100, max_digits=5, decimal_places=2)
    discounted_price: Decimal = Field(default=Decimal("0.00"), ge=0, max_digits=8, decimal_places=2)
    quantity_in_stock: int = Field(default=0, ge=0)
    quantity_sold: int = Field(default=0, ge=0)
    revenue: Decimal = Field(default=Decimal("0.00"), ge=0, max_digits=10, decimal_places=2)
    total_revenue: Decimal = Field(default=Decimal("0.00"), ge=0, max_digits=12, decimal_places=2)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    
    def calculate_discounted_price(self):
        discount_amount = self.original_price * (self.discount / 100)
        self.discounted_price = self.original_price - discount_amount


class ProductCreate(SQLModel):
    product_name: str = Field(min_length=1, max_length=30)
    quantity_in_stock: int = Field(ge=0)
    original_price: Decimal = Field(ge=0)
    discount: Decimal = Field(default=Decimal("0.00"), ge=0, le=100)
    gemstone: Optional[str] = None
    materials: Optional[str] = None
    size: Optional[str] = None
    description: Optional[str] = None


class ProductResponse(SQLModel):
    id: int
    product_name: str
    quantity_in_stock: int
    quantity_sold: int
    original_price: Decimal
    discount: Decimal
    discounted_price: Decimal
    revenue: Decimal
    total_revenue: Decimal
    image_paths:List[str] = [] 
    gemstone: Optional[str] = None
    materials: Optional[str] = None
    size: Optional[str] = None
    description: Optional[str] = None