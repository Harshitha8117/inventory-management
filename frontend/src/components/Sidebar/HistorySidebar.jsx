import React, { useEffect, useState } from "react";
import axios from "../../api/axiosClient";

export default function HistorySidebar({ product, onClose }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!product) {
      setLogs([]);
      return;
    }
    (async () => {
      try {
        const res = await axios.get(`/api/products/${product.id}/history`);
        setLogs(res.data || []);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setLogs([]);
      }
    })();
  }, [product]);

  return (
    <aside className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      {!product ? (
        <div className="text-sm text-gray-500">Select a product to view history</div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">{product.name} — History</h4>
            <button onClick={onClose} className="text-sm text-gray-500">Close</button>
          </div>

          {logs.length === 0 ? (
            <div className="text-sm text-gray-500">No inventory changes recorded.</div>
          ) : (
            <div className="space-y-4">
              {logs.map((l) => (
                <div key={l.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${l.new_quantity > l.old_quantity ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div className="w-px bg-gray-200 flex-1" />
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 flex-1">
                    <div className="text-xs text-gray-500">{new Date(l.change_date).toLocaleString()}</div>
                    <div className="mt-1 text-sm text-gray-800 dark:text-gray-100">
                      {l.old_quantity} → <span className={l.new_quantity > l.old_quantity ? 'text-green-600' : 'text-red-600'}>{l.new_quantity}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">By: {l.user_info || 'system'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </aside>
  );
}
