import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Linkedin, Instagram, Facebook, Twitter } from 'lucide-react';
import { Logo } from './Logo';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border/50 bg-card/30 mt-24">
      <div className="container py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 text-muted-foreground max-w-sm">{t('footer.tagline')}</p>
          <div className="flex gap-3 mt-6">
            {[Linkedin, Twitter, Instagram, Facebook].map((Icon, i) => (
              <a key={i} href="#" className="h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Social">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">{t('footer.company')}</h4>
          <ul className="space-y-2.5">
            <li><Link to="/about" className="hover:text-primary transition-colors">{t('nav.about')}</Link></li>
            <li><Link to="/media" className="hover:text-primary transition-colors">{t('nav.media')}</Link></li>
            <li><Link to="/jobs" className="hover:text-primary transition-colors">{t('nav.jobs')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">{t('footer.support')}</h4>
          <ul className="space-y-2.5">
            <li><Link to="/faq" className="hover:text-primary transition-colors">{t('nav.faq')}</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">{t('nav.contact')}</Link></li>
            <li><Link to="/map" className="hover:text-primary transition-colors">{t('nav.map')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50">
        <div className="container py-6 text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-2">
          <p>© {new Date().getFullYear()} {t('brand')}. {t('footer.rights')}</p>
          <p>Vision 2030 · Kingdom of Saudi Arabia</p>
          <Link to="/admin/login" className="text-xs text-muted-foreground/60 hover:text-primary transition-colors">
            Staff login
          </Link>
        </div>
      </div>
    </footer>
  );
};
