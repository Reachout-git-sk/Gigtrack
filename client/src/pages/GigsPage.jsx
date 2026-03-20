import GigList from "../components/GigList/GigList.jsx";
import PropTypes from "prop-types";

export default function GigsPage({ user }) {
  return <GigList userId={user.id} />;
}

GigsPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
  }).isRequired,
};
