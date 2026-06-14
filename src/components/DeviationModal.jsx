import { createPortal } from "react-dom";

export default function DeviationModal({
  show,
  countdown,
  onSafe,
  onSOS,
}) {

  if (!show) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] font-inter pointer-events-none flex items-center justify-center">
      <div className="pointer-events-auto bg-white rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-red-200">
        <h2 className="font-bold text-xl font-syne text-red-500 mb-3">
          Route Deviation Detected
        </h2>

        <p className="mb-4 font-inter">
          We noticed that you are away from your planned route.
        </p>

        <p className="font-bold font-inter text-lg mb-5">
          Emergency contacts will be notified in:
          <br />
          {countdown}s
        </p>

        <div className="flex gap-3">
          <button
            onClick={onSafe}
            className="flex-1 font-inter bg-green-500 text-white py-3 rounded-xl"
          >
            I'm Safe
          </button>

          <button
            onClick={onSOS}
            className="flex-1 font-inter bg-red-500 text-white py-3 rounded-xl"
          >
            Send Help
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}