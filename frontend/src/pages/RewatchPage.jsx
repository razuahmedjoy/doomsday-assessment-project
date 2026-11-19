import { useEffect, useState } from 'react';
import { useMovieStore } from '../store/useMovieStore.js';
import { getRewatchPlan } from '../api/movies.js';
import { formatRuntime } from '../utils/format.js';
import Card from '../components/ui/Card.jsx';
import Alert from '../components/ui/Alert.jsx';
import { Field, Select } from '../components/ui/Field.jsx';

export default function RewatchPage() {
  const movies = useMovieStore((s) => s.movies);
  const updateMovie = useMovieStore((s) => s.updateMovie);
  const [targetId, setTargetId] = useState('');
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');

  // Reload the plan when the target changes or any movie changes (e.g. marked watched).
  useEffect(() => {
    setError('');
    if (!targetId) {
      setPlan(null);
      return;
    }
    let ignore = false; // drop responses from an outdated request
    getRewatchPlan(targetId)
      .then((data) => !ignore && setPlan(data))
      .catch((err) => !ignore && setError(err.message));
    return () => {
      ignore = true;
    };
  }, [targetId, movies]);

  const toggleWatched = (movie) => updateMovie(movie.id, { watched: !movie.watched }).catch((err) => setError(err.message));

  const percent = plan?.totalCount ? Math.round((plan.watchedCount / plan.totalCount) * 100) : 0;

  return (
    <Card title="Rewatch plan" description="Pick a movie to see everything to watch before it, in order.">
      <div className="space-y-6">
        <Field label="Target movie">
          <Select value={targetId} onChange={(e) => setTargetId(e.target.value)}>
            <option value="">Select a movie…</option>
            {movies.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </Select>
        </Field>

        {error && <Alert>{error}</Alert>}

        {plan && plan.totalCount === 0 && (
          <p className="text-sm text-slate-500">Nothing to watch first. You're ready for {plan.target.title}.</p>
        )}

        {plan && plan.totalCount > 0 && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{plan.watchedCount} of {plan.totalCount} watched</span>
                <span className="text-slate-500">{formatRuntime(plan.remainingRuntime)} left to watch</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${percent}%` }} />
              </div>
            </div>

            <ol className="space-y-2">
              {plan.order.map((movie, index) => (
                <li key={movie.id} className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
                  <span className="w-5 text-sm text-slate-400">{index + 1}</span>
                  <input
                    type="checkbox"
                    checked={movie.watched}
                    onChange={() => toggleWatched(movie)}
                    aria-label={`Mark ${movie.title} as watched`}
                    className="size-4 cursor-pointer accent-indigo-600"
                  />
                  <span className={`flex-1 ${movie.watched ? 'text-slate-400 line-through' : ''}`}>{movie.title}</span>
                  <span className="text-sm text-slate-500">{movie.runtime} min</span>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </Card>
  );
}
