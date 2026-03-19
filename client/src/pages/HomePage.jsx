import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <h1 className="mb-3">💼 GigTrack</h1>
      <p className="lead mb-4">
        Track your side hustles, rate your clients, and hit your income goals —
        all in one place.
      </p>
      <div className="d-flex gap-3 justify-content-center">
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate("/register")}
        >
          Get Started
        </Button>
        <Button
          variant="outline-primary"
          size="lg"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </div>
    </Container>
  );
}
