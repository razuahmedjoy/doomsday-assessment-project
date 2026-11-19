import { useState } from 'react';
import { useMovieStore } from '../store/useMovieStore.js';
import PrerequisitePicker from './PrerequisitePicker.jsx';
import Button from './ui/Button.jsx';
import Alert from './ui/Alert.jsx';

export default function MovieRow({ movie, movies }) {
  const updateMovie = useMovieStore((s) => s.updateMovie);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  const titleOf = (id) => movies.find((m) => m.id === id)?.title;

  const update = async (changes) => {
    setError('');
    try {
      await updateMovie(movie.id, changes);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <li className="py-4">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={movie.watched}
          onChange={(e) => update({ watched: e.target.checked })}
          aria-label={`Mark ${movie.title} as watched`}
          className="mt-1 size-4 cursor-pointer accent-indigo-600"
        />
        <div className="min-w-0 flex-1">
          <p className={`font-medium ${movie.watched ? 'text-slate-400 line-through' : ''}`}>{movie.title}</p>
          <p className="text-sm text-slate-500">
            {movie.releaseYear} · {movie.runtime} min
            {movie.prerequisites.length > 0 && <> · after {movie.prerequisites.map(titleOf).join(', ')}</>}
          </p>
        </div>
        <Button variant="ghost" onClick={() => setEditing(!editing)}>
          {editing ? 'Done' : 'Edit prerequisites'}
        </Button>
      </div>

      {(editing || error) && (
        <div className="mt-3 space-y-3 pl-7">
          {editing && (
            <PrerequisitePicker
              movies={movies.filter((m) => m.id !== movie.id)}
              selected={movie.prerequisites}
              onChange={(prerequisites) => update({ prerequisites })}
            />
          )}
          {error && <Alert>{error}</Alert>}
        </div>
      )}
    </li>
  );
}
