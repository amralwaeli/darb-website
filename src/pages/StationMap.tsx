import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Fuel, Zap, ShoppingBag, Coffee, Navigation } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';

interface Station {
  id: string; name_en: string; name_ar: string; city_en: string; city_ar: string;
  address_en: string; address_ar: string; lat: number; lng: number; services: string[];
}

// Custom marker
const icon = L.divIcon({
  className: '',
  html: `<div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,hsl(22 100% 55%),hsl(38 92% 58%));display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px hsl(22 100% 55% / 0.5);border:2px solid white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M3 22V8a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14"/><path d="M3 22h11"/></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const serviceIcon: Record<string, typeof Fuel> = { fuel: Fuel, ev: Zap, retail: ShoppingBag, cafe: Coffee };

const StationMap = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [city, setCity] = useState('all');
  const [q, setQ] = useState('');
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    supabase.from('stations').select('*').order('name_en').then(({ data }) => {
      setStations((data ?? []) as Station[]);
    });
  }, []);

  const cities_en = useMemo(() => Array.from(new Set(stations.map(s => s.city_en))), [stations]);

  const filtered = useMemo(() => stations.filter(s => {
    const cityMatch = city === 'all' || s.city_en === city;
    const text = `${s.name_en} ${s.name_ar} ${s.city_en} ${s.city_ar}`.toLowerCase();
    const qMatch = !q || text.includes(q.toLowerCase());
    return cityMatch && qMatch;
  }), [city, q, stations]);

  return (
    <div className="container py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <p className="text-primary text-sm uppercase tracking-widest font-semibold mb-3">— {t('nav.map')}</p>
          <h1 className="text-4xl md:text-6xl font-bold">{t('network.title')}</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">{t('network.subtitle')}</p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-bold text-gradient">{filtered.length}</div>
          <div className="text-sm text-muted-foreground">stations shown</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[340px_1fr] gap-6">
        <aside className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search station..." className="pl-9 h-12 bg-card border-border/50" />
          </div>
          <div className="rounded-2xl bg-gradient-card border border-border/50 p-2 max-h-[420px] overflow-y-auto">
            <button onClick={() => setCity('all')} className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${city === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>All cities</button>
            {cities_en.map(c => (
              <button key={c} onClick={() => setCity(c)} className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${city === c ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>{c}</button>
            ))}
          </div>
          <div className="rounded-2xl bg-gradient-card border border-border/50 p-2 max-h-[420px] overflow-y-auto">
            {filtered.map(s => (
              <div key={s.id} className="px-4 py-3 rounded-lg hover:bg-secondary/50 cursor-pointer">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                  <div>
                    <div className="font-medium">{isAr ? s.name_ar : s.name_en}</div>
                    <div className="text-xs text-muted-foreground">{isAr ? s.city_ar : s.city_en}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="rounded-2xl overflow-hidden border border-border/50 h-[600px] lg:h-[720px]">
          <MapContainer center={[24.0, 45.0]} zoom={6} className="h-full w-full" scrollWheelZoom>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filtered.map(s => (
              <Marker key={s.id} position={[s.lat, s.lng]} icon={icon}>
                <Popup>
                  <div className="font-display min-w-[220px]" dir={isAr ? 'rtl' : 'ltr'}>
                    <div className="font-semibold text-base">{isAr ? s.name_ar : s.name_en}</div>
                    <div className="text-sm opacity-70 mb-2">{isAr ? s.city_ar : s.city_en}</div>
                    <div className="flex items-start gap-1.5 text-sm leading-snug border-t pt-2 mt-1">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                      <span>{isAr ? s.address_ar : s.address_en}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {s.services.map(sv => {
                        const Icon = serviceIcon[sv] || Fuel;
                        return <Icon key={sv} className="h-4 w-4" />;
                      })}
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      {isAr ? 'الاتجاهات' : 'Get directions'}
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default StationMap;
