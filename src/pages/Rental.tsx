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

// ─── Logo card ────────────────────────────────────────────────────────────────
const PartnerCard = ({ partner }: { partner: any }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-3 flex items-center justify-center h-20 w-36 shadow-md flex-shrink-0">
      {partner.logo && !imgError ? (
        <img
          src={partner.logo}
          alt={partner.name}
          className="max-h-12 max-w-full object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-gray-800 font-bold text-sm text-center leading-tight px-1">
          {partner.fallbackText ?? partner.name}
        </span>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const Rental = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [done, setDone] = useState(false);
  const [dbPartners, setDbPartners] = useState<any[]>([]);

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
  const combinedPartners = [...STATIC_PARTNERS, ...dbPartners];

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
          100% { transform: translateX(calc(-50% - 0.5rem)); }
        }
        .animate-marquee {
          animation: scroll-marquee 40s linear infinite;
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

          <div className="flex w-max animate-marquee gap-4" dir="ltr">
            {/* Render two identical sets to create the seamless infinite loop effect */}
            {[...combinedPartners, ...combinedPartners].map((p, idx) => (
              <PartnerCard key={idx} partner={p} />
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