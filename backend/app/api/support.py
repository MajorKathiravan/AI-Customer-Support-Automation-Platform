from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.models import (
    Conversation,
    Customer,
    Message,
)
from app.schemas.support_schemas import (
    SupportMessageRequest,
    SupportMessageResponse,
)
from app.services.automation_service import (
    apply_automation_rules,
    create_or_update_ticket,
)
from app.services.faq_service import find_best_faq
from app.services.intent_service import detect_intent
from app.services.llm_service import generate_ai_response
from app.services.priority_service import detect_priority


router = APIRouter(
    prefix="/api/support",
    tags=["AI Support"]
)


FAQ_THRESHOLD = 0.55
INTENT_THRESHOLD = 0.40


def build_conversation_context(
    conversation_id: int,
    db: Session
) -> str:

    messages = (
        db.query(Message)
        .filter(
            Message.conversation_id == conversation_id
        )
        .order_by(Message.id.desc())
        .limit(10)
        .all()
    )

    messages.reverse()

    if not messages:
        return "No previous messages."

    return "\n".join(
        f"{message.sender}: {message.content}"
        for message in messages
    )


@router.post(
    "/analyze",
    response_model=SupportMessageResponse
)
def analyze_support_message(
    request: SupportMessageRequest,
    db: Session = Depends(get_db)
):

    conversation = None
    customer = None


    # ========================================================
    # CONVERSATION
    # ========================================================

    if request.conversation_id is not None:

        conversation = (
            db.query(Conversation)
            .filter(
                Conversation.id ==
                request.conversation_id
            )
            .first()
        )

        if not conversation:

            raise HTTPException(
                status_code=404,
                detail="Conversation not found."
            )

        customer = (
            db.query(Customer)
            .filter(
                Customer.id ==
                conversation.customer_id
            )
            .first()
        )


    # ========================================================
    # INTENT
    # ========================================================

    intent, intent_confidence = detect_intent(
        request.message
    )


    # ========================================================
    # FAQ
    # ========================================================

    faq_item, faq_confidence = find_best_faq(
        request.message,
        db
    )

    faq_found = (
        faq_item is not None
        and faq_confidence >= FAQ_THRESHOLD
    )


    # ========================================================
    # CONTEXT
    # ========================================================

    conversation_context = None

    if conversation:

        conversation_context = (
            build_conversation_context(
                conversation.id,
                db
            )
        )


    # ========================================================
    # RESPONSE
    # ========================================================

    if faq_found:

        response_message = faq_item.answer

    else:

        response_message = generate_ai_response(
            user_message=request.message,
            intent=intent,
            conversation_context=conversation_context
        )


    # ========================================================
    # BASE ESCALATION
    # ========================================================

    requires_human = (
        not faq_found
        or intent == "contact_support"
        or intent_confidence < INTENT_THRESHOLD
    )

    ticket_recommended = (
        requires_human
        and intent != "greeting"
    )


    # ========================================================
    # BASE PRIORITY
    # ========================================================

    priority, priority_confidence, escalation_reason = (
        detect_priority(
            request.message,
            intent
        )
    )


    # ========================================================
    # CUSTOM AUTOMATION RULES
    # ========================================================

    (
        priority,
        force_ticket,
        force_escalation,
        applied_rules,
    ) = apply_automation_rules(
        db=db,
        message=request.message,
        intent=intent,
        priority=priority,
    )


    if force_escalation:

        requires_human = True
        ticket_recommended = True

        escalation_reason = (
            escalation_reason
            or "Automation rule requested escalation."
        )


    if force_ticket:

        ticket_recommended = True


    # ========================================================
    # AUTOMATIC TICKET
    # ========================================================

    ticket_created = False
    ticket_id = None

    if (
        ticket_recommended
        and conversation is not None
        and customer is not None
    ):

        ticket = create_or_update_ticket(
            db=db,
            conversation=conversation,
            customer=customer,
            message=request.message,
            intent=intent,
            priority=priority
        )

        ticket_created = True
        ticket_id = ticket.id


    # ========================================================
    # SAVE CUSTOMER + AI MESSAGES
    # ========================================================

    if conversation:

        user_message = Message(
            conversation_id=conversation.id,
            sender="customer",
            content=request.message,
            intent=intent,
            confidence=intent_confidence
        )

        db.add(user_message)


        ai_message = Message(
            conversation_id=conversation.id,
            sender="assistant",
            content=response_message,
            intent=intent,
            confidence=(
                faq_confidence
                if faq_found
                else None
            )
        )

        db.add(ai_message)

        db.commit()


    return SupportMessageResponse(

        message=response_message,

        intent=intent,

        intent_confidence=intent_confidence,

        faq_found=faq_found,

        faq_confidence=faq_confidence,

        knowledge_base_id=(
            faq_item.id
            if faq_item and faq_found
            else None
        ),

        requires_human=requires_human,

        ticket_recommended=ticket_recommended,

        ticket_created=ticket_created,

        ticket_id=ticket_id,

        priority=priority,

        priority_confidence=priority_confidence,

        escalation_reason=escalation_reason,

        automation_rules_applied=applied_rules,
    )