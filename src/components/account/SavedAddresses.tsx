import React, { useEffect, useState } from 'react';
import { MapPin, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { SavedAddress } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';

const emptyAddress = (): SavedAddress => ({
  id: '', label: '', fullName: '', address: '', city: '', state: '', zipCode: '',
});

const SavedAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [draft, setDraft] = useState<SavedAddress>(emptyAddress());
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAddresses = async () => {
      const { data } = await supabase.auth.getUser();
      const metadata = data.user?.user_metadata as Record<string, unknown> | undefined;
      if (Array.isArray(metadata?.saved_addresses)) setAddresses(metadata.saved_addresses as SavedAddress[]);
    };
    loadAddresses();
  }, []);

  const saveAddresses = async (next: SavedAddress[]) => {
    setIsSaving(true);
    setError('');
    try {
      const { error: updateError } = await supabase.auth.updateUser({ data: { saved_addresses: next } });
      if (updateError) throw updateError;
      setAddresses(next);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save your address.');
    } finally {
      setIsSaving(false);
    }
  };

  const addAddress = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.label || !draft.fullName || !draft.address || !draft.city || !draft.state || !draft.zipCode) {
      setError('Complete every address field before saving.');
      return;
    }
    await saveAddresses([...addresses, { ...draft, id: crypto.randomUUID() }]);
    setDraft(emptyAddress());
    setIsAdding(false);
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <MapPin className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Saved Addresses</h2>
        </div>
        {!isAdding && <Button size="sm" variant="outline" onClick={() => setIsAdding(true)}>Add Address</Button>}
      </div>
      {addresses.length === 0 && !isAdding && <p className="text-sm text-gray-600">Save an address to use it faster at checkout.</p>}
      <div className="space-y-3">
        {addresses.map((address) => (
          <div key={address.id} className="border border-gray-200 rounded-md p-3 flex justify-between gap-3">
            <p className="text-sm text-gray-700"><span className="font-medium text-gray-900">{address.label}</span><br />{address.fullName}<br />{address.address}, {address.city}, {address.state} {address.zipCode}</p>
            <button aria-label={`Delete ${address.label} address`} className="text-gray-400 hover:text-red-600" disabled={isSaving} onClick={() => saveAddresses(addresses.filter(item => item.id !== address.id))}><Trash2 className="h-5 w-5" /></button>
          </div>
        ))}
      </div>
      {isAdding && (
        <form onSubmit={addAddress} className="mt-4 border-t pt-4 space-y-3">
          <Input label="Address label" value={draft.label} onChange={e => setDraft({ ...draft, label: e.target.value })} placeholder="Home" fullWidth />
          <Input label="Full name" value={draft.fullName} onChange={e => setDraft({ ...draft, fullName: e.target.value })} fullWidth />
          <Input label="Street address" value={draft.address} onChange={e => setDraft({ ...draft, address: e.target.value })} fullWidth />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input label="City" value={draft.city} onChange={e => setDraft({ ...draft, city: e.target.value })} fullWidth />
            <Input label="State" value={draft.state} onChange={e => setDraft({ ...draft, state: e.target.value })} fullWidth />
            <Input label="ZIP code" value={draft.zipCode} onChange={e => setDraft({ ...draft, zipCode: e.target.value })} fullWidth />
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <div className="flex gap-2"><Button type="submit" isLoading={isSaving}>Save Address</Button><Button type="button" variant="outline" onClick={() => { setIsAdding(false); setError(''); }}>Cancel</Button></div>
        </form>
      )}
    </section>
  );
};

export default SavedAddresses;
