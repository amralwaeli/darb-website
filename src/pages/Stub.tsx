import { useTranslation } from 'react-i18next';
import { Construction } from 'lucide-react';

const Stub = ({ titleKey }: { titleKey: string }) => {
  const { t } = useTranslation();
  return (
    <div className="container py-32 text-center">
      <Construction className="h-16 w-16 text-primary mx-auto mb-6" />
      <h1 className="text-4xl md:text-6xl font-bold">{t(titleKey)}</h1>
      <p className="mt-4 text-muted-foreground max-w-md mx-auto">This page is part of the upcoming build phase. The CMS-powered version is coming next.</p>
    </div>
  );
};

export default Stub;
