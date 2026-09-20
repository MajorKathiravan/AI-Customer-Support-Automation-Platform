import re
from typing import Dict, List, Tuple


INTENT_PATTERNS: Dict[str, List[str]] = {

    "order_status": [
        "where is my order",
        "track my order",
        "order tracking",
        "track order",
        "order status",
        "when will my order arrive",
        "delivery status",
        "shipping status",
        "where is my package",
        "where is my parcel",
    ],

    "refund_request": [
        "i want a refund",
        "request a refund",
        "refund my order",
        "how do i get a refund",
        "money back",
        "return and refund",
        "need a refund",
        "refund request",
    ],

    "payment_issue": [
        "payment failed",
        "payment not working",
        "card payment failed",
        "transaction failed",
        "payment declined",
        "unable to pay",
        "payment error",
        "charged twice",
        "wrong payment",
    ],

    "password_reset": [
        "forgot password",
        "reset password",
        "change my password",
        "password reset",
        "can't login",
        "cannot login",
        "unable to login",
        "login problem",
        "sign in problem",
    ],

    "account_issue": [
        "account locked",
        "account problem",
        "update my account",
        "change account details",
        "account access",
        "my account is blocked",
    ],

    "contact_support": [
        "contact support",
        "talk to support",
        "speak to an agent",
        "talk to an agent",
        "human agent",
        "customer care",
        "customer support",
        "support team",
    ],

    "product_information": [
        "product details",
        "tell me about the product",
        "product information",
        "what is this product",
        "product availability",
        "is this product available",
        "stock availability",
    ],

    "greeting": [
        "hi",
        "hello",
        "hey",
        "good morning",
        "good afternoon",
        "good evening",
    ],
}


def normalize_text(text: str) -> str:

    text = text.lower().strip()

    text = re.sub(
        r"[^a-z0-9\s]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text


def detect_intent(text: str) -> Tuple[str, float]:

    normalized = normalize_text(text)

    if not normalized:
        return "general", 0.0

    best_intent = "general"
    best_score = 0.0

    for intent, patterns in INTENT_PATTERNS.items():

        intent_score = 0.0

        for pattern in patterns:

            pattern_normalized = normalize_text(pattern)

            if pattern_normalized in normalized:

                intent_score = max(
                    intent_score,
                    1.0
                )

            else:

                pattern_words = set(
                    pattern_normalized.split()
                )

                text_words = set(
                    normalized.split()
                )

                if pattern_words:

                    overlap = (
                        len(pattern_words & text_words)
                        / len(pattern_words)
                    )

                    intent_score = max(
                        intent_score,
                        overlap
                    )

        if intent_score > best_score:

            best_score = intent_score
            best_intent = intent

    confidence = round(
        min(best_score, 1.0),
        3
    )

    return best_intent, confidence
