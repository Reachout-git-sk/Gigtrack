import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm/LoginForm.jsx";
import PropTypes from "prop-types";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  function handleSuccess(user) {
    onLogin(user);
    navigate("/gigs");
  }

  return <LoginForm onSuccess={handleSuccess} />;
}

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};