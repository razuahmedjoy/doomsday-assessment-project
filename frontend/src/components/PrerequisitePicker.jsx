// Toggle chips for choosing which movies must be watched first.
export default function PrerequisitePicker({ movies, selected, onChange }) {
  if (movies.length === 0) return <p className="text-sm text-slate-500">No other movies yet.</p>;

  const toggle = (id) => onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);

  return (
    <div className="flex flex-wrap gap-2">
      {movies.map((movie) => {
        const active = selected.includes(movie.id);
        return (
          <button
            key={movie.id}
            type="button"
            onClick={() => toggle(movie.id)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              active
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-slate-300 bg-white text-slate-600 hover:border-indigo-400'
            }`}
          >
            {movie.title}
          </button>
        );
      })}
    </div>
  );
}
