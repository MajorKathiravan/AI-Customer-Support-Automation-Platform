import re
from typing import Dict, List, Tuple

from sqlalchemy.orm import Session

from app.models.models import (
    AutomationRule,
    Conversation,
    Customer,
    Ticket,
)


PRIORITY_RANK = {
    "low": 1,
    "medium": 2,
    "high": 3,
    "urgent": 4,
}


def normalize(text: str) -> str:

    return re.sub(
        r"\s+",
        " ",
        text.lower().strip()
    )


def priority_is_higher(
    first: str,
    second: str
) -> bool:

    return (
        PRIORITY_RANK.get(first, 2)
        >
        PRIORITY_RANK.get(second, 2)
    )


def apply_automation_rules(
    db: Session,
    message: str,
    intent: str,
    priority: str,
) -> Tuple[str, bool, bool, List[str]]:

    rules = (
        db.query(AutomationRule)
        .filter(
            AutomationRule.active == True
        )
        .order_by(AutomationRule.id.asc())
        .all()
    )

    normalized_message = normalize(message)

    resulting_priority = priority
    force_ticket = False
    force_escalation = False

    applied_rules: List[str] = []

    for rule in rules:

        matched = False

        if rule.trigger_type == "keyword":

            trigger = normalize(
                rule.trigger_value
            )

            matched = (
                trigger in normalized_message
            )

        elif rule.trigger_type == "intent":

            matched = (
                normalize(rule.trigger_value)
                == normalize(intent)
            )

        elif rule.trigger_type == "priority":

            trigger_priority = normalize(
                rule.trigger_value
            )

            matched = (
                normalize(priority)
                == trigger_priority
            )

        if not matched:
            continue

        applied_rules.append(rule.name)

        if rule.action_type == "create_ticket":

            force_ticket = True

        elif rule.action_type == "escalate":

            force_escalation = True
            force_ticket = True

        elif rule.action_type == "set_priority":

            requested_priority = normalize(
                rule.action_value or "medium"
            )

            if requested_priority in PRIORITY_RANK:

                if priority_is_higher(
                    requested_priority,
                    resulting_priority
                ):

                    resulting_priority = (
                        requested_priority
                    )

    return (
        resulting_priority,
        force_ticket,
        force_escalation,
        applied_rules,
    )


def create_or_update_ticket(
    db: Session,
    conversation: Conversation,
    customer: Customer,
    message: str,
    intent: str,
    priority: str
) -> Ticket:

    existing_ticket = (
        db.query(Ticket)
        .filter(
            Ticket.conversation_id == conversation.id,
            Ticket.status.in_(
                ["open", "pending"]
            )
        )
        .order_by(Ticket.id.desc())
        .first()
    )

    if existing_ticket:

        if priority_is_higher(
            priority,
            existing_ticket.priority
        ):

            existing_ticket.priority = priority

        existing_ticket.description = message

        conversation.status = "escalated"

        db.commit()
        db.refresh(existing_ticket)

        return existing_ticket


    readable_intent = (
        intent.replace(
            "_",
            " "
        ).title()
    )


    ticket = Ticket(
        conversation_id=conversation.id,
        customer_id=customer.id,
        subject=(
            f"AI Escalation - "
            f"{readable_intent}"
        ),
        description=message,
        category=intent,
        priority=priority,
        status="open"
    )

    db.add(ticket)

    conversation.status = "escalated"

    db.commit()
    db.refresh(ticket)

    return ticket