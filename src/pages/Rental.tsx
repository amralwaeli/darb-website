import { useState } from 'react';
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
import heroBg from '@/assets/hero-station.jpg';

// ─── Partner logos ────────────────────────────────────────────────────────────
// Using publicly accessible CDN URLs for well-known brand logos
const PARTNERS = [
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
const PartnerCard = ({ partner }: { partner: typeof PARTNERS[number] }) => {
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await new Promise(r => setTimeout(r, 700));
    console.log('Rental request:', data);
    toast.success(t('rental.form.success'));
    setDone(true);
  };

  const businessTypes = ['shop', 'kiosk', 'driveThru', 'supermarket'] as const;

  return (
    /* ── full-page hero wrapper ── */
    <div
      className="relative min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />

      <div className="relative z-10 container py-20 md:py-28 flex flex-col items-center gap-14">

        {/* ── Headline ── */}
        <div className="text-center">
          <p className="text-primary text-sm uppercase tracking-widest font-semibold mb-3">
            — {t('nav.rental')}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight">
            {t('rental.headline')}
          </h1>
        </div>

        {/* ── Partner logos strip ── */}
        <div className="w-full max-w-5xl">
          <div
            className="flex flex-wrap justify-center gap-4"
            dir="ltr"   /* logos row always LTR regardless of locale */
          >
            {PARTNERS.map(p => (
              <PartnerCard key={p.name} partner={p} />
            ))}
          </div>
        </div>

        {/* ── Sub-heading ── */}
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
              {/* Row 1 – Name & Phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">{t('rental.form.name')}</Label>
                  <Input
                    {...register('name')}
                    placeholder={t('rental.form.name')}
                    className="h-12 bg-input/50 border-border/50"
                  />
                  {errors.name && (
                    <p className="text-destructive text-xs mt-1">{t('rental.form.required')}</p>
                  )}
                </div>
                <div>
                  <Label className="mb-2 block">{t('rental.form.phone')}</Label>
                  <Input
                    {...register('phone')}
                    placeholder={t('rental.form.phone')}
                    className="h-12 bg-input/50 border-border/50"
                  />
                  {errors.phone && (
                    <p className="text-destructive text-xs mt-1">{t('rental.form.required')}</p>
                  )}
                </div>
              </div>

              {/* Row 2 – City & Business Type */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">{t('rental.form.city')}</Label>
                  <Input
                    {...register('city')}
                    placeholder={t('rental.form.city')}
                    className="h-12 bg-input/50 border-border/50"
                  />
                  {errors.city && (
                    <p className="text-destructive text-xs mt-1">{t('rental.form.required')}</p>
                  )}
                </div>
                <div>
                  <Label className="mb-2 block">{t('rental.form.type')}</Label>
                  <Select
                    value={watch('type')}
                    onValueChange={v => setValue('type', v, { shouldValidate: true })}
                  >
                    <SelectTrigger className="h-12 bg-input/50 border-border/50">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map(bt => (
                        <SelectItem key={bt} value={bt}>
                          {t(`rental.types.${bt}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-destructive text-xs mt-1">{t('rental.form.required')}</p>
                  )}
                </div>
              </div>

              {/* Row 3 – Branches & Brand */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">{t('rental.form.branches')}</Label>
                  <Input
                    {...register('branches')}
                    placeholder={t('rental.form.branches')}
                    className="h-12 bg-input/50 border-border/50"
                  />
                  {errors.branches && (
                    <p className="text-destructive text-xs mt-1">{t('rental.form.required')}</p>
                  )}
                </div>
                <div>
                  <Label className="mb-2 block">{t('rental.form.brand')}</Label>
                  <Input
                    {...register('brand')}
                    placeholder={t('rental.form.brand')}
                    className="h-12 bg-input/50 border-border/50"
                  />
                  {errors.brand && (
                    <p className="text-destructive text-xs mt-1">{t('rental.form.required')}</p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full h-14 bg-gradient-ignition text-primary-foreground shadow-glow hover:opacity-90 text-base font-semibold"
              >
                {isSubmitting ? (
                  '...'
                ) : (
                  <>
                    {t('rental.form.send')}
                    <Send className={`h-5 w-5 ${isRtl ? 'mr-2' : 'ml-2'}`} />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rental;