import { useEffect } from "react";
import { useCalendly } from "@/hooks/useCalendly";

const BookCall = () => {
  const { open } = useCalendly();

  useEffect(() => {
    open();
  }, [open]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-900">
      <p className="text-gray-300 text-lg">Loading your booking calendar…</p>
    </div>
  );
};

export default BookCall;
