import React from "react";
import ProductTable from "../components/Table/ProductTable";
import HistorySidebar from "../components/Sidebar/HistorySidebar";

export default function ProductsPage({ products, category, onUpdate, onSelect, selected }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow p-4 z-clean">
        <ProductTable
          products={category ? products.filter((p) => p.category === category) : products}
          onUpdate={onUpdate}
          onSelect={onSelect}
        />
      </div>

      <div className="lg:col-span-1">
        <HistorySidebar product={selected} onClose={() => onSelect(null)} />
      </div>
    </div>
  );
}
