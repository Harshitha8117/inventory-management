import React, { useState } from "react";
import axios from "../../api/axiosClient";
import { useToast } from "../UI/ToastProvider";

export default function AddProductModal({ onClose, onCreated }) {
  const toast = useToast();

  const [form, setForm] = useState({
    name: "",
    unit: "",
    category: "",
    brand: "",
    stock: 0,
    status: "In Stock",
    image: ""
  });
  const [error, setError] = useState(null);
  const [duplicate, setDuplicate] = useState(null);

  const submit = async () => {
    setError(null);
    setDuplicate(null);
    try {
      const res = await axios.post("/api/products", form);
      toast.success("Product created");
      onCreated && onCreated(res.data);
      onClose();
    } catch (err) {
      console.error("Create error:", err);
      const resp = err.response;
      if (resp && resp.status === 409 && resp.data?.error === "duplicate") {
        setDuplicate({ existingId: resp.data.existingId, name: resp.data.name });
        toast.error("Duplicate product detected");
      } else {
        const msg = resp?.data?.error || err.message || "Something went wrong";
        setError(msg);
        toast.error(msg);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">Name</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300">Unit</label>
              <input value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300">Stock</label>
              <input type="number" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">Category</label>
            <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">Brand</label>
            <input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">Image URL</label>
            <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="https://..." />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
          <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded-md">Create</button>
        </div>

        {duplicate && (
          <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-yellow-700">
            Product <strong>{duplicate.name}</strong> already exists.
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-400 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
