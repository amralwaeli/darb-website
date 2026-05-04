import { Link } from 'react-router-dom';
import logo from '@/assets/darb-logo.svg';

export const Logo = ({ className = '' }: { className?: string }) => (
  <Link to="/" aria-label="Darb home" className={`flex items-center ${className}`}>
    <img src={logo} alt="Darb" className="h-8 md:h-9 w-auto" />
  </Link>
);
