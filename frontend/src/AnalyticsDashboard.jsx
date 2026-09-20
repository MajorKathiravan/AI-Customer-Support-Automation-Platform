import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Bot,
  BookOpen,
  MessageSquare,
  RefreshCw,
  Ticket,
  Users,
  Workflow,
} from "lucide-react";
import "./AnalyticsDashboard.css";

const API = "http://127.0.0.1:8000";

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API}/api/analytics/overview`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load analytics data."
        );
      }

      setData(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const formatIntent = (intent) =>
    intent
      ?.replaceAll("_", " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );

  return (
    <div className="analytics-page">

      <header className="analytics-topbar">

        <div className="analytics-brand">

          <button
            className="analytics-back"
            onClick={() => {
              window.location.href = "/admin";
            }}
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1>Analytics Dashboard</h1>
            <p>
              Support platform performance overview
            </p>
          </div>

        </div>

        <button
          className="analytics-refresh"
          onClick={loadAnalytics}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "spin" : ""}
          />
          Refresh
        </button>

      </header>

      <main className="analytics-container">

        {error && (
          <div className="analytics-error">
            {error}
          </div>
        )}

        {!data && loading && (
          <div className="analytics-loading">
            Loading analytics...
          </div>
        )}

        {data && (
          <>

            <section className="stats-grid">

              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={20} />
                </div>
                <div>
                  <span>Total Customers</span>
                  <strong>
                    {data.total_customers}
                  </strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <span>Conversations</span>
                  <strong>
                    {data.total_conversations}
                  </strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Ticket size={20} />
                </div>
                <div>
                  <span>Total Tickets</span>
                  <strong>
                    {data.total_tickets}
                  </strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Ticket size={20} />
                </div>
                <div>
                  <span>Open Tickets</span>
                  <strong>
                    {data.open_tickets}
                  </strong>
                </div>
              </div>

            </section>

            <section className="stats-grid secondary-stats">

              <div className="stat-card">
                <div className="stat-icon">
                  <Bot size={20} />
                </div>
                <div>
                  <span>Escalated Conversations</span>
                  <strong>
                    {data.escalated_conversations}
                  </strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <BookOpen size={20} />
                </div>
                <div>
                  <span>Active Knowledge Items</span>
                  <strong>
                    {data.active_knowledge_items}
                  </strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Workflow size={20} />
                </div>
                <div>
                  <span>Active Automation Rules</span>
                  <strong>
                    {data.active_automation_rules}
                  </strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <span>Tracked Intents</span>
                  <strong>
                    {data.intent_distribution.length}
                  </strong>
                </div>
              </div>

            </section>

            <section className="analytics-card">

              <div className="analytics-card-header">
                <div>
                  <h2>Intent Distribution</h2>
                  <p>
                    Customer message categories detected by the AI.
                  </p>
                </div>
              </div>

              {data.intent_distribution.length === 0 ? (

                <div className="analytics-empty">
                  No intent data available yet.
                </div>

              ) : (

                <div className="intent-list">

                  {data.intent_distribution.map(
                    (item, index) => {

                      const total =
                        data.intent_distribution.reduce(
                          (sum, current) =>
                            sum + current.count,
                          0
                        );

                      const percentage =
                        total === 0
                          ? 0
                          : Math.round(
                              (item.count / total) *
                                100
                            );

                      return (
                        <div
                          className="intent-row"
                          key={item.intent || index}
                        >

                          <div className="intent-info">

                            <span>
                              {formatIntent(
                                item.intent
                              )}
                            </span>

                            <strong>
                              {item.count}
                            </strong>

                          </div>

                          <div className="intent-bar">

                            <div
                              className="intent-fill"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />

                          </div>

                          <span className="intent-percent">
                            {percentage}%
                          </span>

                        </div>
                      );
                    }
                  )}

                </div>

              )}

            </section>

          </>
        )}

      </main>

    </div>
  );
}
