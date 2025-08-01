import React, { useState } from "react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      id="sidebar"
      className={`sidebar bg-blue-800 text-white flex flex-col${
        collapsed ? " collapsed w-20" : " w-64"
      }`}
      style={{ transition: "all 0.3s ease" }}
    >
      <div className="p-4 flex items-center justify-between border-b border-blue-700">
        <div className="flex items-center">
          <i className="fas fa-briefcase text-2xl sidebar-icon mr-3"></i>
          {!collapsed && (
            <span className="text-xl font-bold sidebar-text">HR GDA</span>
          )}
        </div>
        <button
          id="toggleSidebar"
          className="text-white focus:outline-none cursor-pointer"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>
      <div className="flex-1 py-4">
        <div className="overflow-y-auto custom-scrollbar h-full">
          <div className="px-4 mb-6">
            {!collapsed && (
              <div className="text-xs uppercase font-semibold text-blue-200 mb-2 sidebar-text">
                Core Modules
              </div>
            )}
            <ul>
              <li className="mb-1">
                <a
                  href="#"
                  className={`flex items-center px-3 py-2 rounded-lg bg-blue-700 text-white`}
                >
                  <i className="fas fa-users sidebar-icon mr-3"></i>
                  {!collapsed && (
                    <span className="sidebar-text">Employee Database</span>
                  )}
                </a>
              </li>
              <li className="mb-1">
                <a
                  href="#"
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-700 text-blue-100 hover:text-white"
                >
                  <i className="fas fa-search sidebar-icon mr-3"></i>
                  {!collapsed && (
                    <span className="sidebar-text">Recruitment (ATS)</span>
                  )}
                </a>
              </li>
              <li className="mb-1">
                <a
                  href="#"
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-700 text-blue-100 hover:text-white"
                >
                  <i className="fas fa-money-bill-wave sidebar-icon mr-3"></i>
                  {!collapsed && (
                    <span className="sidebar-text">Payroll Processing</span>
                  )}
                </a>
              </li>
              <li className="mb-1">
                <a
                  href="#"
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-700 text-blue-100 hover:text-white"
                >
                  <i className="fas fa-heart sidebar-icon mr-3"></i>
                  {!collapsed && (
                    <span className="sidebar-text">Benefits Admin</span>
                  )}
                </a>
              </li>
              <li className="mb-1">
                <a
                  href="#"
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-700 text-blue-100 hover:text-white"
                >
                  <i className="fas fa-user-cog sidebar-icon mr-3"></i>
                  {!collapsed && (
                    <span className="sidebar-text">Self-Service</span>
                  )}
                </a>
              </li>
            </ul>
          </div>
          <div className="px-4 mb-6">
            {!collapsed && (
              <div className="text-xs uppercase font-semibold text-blue-200 mb-2 sidebar-text">
                Tools
              </div>
            )}
            <ul>
              <li className="mb-1">
                <a
                  href="#"
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-700 text-blue-100 hover:text-white"
                >
                  <i className="fas fa-chart-line sidebar-icon mr-3"></i>
                  {!collapsed && (
                    <span className="sidebar-text">Analytics</span>
                  )}
                </a>
              </li>
              <li className="mb-1">
                <a
                  href="#"
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-700 text-blue-100 hover:text-white"
                >
                  <i className="fas fa-file-alt sidebar-icon mr-3"></i>
                  {!collapsed && (
                    <span className="sidebar-text">Documents</span>
                  )}
                </a>
              </li>
              <li className="mb-1">
                <a
                  href="#"
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-700 text-blue-100 hover:text-white"
                >
                  <i className="fas fa-calendar-alt sidebar-icon mr-3"></i>
                  {!collapsed && <span className="sidebar-text">Calendar</span>}
                </a>
              </li>
            </ul>
          </div>
          <div className="px-4">
            {!collapsed && (
              <div className="text-xs uppercase font-semibold text-blue-200 mb-2 sidebar-text">
                Settings
              </div>
            )}
            <ul>
              <li className="mb-1">
                <a
                  href="#"
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-700 text-blue-100 hover:text-white"
                >
                  <i className="fas fa-cog sidebar-icon mr-3"></i>
                  {!collapsed && (
                    <span className="sidebar-text">System Settings</span>
                  )}
                </a>
              </li>
              <li className="mb-1">
                <a
                  href="#"
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-700 text-blue-100 hover:text-white"
                >
                  <i className="fas fa-users-cog sidebar-icon mr-3"></i>
                  {!collapsed && (
                    <span className="sidebar-text">User Management</span>
                  )}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-blue-700">
        <div className="flex items-center">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
          {!collapsed && (
            <div className="sidebar-text">
              <div className="font-medium">Sarah Johnson</div>
              <div className="text-xs text-blue-200">HR Administrator</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
