import { useTranslation } from 'react-i18next';
import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const contactMethods = [
    {
      icon: Phone,
      title: t('contact.methods.phone.title'),
      value: '8003030100',
      label: t('contact.methods.phone.label'),
      href: 'tel:8003030100',
    },
    {
      icon: MessageCircle,
      title: t('contact.methods.whatsapp.title'),
      value: '920005804',
      label: t('contact.methods.whatsapp.label'),
      href: 'https://wa.me/966920005804',
      external: true,
    },
    {
      icon: Mail,
      title: t('contact.methods.email.title'),
      value: 'info@darbstations.com.sa',
      label: t('contact.methods.email.label'),
      href: 'mailto:info@darbstations.com.sa',
      external: true,
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        {/* Contact Methods Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.href}
              target={method.external ? '_blank' : undefined}
              rel={method.external ? 'noopener noreferrer' : undefined}
              className="group relative rounded-2xl bg-gradient-card border border-border/50 p-8 overflow-hidden hover:border-primary/40 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all" />
              <div className="relative text-center">
                <div className="h-16 w-16 rounded-2xl bg-gradient-ignition flex items-center justify-center shadow-glow mb-6 mx-auto">
                  <method.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                <p className="text-2xl font-bold text-primary mb-2">{method.value}</p>
                <p className="text-sm text-muted-foreground">{method.label}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="rounded-2xl bg-gradient-card border border-border/50 p-8">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('contact.location.title')}</h3>
                <p className="text-muted-foreground">{t('contact.location.address')}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-card border border-border/50 p-8">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('contact.hours.title')}</h3>
                <p className="text-muted-foreground">{t('contact.hours.schedule')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Satisfaction Message */}
        <div className="rounded-3xl bg-gradient-ignition p-12 text-center shadow-glow">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            {t('contact.satisfaction.title')}
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-3xl mx-auto">
            {t('contact.satisfaction.message')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;