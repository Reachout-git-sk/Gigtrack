import { Badge, Button, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import "./GigCard.css";

const TYPE_COLORS = {
  tutoring: "primary",
  delivery: "warning",
  design: "info",
  retail: "success",
  other: "secondary",
};

const STATUS_COLORS = {
  completed: "success",
  "in-progress": "warning",
  unpaid: "danger",
};

export default function GigCard({ gig, onEdit, onDelete }) {
  const date = new Date(gig.date).toLocaleDateString();
  const earnings = gig.earnings.toFixed(2);

  return (
    <Card className="gigcard">
      <Card.Body>
        <div className="gigcard-header">
          <div>
            <h5 className="gigcard-title">{gig.title}</h5>
            <span className="gigcard-client">{gig.clientName}</span>
          </div>
          <span className="gigcard-earnings">${earnings}</span>
        </div>
        <div className="gigcard-meta">
          <Badge bg={TYPE_COLORS[gig.gigType] || "secondary"}>
            {gig.gigType}
          </Badge>
          <Badge bg={STATUS_COLORS[gig.status] || "secondary"}>
            {gig.status}
          </Badge>
          <span className="gigcard-date">{date}</span>
          {gig.clientRating && (
            <span className="gigcard-rating">
              {"⭐".repeat(gig.clientRating)}
            </span>
          )}
        </div>
        {gig.clientNote && <p className="gigcard-note">{gig.clientNote}</p>}
        <div className="gigcard-actions">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onEdit(gig)}
          >
            Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(gig._id)}
          >
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

GigCard.propTypes = {
  gig: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    clientName: PropTypes.string.isRequired,
    gigType: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    earnings: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    clientRating: PropTypes.number,
    clientNote: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
