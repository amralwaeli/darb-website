import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Info, TrendingUp, Store, MapPin } from 'lucide-react';

const items = [
  { to: '/about', icon: Info, key: 'nav.about' },
  { to: '/investment', icon: TrendingUp, key: 'nav.investment' },
  { to: '/rental', icon: Store, key: 'nav.rental' },
  { to: '/map', icon: MapPin, key: 'nav.map' },
];

export const QuickNav = () => {
  const { t } = useTranslation();
  return (
    <div className="fixed bottom-4 inset-x-0 z-40 px-4 pointer-events-none">
      <div className="container max-w-2xl pointer-events-auto">
        <nav className="glass rounded-2xl border border-border/60 shadow-elegant grid grid-cols-4 overflow-hidden">
          {items.map(({ to, icon: Icon, key }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-1.5 py-3 px-2 hover:bg-primary/10 transition-colors group"
            >
              <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-[11px] md:text-xs font-medium text-foreground/90">{t(key)}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
