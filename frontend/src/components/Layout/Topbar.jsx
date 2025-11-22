import React from "react";
import SearchBar from "../Header/SearchBar";
import CategoryFilter from "../Header/CategoryFilter";
import useTheme from "../../hooks/useTheme";

export default function Topbar({
  query,
  onSearch,
  categories,
  category,
  setCategory,
  onAdd,
  onExport
}) {
  const [theme, setTheme] = useTheme();

  return (
    <header
      className="
        border-b border-gray-200 dark:border-gray-700
        bg-white dark:bg-[rgba(30,33,40,0.75)]
        backdrop-blur-md
        shadow-sm
        sticky top-0 z-20
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LEFT SIDE — Search + Filter */}
        <div className="flex items-center gap-4">
          <SearchBar value={query} onSearch={onSearch} />
          <CategoryFilter
            categories={categories}
            value={category}
            onChange={setCategory}
          />
        </div>

        {/* RIGHT SIDE — Actions */}
        <div className="flex items-center gap-3">

          {/* Export CSV */}
          <button
            onClick={onExport}
            className="
              px-4 py-2
              bg-green-600 hover:bg-green-700
              text-white
              rounded-md
              shadow-sm
              transition
            "
          >
            Export CSV
          </button>

          {/* Add Product */}
          <button
            onClick={onAdd}
            className="
              px-4 py-2
              bg-blue-600 hover:bg-blue-700
              text-white
              rounded-md
              shadow-sm
              transition
            "
          >
            Add Product
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="
              px-3 py-2
              rounded-md border
              bg-white dark:bg-gray-800
              text-gray-800 dark:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-700
              shadow-sm
              transition
            "
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>

        </div>
      </div>
    </header>
  );
}
