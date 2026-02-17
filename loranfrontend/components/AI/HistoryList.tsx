"use client";

import { useEffect, useState } from "react";

type HistoryItem = {
  id: string;
  createdAt: string;
  thumbnail?: string;
  result: any;
};

export default function HistoryList({ onLoad }: { onLoad: (r: any) => void }) {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("aiHistory");
    if (raw) setItems(JSON.parse(raw));
  }, []);

  const handleLoad = (it: HistoryItem) => onLoad(it.result);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h4 className="font-semibold mb-2">History</h4>
      {items.length === 0 && <p className="text-sm text-gray-500">No recent runs</p>}
      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between border rounded p-2">
            <div className="flex items-center gap-3">
              {it.thumbnail ? <img src={it.thumbnail} alt="thumb" className="w-12 h-12 object-cover rounded" /> : <div className="w-12 h-12 bg-gray-100 rounded" />}
              <div>
                <div className="text-sm font-medium">{new Date(it.createdAt).toLocaleString()}</div>
                <div className="text-xs text-gray-500">{it.result?.measurements?.length || 0} measurements</div>
              </div>
            </div>
            <div>
              <button onClick={() => handleLoad(it)} className="bg-indigo-600 text-white px-3 py-1 rounded">Load</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
