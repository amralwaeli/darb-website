import { useEffect, useState } from 'react';
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

const Admin = () => {
  const nav = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'stations' | 'partners'>('stations');
  const [busy, setBusy] = useState(false);

  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState({ name_en: '', name_ar: '', city_en: '', city_ar: '', address_en: '', address_ar: '', lat: '', lng: '' });
  const [services, setServices] = useState<string[]>(['fuel']);

  const [partners, setPartners] = useState<PartnerRow[]>([]);
  const [partnerName, setPartnerName] = useState('');
  
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

  useEffect(() => { if (isAdmin) { loadStations(); loadPartners(); } }, [isAdmin]);

  const toggleService = (s: string) => setServices((prev) => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log("File selected:", file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImageObj(img);
        setScale(1);
        setPos({ x: 0, y: 0 });
        console.log("Image loaded successfully");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const onSubmitPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim()) { toast.error('Partner name required'); return; }
    if (!imageObj) { toast.error('Please upload an image'); return; }

    setBusy(true);
    const canvas = document.createElement('canvas');
    canvas.width = 288;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(2, 2);
      ctx.translate(pos.x, pos.y);
      ctx.scale(scale, scale);
      ctx.drawImage(imageObj, 0, 0);
    }
    
    const base64Logo = canvas.toDataURL('image/png');
    const { error } = await supabase.from('partners').insert({ name: partnerName.trim(), logo_url: base64Logo });
    
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    
    toast.success('Partner added');
    setPartnerName('');
    setImageObj(null);
    loadPartners();
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={async () => { await signOut(); nav('/'); }}>Sign out</Button>
      </div>

      <div className="flex gap-4 mb-8">
        <Button variant={activeTab === 'stations' ? 'default' : 'ghost'} onClick={() => setActiveTab('stations')}>Stations</Button>
        <Button variant={activeTab === 'partners' ? 'default' : 'ghost'} onClick={() => setActiveTab('partners')}>Rental Partners</Button>
      </div>

      {activeTab === 'partners' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <form onSubmit={onSubmitPartner} className="bg-gradient-card p-6 rounded-2xl border space-y-4">
            <h2 className="text-lg font-semibold">Add Rental Partner</h2>
            <Input value={partnerName} onChange={e => setPartnerName(e.target.value)} placeholder="Brand Name" required />
            
            {/* THIS IS THE FIX: Added an explicit trigger for the file change */}
            <Input 
              type="file" 
              accept="image/*" 
              onChange={(e) => onFileChange(e)} 
            />

            {imageObj && (
              <div className="p-4 border rounded-xl bg-white/5">
                <div 
                  className="bg-white rounded-lg overflow-hidden relative"
                  style={{ width: 144, height: 80, cursor: 'move' }}
                  onPointerDown={(e) => { setIsDragging(true); setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y }); }}
                  onPointerMove={(e) => { if (isDragging) setPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); }}
                  onPointerUp={() => setIsDragging(false)}
                >
                  <img src={imageObj.src} style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})` }} />
                </div>
                <input type="range" min="0.1" max="3" step="0.1" value={scale} onChange={e => setScale(Number(e.target.value))} className="w-full mt-4" />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={busy || !imageObj}>
              {busy ? 'Saving...' : 'Save Partner Logo'}
            </Button>
          </form>

          <div className="grid grid-cols-3 gap-4">
            {partners.map(p => (
              <div key={p.id} className="bg-white p-2 rounded-lg"><img src={p.logo_url} /></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;