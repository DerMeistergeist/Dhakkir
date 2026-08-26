// -- SECTION / CATEGORY METADATA --------------------

export var SECTIONS = [
  {id:"adhkar",  ar:"الاذكار والادعية", en:"Adhkar & Duaa",    de:"Adhkar & Bittgebete", icon:"P"},
  {id:"quran",   ar:"القرآن الكريم",    en:"Holy Quran",       de:"Der Heilige Koran",   icon:"Q"},
  {id:"hadiths", ar:"الاحاديث النبوية",  en:"Hadiths",          de:"Hadithe",             icon:"H"},
  {id:"prayertimes", ar:"مواعيد الصلاة", en:"Prayer Times",    de:"Gebetszeiten",        icon:"T"},
];

export var HADITH_CATS = [
  {id:"akhlaq",  ar:"الاخلاق",        en:"Character",   de:"Charakter",      icon:"*"},
  {id:"muamala", ar:"المعاملة",        en:"Dealings",    de:"Umgang",         icon:"~"},
  {id:"rahma",   ar:"الرحمة والرفق",   en:"Mercy",       de:"Barmherzigkeit", icon:"~"},
  {id:"sadk",    ar:"الصدق والامانة",  en:"Honesty",     de:"Ehrlichkeit",    icon:"~"},
  {id:"sabr",    ar:"الصبر والشكر",    en:"Patience",    de:"Geduld",         icon:"~"},
  {id:"usra",    ar:"الاسرة والجيران", en:"Family",      de:"Familie",        icon:"~"},
  {id:"ilm",     ar:"العلم والحكمة",   en:"Knowledge",   de:"Wissen",         icon:"~"},
  {id:"mal",     ar:"المال والعمل",    en:"Work",        de:"Arbeit",         icon:"~"},
  {id:"adab",    ar:"الآداب العامة",    en:"General Manners", de:"Allgemeine Sitten", icon:"~"},
  {id:"sadaqa",  ar:"الإنفاق والصدقات", en:"Charity & Giving", de:"Wohltätigkeit",      icon:"~"},
];

// `time` (HH:MM, 24h local time) is a fixed fallback reminder time used by
// the in-app reminder scheduler (see src/hooks/useReminders.js) when the
// user hasn't granted location access. `timeAnchor` names a prayer-time
// key (see src/utils/prayerTimes.js's PRAYER_ORDER) that the reminder
// should follow instead, once real astronomically-computed prayer times
// are available for the user's location -- e.g. "morning" adhkar are
// reminded at sunrise (the traditional end of their time window) rather
// than a fixed clock time that drifts from the real sunrise all year.
export var CATEGORIES = [
  {id:"morning",     ar:"اذكار الصباح",       en:"Morning",        de:"Morgengebete",   icon:"S", time:"05:00", timeAnchor:"sunrise"},
  {id:"evening",     ar:"اذكار المساء",       en:"Evening",        de:"Abendgebete",    icon:"E", time:"17:00", timeAnchor:"asr"},
  {id:"sleep",       ar:"اذكار النوم",         en:"Sleep",          de:"Schlafgebete",   icon:"M", time:"21:00", timeAnchor:"isha"},
  {id:"wakeup",      ar:"اذكار الاستيقاظ",    en:"Waking Up",      de:"Aufwachen",      icon:"S", time:"06:00", timeAnchor:"fajr"},
  {id:"prayer",      ar:"اذكار الصلاة",       en:"Prayer",         de:"Gebet",          icon:"P", time:null},
  {id:"after_prayer",ar:"اذكار بعد الصلاة",   en:"After Prayer",   de:"Nach dem Gebet", icon:"A", time:null},
  {id:"wudu",        ar:"اذكار الوضوء",       en:"Wudu",           de:"Wudu",           icon:"W", time:null},
  {id:"home_out",    ar:"الخروج من المنزل",   en:"Leaving Home",   de:"Haus verlassen", icon:"D", time:null},
  {id:"home_in",     ar:"دخول المنزل",        en:"Entering Home",  de:"Haus betreten",  icon:"H", time:null},
  {id:"mosque",      ar:"اذكار المسجد",       en:"Mosque",         de:"Moschee",        icon:"M", time:null},
  {id:"food",        ar:"اذكار الطعام",       en:"Food",           de:"Essen",          icon:"F", time:null},
  {id:"travel",      ar:"اذكار السفر",        en:"Travel",         de:"Reise",          icon:"T", time:null},
  {id:"distress",    ar:"دعاء الهم والكرب",   en:"Hardship",       de:"Not",            icon:"D", time:null},
  {id:"sick",        ar:"ادعية المريض",       en:"Sickness",       de:"Krankheit",      icon:"S", time:null},
  {id:"baaqiyat",    ar:"الباقيات الصالحات",  en:"Enduring Deeds", de:"Beständige Taten",icon:"B",time:null},
  {id:"prophetic",   ar:"ادعية نبوية",        en:"Prophetic Duaa", de:"Prophetische Bittgebete",icon:"N",time:null},
  {id:"exam",        ar:"دعاء الاختبار",      en:"Exam & Knowledge",de:"Prüfung",      icon:"E", time:null},
  {id:"quran",       ar:"اذكار متنوعة",       en:"General",        de:"Allgemeine",     icon:"G", time:null},
];
