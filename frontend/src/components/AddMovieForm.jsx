import { useState } from 'react';
import { useMovieStore } from '../store/useMovieStore.js';
import PrerequisitePicker from './PrerequisitePicker.jsx';
import Card from './ui/Card.jsx';
import Button from './ui/Button.jsx';
import Alert from './ui/Alert.jsx';
import { Field, Input } from './ui/Field.jsx';

const emptyForm = { title: '', releaseYear: '', runtime: '', prerequisites: [] };

export default function AddMovieForm() {
  const movies = useMovieStore((s) => s.movies);
  const addMovie = useMovieStore((s) => s.addMovie);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const setField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await addMovie({ ...form, releaseYear: Number(form.releaseYear), runtime: Number(form.runtime) });
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Add a movie" description="Add a movie and pick what should be watched before it.">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Title" className="sm:col-span-2">
            <Input value={form.title} onChange={setField('title')} placeholder="e.g. Iron Man 2" required />
          </Field>
          <Field label="Release year">
            <Input type="number" value={form.releaseYear} onChange={setField('releaseYear')} placeholder="2010" required />
          </Field>
          <Field label="Runtime (min)">
            <Input type="number" min="1" max="300" value={form.runtime} onChange={setField('runtime')} placeholder="124" required />
          </Field>
        </div>

        <div className="space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Watch these first</span>
          <PrerequisitePicker
            movies={movies}
            selected={form.prerequisites}
            onChange={(prerequisites) => setForm({ ...form, prerequisites })}
          />
        </div>

        {error && <Alert>{error}</Alert>}

        <Button type="submit" disabled={saving}>{saving ? 'Adding…' : 'Add movie'}</Button>
      </form>
    </Card>
  );
}
