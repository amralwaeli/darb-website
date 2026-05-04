import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().min(8, 'Phone is required').max(20),
  type: z.string().min(1, 'Select investor type'),
  city: z.string().trim().max(100).optional(),
  message: z.string().trim().max(1000).optional(),
});
type FormData = z.infer<typeof schema>;

const Investment = () => {
  const { t } = useTranslation();
  const [done, setDone] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await new Promise(r => setTimeout(r, 700));
    console.log('Investment lead:', data);
    toast.success(t('invest.form.success'));
    setDone(true);
  };

  const types = ['franchise', 'station', 'land', 'broker', 'investor'] as const;

  return (
    <div className="container py-20 md:py-28 grid lg:grid-cols-2 gap-16 items-start">
      <div>
        <p className="text-primary text-sm uppercase tracking-widest font-semibold mb-3">— {t('nav.investment')}</p>
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05]">{t('invest.title')}</h1>
        <p className="mt-6 text-lg text-muted-foreground">{t('invest.subtitle')}</p>

        <div className="mt-10 space-y-4">
          {[
            { k: 'SAR 250K+', v: 'Franchise opportunities starting from' },
            { k: '7 years', v: 'Standard lease terms with renewal options' },
            { k: '53 sites', v: 'Active national footprint, expanding fast' },
          ].map(x => (
            <div key={x.k} className="flex items-center gap-5 p-5 rounded-2xl bg-gradient-card border border-border/50">
              <Sparkles className="h-6 w-6 text-primary shrink-0" />
              <div>
                <div className="text-2xl font-bold text-gradient">{x.k}</div>
                <div className="text-sm text-muted-foreground">{x.v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-card border border-border/50 p-8 md:p-10 shadow-elegant">
        {done ? (
          <div className="text-center py-12">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-2">Application received</h3>
            <p className="text-muted-foreground">{t('invest.form.success')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">{t('invest.form.name')}</Label>
                <Input {...register('name')} className="h-12 bg-input/50 border-border/50" />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label className="mb-2 block">{t('invest.form.phone')}</Label>
                <Input {...register('phone')} className="h-12 bg-input/50 border-border/50" />
                {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">{t('invest.form.email')}</Label>
              <Input type="email" {...register('email')} className="h-12 bg-input/50 border-border/50" />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">{t('invest.form.type')}</Label>
                <Select value={watch('type')} onValueChange={(v) => setValue('type', v, { shouldValidate: true })}>
                  <SelectTrigger className="h-12 bg-input/50 border-border/50"><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    {types.map(ty => <SelectItem key={ty} value={ty}>{t(`invest.types.${ty}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-destructive text-xs mt-1">{errors.type.message}</p>}
              </div>
              <div>
                <Label className="mb-2 block">{t('invest.form.city')}</Label>
                <Input {...register('city')} className="h-12 bg-input/50 border-border/50" />
              </div>
            </div>
            <div>
              <Label className="mb-2 block">{t('invest.form.message')}</Label>
              <Textarea rows={4} {...register('message')} className="bg-input/50 border-border/50 resize-none" />
            </div>
            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full h-14 bg-gradient-ignition text-primary-foreground shadow-glow hover:opacity-90 text-base">
              {isSubmitting ? '...' : <>{t('cta.submit')} <ArrowRight className="h-5 w-5" /></>}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Investment;
