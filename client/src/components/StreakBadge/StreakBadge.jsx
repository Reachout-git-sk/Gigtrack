import PropTypes from "prop-types";
import "./StreakBadge.css";

export default function StreakBadge({ streak }) {
  if (streak === 0) return null;

  return (
    <div className="streakbadge">
      <span className="streakbadge-fire">🔥</span>
      <span className="streakbadge-count">{streak}</span>
      <span className="streakbadge-label">
        month{streak !== 1 ? "s" : ""} in a row
      </span>
    </div>
  );
}

StreakBadge.propTypes = {
  streak: PropTypes.number.isRequired,
};