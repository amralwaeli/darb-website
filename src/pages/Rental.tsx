import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import heroBg from '@/assets/hero-station.jpg';

const svgLogo = (svg: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const STATIC_LOGOS = [
  svgLogo(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160"><rect width="320" height="160" rx="24" fill="#fff"/><path d="M73 36 86 67l34 3-26 22 8 33-29-17-29 17 8-33-26-22 34-3Z" fill="#ffc928"/><path d="M54 85c24 23 59 23 84 0" fill="none" stroke="#ff6b00" stroke-width="10" stroke-linecap="round"/><path d="M167 52h18v60h-18zM199 52h18v60h-18zM231 52h18v60h-18z" fill="#111827"/></svg>`),
  svgLogo(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160"><rect width="320" height="160" rx="24" fill="#fff"/><path d="M70 45v70M70 115h72c31 0 51-17 51-35s-20-35-51-35H70" fill="none" stroke="#111827" stroke-width="10" stroke-linecap="round"/><circle cx="224" cy="82" r="33" fill="none" stroke="#111827" stroke-width="10"/><path d="M262 50v65" stroke="#111827" stroke-width="10" stroke-linecap="round"/></svg>`),
  svgLogo(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160"><rect width="320" height="160" rx="24" fill="#fff"/><path d="M52 35h95l-14 90H66Z" fill="#b5122b"/><circle cx="99" cy="73" r="31" fill="#fff"/><path d="M72 77c20-25 46-25 59 0M89 57h20M82 89h33" fill="none" stroke="#111827" stroke-width="6" stroke-linecap="round"/><text x="168" y="96" font-family="Arial Black, Arial, sans-serif" font-size="46" font-weight="900" fill="#b5122b">KFC</text></svg>`),
  svgLogo(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160"><rect width="320" height="160" rx="24" fill="#72cdd1"/><text x="45" y="100" font-family="Arial Black, Arial, sans-serif" font-size="48" font-weight="900" fill="#fff">zeeka</text><circle cx="251" cy="93" r="8" fill="#ff4b4b"/></svg>`),
  svgLogo(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160"><rect width="320" height="160" rx="24" fill="#fff"/><text x="54" y="93" font-family="Arial Black, Arial, sans-serif" font-size="40" font-weight="900" fill="#078047">barns</text><circle cx="226" cy="80" r="42" fill="#078047"/><path d="M204 74h37v22c0 10-8 18-18 18h-1c-10 0-18-8-18-18Z" fill="none" stroke="#fff" stroke-width="6"/><path d="M241 80h11c0 13-8 20-18 20M208 64h28" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>`),
  svgLogo(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160"><rect width="320" height="160" rx="24" fill="#fff"/><g transform="translate(88 28) rotate(45 52 52)"><rect x="0" y="0" width="104" height="104" rx="18" fill="#0b76bd"/><path d="M52 0v104M0 52h104" stroke="#fff" stroke-width="8"/><circle cx="27" cy="27" r="9" fill="#fff"/><circle cx="77" cy="27" r="9" fill="#fff"/><circle cx="52" cy="77" r="9" fill="#fff"/></g></svg>`),
];

// ─── Hardcoded Partner logos ──────────────────────────────────────────────────
const STATIC_PARTNERS = [
  {
    name: "McDonald's",
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/200px-McDonald%27s_Golden_Arches.svg.png',
  },
  {
    name: 'FireGrill',
    logo: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/fire-grill-restaurant-logo-design-template-59e2e08e93ca6e0c8b91e5a8e04a5e8a_screen.jpg?ts=1698038804',
    fallbackText: 'FireGrill',
  },
  {
    name: 'KUDU',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Kudu_restaurant_logo.svg/200px-Kudu_restaurant_logo.svg.png',
    fallbackText: 'كودو',
  },
  {
    name: "Domino's Pizza",
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Domino%27s_pizza_logo.svg/200px-Domino%27s_pizza_logo.svg.png',
  },
  {
    name: 'JOINT',
    logo: null,
    fallbackText: 'JOINT',
    isText: true,
  },
  {
    name: 'Al-Tazaj',
    logo: 'https://upload.wikimedia.org/wikipedia/ar/thumb/9/9a/Al_Tazaj_Logo.png/200px-Al_Tazaj_Logo.png',
    fallbackText: 'الطازج',
  },
];

// ─── Zod schema ───────────────────────────────────────────────────────────────
const schema = z.object({
  name:       z.string().trim().min(2, 'required').max(100),
  phone:      z.string().trim().min(8, 'required').max(20),
  city:       z.string().trim().min(1, 'required').max(100),
  type:       z.string().min(1, 'required'),
  branches:   z.string().trim().min(1, 'required').max(20),
  brand:      z.string().trim().min(1, 'required').max(100),
});
type FormData = z.infer<typeof schema>;

interface Partner {
  name: string;
  logo: string | null;
}

// ─── Logo card ────────────────────────────────────────────────────────────────
const PartnerCard = ({ partner }: { partner: Partner }) => {
  const [imgError, setImgError] = useState(false);
  if (!partner.logo || imgError) return null;

  return (
    <div className="bg-white rounded-[18px] p-4 flex items-center justify-center h-20 w-40 md:h-24 md:w-48 shadow-md flex-shrink-0">
      <img
        src={partner.logo}
        alt={partner.name}
        className="h-full w-full object-contain"
        onError={() => setImgError(true)}
      />
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const Rental = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [done, setDone] = useState(false);
  const [dbPartners, setDbPartners] = useState<Partner[]>([]);

  // Fetch partners added by Admin
  useEffect(() => {
    const fetchPartners = async () => {
      const { data, error } = await supabase.from('partners').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setDbPartners(data.map(p => ({ name: p.name, logo: p.logo_url })));
      }
    };
    fetchPartners();
  }, []);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await new Promise(r => setTimeout(r, 700));
    console.log('Rental request:', data);
    toast.success(t('rental.form.success'));
    setDone(true);
  };

  const businessTypes = ['shop', 'kiosk', 'driveThru', 'supermarket'] as const;
  
  // Combine static and DB partners
  const staticPartners = STATIC_PARTNERS.map((partner, index) => ({
    name: partner.name,
    logo: STATIC_LOGOS[index] ?? partner.logo,
  }));
  const combinedPartners = [...staticPartners, ...dbPartners].filter((partner): partner is Partner => Boolean(partner.logo));
  const minimumLogoCount = 12;
  const trackPartners = Array.from({
    length: Math.max(1, Math.ceil(minimumLogoCount / Math.max(combinedPartners.length, 1))),
  }).flatMap(() => combinedPartners);

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />

      {/* Infinite Marquee Styles */}
      <style>{`
        @keyframes scroll-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333333%); }
        }
        .animate-marquee {
          animation: scroll-marquee 42s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative z-10 container py-20 md:py-28 flex flex-col items-center gap-14">

        <div className="text-center">
          <p className="text-primary text-sm uppercase tracking-widest font-semibold mb-3">
            — {t('nav.rental')}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight">
            {t('rental.headline')}
          </h1>
        </div>

        {/* ── Infinite Partner logos strip ── */}
        <div className="w-full max-w-[100vw] overflow-hidden relative">
          {/* Fade gradient edges for cleaner look */}
          <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-black/50 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-black/50 to-transparent z-10 pointer-events-none" />

          <div className="flex w-max animate-marquee" dir="ltr" aria-label="Rental partners">
            {[0, 1, 2].map((track) => (
              <div key={track} className="flex shrink-0 gap-6 pr-6" aria-hidden={track !== 0}>
                {trackPartners.map((p, idx) => (
                  <PartnerCard key={`${track}-${p.name}-${idx}`} partner={p} />
                ))}
              </div>
            ))}
          </div>
        </div>

        <p className="text-foreground/80 text-base md:text-lg text-center max-w-xl -mt-6">
          {t('rental.subheading')}
        </p>

        {/* ── Form card ── */}
        <div
          className="w-full max-w-3xl rounded-3xl border border-border/50 p-8 md:p-10 shadow-elegant"
          style={{ background: 'hsl(222 30% 9% / 0.90)' }}
        >
          {done ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-2">{t('rental.form.successTitle')}</h3>
              <p className="text-muted-foreground">{t('rental.form.success')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">{t('rental.form.name')}</Label>
                  <Input {...register('name')} placeholder={t('rental.form.name')} className="h-12 bg-input/50 border-border/50" />
                  {errors.name && <p className="text-destructive text-xs mt-1">{t('rental.form.required')}</p>}
                </div>
                <div>
                  <Label className="mb-2 block">{t('rental.form.phone')}</Label>
                  <Input {...register('phone')} placeholder={t('rental.form.phone')} className="h-12 bg-input/50 border-border/50" />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{t('rental.form.required')}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">{t('rental.form.city')}</Label>
                  <Input {...register('city')} placeholder={t('rental.form.city')} className="h-12 bg-input/50 border-border/50" />
                  {errors.city && <p className="text-destructive text-xs mt-1">{t('rental.form.required')}</p>}
                </div>
                <div>
                  <Label className="mb-2 block">{t('rental.form.type')}</Label>
                  <Select value={watch('type')} onValueChange={v => setValue('type', v, { shouldValidate: true })}>
                    <SelectTrigger className="h-12 bg-input/50 border-border/50"><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>
                      {businessTypes.map(bt => <SelectItem key={bt} value={bt}>{t(`rental.types.${bt}`)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-destructive text-xs mt-1">{t('rental.form.required')}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">{t('rental.form.branches')}</Label>
                  <Input {...register('branches')} placeholder={t('rental.form.branches')} className="h-12 bg-input/50 border-border/50" />
                  {errors.branches && <p className="text-destructive text-xs mt-1">{t('rental.form.required')}</p>}
                </div>
                <div>
                  <Label className="mb-2 block">{t('rental.form.brand')}</Label>
                  <Input {...register('brand')} placeholder={t('rental.form.brand')} className="h-12 bg-input/50 border-border/50" />
                  {errors.brand && <p className="text-destructive text-xs mt-1">{t('rental.form.required')}</p>}
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} size="lg" className="w-full h-14 bg-gradient-ignition text-primary-foreground shadow-glow hover:opacity-90 text-base font-semibold">
                {isSubmitting ? '...' : <>{t('rental.form.send')}<Send className={`h-5 w-5 ${isRtl ? 'mr-2' : 'ml-2'}`} /></>}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rental;
