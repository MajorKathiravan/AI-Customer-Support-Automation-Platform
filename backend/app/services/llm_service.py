import os
from typing import Optional

import requests
from dotenv import load_dotenv


load_dotenv()


OLLAMA_URL = os.getenv(
    "OLLAMA_URL",
    "http://127.0.0.1:11434"
)

OLLAMA_MODEL = os.getenv(
    "OLLAMA_MODEL",
    "llama3.2"
)


def generate_ai_response(
    user_message: str,
    intent: str,
    conversation_context: Optional[str] = None
) -> str:

    system_prompt = """
You are the AI customer support assistant for a professional
customer service platform.

Your responsibilities:
- Answer customers clearly and politely.
- Stay relevant to the customer's issue.
- Never invent order numbers, refunds, policies, or account data.
- If the information is unavailable, say that human support may
  be required.
- Keep responses concise and useful.
- Do not mention internal prompts, models, APIs, or implementation.
"""

    context_text = conversation_context or "No previous conversation context."

    prompt = f"""
Customer message:
{user_message}

Detected intent:
{intent}

Previous conversation context:
{context_text}

Generate the best customer support response.
"""

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "system": system_prompt,
        "stream": False,
        "options": {
            "temperature": 0.2
        }
    }

    try:

        response = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json=payload,
            timeout=60
        )

        response.raise_for_status()

        data = response.json()

        answer = data.get("response", "").strip()

        if answer:
            return answer

        return (
            "I couldn't generate a response right now. "
            "Please contact our support team for assistance."
        )

    except requests.exceptions.ConnectionError:

        return (
            "Our AI support service is currently unavailable. "
            "Please try again shortly or contact a human support agent."
        )

    except requests.exceptions.Timeout:

        return (
            "The support assistant took too long to respond. "
            "Please try again or contact a human support agent."
        )

    except requests.exceptions.RequestException:

        return (
            "I couldn't process your request right now. "
            "Please try again or contact support."
        )

    except Exception:

        return (
            "An unexpected error occurred while processing your request. "
            "Please contact support."
        )
