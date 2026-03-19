import { useNavigate, useLocation } from "react-router-dom";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import "./Navbar.css";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    onLogout();
    navigate("/login");
  }

  return (
    <BSNavbar className="gigtrack-navbar" expand="md">
      <Container>
        <BSNavbar.Brand
          onClick={() => navigate("/")}
          className="gigtrack-brand"
        >
          💼 GigTrack
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="main-nav" />
        <BSNavbar.Collapse id="main-nav">
          <Nav className="me-auto">
            {user && (
              <>
                <Nav.Link
                  onClick={() => navigate("/gigs")}
                  active={location.pathname === "/gigs"}
                >
                  My Gigs
                </Nav.Link>
                <Nav.Link
                  onClick={() => navigate("/dashboard")}
                  active={location.pathname === "/dashboard"}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link
                  onClick={() => navigate("/goals")}
                  active={location.pathname === "/goals"}
                >
                  Goals
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <div className="gigtrack-user-area">
                <span className="gigtrack-username">Hi, {user.name}</span>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="gigtrack-user-area">
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

Navbar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
  user: null,
};