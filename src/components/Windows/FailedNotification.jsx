import "./FailedNotification.css";

export const FailedNotification = ({ message, onClose }) => {
  return (
    <div className="failed-notification">
      <div className="failed-content">
        <div className="failed-icon">x</div>
        <h3>¡Error!</h3>
        <p>{message}</p>
        <button className="btn-close-notification" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};
