from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.models import Customer
from app.schemas.schemas import (
    CustomerCreate,
    CustomerResponse,
)


router = APIRouter(
    prefix="/api/customers",
    tags=["Customers"]
)


@router.post(
    "",
    response_model=CustomerResponse
)
def create_customer(
    customer_data: CustomerCreate,
    db: Session = Depends(get_db)
):

    existing_customer = (
        db.query(Customer)
        .filter(
            Customer.email == customer_data.email
        )
        .first()
    )

    if existing_customer:

        raise HTTPException(
            status_code=400,
            detail="Customer with this email already exists."
        )

    customer = Customer(
        name=customer_data.name,
        email=customer_data.email
    )

    db.add(customer)

    db.commit()

    db.refresh(customer)

    return customer


@router.get(
    "",
    response_model=list[CustomerResponse]
)
def get_customers(
    db: Session = Depends(get_db)
):

    return (
        db.query(Customer)
        .order_by(Customer.id.desc())
        .all()
    )
