import React from 'react';
import '../DashboardLayout.css';

const DashboardLayout = ({ header, sidebar, children }) => {
  return (
    <div className="dashboard-grid">
      <header className="dashboard-header">{header}</header>
      <aside className="dashboard-sidebar">{sidebar}</aside>
      <main className="dashboard-main">{children}</main>
    </div>
  );
};

export default DashboardLayout;