import { useEffect, useState } from 'react';
import { useMovieStore } from './store/useMovieStore.js';
import { resetDatabase } from './api/admin.js';
import MoviesPage from './pages/MoviesPage.jsx';
import RewatchPage from './pages/RewatchPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import Alert from './components/ui/Alert.jsx';
import Button from './components/ui/Button.jsx';

const tabs = [
  { label: 'Movies', Page: MoviesPage },
  { label: 'Rewatch Plan', Page: RewatchPage },
  { label: 'Booking', Page: BookingPage },
];

export default function App() {
  const fetchMovies = useMovieStore((s) => s.fetchMovies);
  const [active, setActive] = useState(tabs[0].label);
  const [error, setError] = useState('');
  const [resetting, setResetting] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  useEffect(() => {
    fetchMovies().catch((err) => setError(err.message));
  }, [fetchMovies]);

  const reset = async () => {
    if (!window.confirm('Delete all data and load the sample movies and cinemas again?')) return;
    setResetting(true);
    setError('');
    try {
      await resetDatabase();
      await fetchMovies();
      setResetCount((n) => n + 1); // remount the page so its local state starts fresh
    } catch (err) {
      setError(err.message);
    } finally {
      setResetting(false);
    }
  };

  const { Page } = tabs.find((t) => t.label === active);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doomsday Ready</h1>
          <p className="mt-1 text-slate-500">Catch up on the MCU and book your opening-night watch party.</p>
        </div>
        <Button variant="ghost" onClick={reset} disabled={resetting} className="shrink-0">
          {resetting ? 'Resetting…' : 'Reset data'}
        </Button>
      </header>

      <nav className="mb-6 inline-flex rounded-xl bg-slate-200/70 p-1">
        {tabs.map(({ label }) => (
          <button
            key={label}
            type="button"
            onClick={() => setActive(label)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              label === active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {error && <div className="mb-6"><Alert>{error}</Alert></div>}
      <Page key={resetCount} />
    </div>
  );
}
