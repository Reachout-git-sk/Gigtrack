import { useState } from "react";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import "./LoginForm.css";

const DEMO_EMAIL = "seed@gigtrack.com";
const DEMO_PASSWORD = "demo1234";

export default function LoginForm({ onSuccess }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function fillDemo() {
    setFormData({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        onSuccess(data.user);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="login-container">
      <Card className="login-card">
        <Card.Body>
          <h2 className="login-title">Welcome Back</h2>

          <div className="login-demo-box">
            <p className="login-demo-text">
              🎓 Want to explore without registering?
            </p>
            <Button
              variant="outline-secondary"
              size="sm"
              className="w-100"
              onClick={fillDemo}
            >
              Use Demo Account
            </Button>
            <p className="login-demo-credentials">
              Email: <strong>{DEMO_EMAIL}</strong> · Password:{" "}
              <strong>{DEMO_PASSWORD}</strong>
            </p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your password"
                required
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

LoginForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};
