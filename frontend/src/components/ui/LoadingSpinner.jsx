export default function LoadingSpinner({ size = 'md', label = 'Loading...' }) {
  const sizeClass = size === 'sm' ? 'w-6 h-6 border-2' : size === 'lg' ? 'w-12 h-12 border-2' : 'w-10 h-10 border-2';
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12" role="status" aria-label={label}>
      <div
        className={`${sizeClass} border-sky-500 border-t-transparent rounded-full animate-spin`}
      />
      {label && <p className="text-slate-500 dark:text-slate-400 text-sm">{label}</p>}
    </div>
  );
}
