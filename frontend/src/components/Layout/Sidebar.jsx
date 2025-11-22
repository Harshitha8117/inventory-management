import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="
      w-64
      bg-white dark:bg-[#171a1f]
      border-r border-gray-200 dark:border-gray-800
      min-h-screen
      hidden md:block
    ">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Inventory Dashboard
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your products
        </p>
      </div>

      <nav className="px-4 py-6 space-y-1">

        {[
          { label: "Products", to: "/" },
          { label: "Categories", to: "/categories" },
          { label: "Reports", to: "/reports" },
          { label: "Settings", to: "/settings" }
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `
                block px-3 py-2 rounded-md transition
                ${
                  isActive
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `
            }
          >
            {item.label}
          </NavLink>
        ))}

      </nav>
    </aside>
  );
}
