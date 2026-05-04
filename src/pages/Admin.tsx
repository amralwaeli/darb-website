import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Plus, Trash2, LogOut, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const SERVICES = ['fuel', 'ev', 'retail', 'cafe'] as const;

const schema = z.object({
  name_en: z.string().trim().min(2).max(120),
  name_ar: z.string().trim().min(2).max(120),
  city_en: z.string().trim().min(2).max(80),
  city_ar: z.string().trim().min(2).max(80),
  address_en: z.string().trim().min(5).max(300),
  address_ar: z.string().trim().min(5).max(300),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

interface Row {
  id: string; name_en: string; name_ar: string; city_en: string; city_ar: string;
  address_en: string; address_ar: string; lat: number; lng: number; services: string[];
}

const Admin = () => {
  const nav = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name_en: '', name_ar: '', city_en: '', city_ar: '', address_en: '', address_ar: '', lat: '', lng: '' });
  const [services, setServices] = useState<string[]>(['fuel']);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) nav('/admin/login', { replace: true });
  }, [user, isAdmin, loading, nav]);

  const load = async () => {
    const { data, error } = await supabase.from('stations').select('*').order('created_at', { ascending: false });
    if (error) { toast.error(error.message); return; }
    setRows((data ?? []) as Row[]);
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const toggleService = (s: string) => {
    setServices((prev) => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      ...form,
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
    });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    if (services.length === 0) { toast.error('Pick at least one service'); return; }
    setBusy(true);
    const { error } = await supabase.from('stations').insert({ ...parsed.data, services });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Station added');
    setForm({ name_en: '', name_ar: '', city_en: '', city_ar: '', address_en: '', address_ar: '', lat: '', lng: '' });
    setServices(['fuel']);
    load();
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this station?')) return;
    const { error } = await supabase.from('stations').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted');
    load();
  };

  if (loading || !isAdmin) return <div className="container py-20 text-center text-muted-foreground">Loading…</div>;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="container py-12 md:py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-primary text-sm uppercase tracking-widest font-semibold mb-2">— Admin</p>
          <h1 className="text-4xl md:text-5xl font-bold">Manage stations</h1>
        </div>
        <Button variant="outline" onClick={async () => { await signOut(); nav('/'); }} className="gap-2">
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
        <form onSubmit={onSubmit} className="rounded-2xl bg-gradient-card border border-border/50 p-6 space-y-4 h-fit">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Plus className="h-4 w-4 text-primary" /> Add new station</h2>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Name (EN)</Label><Input value={form.name_en} onChange={set('name_en')} required className="mt-1" /></div>
            <div><Label>Name (AR)</Label><Input value={form.name_ar} onChange={set('name_ar')} required className="mt-1" dir="rtl" /></div>
            <div><Label>City (EN)</Label><Input value={form.city_en} onChange={set('city_en')} required className="mt-1" /></div>
            <div><Label>City (AR)</Label><Input value={form.city_ar} onChange={set('city_ar')} required className="mt-1" dir="rtl" /></div>
          </div>
          <div><Label>Address (EN)</Label><Input value={form.address_en} onChange={set('address_en')} required className="mt-1" /></div>
          <div><Label>Address (AR)</Label><Input value={form.address_ar} onChange={set('address_ar')} required className="mt-1" dir="rtl" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Latitude</Label><Input type="number" step="any" value={form.lat} onChange={set('lat')} required className="mt-1" /></div>
            <div><Label>Longitude</Label><Input type="number" step="any" value={form.lng} onChange={set('lng')} required className="mt-1" /></div>
          </div>
          <div>
            <Label className="block mb-2">Services</Label>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <button type="button" key={s} onClick={() => toggleService(s)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${services.includes(s) ? 'bg-primary text-primary-foreground border-primary' : 'border-border/60 hover:bg-secondary'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={busy} className="w-full h-11 bg-gradient-ignition text-primary-foreground shadow-glow">
            {busy ? 'Saving…' : 'Add station'}
          </Button>
        </form>

        <div className="rounded-2xl bg-gradient-card border border-border/50 p-3 max-h-[700px] overflow-y-auto">
          <div className="px-3 py-2 text-sm text-muted-foreground">{rows.length} station(s)</div>
          {rows.map((r) => (
            <div key={r.id} className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-secondary/40 group">
              <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{r.name_en}</div>
                <div className="text-xs text-muted-foreground truncate">{r.city_en} · {r.address_en}</div>
                <div className="text-[11px] text-muted-foreground/70 mt-0.5">{r.lat.toFixed(4)}, {r.lng.toFixed(4)} · {r.services.join(', ')}</div>
              </div>
              <button onClick={() => onDelete(r.id)} className="opacity-0 group-hover:opacity-100 text-destructive p-1.5 hover:bg-destructive/10 rounded transition-all">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
