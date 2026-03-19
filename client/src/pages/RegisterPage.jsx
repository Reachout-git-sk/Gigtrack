import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm/RegisterForm.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();

  function handleSuccess() {
    navigate("/login");
  }

  return <RegisterForm onSuccess={handleSuccess} />;
}
