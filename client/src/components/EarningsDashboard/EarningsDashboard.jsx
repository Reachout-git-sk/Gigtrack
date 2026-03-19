import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import "./EarningsDashboard.css";

export default function EarningsDashboard({ userId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/gigs/dashboard", {
          credentials: "include",
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error || "Failed to load dashboard");
        } else {
          setData(json);
        }
      } catch (err) {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [userId]);

  if (loading) return <p className="dashboard-loading">Loading dashboard...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!data) return null;

  const months = Object.entries(data.monthlyTotals).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  const types = Object.entries(data.byType);

  return (
    <Container className="dashboard-container">
      <h2 className="dashboard-heading">Earnings Dashboard</h2>

      <Row className="mb-4">
        <Col>
          <Card className="dashboard-total-card">
            <Card.Body>
              <p className="dashboard-total-label">Total Earnings</p>
              <h3 className="dashboard-total-amount">
                ${data.totalEarnings.toFixed(2)}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="dashboard-card">
            <Card.Body>
              <h5>Monthly Totals</h5>
              {months.length === 0 && <p>No data yet.</p>}
              {months.map(([month, total]) => (
                <div key={month} className="dashboard-bar-row">
                  <span className="dashboard-bar-label">{month}</span>
                  <div className="dashboard-bar-track">
                    <div
                      className="dashboard-bar-fill"
                      style={{
                        width: `${Math.min(
                          (total / Math.max(...months.map((m) => m[1]))) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="dashboard-bar-value">
                    ${total.toFixed(2)}
                  </span>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="dashboard-card">
            <Card.Body>
              <h5>Earnings by Gig Type</h5>
              {types.length === 0 && <p>No data yet.</p>}
              {types.map(([type, total]) => (
                <div key={type} className="dashboard-bar-row">
                  <span className="dashboard-bar-label">{type}</span>
                  <div className="dashboard-bar-track">
                    <div
                      className="dashboard-bar-fill dashboard-bar-fill--type"
                      style={{
                        width: `${Math.min(
                          (total / Math.max(...types.map((t) => t[1]))) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="dashboard-bar-value">
                    ${total.toFixed(2)}
                  </span>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

EarningsDashboard.propTypes = {
  userId: PropTypes.string.isRequired,
};
