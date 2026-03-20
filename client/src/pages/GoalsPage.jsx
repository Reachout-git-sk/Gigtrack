import GoalList from "../components/GoalList/GoalList.jsx";
import PropTypes from "prop-types";

export default function GoalsPage({ user }) {
  return <GoalList userId={user.id} />;
}

GoalsPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
