import "../styles/NotificationCard.css";

const NotificationCard = ({ color, icon, title, description }) => {
  return (
    <div className={`notification-card ${color}`}>
      <span className="material-symbols-outlined">{icon}</span>
      <div>
        <p className="title">{title}</p>
        <p className="desc">{description}</p>
      </div>
    </div>
  );
};

export default NotificationCard;