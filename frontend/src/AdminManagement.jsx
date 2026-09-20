import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Edit3,
  Plus,
  RefreshCw,
  Trash2,
  Workflow,
  X,
} from "lucide-react";
import "./AdminManagement.css";

const API = "http://127.0.0.1:8000";

const emptyKB = {
  question: "",
  answer: "",
  intent: "",
  active: true,
};

const emptyRule = {
  name: "",
  trigger_type: "keyword",
  trigger_value: "",
  action_type: "create_ticket",
  action_value: "",
  active: true,
};

export default function AdminManagement() {
  const [tab, setTab] = useState("knowledge");
  const [kb, setKb] = useState([]);
  const [rules, setRules] = useState([]);

  const [kbForm, setKbForm] = useState(emptyKB);
  const [ruleForm, setRuleForm] = useState(emptyRule);

  const [editingKB, setEditingKB] = useState(null);
  const [editingRule, setEditingRule] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const loadData = async () => {
    setLoading(true);

    try {
      const [kbResponse, ruleResponse] = await Promise.all([
        fetch(`${API}/api/knowledge-base`),
        fetch(`${API}/api/automation-rules`),
      ]);

      if (!kbResponse.ok || !ruleResponse.ok) {
        throw new Error("Unable to load management data.");
      }

      setKb(await kbResponse.json());
      setRules(await ruleResponse.json());
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetKB = () => {
    setKbForm(emptyKB);
    setEditingKB(null);
  };

  const resetRule = () => {
    setRuleForm(emptyRule);
    setEditingRule(null);
  };

  const saveKB = async (event) => {
    event.preventDefault();

    if (!kbForm.question.trim() || !kbForm.answer.trim()) {
      setNotice("Question and answer are required.");
      return;
    }

    setSaving(true);

    try {
      const url = editingKB
        ? `${API}/api/knowledge-base/${editingKB.id}`
        : `${API}/api/knowledge-base`;

      const response = await fetch(url, {
        method: editingKB ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: kbForm.question.trim(),
          answer: kbForm.answer.trim(),
          intent: kbForm.intent.trim(),
          active: kbForm.active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to save knowledge item."
        );
      }

      resetKB();
      await loadData();

      setNotice(
        editingKB
          ? "Knowledge item updated."
          : "Knowledge item created."
      );
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  };

  const saveRule = async (event) => {
    event.preventDefault();

    if (
      !ruleForm.name.trim() ||
      !ruleForm.trigger_value.trim()
    ) {
      setNotice(
        "Rule name and trigger value are required."
      );
      return;
    }

    setSaving(true);

    try {
      const url = editingRule
        ? `${API}/api/automation-rules/${editingRule.id}`
        : `${API}/api/automation-rules`;

      const response = await fetch(url, {
        method: editingRule ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: ruleForm.name.trim(),
          trigger_type: ruleForm.trigger_type,
          trigger_value: ruleForm.trigger_value.trim(),
          action_type: ruleForm.action_type,
          action_value: ruleForm.action_value.trim(),
          active: ruleForm.active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to save automation rule."
        );
      }

      resetRule();
      await loadData();

      setNotice(
        editingRule
          ? "Automation rule updated."
          : "Automation rule created."
      );
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (url, label) => {
    if (!window.confirm(`Delete this ${label}?`)) {
      return;
    }

    try {
      const response = await fetch(url, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || `Unable to delete ${label}.`
        );
      }

      await loadData();
      setNotice(`${label} deleted.`);
    } catch (error) {
      setNotice(error.message);
    }
  };

  const toggleItem = async (url, active) => {
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          active: !active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to update item."
        );
      }

      await loadData();
    } catch (error) {
      setNotice(error.message);
    }
  };

  return (
    <div className="management-page">

      <header className="management-topbar">

        <div className="management-brand">

          <button
            className="management-icon-button"
            onClick={() => {
              window.location.href = "/admin";
            }}
            title="Back to dashboard"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="management-title">
              Admin Management
            </div>

            <div className="management-subtitle">
              Knowledge base and automation configuration
            </div>
          </div>

        </div>

        <button
          className="management-refresh"
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "spin" : ""}
          />
          Refresh
        </button>

      </header>

      <main className="management-container">

        {notice && (
          <div className="management-alert">
            <Check size={16} />
            <span>{notice}</span>

            <button
              onClick={() => setNotice("")}
              className="alert-close"
            >
              ×
            </button>
          </div>
        )}

        <div className="management-tabs">

          <button
            className={
              tab === "knowledge"
                ? "management-tab active"
                : "management-tab"
            }
            onClick={() => setTab("knowledge")}
          >
            <BookOpen size={17} />
            Knowledge Base
            <span>{kb.length}</span>
          </button>

          <button
            className={
              tab === "automation"
                ? "management-tab active"
                : "management-tab"
            }
            onClick={() => setTab("automation")}
          >
            <Workflow size={17} />
            Automation Rules
            <span>{rules.length}</span>
          </button>

        </div>

        {tab === "knowledge" ? (

          <section className="management-grid">

            <div className="management-card form-card">

              <div className="card-heading">

                <div className="card-icon">
                  <BookOpen size={18} />
                </div>

                <div>
                  <h2>
                    {editingKB
                      ? "Edit Knowledge Item"
                      : "Add Knowledge Item"}
                  </h2>

                  <p>
                    Manage FAQ content used by the AI.
                  </p>
                </div>

              </div>

              <form onSubmit={saveKB}>

                <label>Question</label>

                <input
                  value={kbForm.question}
                  onChange={(event) =>
                    setKbForm({
                      ...kbForm,
                      question: event.target.value,
                    })
                  }
                  placeholder="How long does delivery take?"
                />

                <label>Answer</label>

                <textarea
                  rows="7"
                  value={kbForm.answer}
                  onChange={(event) =>
                    setKbForm({
                      ...kbForm,
                      answer: event.target.value,
                    })
                  }
                  placeholder="Delivery usually takes 3-5 business days."
                />

                <label>Intent</label>

                <input
                  value={kbForm.intent}
                  onChange={(event) =>
                    setKbForm({
                      ...kbForm,
                      intent: event.target.value,
                    })
                  }
                  placeholder="order_status"
                />

                <label className="checkbox-row">

                  <input
                    type="checkbox"
                    checked={kbForm.active}
                    onChange={(event) =>
                      setKbForm({
                        ...kbForm,
                        active: event.target.checked,
                      })
                    }
                  />

                  Active

                </label>

                <div className="form-actions">

                  <button
                    type="submit"
                    className="primary-action"
                    disabled={saving}
                  >
                    <Check size={16} />

                    {saving
                      ? "Saving..."
                      : editingKB
                        ? "Update Item"
                        : "Create Item"}
                  </button>

                  {editingKB && (

                    <button
                      type="button"
                      className="secondary-action"
                      onClick={resetKB}
                    >
                      <X size={16} />
                      Cancel
                    </button>

                  )}

                </div>

              </form>

            </div>

            <div className="management-card list-card">

              <div className="section-heading">

                <div>
                  <h2>Knowledge Base Items</h2>

                  <p>
                    Existing FAQ records.
                  </p>
                </div>

                <span className="count-badge">
                  {kb.length}
                </span>

              </div>

              <div className="management-list">

                {kb.length === 0 ? (

                  <div className="empty-state">
                    No knowledge base items found.
                  </div>

                ) : (

                  kb.map((item) => (

                    <div
                      className="management-list-item"
                      key={item.id}
                    >

                      <div className="list-item-main">

                        <div className="item-topline">

                          <span className="item-id">
                            #{item.id}
                          </span>

                          <span
                            className={
                              item.active
                                ? "status-pill active"
                                : "status-pill inactive"
                            }
                          >
                            {item.active
                              ? "Active"
                              : "Inactive"}
                          </span>

                        </div>

                        <h3>{item.question}</h3>

                        <p>{item.answer}</p>

                        {item.intent && (
                          <span className="intent-chip">
                            {item.intent}
                          </span>
                        )}

                      </div>

                      <div className="list-actions">

                        <button
                          className="action-button"
                          onClick={() =>
                            toggleItem(
                              `${API}/api/knowledge-base/${item.id}`,
                              item.active
                            )
                          }
                          title="Toggle"
                        >
                          <Check size={15} />
                        </button>

                        <button
                          className="action-button"
                          onClick={() => {
                            setEditingKB(item);

                            setKbForm({
                              question:
                                item.question || "",
                              answer:
                                item.answer || "",
                              intent:
                                item.intent || "",
                              active:
                                item.active !== false,
                            });

                            window.scrollTo({
                              top: 0,
                              behavior: "smooth",
                            });
                          }}
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          className="action-button danger"
                          onClick={() =>
                            deleteItem(
                              `${API}/api/knowledge-base/${item.id}`,
                              "knowledge item"
                            )
                          }
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>

                    </div>

                  ))

                )}

              </div>

            </div>

          </section>

        ) : (

          <section className="management-grid">

            <div className="management-card form-card">

              <div className="card-heading">

                <div className="card-icon">
                  <Workflow size={18} />
                </div>

                <div>
                  <h2>
                    {editingRule
                      ? "Edit Automation Rule"
                      : "Add Automation Rule"}
                  </h2>

                  <p>
                    Configure automatic support actions.
                  </p>
                </div>

              </div>

              <form onSubmit={saveRule}>

                <label>Rule Name</label>

                <input
                  value={ruleForm.name}
                  onChange={(event) =>
                    setRuleForm({
                      ...ruleForm,
                      name: event.target.value,
                    })
                  }
                  placeholder="Urgent complaints"
                />

                <label>Trigger Type</label>

                <select
                  value={ruleForm.trigger_type}
                  onChange={(event) =>
                    setRuleForm({
                      ...ruleForm,
                      trigger_type: event.target.value,
                    })
                  }
                >
                  <option value="keyword">
                    Keyword
                  </option>

                  <option value="intent">
                    Intent
                  </option>

                  <option value="priority">
                    Priority
                  </option>
                </select>

                <label>Trigger Value</label>

                <input
                  value={ruleForm.trigger_value}
                  onChange={(event) =>
                    setRuleForm({
                      ...ruleForm,
                      trigger_value:
                        event.target.value,
                    })
                  }
                  placeholder="urgent"
                />

                <label>Action Type</label>

                <select
                  value={ruleForm.action_type}
                  onChange={(event) =>
                    setRuleForm({
                      ...ruleForm,
                      action_type:
                        event.target.value,
                    })
                  }
                >
                  <option value="create_ticket">
                    Create Ticket
                  </option>

                  <option value="escalate">
                    Escalate
                  </option>

                  <option value="set_priority">
                    Set Priority
                  </option>
                </select>

                <label>Action Value</label>

                <input
                  value={ruleForm.action_value}
                  onChange={(event) =>
                    setRuleForm({
                      ...ruleForm,
                      action_value:
                        event.target.value,
                    })
                  }
                  placeholder="urgent"
                />

                <label className="checkbox-row">

                  <input
                    type="checkbox"
                    checked={ruleForm.active}
                    onChange={(event) =>
                      setRuleForm({
                        ...ruleForm,
                        active:
                          event.target.checked,
                      })
                    }
                  />

                  Active

                </label>

                <div className="form-actions">

                  <button
                    type="submit"
                    className="primary-action"
                    disabled={saving}
                  >
                    <Check size={16} />

                    {saving
                      ? "Saving..."
                      : editingRule
                        ? "Update Rule"
                        : "Create Rule"}
                  </button>

                  {editingRule && (

                    <button
                      type="button"
                      className="secondary-action"
                      onClick={resetRule}
                    >
                      <X size={16} />
                      Cancel
                    </button>

                  )}

                </div>

              </form>

            </div>

            <div className="management-card list-card">

              <div className="section-heading">

                <div>
                  <h2>Automation Rules</h2>

                  <p>
                    Rules evaluated during support analysis.
                  </p>
                </div>

                <span className="count-badge">
                  {rules.length}
                </span>

              </div>

              <div className="management-list">

                {rules.length === 0 ? (

                  <div className="empty-state">
                    No automation rules found.
                  </div>

                ) : (

                  rules.map((rule) => (

                    <div
                      className="management-list-item"
                      key={rule.id}
                    >

                      <div className="list-item-main">

                        <div className="item-topline">

                          <span className="item-id">
                            #{rule.id}
                          </span>

                          <span
                            className={
                              rule.active
                                ? "status-pill active"
                                : "status-pill inactive"
                            }
                          >
                            {rule.active
                              ? "Enabled"
                              : "Disabled"}
                          </span>

                        </div>

                        <h3>{rule.name}</h3>

                        <div className="rule-flow">

                          <span>
                            {rule.trigger_type}
                          </span>

                          <span>→</span>

                          <span>
                            {rule.trigger_value}
                          </span>

                          <span>→</span>

                          <span>
                            {rule.action_type}
                          </span>

                        </div>

                        {rule.action_value && (

                          <div className="rule-value">
                            Action value:{" "}
                            <strong>
                              {rule.action_value}
                            </strong>
                          </div>

                        )}

                      </div>

                      <div className="list-actions">

                        <button
                          className="action-button"
                          onClick={() =>
                            toggleItem(
                              `${API}/api/automation-rules/${rule.id}`,
                              rule.active
                            )
                          }
                          title="Toggle"
                        >
                          <Check size={15} />
                        </button>

                        <button
                          className="action-button"
                          onClick={() => {
                            setEditingRule(rule);

                            setRuleForm({
                              name: rule.name || "",
                              trigger_type:
                                rule.trigger_type ||
                                "keyword",
                              trigger_value:
                                rule.trigger_value || "",
                              action_type:
                                rule.action_type ||
                                "create_ticket",
                              action_value:
                                rule.action_value || "",
                              active:
                                rule.active !== false,
                            });

                            window.scrollTo({
                              top: 0,
                              behavior: "smooth",
                            });
                          }}
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          className="action-button danger"
                          onClick={() =>
                            deleteItem(
                              `${API}/api/automation-rules/${rule.id}`,
                              "automation rule"
                            )
                          }
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>

                    </div>

                  ))

                )}

              </div>

            </div>

          </section>

        )}

        <div className="management-footer">

          <button
            className="add-footer-button"
            onClick={() => {
              if (tab === "knowledge") {
                resetKB();
              } else {
                resetRule();
              }
            }}
          >
            <Plus size={16} />
            New{" "}
            {tab === "knowledge"
              ? "Knowledge Item"
              : "Automation Rule"}
          </button>

        </div>

      </main>

    </div>
  );
}
