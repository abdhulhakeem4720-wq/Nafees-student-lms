"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
        <p className="text-sm text-slate-600">
          {error?.message || "An unexpected error occurred while loading this page."}
        </p>
        <button
          onClick={reset}
          className="btn-primary px-4 py-2 text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
