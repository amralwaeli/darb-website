import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import vision2030Logo from '@/assets/2030-vision.svg';

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

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={toggleLang} className="gap-2">
            <Globe className="h-15 w-15" /> <span className="hidden sm:inline">{t('lang')}</span>
          </Button>
          
          {/* Vision 2030 Logo - Replaces "Become an investor" button */}
          <div className="hidden md:flex items-center">
            <img 
              src={vision2030Logo} 
              alt="Saudi Vision 2030" 
              className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
          
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
            {/* Vision 2030 Logo in mobile menu */}
            <div className="px-4 py-3 mt-2">
              <img 
                src={vision2030Logo} 
                alt="Saudi Vision 2030" 
                className="h-8 w-auto opacity-90"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};