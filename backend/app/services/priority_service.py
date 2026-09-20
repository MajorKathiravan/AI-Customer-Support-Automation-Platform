import re
from typing import Tuple


PRIORITY_RANK = {
    "low": 1,
    "medium": 2,
    "high": 3,
    "urgent": 4,
}


URGENT_PATTERNS = [
    "fraud",
    "fraudulent",
    "account hacked",
    "hacked account",
    "security breach",
    "money stolen",
    "stolen money",
    "unauthorized transaction",
    "unauthorized charge",
    "someone accessed my account",
    "urgent",
    "emergency",
]


HIGH_PATTERNS = [
    "payment failed",
    "payment declined",
    "charged twice",
    "duplicate charge",
    "refund not received",
    "money missing",
    "cannot access my account",
    "account blocked",
    "account locked",
    "complaint",
    "very angry",
    "terrible service",
]


LOW_PATTERNS = [
    "product details",
    "product information",
    "availability",
    "stock",
    "what is this product",
]


def normalize_text(text: str) -> str:

    text = text.lower().strip()

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text


def detect_priority(
    text: str,
    intent: str
) -> Tuple[str, float, str]:

    normalized = normalize_text(text)

    # --------------------------------------------------------
    # URGENT
    # --------------------------------------------------------

    for pattern in URGENT_PATTERNS:

        if pattern in normalized:

            return (
                "urgent",
                1.0,
                f"Urgent keyword detected: {pattern}"
            )

    # --------------------------------------------------------
    # HIGH
    # --------------------------------------------------------

    for pattern in HIGH_PATTERNS:

        if pattern in normalized:

            return (
                "high",
                0.9,
                f"High-priority keyword detected: {pattern}"
            )

    # Payment and refund issues receive higher attention
    if intent in {
        "payment_issue",
        "refund_request",
    }:

        return (
            "high",
            0.85,
            f"Intent requires elevated attention: {intent}"
        )

    # --------------------------------------------------------
    # LOW
    # --------------------------------------------------------

    for pattern in LOW_PATTERNS:

        if pattern in normalized:

            return (
                "low",
                0.9,
                f"Low-priority informational request: {pattern}"
            )

    # --------------------------------------------------------
    # DEFAULT
    # --------------------------------------------------------

    return (
        "medium",
        0.5,
        "No urgent or high-priority indicators detected"
    )


def is_higher_priority(
    new_priority: str,
    existing_priority: str
) -> bool:

    return (
        PRIORITY_RANK.get(new_priority, 2)
        >
        PRIORITY_RANK.get(existing_priority, 2)
    )
