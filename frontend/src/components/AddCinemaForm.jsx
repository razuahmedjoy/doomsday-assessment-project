import { useState } from 'react';
import { createCinema } from '../api/cinemas.js';
import Card from './ui/Card.jsx';
import Button from './ui/Button.jsx';
import Alert from './ui/Alert.jsx';
import { Field, Input } from './ui/Field.jsx';

const emptyForm = { name: '', bundleSizes: '' };

export default function AddCinemaForm({ onCreated }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const setField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    // "2, 5" -> [2, 5]. Range and duplicate checks are done by the API.
    const bundleSizes = form.bundleSizes.split(',').map((s) => s.trim()).filter(Boolean).map(Number);
    if (!bundleSizes.every(Number.isInteger)) {
      setError('Bundle sizes must be whole numbers separated by commas, e.g. 2, 5');
      return;
    }

    setSaving(true);
    try {
      onCreated(await createCinema({ name: form.name, bundleSizes }));
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Add a cinema" description="Each cinema sells opening-night seats only in its own bundle sizes.">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <Input value={form.name} onChange={setField('name')} placeholder="e.g. Grand Cinema" required />
          </Field>
          <Field label="Bundle sizes (1–10 sizes, 1–500 seats each)">
            <Input value={form.bundleSizes} onChange={setField('bundleSizes')} placeholder="e.g. 2, 5" required />
          </Field>
        </div>

        {error && <Alert>{error}</Alert>}

        <Button type="submit" disabled={saving}>{saving ? 'Adding…' : 'Add cinema'}</Button>
      </form>
    </Card>
  );
}
