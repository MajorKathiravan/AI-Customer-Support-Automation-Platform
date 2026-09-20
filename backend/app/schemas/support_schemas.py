from pydantic import BaseModel, Field


class SupportMessageRequest(BaseModel):

    conversation_id: int | None = None

    message: str = Field(
        min_length=1,
        max_length=2000
    )


class SupportMessageResponse(BaseModel):

    message: str

    intent: str

    intent_confidence: float

    faq_found: bool

    faq_confidence: float

    knowledge_base_id: int | None

    requires_human: bool

    ticket_recommended: bool

    ticket_created: bool

    ticket_id: int | None

    priority: str

    priority_confidence: float

    escalation_reason: str | None

    automation_rules_applied: list[str]