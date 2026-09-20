import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock3,
  Headphones,
  MessageSquare,
  RefreshCw,
  Ticket,
  Users,
  XCircle,
} from "lucide-react";

import api from "./services/api";

import "./AdminDashboard.css";


function AdminDashboard() {

  const [activeTab, setActiveTab] = useState("overview");

  const [customers, setCustomers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [tickets, setTickets] = useState([]);

  const [selectedConversation, setSelectedConversation] =
    useState(null);

  const [conversationMessages, setConversationMessages] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);

  const [error, setError] = useState("");


  async function loadDashboard() {

    setLoading(true);
    setError("");

    try {

      const [
        customersResponse,
        conversationsResponse,
        ticketsResponse,
      ] = await Promise.all([
        api.get("/api/customers"),
        api.get("/api/conversations"),
        api.get("/api/tickets"),
      ]);

      setCustomers(
        customersResponse.data || []
      );

      setConversations(
        conversationsResponse.data || []
      );

      setTickets(
        ticketsResponse.data || []
      );

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Unable to load admin dashboard data."
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    loadDashboard();

  }, []);


  async function loadConversationMessages(
    conversation
  ) {

    setSelectedConversation(
      conversation
    );

    setMessageLoading(true);

    try {

      const response = await api.get(
        `/api/conversations/${conversation.id}/messages`
      );

      setConversationMessages(
        response.data || []
      );

    } catch (err) {

      console.error(err);

      setConversationMessages([]);

    } finally {

      setMessageLoading(false);

    }
  }


  async function updateTicketStatus(
    ticketId,
    status
  ) {

    try {

      await api.patch(
        `/api/tickets/${ticketId}/status`,
        {
          status,
        }
      );

      await loadDashboard();

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Unable to update ticket status."
      );

    }
  }


  function customerName(customerId) {

    const customer = customers.find(
      (item) => item.id === customerId
    );

    return customer?.name || `Customer #${customerId}`;
  }


  function customerEmail(customerId) {

    const customer = customers.find(
      (item) => item.id === customerId
    );

    return customer?.email || "—";

  }


  function formatDate(value) {

    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );

  }


  const stats = useMemo(() => {

    const openTickets =
      tickets.filter(
        (ticket) =>
          ticket.status === "open" ||
          ticket.status === "pending"
      ).length;


    const escalatedConversations =
      conversations.filter(
        (conversation) =>
          conversation.status === "escalated"
      ).length;


    const urgentTickets =
      tickets.filter(
        (ticket) =>
          ticket.priority === "urgent"
      ).length;


    const resolvedTickets =
      tickets.filter(
        (ticket) =>
          ticket.status === "resolved" ||
          ticket.status === "closed"
      ).length;


    return {
      customers: customers.length,
      conversations: conversations.length,
      openTickets,
      escalatedConversations,
      urgentTickets,
      resolvedTickets,
    };

  }, [
    customers,
    conversations,
    tickets,
  ]);


  if (loading) {

    return (
      <div className="admin-loading">

        <RefreshCw
          size={25}
          className="loading-spin"
        />

        <p>
          Loading support dashboard...
        </p>

      </div>
    );

  }


  return (
    <div className="admin-shell">

      {/* ====================================================
          HEADER
          ==================================================== */}

      <header className="admin-topbar">

        <div className="admin-brand">

          <div className="admin-brand-icon">
            <Headphones size={21} />
          </div>

          <div>
            <strong>
              AI Support Admin
            </strong>

            <span>
              Support operations dashboard
            </span>
          </div>

        </div>


        <div className="admin-actions">

          <button
            className="admin-refresh"
            onClick={loadDashboard}
          >
            <RefreshCw size={16} />
            Refresh
          </button>


          <button
            className="back-to-chat"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <ArrowLeft size={16} />
            Customer Chat
          </button>

        </div>

      </header>


      {/* ====================================================
          NAVIGATION
          ==================================================== */}

      <nav className="admin-nav">

        <button
          className={
            activeTab === "overview"
              ? "admin-nav-item active"
              : "admin-nav-item"
          }
          onClick={() =>
            setActiveTab("overview")
          }
        >
          <BarChart3 size={16} />
          Overview
        </button>


        <button
          className={
            activeTab === "tickets"
              ? "admin-nav-item active"
              : "admin-nav-item"
          }
          onClick={() =>
            setActiveTab("tickets")
          }
        >
          <Ticket size={16} />
          Tickets
          <span>
            {stats.openTickets}
          </span>
        </button>


        <button
          className={
            activeTab === "customers"
              ? "admin-nav-item active"
              : "admin-nav-item"
          }
          onClick={() =>
            setActiveTab("customers")
          }
        >
          <Users size={16} />
          Customers
        </button>


        <button
          className={
            activeTab === "conversations"
              ? "admin-nav-item active"
              : "admin-nav-item"
          }
          onClick={() =>
            setActiveTab("conversations")
          }
        >
          <MessageSquare size={16} />
          Conversations
        </button>

      </nav>


      <main className="admin-content">

        {error && (

          <div className="admin-error">
            <XCircle size={17} />
            {error}
          </div>

        )}


        {/* ==================================================
            OVERVIEW
            ================================================== */}

        {activeTab === "overview" && (

          <>

            <section className="dashboard-heading">

              <div>
                <span className="eyebrow">
                  OPERATIONS
                </span>

                <h1>
                  Support Overview
                </h1>

                <p>
                  Monitor customer activity,
                  support tickets, and escalations.
                </p>
              </div>

              <div className="live-badge">
                <span></span>
                Live
              </div>

            </section>


            <section className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon">
                  <Users size={20} />
                </div>

                <span>
                  Total Customers
                </span>

                <strong>
                  {stats.customers}
                </strong>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  <MessageSquare size={20} />
                </div>

                <span>
                  Conversations
                </span>

                <strong>
                  {stats.conversations}
                </strong>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  <Ticket size={20} />
                </div>

                <span>
                  Open Tickets
                </span>

                <strong>
                  {stats.openTickets}
                </strong>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  <AlertTriangle size={20} />
                </div>

                <span>
                  Urgent Tickets
                </span>

                <strong>
                  {stats.urgentTickets}
                </strong>

              </div>

            </section>


            <section className="overview-grid">

              <div className="dashboard-card">

                <div className="card-header">

                  <div>
                    <h2>
                      Recent Tickets
                    </h2>

                    <span>
                      Latest support activity
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setActiveTab("tickets")
                    }
                  >
                    View all
                  </button>

                </div>


                <div className="ticket-list">

                  {tickets.length === 0 ? (

                    <div className="empty-state">
                      <Ticket size={28} />
                      <p>
                        No tickets yet.
                      </p>
                    </div>

                  ) : (

                    tickets
                      .slice(0, 6)
                      .map((ticket) => (

                        <div
                          key={ticket.id}
                          className="ticket-row"
                        >

                          <div className="ticket-main">

                            <strong>
                              #{ticket.id}{" "}
                              {ticket.subject}
                            </strong>

                            <span>
                              {customerName(
                                ticket.customer_id
                              )}
                              {" • "}
                              {formatDate(
                                ticket.created_at
                              )}
                            </span>

                          </div>


                          <span
                            className={`priority-badge admin-priority-${ticket.priority}`}
                          >
                            {ticket.priority}
                          </span>


                          <span
                            className={`status-badge status-${ticket.status}`}
                          >
                            {ticket.status}
                          </span>

                        </div>

                      ))

                  )}

                </div>

              </div>


              <div className="dashboard-card">

                <div className="card-header">

                  <div>
                    <h2>
                      Support Health
                    </h2>

                    <span>
                      Current workload
                    </span>
                  </div>

                </div>


                <div className="health-list">

                  <div className="health-item">

                    <div className="health-left">
                      <Activity size={17} />
                      <span>
                        Escalated Conversations
                      </span>
                    </div>

                    <strong>
                      {stats.escalatedConversations}
                    </strong>

                  </div>


                  <div className="health-item">

                    <div className="health-left">
                      <Clock3 size={17} />
                      <span>
                        Open / Pending Tickets
                      </span>
                    </div>

                    <strong>
                      {stats.openTickets}
                    </strong>

                  </div>


                  <div className="health-item">

                    <div className="health-left">
                      <AlertTriangle size={17} />
                      <span>
                        Urgent Tickets
                      </span>
                    </div>

                    <strong>
                      {stats.urgentTickets}
                    </strong>

                  </div>


                  <div className="health-item">

                    <div className="health-left">
                      <CheckCircle2 size={17} />
                      <span>
                        Resolved / Closed
                      </span>
                    </div>

                    <strong>
                      {stats.resolvedTickets}
                    </strong>

                  </div>

                </div>

              </div>

            </section>

          </>

        )}


        {/* ==================================================
            TICKETS
            ================================================== */}

        {activeTab === "tickets" && (

          <section>

            <div className="dashboard-heading">

              <div>

                <span className="eyebrow">
                  TICKET MANAGEMENT
                </span>

                <h1>
                  Support Tickets
                </h1>

                <p>
                  Review escalations and update
                  ticket status.
                </p>

              </div>

            </div>


            <div className="dashboard-card table-card">

              {tickets.length === 0 ? (

                <div className="empty-state large">
                  <Ticket size={38} />
                  <h3>
                    No tickets found
                  </h3>
                  <p>
                    Escalated customer requests
                    will appear here.
                  </p>
                </div>

              ) : (

                <div className="table-wrap">

                  <table>

                    <thead>

                      <tr>
                        <th>Ticket</th>
                        <th>Customer</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Created</th>
                        <th>Status</th>
                      </tr>

                    </thead>

                    <tbody>

                      {tickets.map((ticket) => (

                        <tr key={ticket.id}>

                          <td>

                            <div className="table-ticket">

                              <strong>
                                #{ticket.id}
                              </strong>

                              <span>
                                {ticket.subject}
                              </span>

                            </div>

                          </td>


                          <td>

                            <strong>
                              {customerName(
                                ticket.customer_id
                              )}
                            </strong>

                            <span className="table-secondary">
                              {customerEmail(
                                ticket.customer_id
                              )}
                            </span>

                          </td>


                          <td>
                            <span className="category-pill">
                              {ticket.category.replaceAll(
                                "_",
                                " "
                              )}
                            </span>
                          </td>


                          <td>

                            <span
                              className={`priority-badge admin-priority-${ticket.priority}`}
                            >
                              {ticket.priority}
                            </span>

                          </td>


                          <td>
                            {formatDate(
                              ticket.created_at
                            )}
                          </td>


                          <td>

                            <select
                              className={`status-select status-${ticket.status}`}
                              value={ticket.status}
                              onChange={(event) =>
                                updateTicketStatus(
                                  ticket.id,
                                  event.target.value
                                )
                              }
                            >

                              <option value="open">
                                Open
                              </option>

                              <option value="pending">
                                Pending
                              </option>

                              <option value="resolved">
                                Resolved
                              </option>

                              <option value="closed">
                                Closed
                              </option>

                            </select>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </section>

        )}


        {/* ==================================================
            CUSTOMERS
            ================================================== */}

        {activeTab === "customers" && (

          <section>

            <div className="dashboard-heading">

              <div>

                <span className="eyebrow">
                  CUSTOMER MANAGEMENT
                </span>

                <h1>
                  Customers
                </h1>

                <p>
                  View registered support customers.
                </p>

              </div>

            </div>


            <div className="dashboard-card table-card">

              {customers.length === 0 ? (

                <div className="empty-state large">

                  <Users size={38} />

                  <h3>
                    No customers yet
                  </h3>

                </div>

              ) : (

                <div className="table-wrap">

                  <table>

                    <thead>

                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Joined</th>
                      </tr>

                    </thead>

                    <tbody>

                      {customers.map(
                        (customer) => (

                          <tr
                            key={customer.id}
                          >

                            <td>
                              #{customer.id}
                            </td>

                            <td>
                              <strong>
                                {customer.name}
                              </strong>
                            </td>

                            <td>
                              {customer.email}
                            </td>

                            <td>
                              {formatDate(
                                customer.created_at
                              )}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </section>

        )}


        {/* ==================================================
            CONVERSATIONS
            ================================================== */}

        {activeTab === "conversations" && (

          <section>

            <div className="dashboard-heading">

              <div>

                <span className="eyebrow">
                  CUSTOMER COMMUNICATIONS
                </span>

                <h1>
                  Conversations
                </h1>

                <p>
                  Review conversation activity
                  and message history.
                </p>

              </div>

            </div>


            <div className="conversation-layout">

              <div className="dashboard-card conversation-list">

                {conversations.length === 0 ? (

                  <div className="empty-state">
                    <MessageSquare size={32} />
                    <p>
                      No conversations yet.
                    </p>
                  </div>

                ) : (

                  conversations.map(
                    (conversation) => (

                      <button
                        key={conversation.id}
                        className={
                          selectedConversation?.id ===
                          conversation.id
                            ? "conversation-item selected"
                            : "conversation-item"
                        }
                        onClick={() =>
                          loadConversationMessages(
                            conversation
                          )
                        }
                      >

                        <div className="conversation-avatar">
                          <MessageSquare size={16} />
                        </div>

                        <div className="conversation-info">

                          <strong>
                            Conversation #
                            {conversation.id}
                          </strong>

                          <span>
                            {customerName(
                              conversation.customer_id
                            )}
                          </span>

                        </div>

                        <span
                          className={`conversation-status conversation-${conversation.status}`}
                        >
                          {conversation.status}
                        </span>

                      </button>

                    )
                  )

                )}

              </div>


              <div className="dashboard-card message-detail">

                {!selectedConversation ? (

                  <div className="empty-state large">

                    <MessageSquare size={38} />

                    <h3>
                      Select a conversation
                    </h3>

                    <p>
                      Choose a conversation to
                      inspect its messages.
                    </p>

                  </div>

                ) : (

                  <>

                    <div className="card-header">

                      <div>

                        <h2>
                          Conversation #
                          {selectedConversation.id}
                        </h2>

                        <span>
                          {customerName(
                            selectedConversation.customer_id
                          )}
                          {" • "}
                          {selectedConversation.status}
                        </span>

                      </div>

                    </div>


                    <div className="admin-messages">

                      {messageLoading ? (

                        <div className="empty-state">
                          <RefreshCw
                            size={22}
                            className="loading-spin"
                          />

                          <p>
                            Loading messages...
                          </p>
                        </div>

                      ) : conversationMessages.length === 0 ? (

                        <div className="empty-state">
                          <MessageSquare size={28} />

                          <p>
                            No messages found.
                          </p>
                        </div>

                      ) : (

                        conversationMessages.map(
                          (message) => (

                            <div
                              key={message.id}
                              className={
                                message.sender ===
                                "customer"
                                  ? "admin-message customer"
                                  : "admin-message assistant"
                              }
                            >

                              <div className="admin-message-meta">

                                <strong>
                                  {message.sender ===
                                  "customer"
                                    ? customerName(
                                        selectedConversation.customer_id
                                      )
                                    : "AI Assistant"}
                                </strong>

                                <span>
                                  {formatDate(
                                    message.created_at
                                  )}
                                </span>

                              </div>

                              <p>
                                {message.content}
                              </p>


                              {message.intent && (

                                <div className="message-intelligence">

                                  <span>
                                    Intent:{" "}
                                    {message.intent.replaceAll(
                                      "_",
                                      " "
                                    )}
                                  </span>

                                  {message.confidence !=
                                    null && (
                                    <span>
                                      Confidence:{" "}
                                      {Math.round(
                                        message.confidence *
                                          100
                                      )}
                                      %
                                    </span>
                                  )}

                                </div>

                              )}

                            </div>

                          )
                        )

                      )}

                    </div>

                  </>

                )}

              </div>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}


export default AdminDashboard;
