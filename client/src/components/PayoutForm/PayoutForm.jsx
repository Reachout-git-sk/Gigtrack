import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import "./PayoutForm.css";

const EMPTY_FORM = {
  source: "",
  amount: "",
  date: "",
  status: "received",
};

export default function PayoutForm({ goalId, onSuccess, existingPayout }) {
  const [formData, setFormData] = useState(
    existingPayout
      ? {
          source: existingPayout.source,
          amount: existingPayout.amount,
          date: existingPayout.date?.slice(0, 10),
          status: existingPayout.status,
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
      const url = existingPayout
        ? `/api/goals/${goalId}/payouts/${existingPayout._id}`
        : `/api/goals/${goalId}/payouts`;
      const method = existingPayout ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save payout");
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
    <div className="payoutform-wrapper">
      <h6 className="payoutform-title">
        {existingPayout ? "Edit Payout" : "Log a Payout"}
      </h6>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Source</Form.Label>
          <Form.Control
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder="e.g. DoorDash, Client A"
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Amount ($)</Form.Label>
          <Form.Control
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="received">Received</option>
            <option value="pending">Pending</option>
          </Form.Select>
        </Form.Group>
        <Button type="submit" variant="primary" size="sm" disabled={loading}>
          {loading ? "Saving..." : existingPayout ? "Update" : "Add Payout"}
        </Button>
      </Form>
    </div>
  );
}

PayoutForm.propTypes = {
  goalId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  existingPayout: PropTypes.object,
};

PayoutForm.defaultProps = {
  existingPayout: null,
};
