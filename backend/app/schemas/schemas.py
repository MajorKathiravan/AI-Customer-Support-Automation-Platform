from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class CustomerCreate(BaseModel):

    name: str
    email: EmailStr


class CustomerResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    created_at: datetime


class ConversationCreate(BaseModel):

    customer_id: int


class ConversationResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_id: int
    status: str
    created_at: datetime
    updated_at: datetime | None


class MessageCreate(BaseModel):

    sender: str
    content: str


class MessageResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    conversation_id: int
    sender: str
    content: str
    intent: str | None
    confidence: float | None
    created_at: datetime


class TicketCreate(BaseModel):

    conversation_id: int
    customer_id: int
    subject: str
    description: str
    category: str = "general"
    priority: str = "medium"


class TicketResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    conversation_id: int
    customer_id: int
    subject: str
    description: str
    category: str
    priority: str
    status: str
    created_at: datetime
    updated_at: datetime | None


class KnowledgeBaseCreate(BaseModel):

    question: str
    answer: str
    category: str = "general"
    keywords: str | None = None


class KnowledgeBaseUpdate(BaseModel):

    question: str | None = None
    answer: str | None = None
    category: str | None = None
    keywords: str | None = None
    active: bool | None = None


class KnowledgeBaseResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    question: str
    answer: str
    category: str
    keywords: str | None
    active: bool
    created_at: datetime


class AutomationRuleCreate(BaseModel):

    name: str
    trigger_type: str
    trigger_value: str
    action_type: str
    action_value: str | None = None
    active: bool = True


class AutomationRuleUpdate(BaseModel):

    name: str | None = None
    trigger_type: str | None = None
    trigger_value: str | None = None
    action_type: str | None = None
    action_value: str | None = None
    active: bool | None = None


class AutomationRuleResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    trigger_type: str
    trigger_value: str
    action_type: str
    action_value: str | None
    active: bool
    created_at: datetime