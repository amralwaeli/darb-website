import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Fuel, Zap, ShoppingBag, Store, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImg from '@/assets/hero-station.svg';
import networkImg from '@/assets/network-aerial.jpg';
import evImg from '@/assets/ev-charging.jpg';

const stats = [
  { value: '53', key: 'stats.stations' },
  { value: '15+', key: 'stats.cities' },
  { value: '12', key: 'stats.years' },
  { value: '99.9%', key: 'stats.uptime' },
];

const services = [
  { icon: Fuel, key: 'fuel' },
  { icon: Zap, key: 'ev' },
  { icon: ShoppingBag, key: 'retail' },
  { icon: Store, key: 'rental' },
];

const Home = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Darb premium fuel station at golden hour" width={1920} height={1080} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
          <div className="absolute inset-0 grid-pattern opacity-30" />
        </div>

        <div className="relative container py-32">
          <div className="max-w-3xl animate-float-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
              {t('hero.tag')}
            </div>
            <h1 className="mt-6 text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95]">
              {t('hero.title')}<br />
              <span className="text-gradient">{t('hero.titleAccent')}</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">{t('hero.subtitle')}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-gradient-ignition text-primary-foreground hover:opacity-90 shadow-glow h-14 px-8 text-base">
                <Link to="/map">{t('cta.explore')} <ArrowRight className={`h-5 w-5 ${isRtl ? 'rotate-180' : ''}`} /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base glass border-border/60 hover:bg-secondary">
                <Link to="/investment">{t('cta.invest')}</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 border-t border-border/50 glass">
          <div className="container grid grid-cols-2 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.key} className="py-6 px-4 border-r border-border/50 last:border-r-0 first:border-l-0">
                <div className="text-3xl md:text-4xl font-bold text-gradient">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{t(s.key)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container py-24 md:py-32">
        <div className="max-w-2xl mb-16">
          <p className="text-primary text-sm uppercase tracking-widest font-semibold mb-3">— {t('nav.about')}</p>
          <h2 className="text-4xl md:text-6xl font-bold">{t('services.title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t('services.subtitle')}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <div key={s.key} className="group relative rounded-2xl bg-gradient-card border border-border/50 p-7 overflow-hidden hover:border-primary/40 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all" />
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-gradient-ignition flex items-center justify-center shadow-glow mb-6">
                  <s.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t(`services.${s.key}.title`)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t(`services.${s.key}.desc`)}</p>
                <div className="mt-6 text-xs text-muted-foreground/60 font-mono">0{i + 1}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NETWORK */}
      <section className="container py-16">
        <div className="relative rounded-3xl overflow-hidden border border-border/50">
          <img src={networkImg} alt="Aerial view of Darb station network" loading="lazy" width={1536} height={1024} className="absolute inset-0 w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
          <div className="relative p-10 md:p-20 max-w-2xl">
            <MapPin className="h-10 w-10 text-primary mb-6" />
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">{t('network.title')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('network.subtitle')}</p>
            <Button asChild size="lg" className="mt-8 bg-gradient-ignition text-primary-foreground shadow-glow h-14 px-8">
              <Link to="/map">{t('network.cta')} <ArrowRight className={`h-5 w-5 ${isRtl ? 'rotate-180' : ''}`} /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* EV TEASER */}
      <section className="container py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
          <img src={evImg} alt="Modern EV charging station" loading="lazy" width={1024} height={1024} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>
        <div>
          <p className="text-accent text-sm uppercase tracking-widest font-semibold mb-3">— EV · 2026</p>
          <h2 className="text-4xl md:text-6xl font-bold">Ready for what's next.</h2>
          <p className="mt-4 text-lg text-muted-foreground">In partnership with EVIQ, we're rolling out fast-charging across our entire network — so the road ahead stays open, whatever you drive.</p>
          <ul className="mt-8 space-y-3">
            {['DC fast-charging up to 360 kW', 'Live availability in app', 'Single tap-to-pay across the network'].map(x => (
              <li key={x} className="flex items-center gap-3"><ChevronRight className="h-4 w-4 text-primary" /><span>{x}</span></li>
            ))}
          </ul>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container py-24">
        <div className="rounded-3xl bg-gradient-ignition p-12 md:p-20 text-center shadow-glow">
          <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground">{t('invest.title')}</h2>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">{t('invest.subtitle')}</p>
          <Button asChild size="lg" variant="secondary" className="mt-8 h-14 px-8 text-base">
            <Link to="/investment">{t('cta.invest')} <ArrowRight className={`h-5 w-5 ${isRtl ? 'rotate-180' : ''}`} /></Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Home;
