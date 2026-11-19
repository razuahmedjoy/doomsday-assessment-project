import { useMovieStore } from '../store/useMovieStore.js';
import AddMovieForm from '../components/AddMovieForm.jsx';
import MovieRow from '../components/MovieRow.jsx';
import Card from '../components/ui/Card.jsx';

export default function MoviesPage() {
  const movies = useMovieStore((s) => s.movies);

  return (
    <div className="space-y-6">
      <AddMovieForm />
      <Card title="Movies" description="Tick the ones you've watched.">
        {movies.length === 0 ? (
          <p className="text-sm text-slate-500">No movies yet.</p>
        ) : (
          <ul className="-my-4 divide-y divide-slate-100">
            {movies.map((movie) => <MovieRow key={movie.id} movie={movie} movies={movies} />)}
          </ul>
        )}
      </Card>
    </div>
  );
}
