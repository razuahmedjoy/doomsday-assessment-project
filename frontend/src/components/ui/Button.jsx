const variants = {
  primary: 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
};

export default function Button({ variant = 'primary', type = 'button', className = '', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
