import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';

const links = [
  { to: '/', key: 'nav.home' },
  { to: '/about', key: 'nav.about' },
  { to: '/map', key: 'nav.map' },
  { to: '/investment', key: 'nav.investment' },
  { to: '/rental', key: 'nav.rental' },
  { to: '/jobs', key: 'nav.jobs' },
  { to: '/contact', key: 'nav.contact' },
];

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled || open ? 'glass border-b border-border/50' : ''}`}>
      <div className="container flex items-center justify-between h-16 md:h-20">
        <div className="flex items-center gap-4">
          <Logo />
          <img src="/vision2030.png" alt="Vision 2030" className="hidden sm:block h-9 w-auto opacity-90" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleLang} className="gap-2">
            <Globe className="h-4 w-4" /> <span className="hidden sm:inline">{t('lang')}</span>
          </Button>
          <Button asChild size="sm" className="hidden md:inline-flex bg-gradient-ignition text-primary-foreground hover:opacity-90 shadow-glow">
            <Link to="/investment">{t('cta.invest')}</Link>
          </Button>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-secondary" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden glass border-t border-border/50">
          <nav className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg ${isActive ? 'bg-secondary text-primary' : 'text-foreground hover:bg-secondary/50'}`
                }
              >
                {t(l.key)}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
