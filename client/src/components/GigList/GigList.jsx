import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import GigCard from "../GigCard/GigCard.jsx";
import GigForm from "../GigForm/GigForm.jsx";
import PropTypes from "prop-types";
import "./GigList.css";

export default function GigList({ userId }) {
  const [gigs, setGigs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingGig, setEditingGig] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    client: "",
    startDate: "",
    endDate: "",
  });

  async function fetchGigs() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);
      if (filters.client) params.append("client", filters.client);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const res = await fetch(`/api/gigs?${params.toString()}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load gigs");
      } else {
        setGigs(data);
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGigs();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this gig?")) return;
    try {
      const res = await fetch(`/api/gigs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) fetchGigs();
    } catch (err) {
      setError("Failed to delete gig.");
    }
  }

  function handleEdit(gig) {
    setEditingGig(gig);
    setShowForm(true);
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingGig(null);
    fetchGigs();
  }

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <Container className="giglist-container">
      <div className="giglist-header">
        <h2>My Gigs</h2>
        <Button
          variant="primary"
          onClick={() => {
            setEditingGig(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancel" : "+ Log a Gig"}
        </Button>
      </div>

      {showForm && (
        <GigForm onSuccess={handleFormSuccess} existingGig={editingGig} />
      )}

      <div className="giglist-filters">
        <Row>
          <Col md={3}>
            <Form.Select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="tutoring">Tutoring</option>
              <option value="delivery">Delivery</option>
              <option value="design">Design</option>
              <option value="retail">Retail</option>
              <option value="other">Other</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Control
              type="text"
              name="client"
              placeholder="Filter by client"
              value={filters.client}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={2}>
            <Button variant="outline-secondary" onClick={fetchGigs}>
              Apply Filters
            </Button>
          </Col>
        </Row>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <p>Loading gigs...</p>}
      {!loading && gigs.length === 0 && (
        <p className="giglist-empty">No gigs found. Log your first gig!</p>
      )}
      {gigs.map((gig) => (
        <GigCard
          key={gig._id}
          gig={gig}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </Container>
  );
}

GigList.propTypes = {
  userId: PropTypes.string.isRequired,
};
