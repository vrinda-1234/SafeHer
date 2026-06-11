import { Phone, Share2, Square } from "lucide-react";

export default function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-3">
      <button className="h-14 w-14 rounded-full bg-green-500 text-white shadow-xl flex items-center justify-center">
        <Phone />
      </button>

      <button className="h-16 w-16 rounded-full bg-red-500 text-white shadow-xl flex items-center justify-center">
        <Square />
      </button>

      <button className="h-14 w-14 rounded-full bg-violet-600 text-white shadow-xl flex items-center justify-center">
        <Share2 />
      </button>
    </div>
  );
}
