import { useState } from "react";
import { Card, Badge, Button } from "react-bootstrap";
import PayoutList from "../PayoutList/PayoutList.jsx";
import StreakBadge from "../StreakBadge/StreakBadge.jsx";
import PropTypes from "prop-types";
import "./GoalCard.css";

const HEALTH_COLORS = {
  "on track": "success",
  "at risk": "warning",
  missed: "danger",
};

export default function GoalCard({ goal, onEdit, onDelete, onRefresh }) {
  const [showPayouts, setShowPayouts] = useState(false);

  const received = goal.payouts
    .filter((p) => p.status === "received")
    .reduce((sum, p) => sum + p.amount, 0);

  const pending = goal.payouts
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const percent = Math.min(
    Math.round((received / goal.targetAmount) * 100),
    100
  );

  return (
    <Card className="goalcard">
      <Card.Body>
        <div className="goalcard-header">
          <div>
            <h5 className="goalcard-label">{goal.label}</h5>
            <span className="goalcard-month">{goal.month}</span>
          </div>
          <div className="goalcard-right">
            <Badge bg={HEALTH_COLORS[goal.health] || "secondary"}>
              {goal.health}
            </Badge>
            {goal.streak > 0 && <StreakBadge streak={goal.streak} />}
          </div>
        </div>

        <div className="goalcard-progress-track">
          <div
            className={`goalcard-progress-fill goalcard-progress-fill--${goal.health.replace(" ", "-")}`}
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="goalcard-amounts">
          <span className="goalcard-received">
            ${received.toFixed(2)} received
          </span>
          <span className="goalcard-target">
            of ${goal.targetAmount.toFixed(2)}
          </span>
          {pending > 0 && (
            <span className="goalcard-pending">
              (${pending.toFixed(2)} pending)
            </span>
          )}
        </div>

        <div className="goalcard-actions">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setShowPayouts(!showPayouts)}
          >
            {showPayouts ? "Hide Payouts" : "Show Payouts"}
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onEdit(goal)}
          >
            Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(goal._id)}
          >
            Delete
          </Button>
        </div>

        {showPayouts && (
          <PayoutList
            goalId={goal._id}
            payouts={goal.payouts}
            onRefresh={onRefresh}
          />
        )}
      </Card.Body>
    </Card>
  );
}

GoalCard.propTypes = {
  goal: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    targetAmount: PropTypes.number.isRequired,
    month: PropTypes.string.isRequired,
    payouts: PropTypes.arrayOf(PropTypes.object).isRequired,
    health: PropTypes.string.isRequired,
    streak: PropTypes.number,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};