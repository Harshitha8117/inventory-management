import React, { useState } from "react";
import axios from "../../api/axiosClient";
import { useToast } from "../UI/ToastProvider";

export default function ProductRow({ product, onUpdate, onSelect }) {
  const toast = useToast();
  const [isEditing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...product });

  const save = async () => {
    try {
      await axios.put(`/api/products/${product.id}`, form);
      setEditing(false);
      onUpdate();
      toast.push("Product updated!", "success");
    } catch (err) {
      console.error("Update error:", err);
      toast.push("Failed to update product", "error");
    }
  };

  const deleteProduct = async () => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`/api/products/${product.id}`);
      onUpdate();
      toast.push("Product deleted!", "success");
    } catch (err) {
      console.error("Delete error:", err);
      toast.push("Failed to delete product", "error");
    }
  };

  // Smart image fallback
  const imageUrl =
    product.image && product.image.startsWith("http")
      ? product.image
      : "https://via.placeholder.com/48?text=IMG";

  return (
    <tr className="border-b dark:border-gray-700">
      {/* Image */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-10 h-10 rounded object-cover bg-gray-100 dark:bg-gray-700"
          />
        </div>
      </td>

      {/* Name */}
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
        {isEditing ? (
          <input
            className="border rounded px-2 py-1 w-full bg-white dark:bg-gray-700"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        ) : (
          product.name
        )}
      </td>

      {/* Unit */}
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
        {isEditing ? (
          <input
            className="border rounded px-2 py-1 w-20 bg-white dark:bg-gray-700"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />
        ) : (
          product.unit
        )}
      </td>

      {/* Category */}
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
        {isEditing ? (
          <input
            className="border rounded px-2 py-1 w-full bg-white dark:bg-gray-700"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        ) : (
          product.category
        )}
      </td>

      {/* Brand */}
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
        {isEditing ? (
          <input
            className="border rounded px-2 py-1 w-full bg-white dark:bg-gray-700"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />
        ) : (
          product.brand
        )}
      </td>

      {/* Stock */}
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
        {isEditing ? (
          <input
            type="number"
            className="border rounded px-2 py-1 w-20 bg-white dark:bg-gray-700"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) })
            }
          />
        ) : (
          product.stock
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
        {product.stock > 0 ? (
          <span className="text-green-600 dark:text-green-400">In Stock</span>
        ) : (
          <span className="text-red-600 dark:text-red-400">Out of Stock</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 whitespace-nowrap text-sm">
        {isEditing ? (
          <>
            <button
              onClick={save}
              className="px-3 py-1 bg-blue-600 text-white rounded-md mr-2 hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setForm({ ...product });
              }}
              className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
            >
              Edit
            </button>

            <button
              onClick={deleteProduct}
              className="px-3 py-1 bg-red-500 text-white rounded-md mr-2 hover:bg-red-600"
            >
              Delete
            </button>

            <button
              onClick={() => onSelect(product)}
              className="px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-900"
            >
              History
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
