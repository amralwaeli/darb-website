import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Careers = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    coverLetter: '',
    agreeToTerms: false,
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(file.type)) {
        setCvFile(file);
      } else {
        toast.error(t('careers.errors.invalidFile'));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast.error(t('careers.errors.agreeTerms'));
      return;
    }

    if (!cvFile) {
      toast.error(t('careers.errors.uploadCV'));
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call - replace with actual backend integration
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Application submitted:', { ...formData, cvFile });
    toast.success(t('careers.form.success'));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle2 className="h-20 w-20 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('careers.success.title')}</h2>
          <p className="text-muted-foreground mb-8">{t('careers.success.message')}</p>
          <Button onClick={() => setSubmitted(false)} className="bg-gradient-ignition text-primary-foreground">
            {t('careers.success.submitAnother')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('careers.headline')}</h1>
          <p className="text-xl text-muted-foreground">{t('careers.subheading')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('careers.form.firstName')}</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="h-12 bg-input/50 border-border/50"
                placeholder={t('careers.form.firstName')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('careers.form.lastName')}</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="h-12 bg-input/50 border-border/50"
                placeholder={t('careers.form.lastName')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('careers.form.email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="h-12 bg-input/50 border-border/50"
                placeholder={t('careers.form.email')}
              />
            </div>
          </div>

          {/* Phone and CV Upload */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">{t('careers.form.phone')}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="h-12 bg-input/50 border-border/50"
                placeholder={t('careers.form.phone')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('careers.form.uploadCV')}</Label>
              <label className="flex-1 cursor-pointer block">
                <div className="h-12 flex items-center justify-between px-4 bg-input/50 border border-border/50 rounded-md hover:bg-input/70 transition-colors">
                  <span className="text-sm text-muted-foreground truncate">
                    {cvFile ? cvFile.name : t('careers.form.cvPlaceholder')}
                  </span>
                  <Button type="button" size="sm" className="bg-gradient-ignition text-primary-foreground shrink-0">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="coverLetter">{t('careers.form.coverLetter')}</Label>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              required
              rows={6}
              className="bg-input/50 border-border/50 resize-none"
              placeholder={t('careers.form.coverLetterPlaceholder')}
            />
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-3 p-4 bg-input/30 rounded-lg border border-border/50">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              required
            />
            <Label htmlFor="agreeToTerms" className="text-sm font-normal cursor-pointer select-none">
              {t('careers.form.agreeTerms')}
            </Label>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="bg-gradient-ignition text-primary-foreground px-12 h-14 text-lg"
            >
              {isSubmitting ? t('careers.form.submitting') : t('careers.form.submit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Careers;