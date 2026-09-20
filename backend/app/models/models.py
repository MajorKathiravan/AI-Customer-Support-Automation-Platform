from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.database.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class Customer(Base):

    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String(120),
        nullable=False
    )

    email = Column(
        String(255),
        nullable=False,
        unique=True,
        index=True
    )

    created_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )

    conversations = relationship(
        "Conversation",
        back_populates="customer",
        cascade="all, delete-orphan"
    )

    tickets = relationship(
        "Ticket",
        back_populates="customer",
        cascade="all, delete-orphan"
    )


class Conversation(Base):

    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False
    )

    status = Column(
        String(30),
        default="open",
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now
    )

    customer = relationship(
        "Customer",
        back_populates="conversations"
    )

    messages = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete-orphan"
    )

    tickets = relationship(
        "Ticket",
        back_populates="conversation",
        cascade="all, delete-orphan"
    )


class Message(Base):

    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)

    conversation_id = Column(
        Integer,
        ForeignKey("conversations.id"),
        nullable=False
    )

    sender = Column(
        String(30),
        nullable=False
    )

    content = Column(
        Text,
        nullable=False
    )

    intent = Column(
        String(100),
        nullable=True
    )

    confidence = Column(
        Float,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )

    conversation = relationship(
        "Conversation",
        back_populates="messages"
    )


class Ticket(Base):

    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)

    conversation_id = Column(
        Integer,
        ForeignKey("conversations.id"),
        nullable=False
    )

    customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False
    )

    subject = Column(
        String(255),
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    category = Column(
        String(100),
        default="general",
        nullable=False
    )

    priority = Column(
        String(30),
        default="medium",
        nullable=False
    )

    status = Column(
        String(30),
        default="open",
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now
    )

    conversation = relationship(
        "Conversation",
        back_populates="tickets"
    )

    customer = relationship(
        "Customer",
        back_populates="tickets"
    )


class KnowledgeBase(Base):

    __tablename__ = "knowledge_base"

    id = Column(Integer, primary_key=True, index=True)

    question = Column(
        Text,
        nullable=False
    )

    answer = Column(
        Text,
        nullable=False
    )

    category = Column(
        String(100),
        default="general",
        nullable=False
    )

    keywords = Column(
        Text,
        nullable=True
    )

    active = Column(
        Boolean,
        default=True,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )


class AutomationRule(Base):

    __tablename__ = "automation_rules"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(150),
        nullable=False
    )

    trigger_type = Column(
        String(50),
        nullable=False
    )

    trigger_value = Column(
        String(255),
        nullable=False
    )

    action_type = Column(
        String(50),
        nullable=False
    )

    action_value = Column(
        String(100),
        nullable=True
    )

    active = Column(
        Boolean,
        default=True,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )