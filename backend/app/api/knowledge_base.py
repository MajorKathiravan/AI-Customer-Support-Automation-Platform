from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.models import KnowledgeBase
from app.schemas.schemas import (
    KnowledgeBaseCreate,
    KnowledgeBaseResponse,
    KnowledgeBaseUpdate,
)


router = APIRouter(
    prefix="/api/knowledge-base",
    tags=["Knowledge Base"]
)


@router.post(
    "",
    response_model=KnowledgeBaseResponse
)
def create_knowledge_item(
    item_data: KnowledgeBaseCreate,
    db: Session = Depends(get_db)
):

    item = KnowledgeBase(
        question=item_data.question,
        answer=item_data.answer,
        category=item_data.category,
        keywords=item_data.keywords,
        active=True
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


@router.get(
    "",
    response_model=list[KnowledgeBaseResponse]
)
def get_knowledge_items(
    db: Session = Depends(get_db)
):

    return (
        db.query(KnowledgeBase)
        .order_by(KnowledgeBase.id.desc())
        .all()
    )


@router.patch(
    "/{item_id}",
    response_model=KnowledgeBaseResponse
)
def update_knowledge_item(
    item_id: int,
    item_data: KnowledgeBaseUpdate,
    db: Session = Depends(get_db)
):

    item = (
        db.query(KnowledgeBase)
        .filter(
            KnowledgeBase.id == item_id
        )
        .first()
    )

    if not item:

        raise HTTPException(
            status_code=404,
            detail="Knowledge base item not found."
        )

    updates = item_data.model_dump(
        exclude_unset=True
    )

    for field, value in updates.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)

    return item


@router.delete(
    "/{item_id}"
)
def delete_knowledge_item(
    item_id: int,
    db: Session = Depends(get_db)
):

    item = (
        db.query(KnowledgeBase)
        .filter(
            KnowledgeBase.id == item_id
        )
        .first()
    )

    if not item:

        raise HTTPException(
            status_code=404,
            detail="Knowledge base item not found."
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Knowledge base item deleted.",
        "id": item_id
    }