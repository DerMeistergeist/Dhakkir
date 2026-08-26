// -- SECTION / CATEGORY METADATA --------------------

export var SECTIONS = [
  {id:"adhkar",  ar:"الاذكار والادعية", en:"Adhkar & Duaa",    icon:"P"},
  {id:"hadiths", ar:"الاحاديث النبوية",  en:"Hadiths",          icon:"H"},
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

// `time` (HH:MM, 24h local time) is an optional suggested reminder time
// used by the in-app reminder scheduler (see src/hooks/useReminders.js).
export var CATEGORIES = [
  {id:"morning",     ar:"اذكار الصباح",       en:"Morning",        de:"Morgengebete",   icon:"S", time:"05:00"},
  {id:"evening",     ar:"اذكار المساء",       en:"Evening",        de:"Abendgebete",    icon:"E", time:"17:00"},
  {id:"sleep",       ar:"اذكار النوم",         en:"Sleep",          de:"Schlafgebete",   icon:"M", time:"21:00"},
  {id:"wakeup",      ar:"اذكار الاستيقاظ",    en:"Waking Up",      de:"Aufwachen",      icon:"S", time:"06:00"},
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
