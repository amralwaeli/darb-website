import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Plus, Trash2, LogOut, MapPin, Building2, ImageIcon } from 'lucide-react';
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

interface PartnerRow {
  id: string; name: string; logo_url: string;
}

interface SelectedLogo {
  name: string;
  src: string;
  isSvg: boolean;
}

const Admin = () => {
  const nav = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'stations' | 'partners'>('stations');
  const [busy, setBusy] = useState(false);

  // Stations State
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState({ name_en: '', name_ar: '', city_en: '', city_ar: '', address_en: '', address_ar: '', lat: '', lng: '' });
  const [services, setServices] = useState<string[]>(['fuel']);

  // Partners State
  const [partners, setPartners] = useState<PartnerRow[]>([]);
  const [partnerName, setPartnerName] = useState('');
  const [selectedLogo, setSelectedLogo] = useState<SelectedLogo | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  // Cropper State
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) nav('/admin/login', { replace: true });
  }, [user, isAdmin, loading, nav]);

  const loadStations = async () => {
    const { data, error } = await supabase.from('stations').select('*').order('created_at', { ascending: false });
    if (error) { toast.error(error.message); return; }
    setRows((data ?? []) as Row[]);
  };

  const loadPartners = async () => {
    const { data, error } = await supabase.from('partners').select('*').order('created_at', { ascending: false });
    if (error) { toast.error(error.message); return; }
    setPartners((data ?? []) as PartnerRow[]);
  };

  useEffect(() => { 
    if (isAdmin) {
      loadStations();
      loadPartners();
    }
  }, [isAdmin]);

  // ─── Stations Handlers ───
  const toggleService = (s: string) => setServices((prev) => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const onSubmitStation = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ ...form, lat: parseFloat(form.lat), lng: parseFloat(form.lng) });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    if (services.length === 0) { toast.error('Pick at least one service'); return; }
    
    setBusy(true);
    const { error } = await supabase.from('stations').insert({ ...parsed.data, services });
    setBusy(false);
    
    if (error) { toast.error(error.message); return; }
    toast.success('Station added');
    setForm({ name_en: '', name_ar: '', city_en: '', city_ar: '', address_en: '', address_ar: '', lat: '', lng: '' });
    setServices(['fuel']);
    loadStations();
  };

  const onDeleteStation = async (id: string) => {
    if (!confirm('Delete this station?')) return;
    const { error } = await supabase.from('stations').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted');
    loadStations();
  };

  // ─── Partners/Cropper Handlers ───
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedLogo(null);
    setImageObj(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result;
      if (typeof src !== 'string') {
        toast.error('Could not read the selected file');
        return;
      }

      const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
      setSelectedLogo({ name: file.name, src, isSvg });
      setScale(1);
      setPos({ x: 0, y: 0 });

      if (isSvg) return;

      const img = new Image();
      img.onload = () => {
        setImageObj(img);
      };
      img.onerror = () => {
        setSelectedLogo(null);
        toast.error('Could not load the selected image');
      };
      img.src = src;
    };
    reader.onerror = () => {
      setSelectedLogo(null);
      setImageObj(null);
      toast.error('Could not read the selected file');
    };
    reader.readAsDataURL(file);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const onSubmitPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim()) { toast.error('Partner name required'); return; }
    if (!selectedLogo) { toast.error('Please upload an image'); return; }
    if (!selectedLogo.isSvg && !imageObj) { toast.error('Image is still loading'); return; }

    setBusy(true);

    let logoUrl = selectedLogo.src;

    if (!selectedLogo.isSvg && imageObj) {
      // Create an exact fixed-dimension canvas (288x160 for high quality 144x80 box)
      const canvas = document.createElement('canvas');
      canvas.width = 288;
      canvas.height = 160;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Scale up by 2 to match retina canvas sizes
        ctx.scale(2, 2);
        ctx.translate(pos.x, pos.y);
        ctx.scale(scale, scale);
        ctx.drawImage(imageObj, 0, 0);
      }
      
      // Export normalized rasterized image
      logoUrl = canvas.toDataURL('image/png');
    }

    const { error } = await supabase.from('partners').insert({ name: partnerName.trim(), logo_url: logoUrl });
    setBusy(false);

    if (error) { toast.error(error.message); return; }
    
    toast.success('Partner added');
    setPartnerName('');
    setSelectedLogo(null);
    setImageObj(null);
    if (logoInputRef.current) logoInputRef.current.value = '';
    loadPartners();
  };

  const onDeletePartner = async (id: string) => {
    if (!confirm('Delete this partner logo?')) return;
    const { error } = await supabase.from('partners').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Partner deleted');
    loadPartners();
  };


  if (loading || !isAdmin) return <div className="container py-20 text-center text-muted-foreground">Loading…</div>;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="container py-12 md:py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <p className="text-primary text-sm uppercase tracking-widest font-semibold mb-2">— Admin</p>
          <h1 className="text-4xl md:text-5xl font-bold">Dashboard</h1>
        </div>
        <Button variant="outline" onClick={async () => { await signOut(); nav('/'); }} className="gap-2 shrink-0">
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-border/50 pb-px">
        <button 
          onClick={() => setActiveTab('stations')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors ${activeTab === 'stations' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <MapPin className="h-4 w-4" /> Stations
        </button>
        <button 
          onClick={() => setActiveTab('partners')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors ${activeTab === 'partners' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <Building2 className="h-4 w-4" /> Rental Partners
        </button>
      </div>

      {/* ─── STATIONS TAB ─── */}
      {activeTab === 'stations' && (
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
          <form onSubmit={onSubmitStation} className="rounded-2xl bg-gradient-card border border-border/50 p-6 space-y-4 h-fit">
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
                <button onClick={() => onDeleteStation(r.id)} className="opacity-0 group-hover:opacity-100 text-destructive p-1.5 hover:bg-destructive/10 rounded transition-all">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── PARTNERS TAB ─── */}
      {activeTab === 'partners' && (
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
          <form onSubmit={onSubmitPartner} className="rounded-2xl bg-gradient-card border border-border/50 p-6 space-y-5 h-fit">
            <h2 className="text-lg font-semibold flex items-center gap-2"><ImageIcon className="h-4 w-4 text-primary" /> Add Rental Partner</h2>
            
            <div>
              <Label>Brand Name</Label>
              <Input value={partnerName} onChange={e => setPartnerName(e.target.value)} required className="mt-1" placeholder="e.g. Starbucks" />
            </div>

            <div>
              <Label>Logo Image (SVG, PNG, JPG)</Label>
              <Input ref={logoInputRef} type="file" accept="image/*,.svg" onChange={onFileChange} className="mt-1" />
            </div>

            {selectedLogo && (
              <div className="bg-background/50 border border-border/50 rounded-xl p-4 mt-2">
                <Label className="mb-2 block text-xs text-muted-foreground">
                  {selectedLogo.isSvg ? selectedLogo.name : 'Adjust Logo'}
                </Label>
                <div className="flex flex-col items-center gap-4">
                  
                  {/* Fixed Dimension Preview Box (144x80 matches w-36 h-20 exactly) */}
                  <div 
                    className="bg-white rounded-xl shadow-inner relative overflow-hidden"
                    style={{ width: 144, height: 80, cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                  >
                    <img 
                      src={selectedLogo.src} 
                      alt="preview"
                      style={{
                        position: 'absolute',
                        transformOrigin: '0 0',
                        transform: selectedLogo.isSvg ? 'none' : `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                        pointerEvents: 'none',
                        maxWidth: selectedLogo.isSvg ? '100%' : 'none',
                        maxHeight: selectedLogo.isSvg ? '100%' : 'none',
                        width: selectedLogo.isSvg ? '100%' : undefined,
                        height: selectedLogo.isSvg ? '100%' : undefined,
                        objectFit: selectedLogo.isSvg ? 'contain' : undefined,
                      }}
                    />
                  </div>

                  {!selectedLogo.isSvg && (
                    <div className="w-full flex items-center gap-3">
                      <span className="text-xs">Zoom</span>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="3" 
                        step="0.02" 
                        value={scale} 
                        onChange={e => setScale(Number(e.target.value))}
                        className="flex-1 accent-primary" 
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <Button 
                type="submit" 
                disabled={busy} 
                className="w-full h-11 bg-gradient-ignition text-primary-foreground shadow-glow"
              >
                {busy ? 'Saving…' : 'Save Partner Logo'}
              </Button>
          </form>

          <div className="rounded-2xl bg-gradient-card border border-border/50 p-3 max-h-[700px] overflow-y-auto">
            <div className="px-3 py-2 text-sm text-muted-foreground">{partners.length} Custom Partner(s)</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-2">
              {partners.map((p) => (
                <div key={p.id} className="relative group rounded-xl border border-border/40 bg-white flex items-center justify-center p-2 h-20">
                  <img src={p.logo_url} alt={p.name} className="max-h-full max-w-full object-contain" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <button onClick={() => onDeletePartner(p.id)} className="text-white hover:text-red-400 p-2">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
