import React from "react";
import "../styles/Card.css"; // Import your styles here

const Card = ({ title, children }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default Card;
