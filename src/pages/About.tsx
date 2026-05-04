import { useTranslation } from 'react-i18next';
import { Target, Eye, Heart, Award } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();
  const blocks = [
    { icon: Eye, title: 'Our Vision', text: 'To be the most trusted and innovative fuel-retail network in Saudi Arabia by 2030.' },
    { icon: Target, title: 'Our Mission', text: 'Deliver premium energy and convenience experiences that move people, businesses and the Kingdom forward.' },
    { icon: Heart, title: 'Our Values', text: 'Safety, hospitality, sustainability — at every station, every day.' },
    { icon: Award, title: 'Vision 2030', text: 'Aligned with Saudi Vision 2030 to diversify energy and elevate national mobility.' },
  ];

  return (
    <div className="container py-20 md:py-32">
      <div className="max-w-3xl">
        <p className="text-primary text-sm uppercase tracking-widest font-semibold mb-3">— {t('nav.about')}</p>
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05]">A road built on <span className="text-gradient">trust</span>.</h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground">
          Founded to power Saudi Arabia's growing mobility needs, Darb operates 53 premium service stations from the heart of Riyadh to the southern coasts of Jazan. We don't just sell fuel — we build journeys.
        </p>
      </div>

      <div className="mt-20 grid md:grid-cols-2 gap-5">
        {blocks.map((b) => (
          <div key={b.title} className="rounded-2xl bg-gradient-card border border-border/50 p-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-ignition flex items-center justify-center shadow-glow mb-5">
              <b.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">{b.title}</h3>
            <p className="text-muted-foreground">{b.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
