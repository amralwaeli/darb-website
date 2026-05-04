export interface Station {
  id: number;
  name_en: string;
  name_ar: string;
  city_en: string;
  city_ar: string;
  address_en: string;
  address_ar: string;
  lat: number;
  lng: number;
  services: string[];
}

export const stations: Station[] = [
  { id: 1, name_en: 'Darb Riyadh North', name_ar: 'درب الرياض الشمالي', city_en: 'Riyadh', city_ar: 'الرياض', address_en: 'King Fahd Rd, Al Sahafah District, Riyadh 13315', address_ar: 'طريق الملك فهد، حي الصحافة، الرياض 13315', lat: 24.8247, lng: 46.6753, services: ['fuel', 'ev', 'retail'] },
  { id: 2, name_en: 'Darb Riyadh East', name_ar: 'درب الرياض الشرقي', city_en: 'Riyadh', city_ar: 'الرياض', address_en: 'Eastern Ring Rd, Al Rawdah District, Riyadh 13211', address_ar: 'الطريق الدائري الشرقي، حي الروضة، الرياض 13211', lat: 24.7136, lng: 46.7919, services: ['fuel', 'retail'] },
  { id: 3, name_en: 'Darb Olaya', name_ar: 'درب العليا', city_en: 'Riyadh', city_ar: 'الرياض', address_en: 'Olaya St, Al Olaya District, Riyadh 12244', address_ar: 'شارع العليا، حي العليا، الرياض 12244', lat: 24.6892, lng: 46.6857, services: ['fuel', 'ev', 'retail', 'cafe'] },
  { id: 4, name_en: 'Darb Jeddah Corniche', name_ar: 'درب كورنيش جدة', city_en: 'Jeddah', city_ar: 'جدة', address_en: 'Corniche Rd, Al Shati District, Jeddah 23414', address_ar: 'طريق الكورنيش، حي الشاطئ، جدة 23414', lat: 21.5433, lng: 39.1728, services: ['fuel', 'ev', 'retail'] },
  { id: 5, name_en: 'Darb Jeddah South', name_ar: 'درب جدة الجنوبي', city_en: 'Jeddah', city_ar: 'جدة', address_en: 'Prince Majed Rd, Al Samer District, Jeddah 23526', address_ar: 'طريق الأمير ماجد، حي السامر، جدة 23526', lat: 21.4225, lng: 39.2253, services: ['fuel', 'retail'] },
  { id: 6, name_en: 'Darb Mecca Road', name_ar: 'درب طريق مكة', city_en: 'Mecca', city_ar: 'مكة المكرمة', address_en: 'Makkah-Jeddah Expy, Al Awali, Mecca 24351', address_ar: 'طريق مكة جدة السريع، العوالي، مكة المكرمة 24351', lat: 21.3891, lng: 39.8579, services: ['fuel', 'retail', 'cafe'] },
  { id: 7, name_en: 'Darb Madinah', name_ar: 'درب المدينة', city_en: 'Madinah', city_ar: 'المدينة المنورة', address_en: 'King Abdullah Rd, Al Aziziyah, Madinah 42312', address_ar: 'طريق الملك عبدالله، العزيزية، المدينة المنورة 42312', lat: 24.4709, lng: 39.6121, services: ['fuel', 'retail'] },
  { id: 8, name_en: 'Darb Dammam', name_ar: 'درب الدمام', city_en: 'Dammam', city_ar: 'الدمام', address_en: 'King Saud Rd, Al Adamah District, Dammam 32241', address_ar: 'طريق الملك سعود، حي العدامة، الدمام 32241', lat: 26.4207, lng: 50.0888, services: ['fuel', 'ev', 'retail'] },
  { id: 9, name_en: 'Darb Khobar', name_ar: 'درب الخبر', city_en: 'Khobar', city_ar: 'الخبر', address_en: 'Prince Faisal bin Fahd Rd, Al Aqrabiyah, Khobar 34423', address_ar: 'طريق الأمير فيصل بن فهد، العقربية، الخبر 34423', lat: 26.2172, lng: 50.1971, services: ['fuel', 'retail'] },
  { id: 10, name_en: 'Darb Tabuk', name_ar: 'درب تبوك', city_en: 'Tabuk', city_ar: 'تبوك', address_en: 'Prince Fahd bin Sultan Rd, Al Murooj, Tabuk 47913', address_ar: 'طريق الأمير فهد بن سلطان، المروج، تبوك 47913', lat: 28.3998, lng: 36.5700, services: ['fuel', 'retail'] },
  { id: 11, name_en: 'Darb Abha', name_ar: 'درب أبها', city_en: 'Abha', city_ar: 'أبها', address_en: 'King Khalid Rd, Al Mansak District, Abha 62521', address_ar: 'طريق الملك خالد، حي المنسك، أبها 62521', lat: 18.2164, lng: 42.5053, services: ['fuel', 'cafe'] },
  { id: 12, name_en: 'Darb Hail', name_ar: 'درب حائل', city_en: 'Hail', city_ar: 'حائل', address_en: 'King Abdulaziz Rd, Al Nafl, Hail 55421', address_ar: 'طريق الملك عبدالعزيز، النفل، حائل 55421', lat: 27.5114, lng: 41.7208, services: ['fuel', 'retail'] },
  { id: 13, name_en: 'Darb Buraidah', name_ar: 'درب بريدة', city_en: 'Buraidah', city_ar: 'بريدة', address_en: 'King Fahd Rd, Al Safra District, Buraidah 52366', address_ar: 'طريق الملك فهد، حي الصفراء، بريدة 52366', lat: 26.3260, lng: 43.9750, services: ['fuel', 'retail'] },
  { id: 14, name_en: 'Darb Najran', name_ar: 'درب نجران', city_en: 'Najran', city_ar: 'نجران', address_en: 'King Abdulaziz Rd, Al Faisaliyah, Najran 66264', address_ar: 'طريق الملك عبدالعزيز، الفيصلية، نجران 66264', lat: 17.5656, lng: 44.2289, services: ['fuel'] },
  { id: 15, name_en: 'Darb Jazan', name_ar: 'درب جازان', city_en: 'Jazan', city_ar: 'جازان', address_en: 'Corniche Rd, Al Shate District, Jazan 82822', address_ar: 'طريق الكورنيش، حي الشاطئ، جازان 82822', lat: 16.8892, lng: 42.5611, services: ['fuel', 'retail'] },
];

export const cities_en = Array.from(new Set(stations.map(s => s.city_en)));
