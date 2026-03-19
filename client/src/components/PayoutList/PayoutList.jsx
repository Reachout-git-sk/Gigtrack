import { useState } from "react";
import { Badge, Button } from "react-bootstrap";
import PayoutForm from "../PayoutForm/PayoutForm.jsx";
import PropTypes from "prop-types";
import "./PayoutList.css";

export default function PayoutList({ goalId, payouts, onRefresh }) {
  const [editingPayout, setEditingPayout] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function handleDelete(payoutId) {
    if (!window.confirm("Delete this payout?")) return;
    const res = await fetch(`/api/goals/${goalId}/payouts/${payoutId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) onRefresh();
  }

  function handleEdit(payout) {
    setEditingPayout(payout);
    setShowForm(true);
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingPayout(null);
    onRefresh();
  }

  return (
    <div className="payoutlist-wrapper">
      <div className="payoutlist-header">
        <span className="payoutlist-heading">Payouts</span>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => {
            setEditingPayout(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancel" : "+ Add Payout"}
        </Button>
      </div>

      {showForm && (
        <PayoutForm
          goalId={goalId}
          onSuccess={handleFormSuccess}
          existingPayout={editingPayout}
        />
      )}

      {payouts.length === 0 && (
        <p className="payoutlist-empty">No payouts logged yet.</p>
      )}

      {payouts.map((payout) => (
        <div key={payout._id} className="payoutlist-item">
          <div className="payoutlist-item-info">
            <span className="payoutlist-source">{payout.source}</span>
            <span className="payoutlist-amount">
              ${payout.amount.toFixed(2)}
            </span>
            <Badge
              bg={payout.status === "received" ? "success" : "warning"}
            >
              {payout.status}
            </Badge>
            <span className="payoutlist-date">
              {new Date(payout.date).toLocaleDateString()}
            </span>
          </div>
          <div className="payoutlist-actions">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => handleEdit(payout)}
            >
              Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDelete(payout._id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

PayoutList.propTypes = {
  goalId: PropTypes.string.isRequired,
  payouts: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRefresh: PropTypes.func.isRequired,
};