from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.models import (
    Conversation,
    Customer,
    Ticket,
)
from app.schemas.schemas import (
    TicketCreate,
    TicketResponse,
)


router = APIRouter(
    prefix="/api/tickets",
    tags=["Tickets"]
)


class TicketStatusUpdate(BaseModel):

    status: str


@router.post(
    "",
    response_model=TicketResponse
)
def create_ticket(
    ticket_data: TicketCreate,
    db: Session = Depends(get_db)
):

    customer = (
        db.query(Customer)
        .filter(
            Customer.id == ticket_data.customer_id
        )
        .first()
    )

    if not customer:

        raise HTTPException(
            status_code=404,
            detail="Customer not found."
        )

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == ticket_data.conversation_id
        )
        .first()
    )

    if not conversation:

        raise HTTPException(
            status_code=404,
            detail="Conversation not found."
        )

    ticket = Ticket(
        conversation_id=ticket_data.conversation_id,
        customer_id=ticket_data.customer_id,
        subject=ticket_data.subject,
        description=ticket_data.description,
        category=ticket_data.category,
        priority=ticket_data.priority,
        status="open"
    )

    db.add(ticket)

    db.commit()

    db.refresh(ticket)

    return ticket


@router.get(
    "",
    response_model=list[TicketResponse]
)
def get_tickets(
    db: Session = Depends(get_db)
):

    return (
        db.query(Ticket)
        .order_by(Ticket.id.desc())
        .all()
    )


@router.patch(
    "/{ticket_id}/status",
    response_model=TicketResponse
)
def update_ticket_status(
    ticket_id: int,
    status_data: TicketStatusUpdate,
    db: Session = Depends(get_db)
):

    allowed_statuses = {
        "open",
        "pending",
        "resolved",
        "closed"
    }

    if status_data.status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid status. Allowed values: "
                "open, pending, resolved, closed"
            )
        )

    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.id == ticket_id
        )
        .first()
    )

    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket not found."
        )

    ticket.status = status_data.status

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == ticket.conversation_id
        )
        .first()
    )

    if conversation:

        if status_data.status in {
            "resolved",
            "closed"
        }:

            conversation.status = "resolved"

        else:

            conversation.status = "escalated"

    db.commit()

    db.refresh(ticket)

    return ticket
