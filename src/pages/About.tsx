import { useTranslation } from 'react-i18next';
import { Target, Eye, Heart, Award } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();
  
  // Define keys instead of hardcoded text
  const blocks = [
    { icon: Eye, titleKey: 'about.blocks.vision.title', textKey: 'about.blocks.vision.text' },
    { icon: Target, titleKey: 'about.blocks.mission.title', textKey: 'about.blocks.mission.text' },
    { icon: Heart, titleKey: 'about.blocks.values.title', textKey: 'about.blocks.values.text' },
    { icon: Award, titleKey: 'about.blocks.vision2030.title', textKey: 'about.blocks.vision2030.text' },
  ];

  return (
    <div className="container py-20 md:py-32">
      <div className="max-w-3xl">
        <p className="text-primary text-sm uppercase tracking-widest font-semibold mb-3">
          — {t('nav.about')}
        </p>
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05]">
          {t('about.title')} <span className="text-gradient">{t('about.titleAccent')}</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground">
          {t('about.description')}
        </p>
      </div>

      <div className="mt-20 grid md:grid-cols-2 gap-5">
        {blocks.map((b, index) => (
          <div key={index} className="rounded-2xl bg-gradient-card border border-border/50 p-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-ignition flex items-center justify-center shadow-glow mb-5">
              <b.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">{t(b.titleKey)}</h3>
            <p className="text-muted-foreground">{t(b.textKey)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;