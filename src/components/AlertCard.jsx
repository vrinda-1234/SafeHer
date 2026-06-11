import { AlertTriangle } from "lucide-react";

export default function AlertCard({ show, onSOS }) {
  if (!show) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-3xl p-5 shadow-md mb-5">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="text-red-500" />
        <h3 className="font-bold text-red-500">Route Deviation Alert</h3>
      </div>

      <p>You are outside your safe route.</p>

      <div className="flex gap-3 mt-4 flex-wrap">
        <button className="bg-violet-600 text-white px-4 py-2 rounded-xl">
          I'm Safe
        </button>

        <button
          onClick={onSOS}
          className="bg-red-500 text-white px-4 py-2 rounded-xl"
        >
          Send SOS
        </button>
      </div>
    </div>
  );
}
