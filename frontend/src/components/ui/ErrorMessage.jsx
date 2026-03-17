export default function ErrorMessage({ message, onRetry, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-red-700 dark:text-red-300 text-sm ${className}`}
      role="alert"
    >
      <p className="font-medium">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 text-red-600 dark:text-red-400 underline font-medium hover:no-underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
