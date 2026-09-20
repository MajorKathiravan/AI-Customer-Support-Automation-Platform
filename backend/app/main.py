from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine
from app.models import models

from app.api.customers import router as customers_router
from app.api.conversations import router as conversations_router
from app.api.tickets import router as tickets_router
from app.api.knowledge_base import router as knowledge_base_router
from app.api.support import router as support_router
from app.api.automation_rules import router as automation_rules_router
from app.api.analytics import router as analytics_router


Base.metadata.create_all(
    bind=engine
)


app = FastAPI(
    title="AI Customer Support & Automation Platform",
    description="AI-powered customer support backend",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    customers_router
)

app.include_router(
    conversations_router
)

app.include_router(
    tickets_router
)

app.include_router(
    knowledge_base_router
)

app.include_router(
    support_router
)

app.include_router(
    automation_rules_router
)

app.include_router(
    analytics_router
)


@app.get("/")
def root():
    return {
        "message": (
            "AI Customer Support "
            "& Automation Platform API"
        ),
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "database": "SQLite"
    }
