const variants = {
  error: 'border-red-200 bg-red-50 text-red-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
};

export default function Alert({ variant = 'error', children }) {
  return <p className={`rounded-lg border px-4 py-3 text-sm ${variants[variant]}`}>{children}</p>;
}
