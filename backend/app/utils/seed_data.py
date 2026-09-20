from app.database.database import SessionLocal
from app.models.models import KnowledgeBase


FAQ_DATA = [

    {
        "question": "Where is my order?",
        "answer": (
            "You can check your order status from the Orders "
            "section of your account. Open the order to view "
            "the latest shipping and delivery information."
        ),
        "category": "orders",
        "keywords": "order,track,tracking,status,delivery,shipping",
    },

    {
        "question": "How can I request a refund?",
        "answer": (
            "To request a refund, open your Orders section, "
            "select the order, and choose the refund or return "
            "option. Refund eligibility depends on the product "
            "and applicable return policy."
        ),
        "category": "refunds",
        "keywords": "refund,return,money,refund request",
    },

    {
        "question": "My payment failed. What should I do?",
        "answer": (
            "Please verify your payment details and try again. "
            "You can also try another supported payment method. "
            "If the problem continues, contact support with the "
            "transaction details."
        ),
        "category": "payments",
        "keywords": "payment,failed,declined,transaction,card,pay",
    },

    {
        "question": "How do I reset my password?",
        "answer": (
            "Select 'Forgot Password' on the login screen and "
            "follow the instructions sent to your registered "
            "email address."
        ),
        "category": "account",
        "keywords": "password,reset,forgot,login,signin",
    },

    {
        "question": "How can I contact customer support?",
        "answer": (
            "You can contact customer support through this chat "
            "or request a human support agent. An agent can "
            "assist with issues that require manual review."
        ),
        "category": "support",
        "keywords": "support,agent,customer care,contact,human",
    },

    {
        "question": "How do I check product availability?",
        "answer": (
            "Open the product page to see its current availability "
            "and stock status."
        ),
        "category": "products",
        "keywords": "product,availability,stock,available",
    },

]


def seed_database():

    db = SessionLocal()

    try:

        existing_count = (
            db.query(KnowledgeBase)
            .count()
        )

        if existing_count > 0:

            print(
                f"Knowledge base already contains "
                f"{existing_count} item(s)."
            )

            return

        for item_data in FAQ_DATA:

            item = KnowledgeBase(
                question=item_data["question"],
                answer=item_data["answer"],
                category=item_data["category"],
                keywords=item_data["keywords"],
                active=True,
            )

            db.add(item)

        db.commit()

        print(
            f"Inserted {len(FAQ_DATA)} knowledge base items."
        )

    finally:

        db.close()


if __name__ == "__main__":

    seed_database()
