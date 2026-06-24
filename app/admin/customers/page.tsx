'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/db/supabase';
import { Profile } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Search, Mail, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [filtered, setFiltered] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setCustomers(data || []);
        setFiltered(data || []);
      } catch {
        toast({ title: 'Error loading customers', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [toast]);

  useEffect(() => {
    if (search) {
      setFiltered(customers.filter((c) => (c.full_name || '').toLowerCase().includes(search.toLowerCase())));
    } else {
      setFiltered(customers);
    }
  }, [search, customers]);

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-6">Customers</h1>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((customer) => (
                    <tr key={customer.id} className="border-b last:border-0 hover:bg-accent/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-sm font-bold">
                            {customer.full_name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-medium">{customer.full_name || 'Unnamed'}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {customer.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          customer.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {customer.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(customer.created_at).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
