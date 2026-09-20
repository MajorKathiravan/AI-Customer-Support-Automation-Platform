from typing import Optional, Tuple

from rapidfuzz.fuzz import ratio
from sqlalchemy.orm import Session

from app.models.models import KnowledgeBase


def find_best_faq(
    query: str,
    db: Session
) -> Tuple[Optional[KnowledgeBase], float]:

    items = (
        db.query(KnowledgeBase)
        .filter(
            KnowledgeBase.active == True
        )
        .all()
    )

    if not items:
        return None, 0.0

    best_item = None
    best_score = 0.0

    query = query.strip().lower()

    for item in items:

        question_score = ratio(
            query,
            item.question.lower()
        ) / 100.0

        keyword_score = 0.0

        if item.keywords:

            keywords = [
                keyword.strip().lower()
                for keyword in item.keywords.split(",")
                if keyword.strip()
            ]

            matched_keywords = 0

            for keyword in keywords:

                if keyword in query:
                    matched_keywords += 1

            if keywords:

                keyword_score = (
                    matched_keywords / len(keywords)
                )

        score = max(
            question_score,
            keyword_score
        )

        if score > best_score:

            best_score = score
            best_item = item

    return best_item, round(best_score, 3)
