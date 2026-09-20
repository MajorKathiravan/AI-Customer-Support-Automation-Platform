import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  Bot,
  CircleAlert,
  Headphones,
  MessageCircle,
  Send,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";

import AdminDashboard from "./AdminDashboard";
import AnalyticsDashboard from "./AnalyticsDashboard";
import AdminManagement from "./AdminManagement";

import "./App.css";


const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


function CustomerChat() {

  const [customer, setCustomer] = useState(null);
  const [conversation, setConversation] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [lastAnalysis, setLastAnalysis] = useState(null);

  const [startingChat, setStartingChat] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  const canStartChat = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      email.trim().length > 3 &&
      email.includes("@")
    );
  }, [name, email]);


  const canSend = useMemo(() => {
    return (
      conversation !== null &&
      message.trim().length > 0 &&
      !loading
    );
  }, [conversation, message, loading]);


  useEffect(() => {

    const savedCustomer =
      sessionStorage.getItem("support_customer");

    const savedConversation =
      sessionStorage.getItem("support_conversation");

    if (savedCustomer) {
      try {
        setCustomer(JSON.parse(savedCustomer));
      } catch {
        sessionStorage.removeItem("support_customer");
      }
    }

    if (savedConversation) {
      try {
        setConversation(JSON.parse(savedConversation));
      } catch {
        sessionStorage.removeItem("support_conversation");
      }
    }

  }, []);


  useEffect(() => {

    if (!conversation?.id) {
      return;
    }

    loadMessages(conversation.id);

  }, [conversation]);


  async function loadMessages(conversationId) {

    try {

      const response = await api.get(
        `/api/conversations/${conversationId}/messages`
      );

      setMessages(
        (response.data || []).map((item) => ({
          id: item.id,
          sender: item.sender,
          content: item.content,
          createdAt: item.created_at,
        }))
      );

    } catch (err) {

      console.error(
        "Failed to load messages:",
        err
      );

    }

  }


  async function findCustomerByEmail() {

    const response = await api.get(
      "/api/customers"
    );

    return (
      response.data.find(
        (item) =>
          item.email.toLowerCase() ===
          email.trim().toLowerCase()
      ) || null
    );

  }


  async function getOrCreateCustomer() {

    const existing =
      await findCustomerByEmail();

    if (existing) {
      return existing;
    }

    const response = await api.post(
      "/api/customers",
      {
        name: name.trim(),
        email: email.trim(),
      }
    );

    return response.data;

  }


  async function startChat(event) {

    event.preventDefault();

    if (!canStartChat || startingChat) {
      return;
    }

    setStartingChat(true);
    setError("");

    try {

      const customerData =
        await getOrCreateCustomer();

      const conversationResponse =
        await api.post(
          "/api/conversations",
          {
            customer_id: customerData.id,
          }
        );


      const customerSession = {
        id: customerData.id,
        name: customerData.name,
        email: customerData.email,
      };


      const conversationSession =
        conversationResponse.data;


      setCustomer(customerSession);
      setConversation(conversationSession);
      setMessages([]);
      setLastAnalysis(null);

      sessionStorage.setItem(
        "support_customer",
        JSON.stringify(customerSession)
      );

      sessionStorage.setItem(
        "support_conversation",
        JSON.stringify(conversationSession)
      );

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Unable to start the support chat."
      );

    } finally {

      setStartingChat(false);

    }

  }


  async function sendMessage(event) {

    event?.preventDefault();

    const trimmed = message.trim();

    if (!canSend) {
      return;
    }

    setLoading(true);
    setError("");

    const temporaryId =
      `customer-${Date.now()}`;

    const customerMessage = {
      id: temporaryId,
      sender: "customer",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };


    setMessages((previous) => [
      ...previous,
      customerMessage,
    ]);

    setMessage("");


    try {

      const response =
        await api.post(
          "/api/support/analyze",
          {
            conversation_id:
              conversation.id,
            message: trimmed,
          }
        );


      const data = response.data;


      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        content: data.message,
        createdAt: new Date().toISOString(),
      };


      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);


      setLastAnalysis(data);

    } catch (err) {

      console.error(err);

      setMessages((previous) =>
        previous.filter(
          (item) =>
            item.id !== temporaryId
        )
      );

      setMessage(trimmed);

      setError(
        err.response?.data?.detail ||
        "Unable to process your message."
      );

    } finally {

      setLoading(false);

    }

  }


  function handleKeyDown(event) {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage(event);

    }

  }


  function useSuggestion(value) {

    setMessage(value);

  }


  function resetChat() {

    sessionStorage.removeItem(
      "support_customer"
    );

    sessionStorage.removeItem(
      "support_conversation"
    );

    setCustomer(null);
    setConversation(null);
    setMessages([]);
    setLastAnalysis(null);
    setMessage("");
    setError("");

  }


  if (!customer || !conversation) {

    return (
      <div className="app-shell">

        <div className="login-page">

          <div className="brand-mark">
            <Headphones size={28} />
          </div>

          <h1>
            AI Customer Support
          </h1>

          <p className="subtitle">
            Get instant help from our AI
            support assistant.
          </p>


          <form
            className="start-card"
            onSubmit={startChat}
          >

            <div className="card-heading">

              <MessageCircle size={20} />

              <div>
                <h2>
                  Start a conversation
                </h2>

                <p>
                  Enter your details to begin.
                </p>
              </div>

            </div>


            <label htmlFor="customer-name">
              Name
            </label>

            <input
              id="customer-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />


            <label htmlFor="customer-email">
              Email
            </label>

            <input
              id="customer-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />


            {error && (
              <div className="error-banner">

                <XCircle size={17} />

                <span>
                  {error}
                </span>

              </div>
            )}


            <button
              className="primary-button"
              type="submit"
              disabled={
                !canStartChat ||
                startingChat
              }
            >

              {startingChat
                ? "Starting..."
                : "Start Support Chat"}

              <Send size={17} />

            </button>


            <div className="privacy-note">

              <ShieldCheck size={16} />

              <span>
                Your conversation is stored
                securely for support purposes.
              </span>

            </div>

          </form>

        </div>

      </div>
    );

  }


  return (
    <div className="app-shell">

      <header className="topbar">

        <div className="brand">

          <div className="brand-icon">
            <Headphones size={21} />
          </div>

          <div>

            <strong>
              AI Support Center
            </strong>

            <span>
              Intelligent customer service
            </span>

          </div>

        </div>


        <div className="user-area">

          <div className="user-info">

            <strong>
              {customer.name}
            </strong>

            <span>
              {customer.email}
            </span>

          </div>


          <button
            className="logout-button"
            onClick={resetChat}
            title="End chat"
          >
            <XCircle size={18} />
          </button>

        </div>

      </header>


      <main className="workspace">

        <section className="chat-panel">

          <div className="chat-header">

            <div className="bot-avatar">
              <Bot size={22} />
            </div>

            <div>

              <h2>
                AI Support Assistant
              </h2>

              <span className="online-status">
                <span className="status-dot"></span>
                Online
              </span>

            </div>

          </div>


          <div className="messages-area">

            {messages.length === 0 && (

              <div className="welcome-message">

                <div className="welcome-icon">
                  <Bot size={34} />
                </div>

                <h3>
                  Hi {customer.name}! 👋
                </h3>

                <p>
                  Tell me what you need help with.
                  I can assist with orders, payments,
                  refunds, account issues, and more.
                </p>


                <div className="suggestions">

                  <button
                    onClick={() =>
                      useSuggestion(
                        "Where is my order?"
                      )
                    }
                  >
                    Where is my order?
                  </button>


                  <button
                    onClick={() =>
                      useSuggestion(
                        "I forgot my password"
                      )
                    }
                  >
                    Reset my password
                  </button>


                  <button
                    onClick={() =>
                      useSuggestion(
                        "I need a refund"
                      )
                    }
                  >
                    Request a refund
                  </button>

                </div>

              </div>

            )}


            {messages.map((item) => (

              <div
                key={item.id}
                className={
                  item.sender === "customer"
                    ? "message-row customer-row"
                    : "message-row assistant-row"
                }
              >

                {item.sender === "assistant" && (
                  <div className="small-avatar">
                    <Bot size={16} />
                  </div>
                )}


                <div
                  className={
                    item.sender === "customer"
                      ? "message-bubble customer-bubble"
                      : "message-bubble assistant-bubble"
                  }
                >
                  {item.content}
                </div>


                {item.sender === "customer" && (
                  <div className="small-avatar user-avatar">
                    <User size={16} />
                  </div>
                )}

              </div>

            ))}


            {loading && (

              <div className="message-row assistant-row">

                <div className="small-avatar">
                  <Bot size={16} />
                </div>

                <div className="typing-bubble">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

              </div>

            )}

          </div>


          {error && (

            <div className="chat-error">

              <CircleAlert size={17} />

              <span>
                {error}
              </span>

            </div>

          )}


          <form
            className="composer"
            onSubmit={sendMessage}
          >

            <textarea
              rows="1"
              placeholder="Describe your issue..."
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={loading}
            />


            <button
              type="submit"
              className="send-button"
              disabled={!canSend}
              title="Send message"
            >
              <Send size={19} />
            </button>

          </form>


          <div className="composer-note">
            Press Enter to send • Shift + Enter for a new line
            for a new line
          </div>

        </section>


        <aside className="insights-panel">

          <div className="panel-title">

            <h3>
              Support Intelligence
            </h3>

            <span>
              Live analysis
            </span>

          </div>


          {!lastAnalysis ? (

            <div className="empty-insights">

              <Bot size={35} />

              <p>
                Send a message to see AI analysis.
              </p>

            </div>

          ) : (

            <>

              <div className="insight-card">

                <span className="insight-label">
                  Intent
                </span>

                <strong>
                  {String(
                    lastAnalysis.intent || "general"
                  )
                    .replaceAll("_", " ")
                    .replace(
                      /\b\w/g,
                      (char) =>
                        char.toUpperCase()
                    )}
                </strong>

                <span className="confidence">
                  {Math.round(
                    (lastAnalysis.intent_confidence || 0) *
                    100
                  )}
                  % confidence
                </span>

              </div>


              <div className="insight-card">

                <span className="insight-label">
                  Priority
                </span>

                <div className="priority-value">

                  <span
                    className={`priority-badge ${
                      lastAnalysis.priority || "medium"
                    }`}
                  >
                    {lastAnalysis.priority || "medium"}
                  </span>

                  <span className="confidence">
                    {Math.round(
                      (lastAnalysis.priority_confidence || 0) *
                      100
                    )}
                    % confidence
                  </span>

                </div>

              </div>


              <div className="insight-card">

                <span className="insight-label">
                  Knowledge Base
                </span>

                <strong>
                  {lastAnalysis.faq_found
                    ? "Matched"
                    : "No confident match"}
                </strong>

                <span className="confidence">
                  {Math.round(
                    (lastAnalysis.faq_confidence || 0) *
                    100
                  )}
                  % similarity
                </span>

              </div>


              <div className="insight-card">

                <span className="insight-label">
                  Support Status
                </span>

                <strong
                  className={
                    lastAnalysis.requires_human
                      ? "status-escalated"
                      : "status-resolved"
                  }
                >
                  {lastAnalysis.requires_human
                    ? "Human assistance required"
                    : "AI handling request"}
                </strong>

              </div>


              {lastAnalysis.ticket_created && (

                <div className="ticket-card">

                  <div className="ticket-icon">
                    <CircleAlert size={19} />
                  </div>

                  <div>

                    <strong>
                      Support ticket created
                    </strong>

                    <span>
                      Ticket #
                      {lastAnalysis.ticket_id}
                    </span>

                  </div>

                </div>

              )}

            </>

          )}

        </aside>

      </main>

    </div>
  );
}


function App() {

  if (
    window.location.pathname.startsWith("/admin/analytics")
  ) {
    return <AnalyticsDashboard />;
  }

  if (
    window.location.pathname.startsWith("/admin/management")
  ) {
    return <AdminManagement />;
  }

  if (
    window.location.pathname.startsWith("/admin")
  ) {
    return <AdminDashboard />;
  }

  return <CustomerChat />;
}


export default App;
