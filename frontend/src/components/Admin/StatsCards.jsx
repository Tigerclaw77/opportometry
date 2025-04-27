import React from "react";

const StatsCards = ({ totalUsers, lockedUsers, income }) => {
  return (
    <div className="stats-cards">
      <div className="card">
        <h3>Total Users</h3>
        <p>{totalUsers}</p>
      </div>
      <div className="card">
        <h3>Locked Accounts</h3>
        <p>{lockedUsers}</p>
      </div>
      <div className="card">
        <h3>Current Income</h3>
        <p>${income}</p>
      </div>
    </div>
  );
};

export default StatsCards;
