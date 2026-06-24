'use client';

import { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Address } from '@/types';
import { getAddresses, addAddress, deleteAddress, updateAddress } from '@/lib/db/orders';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch {
      toast({ title: 'Error loading addresses', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAddress({ ...form, is_default: false });
      setShowForm(false);
      setForm({ full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: 'US' });
      await loadAddresses();
      toast({ title: 'Address added' });
    } catch {
      toast({ title: 'Error adding address', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id);
      setAddresses(addresses.filter((a) => a.id !== id));
      toast({ title: 'Address removed' });
    } catch {
      toast({ title: 'Error removing address', variant: 'destructive' });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await updateAddress(id, { is_default: true });
      setAddresses(addresses.map((a) => ({ ...a, is_default: a.id === id })));
      toast({ title: 'Default address updated' });
    } catch {
      toast({ title: 'Error updating address', variant: 'destructive' });
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Addresses</h1>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="gap-1">
            <Plus className="w-4 h-4" /> Add Address
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleSubmit}
              className="rounded-xl border bg-card p-6 mb-6 space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address_line1">Address Line 1</Label>
                  <Input id="address_line1" value={form.address_line1} onChange={(e) => setForm({ ...form, address_line1: e.target.value })} required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address_line2">Address Line 2</Label>
                  <Input id="address_line2" value={form.address_line2} onChange={(e) => setForm({ ...form, address_line2: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input id="postal_code" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Save Address</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-24">
            <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No addresses saved.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="rounded-xl border bg-card p-4 relative">
                {addr.is_default && (
                  <span className="absolute top-2 right-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Default
                  </span>
                )}
                <div className="font-medium">{addr.full_name}</div>
                <div className="text-sm text-muted-foreground mt-1">{addr.address_line1}</div>
                {addr.address_line2 && <div className="text-sm text-muted-foreground">{addr.address_line2}</div>}
                <div className="text-sm text-muted-foreground">
                  {addr.city}, {addr.state} {addr.postal_code}
                </div>
                <div className="text-sm text-muted-foreground">{addr.country}</div>
                {addr.phone && <div className="text-sm text-muted-foreground mt-1">{addr.phone}</div>}
                <div className="flex gap-2 mt-3">
                  {!addr.is_default && (
                    <Button size="sm" variant="outline" onClick={() => handleSetDefault(addr.id)}>
                      Set Default
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleDelete(addr.id)} className="text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
