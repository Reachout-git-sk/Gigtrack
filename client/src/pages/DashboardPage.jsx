import EarningsDashboard from "../components/EarningsDashboard/EarningsDashboard.jsx";
import PropTypes from "prop-types";

export default function DashboardPage({ user }) {
  return <EarningsDashboard userId={user.id} />;
}

DashboardPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
