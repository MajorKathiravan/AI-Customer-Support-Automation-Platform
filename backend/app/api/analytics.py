from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.models.models import (
    Customer,
    Conversation,
    Ticket,
    Message,
    KnowledgeBase,
    AutomationRule,
)

router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"]
)


@router.get("/overview")
def analytics_overview(
    db: Session = Depends(get_db)
):
    total_customers = (
        db.query(Customer)
        .count()
    )

    total_conversations = (
        db.query(Conversation)
        .count()
    )

    total_tickets = (
        db.query(Ticket)
        .count()
    )

    open_tickets = (
        db.query(Ticket)
        .filter(
            Ticket.status.in_(
                ["open", "pending"]
            )
        )
        .count()
    )

    escalated_conversations = (
        db.query(Conversation)
        .filter(
            Conversation.status == "escalated"
        )
        .count()
    )

    active_knowledge_items = (
        db.query(KnowledgeBase)
        .filter(
            KnowledgeBase.active == True
        )
        .count()
    )

    active_automation_rules = (
        db.query(AutomationRule)
        .filter(
            AutomationRule.active == True
        )
        .count()
    )

    intent_rows = (
        db.query(
            Message.intent,
            func.count(Message.id)
        )
        .filter(
            Message.intent.isnot(None)
        )
        .group_by(
            Message.intent
        )
        .order_by(
            func.count(Message.id).desc()
        )
        .limit(10)
        .all()
    )

    intent_distribution = [
        {
            "intent": intent,
            "count": count
        }
        for intent, count in intent_rows
    ]

    return {
        "total_customers": total_customers,
        "total_conversations": total_conversations,
        "total_tickets": total_tickets,
        "open_tickets": open_tickets,
        "escalated_conversations": escalated_conversations,
        "active_knowledge_items": active_knowledge_items,
        "active_automation_rules": active_automation_rules,
        "intent_distribution": intent_distribution,
    }
