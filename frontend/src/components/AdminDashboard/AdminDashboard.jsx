import React, { useState, useEffect } from "react";
import { fetchAdminDashboard } from "../../utils/api"; // ✅ Centralized API function
import UserTable from "./UserTable";
import StatsCards from "./StatsCards";
import IncomeWidget from "./IncomeWidget";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [lockedUsers, setLockedUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [income, setIncome] = useState(0); // Placeholder for future use

  useEffect(() => {
    getAdminDashboardData();
  }, []);

  // ✅ Centralized data fetching
  const getAdminDashboardData = async () => {
    try {
      const dashboardData = await fetchAdminDashboard();

      setUsers(dashboardData.users || []);
      setLockedUsers(dashboardData.lockedUsers || []);
      setTotalUsers(dashboardData.totalUsers || 0);
      setIncome(dashboardData.income || 1200); // You can later replace with actual data
    } catch (error) {
      console.error("❌ Error fetching admin dashboard data:", error.message);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>

      {/* ✅ Stats Cards: total users, locked users, income */}
      <StatsCards
        totalUsers={totalUsers}
        lockedUsers={lockedUsers.length}
        income={income}
      />

      {/* ✅ Income Widget */}
      <IncomeWidget income={income} />

      {/* ✅ User Management Table */}
      <UserTable users={users} lockedUsers={lockedUsers} />
    </div>
  );
};

export default AdminDashboard;
