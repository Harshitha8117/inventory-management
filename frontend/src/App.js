import React, { useEffect, useState } from "react";
import axios from "./api/axiosClient";
import Sidebar from "./components/Layout/Sidebar";
import Topbar from "./components/Layout/Topbar";
import { Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import AddProductModal from "./components/Modals/AddProductModal";
import useTheme from "./hooks/useTheme";

export default function App() {
  const [theme] = useTheme();

  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchAll = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSearch = async (q) => {
    setQuery(q);
    if (!q.trim()) return fetchAll();
    try {
      const res = await axios.get("/api/products/search", { params: { name: q } });
      setProducts(res.data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar
          query={query}
          onSearch={handleSearch}
          categories={categories}
          category={category}
          setCategory={setCategory}
          onAdd={() => setShowAddModal(true)}
          onExport={async () => {
            const res = await axios.get("/api/products/export", { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "products.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
          }}
        />

        <main className="p-6 max-w-7xl mx-auto w-full">
          <Routes>
            <Route
              path="/"
              element={
                <ProductsPage
                  products={products}
                  category={category}
                  onUpdate={fetchAll}
                  onSelect={setSelected}
                  selected={selected}
                />
              }
            />

            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>

      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} onCreated={fetchAll} />
      )}
    </div>
  );
}
