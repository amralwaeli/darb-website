-- Roles enum + table (security best practice)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer to avoid recursive RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Stations table
CREATE TABLE public.stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  city_en TEXT NOT NULL,
  city_ar TEXT NOT NULL,
  address_en TEXT NOT NULL,
  address_ar TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  services TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stations are viewable by everyone"
ON public.stations FOR SELECT
USING (true);

CREATE POLICY "Admins can insert stations"
ON public.stations FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update stations"
ON public.stations FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete stations"
ON public.stations FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER stations_updated_at
BEFORE UPDATE ON public.stations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed initial stations
INSERT INTO public.stations (name_en, name_ar, city_en, city_ar, address_en, address_ar, lat, lng, services) VALUES
('Darb Riyadh North', 'درب الرياض الشمالي', 'Riyadh', 'الرياض', 'King Fahd Rd, Al Sahafah District, Riyadh 13315', 'طريق الملك فهد، حي الصحافة، الرياض 13315', 24.8247, 46.6753, ARRAY['fuel','ev','retail']),
('Darb Riyadh East', 'درب الرياض الشرقي', 'Riyadh', 'الرياض', 'Eastern Ring Rd, Al Rawdah District, Riyadh 13211', 'الطريق الدائري الشرقي، حي الروضة، الرياض 13211', 24.7136, 46.7919, ARRAY['fuel','retail']),
('Darb Olaya', 'درب العليا', 'Riyadh', 'الرياض', 'Olaya St, Al Olaya District, Riyadh 12244', 'شارع العليا، حي العليا، الرياض 12244', 24.6892, 46.6857, ARRAY['fuel','ev','retail','cafe']),
('Darb Jeddah Corniche', 'درب كورنيش جدة', 'Jeddah', 'جدة', 'Corniche Rd, Al Shati District, Jeddah 23414', 'طريق الكورنيش، حي الشاطئ، جدة 23414', 21.5433, 39.1728, ARRAY['fuel','ev','retail']),
('Darb Jeddah South', 'درب جدة الجنوبي', 'Jeddah', 'جدة', 'Prince Majed Rd, Al Samer District, Jeddah 23526', 'طريق الأمير ماجد، حي السامر، جدة 23526', 21.4225, 39.2253, ARRAY['fuel','retail']),
('Darb Mecca Road', 'درب طريق مكة', 'Mecca', 'مكة المكرمة', 'Makkah-Jeddah Expy, Al Awali, Mecca 24351', 'طريق مكة جدة السريع، العوالي، مكة المكرمة 24351', 21.3891, 39.8579, ARRAY['fuel','retail','cafe']),
('Darb Madinah', 'درب المدينة', 'Madinah', 'المدينة المنورة', 'King Abdullah Rd, Al Aziziyah, Madinah 42312', 'طريق الملك عبدالله، العزيزية، المدينة المنورة 42312', 24.4709, 39.6121, ARRAY['fuel','retail']),
('Darb Dammam', 'درب الدمام', 'Dammam', 'الدمام', 'King Saud Rd, Al Adamah District, Dammam 32241', 'طريق الملك سعود، حي العدامة، الدمام 32241', 26.4207, 50.0888, ARRAY['fuel','ev','retail']),
('Darb Khobar', 'درب الخبر', 'Khobar', 'الخبر', 'Prince Faisal bin Fahd Rd, Al Aqrabiyah, Khobar 34423', 'طريق الأمير فيصل بن فهد، العقربية، الخبر 34423', 26.2172, 50.1971, ARRAY['fuel','retail']),
('Darb Tabuk', 'درب تبوك', 'Tabuk', 'تبوك', 'Prince Fahd bin Sultan Rd, Al Murooj, Tabuk 47913', 'طريق الأمير فهد بن سلطان، المروج، تبوك 47913', 28.3998, 36.5700, ARRAY['fuel','retail']),
('Darb Abha', 'درب أبها', 'Abha', 'أبها', 'King Khalid Rd, Al Mansak District, Abha 62521', 'طريق الملك خالد، حي المنسك، أبها 62521', 18.2164, 42.5053, ARRAY['fuel','cafe']),
('Darb Hail', 'درب حائل', 'Hail', 'حائل', 'King Abdulaziz Rd, Al Nafl, Hail 55421', 'طريق الملك عبدالعزيز، النفل، حائل 55421', 27.5114, 41.7208, ARRAY['fuel','retail']),
('Darb Buraidah', 'درب بريدة', 'Buraidah', 'بريدة', 'King Fahd Rd, Al Safra District, Buraidah 52366', 'طريق الملك فهد، حي الصفراء، بريدة 52366', 26.3260, 43.9750, ARRAY['fuel','retail']),
('Darb Najran', 'درب نجران', 'Najran', 'نجران', 'King Abdulaziz Rd, Al Faisaliyah, Najran 66264', 'طريق الملك عبدالعزيز، الفيصلية، نجران 66264', 17.5656, 44.2289, ARRAY['fuel']),
('Darb Jazan', 'درب جازان', 'Jazan', 'جازان', 'Corniche Rd, Al Shate District, Jazan 82822', 'طريق الكورنيش، حي الشاطئ، جازان 82822', 16.8892, 42.5611, ARRAY['fuel','retail']);