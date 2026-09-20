from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.models import (
    Conversation,
    Customer,
    Message,
)
from app.schemas.schemas import (
    ConversationCreate,
    ConversationResponse,
    MessageCreate,
    MessageResponse,
)


router = APIRouter(
    prefix="/api/conversations",
    tags=["Conversations"]
)


@router.post(
    "",
    response_model=ConversationResponse
)
def create_conversation(
    conversation_data: ConversationCreate,
    db: Session = Depends(get_db)
):

    customer = (
        db.query(Customer)
        .filter(
            Customer.id == conversation_data.customer_id
        )
        .first()
    )

    if not customer:

        raise HTTPException(
            status_code=404,
            detail="Customer not found."
        )

    conversation = Conversation(
        customer_id=conversation_data.customer_id,
        status="open"
    )

    db.add(conversation)

    db.commit()

    db.refresh(conversation)

    return conversation


@router.get(
    "",
    response_model=list[ConversationResponse]
)
def get_conversations(
    db: Session = Depends(get_db)
):

    return (
        db.query(Conversation)
        .order_by(Conversation.id.desc())
        .all()
    )


@router.post(
    "/{conversation_id}/messages",
    response_model=MessageResponse
)
def add_message(
    conversation_id: int,
    message_data: MessageCreate,
    db: Session = Depends(get_db)
):

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id
        )
        .first()
    )

    if not conversation:

        raise HTTPException(
            status_code=404,
            detail="Conversation not found."
        )

    message = Message(
        conversation_id=conversation_id,
        sender=message_data.sender,
        content=message_data.content
    )

    db.add(message)

    db.commit()

    db.refresh(message)

    return message


@router.get(
    "/{conversation_id}/messages",
    response_model=list[MessageResponse]
)
def get_messages(
    conversation_id: int,
    db: Session = Depends(get_db)
):

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id
        )
        .first()
    )

    if not conversation:

        raise HTTPException(
            status_code=404,
            detail="Conversation not found."
        )

    return (
        db.query(Message)
        .filter(
            Message.conversation_id == conversation_id
        )
        .order_by(Message.id.asc())
        .all()
    )
