'use client';

import { useState, useEffect } from 'react';
import { User, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/db/supabase';
import { Profile } from '@/types';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setProfile(data);
          setFullName(data.full_name || '');
          setPhone(data.phone || '');
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ full_name: fullName, phone }).eq('id', profile?.id);
    setSaving(false);
    if (error) {
      toast({ title: 'Error saving profile', variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated' });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <div className="rounded-xl border bg-card p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-2xl font-bold relative">
              {profile?.full_name?.charAt(0) || 'U'}
              <button className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div>
              <h2 className="font-bold text-lg">{profile?.full_name || 'User'}</h2>
              <p className="text-sm text-muted-foreground">Member since {new Date(profile?.created_at || '').toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
