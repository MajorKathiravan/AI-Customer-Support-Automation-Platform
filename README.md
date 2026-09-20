# 🤖 AI Customer Support & Automation Platform

> An AI-powered customer support and automation platform that combines intelligent intent detection, FAQ matching, LLM-based responses, ticket automation, priority detection, knowledge-base management, conversation history, and analytics into a unified support workflow.

**React** • **FastAPI** • **Python** • **NLP** • **Generative AI** • **Ollama** • **Llama 3.2** • **SQLite** • **SQLAlchemy**

---

## 📖 Overview

AI Customer Support & Automation Platform is a full-stack AI application designed to automate and simplify customer support operations.

The system accepts customer messages, detects customer intent, matches questions against a knowledge base, detects issue priority, evaluates automation rules, creates support tickets when required, and generates AI-assisted responses.

The platform also provides an administrative interface for managing customers, conversations, tickets, knowledge-base content, automation rules, and support analytics.

The project demonstrates practical AI Product Development using React, FastAPI, Python, NLP, local Generative AI, database integration, workflow automation, and dashboard development.

---

## 🎯 Problem Statement

Customer support teams often spend significant time handling repetitive questions, identifying customer intent, assigning priority, and creating support tickets.

This project provides an intelligent support workflow that allows users to:

- Start customer support conversations
- Ask questions using natural language
- Detect customer intent
- Match questions with FAQ / knowledge-base content
- Detect issue priority
- Apply automation rules
- Automatically create support tickets
- Escalate issues requiring human assistance
- Maintain conversation history
- Manage tickets
- Manage knowledge-base content
- Manage automation workflows
- Monitor support analytics

---

## 💡 Solution

The system combines full-stack web development, REST APIs, NLP services, workflow automation, local LLM inference, and database storage.

```text
Customer Message
       ↓
Intent Detection
       ↓
FAQ / Knowledge Base Matching
       ↓
Priority Detection
       ↓
Automation Rule Evaluation
       ↓
Human Escalation / Ticket Decision
       ↓
LLM Response Generation
       ↓
Conversation Storage
       ↓
Admin Dashboard & Analytics
```

---

## ✨ Features

### 👤 Customer Support

- Customer registration
- Customer session management
- Browser-based support chat
- Natural-language customer messages
- AI-generated support responses
- Conversation history
- Intent detection
- Intent confidence scoring
- FAQ matching
- Knowledge-base retrieval
- Human escalation detection
- Ticket recommendation

### 🎫 Ticket Management

- Automatic ticket creation
- Ticket priority detection
- Urgent issue identification
- Ticket status management
- Open / resolved ticket tracking
- Ticket linked to conversations
- Admin ticket monitoring
- Ticket lifecycle management

### ⚙️ Automation

- Custom automation rules
- Keyword-based triggers
- Dynamic rule evaluation
- Automatic ticket creation
- Active / inactive rule control
- Workflow-based support actions
- Support-process automation

### 📚 Knowledge Base

- FAQ management
- Create knowledge items
- Update knowledge items
- Delete knowledge items
- Activate / deactivate knowledge items
- Intent-based categorization
- Automatic FAQ matching

### 🧑‍💼 Admin Dashboard

- Customer overview
- Conversation overview
- Ticket overview
- Ticket priority tracking
- Customer management
- Conversation management
- Ticket status updates
- Knowledge-base management
- Automation-rule management

### 📊 Analytics

- Total customers
- Total conversations
- Total tickets
- Open tickets
- Escalated conversations
- Active knowledge-base items
- Active automation rules
- Intent distribution

### 🤖 Generative AI

- Ollama integration
- Llama 3.2 integration
- Local LLM inference
- Conversation-context-aware prompting
- AI-assisted support responses
- LLM fallback handling

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│                                                             │
│ Customer Chat • Admin Dashboard • Management • Analytics   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │ REST API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend                           │
│                                                             │
│ Customers • Conversations • Support • Tickets              │
│ Knowledge Base • Automation Rules • Analytics              │
└──────────────────────────────┬──────────────────────────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      ┌─────────────┐  ┌──────────────┐  ┌──────────────┐
      │   SQLite    │  │ NLP / Rules  │  │   Ollama     │
      │  Database   │  │   Services   │  │  Llama 3.2   │
      └─────────────┘  └──────────────┘  └──────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- JavaScript
- Axios
- Lucide React
- CSS

### Backend

- Python
- FastAPI
- Uvicorn
- SQLAlchemy
- Pydantic

### AI / NLP

- Intent Detection
- FAQ Matching
- Priority Detection
- Rule-Based Automation
- Ollama
- Llama 3.2
- Local LLM Inference

### Database

- SQLite
- SQLAlchemy ORM

### API

- REST API
- FastAPI
- Swagger / OpenAPI

### Development Tools

- Visual Studio Code
- PowerShell
- Git
- GitHub

---

## 📁 Project Structure

```text
AI-Customer-Support-Automation-Platform/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── customers.py
│   │   │   ├── conversations.py
│   │   │   ├── tickets.py
│   │   │   ├── knowledge_base.py
│   │   │   ├── support.py
│   │   │   ├── automation_rules.py
│   │   │   └── analytics.py
│   │
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   └── database.py
│   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── models.py
│   │
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── schemas.py
│   │   │   └── support_schemas.py
│   │
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── intent_service.py
│   │   │   ├── faq_service.py
│   │   │   ├── llm_service.py
│   │   │   ├── priority_service.py
│   │   │   └── automation_service.py
│   │
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   └── seed_data.py
│   │
│   │   └── main.py
│   │
│   ├── data/
│   │   └── support.db
│   ├── requirements.txt
│   └── venv/
│
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminDashboard.css
│   │   ├── AdminManagement.jsx
│   │   ├── AdminManagement.css
│   │   ├── AnalyticsDashboard.jsx
│   │   ├── AnalyticsDashboard.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── index.html
│
├── .gitignore
└── README.md
```

---

## 🔄 Application Workflow

```text
1. Customer Opens Support Center
                ↓
2. Customer Starts Conversation
                ↓
3. Customer Sends Message
                ↓
4. Detect Customer Intent
                ↓
5. Search Knowledge Base
                ↓
6. Calculate FAQ Match
                ↓
7. Detect Priority
                ↓
8. Evaluate Automation Rules
                ↓
9. Determine Ticket / Escalation Requirement
                ↓
10. Create or Reuse Support Ticket
                ↓
11. Build Conversation Context
                ↓
12. Generate AI Response
                ↓
13. Store User Message and AI Response
                ↓
14. Display Response
                ↓
15. Admin Reviews Support Activity
                ↓
16. Analytics Updated
```

---

## 🧠 Intent Detection

The support service analyzes incoming customer messages and identifies a likely intent.

Example:

```text
Customer:
"My order is urgent and I need help immediately."

Detected Intent:
order_status
```

The response includes an intent confidence value.

Intent information can support:

- FAQ matching
- Ticket categorization
- Escalation decisions
- Automation
- Analytics

---

## 📚 FAQ / Knowledge Base Matching

The platform compares customer questions against stored knowledge-base items.

```text
Customer Question
       ↓
Question Processing
       ↓
Knowledge Base Search
       ↓
Best FAQ Match
       ↓
FAQ Confidence
       ↓
Relevant Support Context
```

The application contains seeded FAQ content and provides administrative CRUD operations for knowledge-base content.

---

## 🚦 Priority Detection

The platform identifies the priority of incoming support requests.

```text
Customer Message
       ↓
Priority Detection
       ↓
URGENT
       ↓
Human Assistance
       ↓
Ticket Creation
```

Example:

```text
Customer:
"My order is urgent and I need help immediately."

Priority:
URGENT
```

---

## ⚙️ Automation Rules

Automation rules allow the platform to respond automatically to specific support conditions.

Example:

```text
Rule Name:     Urgent Complaints
Trigger Type:  Keyword
Trigger Value: urgent
Action Type:   Create Ticket
```

Workflow:

```text
Customer Message
       ↓
Contains "urgent"
       ↓
Automation Rule Matches
       ↓
Create Ticket
       ↓
Link Ticket to Conversation
```

---

## 🎫 Ticket Lifecycle

Support tickets can be created automatically from customer conversations.

```text
Customer Issue
      ↓
AI / Rule Analysis
      ↓
Ticket Created
      ↓
OPEN
      ↓
Admin Action
      ↓
RESOLVED
```

The admin dashboard provides ticket monitoring and status management.

---

## 🤖 Generative AI

The application integrates **Ollama + Llama 3.2** for local AI response generation.

The LLM can use:

- Current customer message
- Recent conversation context
- Detected intent
- FAQ / knowledge-base context
- Support workflow information

to generate an AI-assisted response.

Local inference allows the application to use a locally hosted language model without requiring a paid hosted LLM API.

---

## 🧠 Conversation Context

Recent conversation history can be included when generating a new response.

```text
Previous Messages
       +
Current Customer Message
       +
Support Context
       ↓
LLM Prompt
       ↓
Llama 3.2
       ↓
AI Response
```

This supports contextual customer conversations and follow-up questions.

---

## 📊 Analytics Dashboard

The analytics layer provides a high-level view of support activity.

```text
SQLite Database
       ↓
Analytics API
       ↓
React Analytics Dashboard
       │
       ├── Total Customers
       ├── Total Conversations
       ├── Total Tickets
       ├── Open Tickets
       ├── Escalated Conversations
       ├── Knowledge Base Items
       ├── Automation Rules
       └── Intent Distribution
```

### Example Analytics Response

```json
{
  "total_customers": 2,
  "total_conversations": 2,
  "total_tickets": 1,
  "open_tickets": 0,
  "escalated_conversations": 0,
  "active_knowledge_items": 6,
  "active_automation_rules": 0,
  "intent_distribution": [
    {
      "intent": "order_status",
      "count": 2
    }
  ]
}
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API home endpoint |
| `GET` | `/health` | Backend health check |
| `GET` | `/api/customers` | Retrieve customers |
| `POST` | `/api/customers` | Create customer |
| `GET` | `/api/conversations` | Retrieve conversations |
| `POST` | `/api/conversations` | Create conversation |
| `GET` | `/api/conversations/{conversation_id}/messages` | Retrieve messages |
| `POST` | `/api/conversations/{conversation_id}/messages` | Add message |
| `POST` | `/api/support/analyze` | Analyze support message |
| `GET` | `/api/tickets` | Retrieve tickets |
| `POST` | `/api/tickets` | Create ticket |
| `PATCH` | `/api/tickets/{ticket_id}/status` | Update ticket status |
| `GET` | `/api/knowledge-base` | Retrieve knowledge items |
| `POST` | `/api/knowledge-base` | Create knowledge item |
| `PUT` | `/api/knowledge-base/{item_id}` | Update knowledge item |
| `DELETE` | `/api/knowledge-base/{item_id}` | Delete knowledge item |
| `GET` | `/api/automation-rules` | Retrieve automation rules |
| `POST` | `/api/automation-rules` | Create automation rule |
| `PUT` | `/api/automation-rules/{rule_id}` | Update automation rule |
| `DELETE` | `/api/automation-rules/{rule_id}` | Delete automation rule |
| `GET` | `/api/analytics/overview` | Retrieve analytics |

---

## 📚 Swagger API Documentation

FastAPI automatically provides interactive Swagger / OpenAPI documentation.

```text
http://127.0.0.1:8000/docs
```

The Swagger interface can be used to inspect and test the backend APIs.

---

## ⚙️ Backend Setup

### 1. Clone the Repository

```powershell
git clone https://github.com/MajorKathiravan/AI-Customer-Support-Automation-Platform.git
```

### 2. Navigate to Backend

```powershell
cd "AI-Customer-Support-Automation-Platform\backend"
```

### 3. Create Virtual Environment

```powershell
python -m venv venv
```

### 4. Activate Virtual Environment

```powershell
.\venv\Scripts\Activate.ps1
```

### 5. Install Dependencies

```powershell
python -m pip install -r requirements.txt
```

### 6. Start FastAPI

```powershell
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

Health Check:

```text
http://127.0.0.1:8000/health
```

---

## 🌐 Frontend Setup

Open another terminal.

### 1. Navigate to Frontend

```powershell
cd "AI-Customer-Support-Automation-Platform\frontend"
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Start Development Server

```powershell
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🦙 Ollama Setup

The Generative AI component uses **Ollama + Llama 3.2**.

### Check Ollama

```powershell
ollama --version
```

### Pull the Model

```powershell
ollama pull llama3.2
```

### Check Available Models

```powershell
ollama list
```

### Run the Model

```powershell
ollama run llama3.2
```

Typical local endpoint:

```text
http://127.0.0.1:11434
```

---

## 🖥️ Application Pages

### Customer Support

```text
http://localhost:5173/
```

### Admin Dashboard

```text
http://localhost:5173/admin
```

### Admin Management

```text
http://localhost:5173/admin/management
```

### Analytics Dashboard

```text
http://localhost:5173/admin/analytics
```

---

## 🧪 Testing

The complete application workflow was tested across the main platform modules.

### Backend Testing

```text
✅ FastAPI import
✅ FastAPI route registration
✅ SQLite database
✅ Health endpoint
✅ Analytics endpoint
✅ Customer API
✅ Conversation API
✅ Ticket API
✅ Knowledge Base API
✅ Automation Rules API
✅ Support Analysis API
```

### Customer Support Testing

```text
✅ Customer creation
✅ Conversation creation
✅ Customer support chat
✅ Intent detection
✅ FAQ matching
✅ AI response generation
✅ Priority detection
✅ Urgent issue detection
✅ Human-assistance detection
✅ Automatic ticket creation
```

### Ticket Testing

```text
✅ Ticket creation
✅ Urgent priority detection
✅ Ticket displayed in Admin Dashboard
✅ Ticket status update
✅ OPEN → RESOLVED workflow
✅ Dashboard metrics update
```

### Administration Testing

```text
✅ Customer management
✅ Conversation management
✅ Ticket management
✅ Knowledge Base management
✅ Automation Rule management
✅ Analytics Dashboard
```

### Frontend Testing

```text
✅ React application
✅ Backend integration
✅ Production build
✅ UTF-8 source validation
```

---

## 🧪 Functional Test Example

### Test Message

```text
My order is urgent and I need help immediately.
```

### Observed Workflow

```text
Customer Message
       ↓
Intent: order_status
       ↓
Priority: URGENT
       ↓
Human assistance required
       ↓
Support ticket created
       ↓
Ticket #1
       ↓
Admin status updated
       ↓
RESOLVED
```

---

## 📊 Verified Test Results

### Backend Health

```json
{
  "status": "healthy",
  "database": "SQLite"
}
```

### Analytics API

```json
{
  "total_customers": 2,
  "total_conversations": 2,
  "total_tickets": 1,
  "open_tickets": 0,
  "escalated_conversations": 0,
  "active_knowledge_items": 6,
  "active_automation_rules": 0,
  "intent_distribution": [
    {
      "intent": "order_status",
      "count": 2
    }
  ]
}
```

### Frontend Production Build

```text
vite v8.3.0 building client environment for production...

✓ 1941 modules transformed.

✓ built successfully
```

---

## 🗄️ Database Design

The application uses SQLite with SQLAlchemy ORM.

### Main Tables

```text
customers
conversations
messages
tickets
knowledge_base
automation_rules
```

### Relationship Overview

```text
Customer
   │
   └── Conversations
          │
          ├── Messages
          │
          └── Tickets

Knowledge Base
      │
      └── FAQ / Intent Matching

Automation Rules
      │
      └── Support Workflow
```

---

## 🧾 Example Support Record

```text
Customer:
Major

Email:
major@test.com

Message:
My order is urgent and I need help immediately.

Intent:
order_status

Priority:
URGENT

Human Assistance:
Required

Ticket:
Created

Ticket Status:
RESOLVED
```

---

## 🧩 Major Functional Modules

```text
Customer Support
       │
       ├── Customer Management
       ├── Conversation Management
       ├── Intent Detection
       ├── FAQ Matching
       ├── Priority Detection
       └── AI Response Generation
       │
       ▼
Support Automation
       │
       ├── Automation Rules
       ├── Ticket Creation
       ├── Escalation
       └── Ticket Status Management
       │
       ▼
Administration
       │
       ├── Customers
       ├── Conversations
       ├── Tickets
       ├── Knowledge Base
       ├── Automation Rules
       └── Analytics
```

---

## 🔐 Repository Hygiene

The following files should remain excluded from Git:

```text
venv/
backend/venv/
frontend/node_modules/
dist/
.env
.env.*
__pycache__/
*.pyc
*.pyo
*.db
*.sqlite
*.sqlite3
*.log
.vscode/
```

### Never Commit

- API keys
- Passwords
- Private environment variables
- Local databases
- Virtual environments
- Uploaded customer data

This protects sensitive configuration and local development files from being committed accidentally.

---

## 🔐 Security Considerations

For production deployment, the platform can be extended with:

- JWT authentication
- Role-based access control
- Secure password hashing
- API rate limiting
- Restrictive CORS configuration
- Secret management
- Audit logging
- Database migrations
- PostgreSQL
- HTTPS
- Production monitoring

---

## 🚀 Future Improvements

Potential enhancements include:

- Admin authentication
- Role-based permissions
- Email support integration
- WhatsApp integration
- Multi-language support
- Sentiment analysis
- Customer feedback / CSAT
- Agent assignment
- SLA tracking
- Email notifications
- Advanced workflow builder
- Streaming LLM responses
- PostgreSQL support
- Docker deployment
- Cloud deployment
- Advanced support analytics
- AI agent workflows
- Vector-based knowledge retrieval
- Semantic intent classification
- Multichannel customer support

---

## 🎯 Project Objective

This project demonstrates how to build a complete AI-powered customer support product by combining:

- Artificial Intelligence
- Natural Language Processing
- Generative AI
- Large Language Models
- Python
- FastAPI
- React
- REST APIs
- SQLite
- SQLAlchemy
- Knowledge-base retrieval
- Ticket automation
- Workflow automation
- Dashboard analytics
- Local AI inference

The project is designed as a portfolio project demonstrating **AI Product Development and full-stack AI application engineering**.

---

## 💼 Skills Demonstrated

### Artificial Intelligence

- Generative AI
- Large Language Models
- Local LLM inference
- Ollama
- Llama 3.2
- Prompt engineering

### NLP

- Intent detection
- Intent confidence scoring
- FAQ matching
- Text-based classification

### Backend Development

- Python
- FastAPI
- REST APIs
- SQLAlchemy
- SQLite
- Pydantic
- API validation

### Frontend Development

- React
- Vite
- JavaScript
- Axios
- CSS
- Dashboard development
- API integration

### Automation

- Keyword-based rules
- Dynamic rule evaluation
- Ticket automation
- Escalation workflows

### Software Engineering

- Git
- GitHub
- Virtual environments
- Dependency management
- API documentation
- Testing
- Production build verification

---

## 🎤 Interview Explanation

### 30-Second Explanation

> I built an AI Customer Support and Automation Platform using React and FastAPI. The system accepts customer messages and detects their intent, matches them against a knowledge base, detects priority, evaluates automation rules, and automatically creates a support ticket when necessary. I integrated Ollama with Llama 3.2 for local AI-generated support responses and added conversation history, ticket management, knowledge-base management, automation rules, and analytics using SQLite and SQLAlchemy.

### Technical Flow

```text
Customer Message
      ↓
Intent Detection
      ↓
FAQ Matching
      ↓
Priority Detection
      ↓
Automation Rules
      ↓
Ticket / Escalation
      ↓
Conversation Context
      ↓
Ollama
      ↓
Llama 3.2
      ↓
AI Response
      ↓
SQLite
      ↓
Admin Dashboard
```

---

## 📌 Key Learning Outcomes

Through this project, I gained practical experience in:

- Designing a full-stack AI product
- Building REST APIs with FastAPI
- Developing React interfaces
- Integrating local LLMs
- Implementing NLP-based intent detection
- Building knowledge-base matching
- Designing ticket automation workflows
- Working with SQLAlchemy
- Creating analytics dashboards
- Connecting frontend and backend systems
- Testing application workflows
- Managing projects using Git and GitHub

---

## 🌐 Portfolio Project

This project is part of an **AI Product Development Portfolio** focused on practical full-stack AI applications.

```text
AI Product Development
        +
Generative AI
        +
NLP
        +
Automation
        +
Full-Stack Development
        ↓
AI Customer Support Product
```

---

## 👨‍💻 Author

### Kathiravan Velmurugan

**B.Tech – Artificial Intelligence & Data Science**

**AI / ML • Generative AI • Python • FastAPI • React • Data Science**

GitHub:

https://github.com/MajorKathiravan

---

## ⭐ Project

**AI Customer Support & Automation Platform**

Built as an **AI Product Development portfolio project**.
