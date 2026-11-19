import { useEffect, useState } from 'react';
import { getBookingQuote, listCinemas } from '../api/cinemas.js';
import AddCinemaForm from '../components/AddCinemaForm.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Alert from '../components/ui/Alert.jsx';
import { Field, Input, Select } from '../components/ui/Field.jsx';

export default function BookingPage() {
  const [cinemas, setCinemas] = useState([]);
  const [cinemaId, setCinemaId] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    listCinemas().then(setCinemas).catch((err) => setError(err.message));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setQuote(null);
    try {
      setQuote(await getBookingQuote(cinemaId, groupSize));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show the new cinema in the list and select it, ready for a quote.
  const handleCreated = (cinema) => {
    setCinemas((list) => [...list, cinema]);
    setCinemaId(cinema.id);
    setQuote(null);
  };

  return (
    <div className="space-y-6">
      <Card title="Book a watch party" description="Seats are sold only in bundles. Find the fewest bundles that fit your group exactly.">
        <div className="space-y-6">
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-[1fr_10rem_auto] sm:items-end">
            <Field label="Cinema">
              <Select value={cinemaId} onChange={(e) => setCinemaId(e.target.value)} required>
                <option value="">Select a cinema…</option>
                {cinemas.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} (bundles of {c.bundleSizes.join(', ')})</option>
                ))}
              </Select>
            </Field>
            <Field label="Group size">
              <Input type="number" min="1" max="10000" value={groupSize} onChange={(e) => setGroupSize(e.target.value)} placeholder="6" required />
            </Field>
            <Button type="submit" disabled={loading}>{loading ? 'Checking…' : 'Get quote'}</Button>
          </form>
  
          {error && <Alert>{error}</Alert>}
  
          {quote && !quote.possible && (
            <Alert variant="warning">
              Not possible. {quote.cinema.name} has no combination of bundles that adds up to exactly {quote.groupSize} seats.
            </Alert>
          )}
  
          {quote?.possible && (
            <div className="rounded-xl bg-indigo-50 p-5">
              <p className="text-sm text-indigo-700">
                {quote.groupSize} seats at {quote.cinema.name}
              </p>
              <p className="mt-1 text-2xl font-semibold text-indigo-950">
                {quote.totalBundles} {quote.totalBundles === 1 ? 'bundle' : 'bundles'}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {quote.bundles.map((b) => (
                  <li key={b.size} className="rounded-lg bg-white px-3 py-2 text-sm shadow-sm">
                    <span className="font-semibold">{b.count} ×</span> {b.size}-seat bundle
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>
      <AddCinemaForm onCreated={handleCreated} />
    </div>
  );
}
