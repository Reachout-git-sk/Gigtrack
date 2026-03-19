import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import "./GoalForm.css";

const EMPTY_FORM = {
  label: "",
  targetAmount: "",
  month: "",
};

export default function GoalForm({ onSuccess, existingGoal }) {
  const [formData, setFormData] = useState(
    existingGoal
      ? {
          label: existingGoal.label,
          targetAmount: existingGoal.targetAmount,
          month: existingGoal.month,
        }
      : EMPTY_FORM
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = existingGoal
        ? `/api/goals/${existingGoal._id}`
        : "/api/goals";
      const method = existingGoal ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          targetAmount: parseFloat(formData.targetAmount),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save goal");
      } else {
        onSuccess();
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="goalform-wrapper">
      <h4 className="goalform-title">
        {existingGoal ? "Edit Goal" : "Create a New Goal"}
      </h4>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Label</Form.Label>
          <Form.Control
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="e.g. November income goal"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Target Amount ($)</Form.Label>
          <Form.Control
            type="number"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleChange}
            placeholder="e.g. 1500"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Month</Form.Label>
          <Form.Control
            type="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit" variant="success" disabled={loading}>
          {loading ? "Saving..." : existingGoal ? "Update Goal" : "Create Goal"}
        </Button>
      </Form>
    </div>
  );
}

GoalForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  existingGoal: PropTypes.object,
};

GoalForm.defaultProps = {
  existingGoal: null,
};