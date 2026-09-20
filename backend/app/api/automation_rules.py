from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.models import AutomationRule
from app.schemas.schemas import (
    AutomationRuleCreate,
    AutomationRuleResponse,
    AutomationRuleUpdate,
)


router = APIRouter(
    prefix="/api/automation-rules",
    tags=["Automation Rules"]
)


ALLOWED_TRIGGER_TYPES = {
    "keyword",
    "intent",
    "priority",
}


ALLOWED_ACTION_TYPES = {
    "create_ticket",
    "escalate",
    "set_priority",
}


@router.post(
    "",
    response_model=AutomationRuleResponse
)
def create_rule(
    rule_data: AutomationRuleCreate,
    db: Session = Depends(get_db)
):

    if rule_data.trigger_type not in ALLOWED_TRIGGER_TYPES:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid trigger type. "
                "Use keyword, intent, or priority."
            )
        )

    if rule_data.action_type not in ALLOWED_ACTION_TYPES:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid action type. "
                "Use create_ticket, escalate, or set_priority."
            )
        )

    rule = AutomationRule(
        name=rule_data.name,
        trigger_type=rule_data.trigger_type,
        trigger_value=rule_data.trigger_value,
        action_type=rule_data.action_type,
        action_value=rule_data.action_value,
        active=rule_data.active,
    )

    db.add(rule)
    db.commit()
    db.refresh(rule)

    return rule


@router.get(
    "",
    response_model=list[AutomationRuleResponse]
)
def get_rules(
    db: Session = Depends(get_db)
):

    return (
        db.query(AutomationRule)
        .order_by(AutomationRule.id.desc())
        .all()
    )


@router.patch(
    "/{rule_id}",
    response_model=AutomationRuleResponse
)
def update_rule(
    rule_id: int,
    rule_data: AutomationRuleUpdate,
    db: Session = Depends(get_db)
):

    rule = (
        db.query(AutomationRule)
        .filter(
            AutomationRule.id == rule_id
        )
        .first()
    )

    if not rule:
        raise HTTPException(
            status_code=404,
            detail="Automation rule not found."
        )

    updates = rule_data.model_dump(
        exclude_unset=True
    )

    if (
        "trigger_type" in updates
        and updates["trigger_type"]
        not in ALLOWED_TRIGGER_TYPES
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid trigger type."
        )

    if (
        "action_type" in updates
        and updates["action_type"]
        not in ALLOWED_ACTION_TYPES
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid action type."
        )

    for field, value in updates.items():
        setattr(rule, field, value)

    db.commit()
    db.refresh(rule)

    return rule


@router.delete(
    "/{rule_id}"
)
def delete_rule(
    rule_id: int,
    db: Session = Depends(get_db)
):

    rule = (
        db.query(AutomationRule)
        .filter(
            AutomationRule.id == rule_id
        )
        .first()
    )

    if not rule:
        raise HTTPException(
            status_code=404,
            detail="Automation rule not found."
        )

    db.delete(rule)
    db.commit()

    return {
        "message": "Automation rule deleted.",
        "id": rule_id
    }
