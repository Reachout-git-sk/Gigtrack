import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import GoalCard from "../GoalCard/GoalCard.jsx";
import GoalForm from "../GoalForm/GoalForm.jsx";
import PropTypes from "prop-types";
import "./GoalList.css";

function computeStreak(goals) {
  const now = new Date();
  let streak = 0;
  let checking = new Date(now.getFullYear(), now.getMonth(), 1);

  while (true) {
    const monthStr = checking.toISOString().slice(0, 7);
    const goal = goals.find((g) => g.month === monthStr);
    if (!goal) break;

    const received = goal.payouts
      .filter((p) => p.status === "received")
      .reduce((sum, p) => sum + p.amount, 0);

    if (received >= goal.targetAmount) {
      streak++;
      checking = new Date(checking.getFullYear(), checking.getMonth() - 1, 1);
    } else {
      break;
    }
  }

  return streak;
}

export default function GoalList({ userId }) {
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filters, setFilters] = useState({ month: "", health: "" });

  async function fetchGoals() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.month) params.append("month", filters.month);
      if (filters.health) params.append("health", filters.health);

      const res = await fetch(`/api/goals?${params.toString()}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load goals");
      } else {
        const streak = computeStreak(data);
        const goalsWithStreak = data.map((g, i) => ({
          ...g,
          streak: i === 0 ? streak : 0,
        }));
        setGoals(goalsWithStreak);
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this goal?")) return;
    const res = await fetch(`/api/goals/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) fetchGoals();
  }

  function handleEdit(goal) {
    setEditingGoal(goal);
    setShowForm(true);
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingGoal(null);
    fetchGoals();
  }

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <Container className="goallist-container">
      <div className="goallist-header">
        <h2>My Goals</h2>
        <Button
          variant="success"
          onClick={() => {
            setEditingGoal(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancel" : "+ New Goal"}
        </Button>
      </div>

      {showForm && (
        <GoalForm onSuccess={handleFormSuccess} existingGoal={editingGoal} />
      )}

      <div className="goallist-filters">
        <Row>
          <Col md={4}>
            <Form.Control
              type="month"
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={4}>
            <Form.Select
              name="health"
              value={filters.health}
              onChange={handleFilterChange}
            >
              <option value="">All Health Statuses</option>
              <option value="on track">On Track</option>
              <option value="at risk">At Risk</option>
              <option value="missed">Missed</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Button variant="outline-secondary" onClick={fetchGoals}>
              Apply Filters
            </Button>
          </Col>
        </Row>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <p>Loading goals...</p>}
      {!loading && goals.length === 0 && (
        <p className="goallist-empty">
          No goals found. Create your first goal!
        </p>
      )}
      {goals.map((goal) => (
        <GoalCard
          key={goal._id}
          goal={goal}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={fetchGoals}
        />
      ))}
    </Container>
  );
}

GoalList.propTypes = {
  userId: PropTypes.string,
};

GoalList.defaultProps = {
  userId: null,
};