import React, { useState, useEffect, useCallback } from "react";

// -- DATA ------------------------------------------

var SECTIONS = [
  {id:"adhkar",  ar:"الاذكار والادعية", en:"Adhkar & Duaa",    icon:"P"},
  {id:"hadiths", ar:"الاحاديث النبوية",  en:"Hadiths",          icon:"H"},
];

var HADITH_CATS = [
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

var HADITHS = {
  akhlaq: [
    {
      arabic:"إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ",
      translit:"Innama buiththu li-utammima makarim al-akhlaq",
      en:"I was sent only to perfect good character.",
      de:"Ich wurde nur gesandt, um guten Charakter zu vervollkommnen.",
      source:"Ahmad - Sahih",
      source_ar:"أحمد — صحيح",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
    {
      arabic:"أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا",
      translit:"Akmal al-muminin imanan ahsanuhum khuluqa",
      en:"The most complete in faith is the one with the best character.",
      de:"Der im Glauben Vollkommenste ist derjenige mit dem besten Charakter.",
      source:"Abu Dawud - Sahih",
      source_ar:"أبو داود — صحيح",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
    {
      arabic:"الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
      translit:"Al-muslimu man salima al-muslimuna min lisanihi wa yadihi",
      en:"The Muslim is one from whose tongü and hand the Muslims are safe.",
      de:"Der Muslim ist derjenige, vor dessen Zunge und Hand die Muslime sicher sind.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Abdullah ibn Amr",
      narrator_ar:"عبد الله بن عمرو رضي الله عنهما",
    },
    {
      arabic:"اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ",
      translit:"Ittaqillaha haythuma kunta, wa atbias-sayyi-ata al-hasanata tamhuha, wa khaliqin-nasa bikhuluqin hasan",
      en:"Fear Allah wherever you are, follow a bad deed with a good one to erase it, and treat people with good character.",
      de:"Fürchte Allah wo immer du bist, folge einer schlechten Tat mit einer guten und behandle die Menschen gut.",
      source:"Tirmidhi - Hasan",
      source_ar:"الترمذي — حسن",
      narrator:"Muadh ibn Jabal",
      narrator_ar:"معاذ بن جبل رضي الله عنه",
    },
    {
      arabic:"لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ",
      translit:"Laysa ash-shadidu bis-suraa, innama ash-shadidu alladhi yamliku nafsahu indal-ghadab",
      en:"The strong man is not the wrestler; the strong man is the one who controls himself when angry.",
      de:"Der Starke ist nicht der Ringer; der Starke ist derjenige, der sich bei Wut beherrscht.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
    {
      arabic:"تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ",
      translit:"Tabassmuka fi wajhi akhika sadaqah",
      en:"Your smile in the face of your brother is charity.",
      de:"Dein Lächeln im Gesicht deines Bruders ist eine Wohltätigkeit.",
      source:"Tirmidhi - Sahih",
      source_ar:"الترمذي — صحيح",
      narrator:"Abu Dharr",
      narrator_ar:"أبو ذر الغفاري رضي الله عنه",
    },
    {
      arabic:"لَا تَحْقِرَنَّ مِنَ الْمَعْرُوفِ شَيْئًا وَلَوْ أَنْ تَلْقَى أَخَاكَ بِوَجْهٍ طَلْقٍ",
      translit:"La tahqiranna minal-marufi shay-an wa law an talqa akhaka biwajhin talq",
      en:"Do not belittle any act of kindness, even if it is meeting your brother with a cheerful face.",
      de:"Unterschätze keine gute Tat, auch nicht wenn du deinen Bruder mit einem freundlichen Gesicht triffst.",
      source:"Muslim",
      source_ar:"مسلم",
      narrator:"Abu Dharr",
      narrator_ar:"أبو ذر الغفاري رضي الله عنه",
    },
  ],
  muamala: [
    {
      arabic:"لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
      translit:"La yuminu ahadukum hatta yuhibba li-akhihi ma yuhibbu li-nafsihi",
      en:"None truly believes until he loves for his brother what he loves for himself.",
      de:"Keiner glaubt wirklich, bis er für seinen Bruder liebt, was er für sich liebt.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Anas ibn Malik",
      narrator_ar:"أنس بن مالك رضي الله عنه",
    },
    {
      arabic:"مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
      translit:"Man kana yuminu billahi wal-yawmil-akhiri falyaqul khayran aw liyasmut",
      en:"Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
      de:"Wer an Allah und den Jüngsten Tag glaubt, soll Gutes sagen oder schweigen.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
    {
      arabic:"الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا",
      translit:"Al-muminu lil-mumini kal-bunyan yashuddhu badhuhu badha",
      en:"The believer to the believer is like a building, each part strengthening the other.",
      de:"Der Gläubige zum Gläubigen ist wie ein Gebäude, jeder Teil stärkt den anderen.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Abu Musa al-Ashari",
      narrator_ar:"أبو موسى الأشعري رضي الله عنه",
    },
    {
      arabic:"إِيَّاكُمْ وَالظَّنَّ، فَإِنَّ الظَّنَّ أَكْذَبُ الْحَدِيثِ",
      translit:"Iyyakum wazh-zhann, fa-innazh-zhanna akdhabu al-hadith",
      en:"Beware of suspicion, for suspicion is the most false of speech.",
      de:"Hütet euch vor Verdacht, denn Verdacht ist die falscheste Rede.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
    {
      arabic:"مَنْ سَتَرَ مُسْلِمًا سَتَرَهُ اللَّهُ يَوْمَ الْقِيَامَةِ",
      translit:"Man satara musliman, satarahu Allahu yawmal-qiyamah",
      en:"Whoever conceals a Muslim fault, Allah will conceal his fault on the Day of Resurrection.",
      de:"Wer die Fehler eines Muslims verbirgt, Allah wird seine Fehler am Tag der Auferstehung verbergen.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Ibn Umar",
      narrator_ar:"ابن عمر رضي الله عنهما",
    },
    {
      arabic:"انْصُرْ أَخَاكَ ظَالِمًا أَوْ مَظْلُومًا",
      translit:"Unsur akhaka dhaliman aw madhluma",
      en:"Help your brother whether he is an oppressor or the oppressed.",
      de:"Hilf deinem Bruder, ob er ein Unterdrücker oder Unterdrückter ist.",
      source:"Bukhari",
      source_ar:"البخاري",
      narrator:"Anas ibn Malik",
      narrator_ar:"أنس بن مالك رضي الله عنه",
    },
  ],
  rahma: [
    {
      arabic:"الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ، ارْحَمُوا مَنْ فِي الْأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ",
      translit:"Ar-rahimuna yarhamuhum ar-rahman, irhamuu man fil-ardi yarhamkum man fis-sama",
      en:"The merciful will be shown mercy by the Most Merciful. Have mercy on those on earth and the One in the heavens will have mercy on you.",
      de:"Den Barmherzigen wird der Allerbarmer Barmherzigkeit zeigen. Seid barmherzig mit denen auf der Erde.",
      source:"Abu Dawud - Sahih",
      source_ar:"أبو داود — صحيح",
      narrator:"Abdullah ibn Amr",
      narrator_ar:"عبد الله بن عمرو رضي الله عنهما",
    },
    {
      arabic:"مَنْ لَا يَرْحَمُ لَا يُرْحَمُ",
      translit:"Man la yarham la yurham",
      en:"He who does not show mercy will not be shown mercy.",
      de:"Wer keine Barmherzigkeit zeigt, dem wird keine Barmherzigkeit gezeigt.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Jarir ibn Abdullah",
      narrator_ar:"جرير بن عبد الله رضي الله عنه",
    },
    {
      arabic:"إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ، وَيُعْطِي عَلَى الرِّفْقِ مَا لَا يُعْطِي عَلَى الْعُنْفِ",
      translit:"Innallaha rafiqun yuhibbu ar-rifqa, wayutiala ar-rifqi ma la yuti alal-unf",
      en:"Allah is gentle and loves gentleness, and gives for gentleneß what He does not give for harshness.",
      de:"Allah ist sanft und liebt Sanftmut, und gibt für Sanftmut was Er für Härte nicht gibt.",
      source:"Muslim",
      source_ar:"مسلم",
      narrator:"Aisha",
      narrator_ar:"عائشة رضي الله عنها",
    },
    {
      arabic:"ارْحَمُوا الصِّغَارَ وَوَقِّرُوا الْكِبَارَ",
      translit:"Irhamuss-ghara wa waqqirul-kibara",
      en:"Have mercy on the young and honor the elderly.",
      de:"Seid barmherzig mit den Jungen und ehrt die Alten.",
      source:"Abu Dawud - Hasan",
      source_ar:"أبو داود — حسن",
      narrator:"Abu Musa",
      narrator_ar:"أبو موسى الأشعري رضي الله عنه",
    },
    {
      arabic:"لَا تُنْزَعُ الرَّحْمَةُ إِلَّا مِنْ شَقِيٍّ",
      translit:"La tunzaur-rahmatu illa min shaqiyy",
      en:"Mercy is not taken away except from a wretched person.",
      de:"Barmherzigkeit wird nur dem Elenden entzogen.",
      source:"Abu Dawud, Tirmidhi",
      source_ar:"أبو داود، الترمذي",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
  ],
  sadk: [
    {
      arabic:"عَلَيْكُمْ بِالصِّدْقِ، فَإِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ، وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ",
      translit:"Alaykum bis-sidqi, fa-innas-sidqa yahdi ilal-birri, wa innal-birra yahdi ilal-jannah",
      en:"You must be truthful, for truthfulneß leads to righteousneß and righteousneß leads to Paradise.",
      de:"Ihr müsst wahrhaftig sein, denn Wahrhaftigkeit führt zur Rechtschaffenheit und ins Paradies.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Ibn Masud",
      narrator_ar:"ابن مسعود رضي الله عنه",
    },
    {
      arabic:"آيَةُ الْمُنَافِقِ ثَلَاثٌ: إِذَا حَدَّثَ كَذَبَ، وَإِذَا وَعَدَ أَخْلَفَ، وَإِذَا اؤْتُمِنَ خَانَ",
      translit:"Ayatul-munafiq thalathtun: idha haddatha kadhaba, wa idha waada akhlafa, wa idha-tumina khana",
      en:"The signs of the hypocrite are three: when he speaks he lies, when he promises he breaks it, and when trusted he betrays.",
      de:"Die Zeichen des Heuchlers sind drei: wenn er spricht lügt er, wenn er verspricht bricht er es.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
    {
      arabic:"إِنَّ الصِّدْقَ طُمَأْنِينَةٌ، وَإِنَّ الْكَذِبَ رِيبَةٌ",
      translit:"Innas-sidqa tumaaninah, wa innal-kadhiba riba",
      en:"Truthfulneß is peace of mind and lying is doubt.",
      de:"Wahrhaftigkeit ist Seelenfrieden und Lüge ist Zweifel.",
      source:"Tirmidhi - Sahih",
      source_ar:"الترمذي — صحيح",
      narrator:"Al-Hasan ibn Ali",
      narrator_ar:"الحسن بن علي رضي الله عنهما",
    },
    {
      arabic:"التَّاجِرُ الصَّدُوقُ الْأَمِينُ مَعَ النَّبِيِّينَ وَالصِّدِّيقِينَ وَالشُّهَدَاءِ",
      translit:"At-tajirus-saduqul-aminu maan-nabiyyina was-siddiqina wash-shuhada",
      en:"The truthful and trustworthy merchant will be with the Prophets, the truthful and the martyrs.",
      de:"Der wahrhaftige und vertrauenswürdige Kaufmann wird mit den Propheten, den Wahrhaftigen und den Märtyrern sein.",
      source:"Tirmidhi - Hasan",
      source_ar:"الترمذي — حسن",
      narrator:"Abu Said al-Khudri",
      narrator_ar:"أبو سعيد الخدري رضي الله عنه",
    },
  ],
  sabr: [
    {
      arabic:"مَا أُعْطِيَ أَحَدٌ عَطَاءً خَيْرًا وَأَوْسَعَ مِنَ الصَّبْرِ",
      translit:"Ma utiya ahadun ataan khayran wa awsaa minas-sabr",
      en:"No one has been given a gift better and more comprehensive than patience.",
      de:"Niemandem wurde eine Gabe gegeben, die besser und umfassender ist als Geduld.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Abu Said al-Khudri",
      narrator_ar:"أبو سعيد الخدري رضي الله عنه",
    },
    {
      arabic:"عَجَبًا لِأَمْرِ الْمُؤْمِنِ، إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ",
      translit:"Ajaban li-amril-mumin, inna amrahu kullahu khayr, in asabathu sarraa shakara fakana khayran lah, wa in asabathu darraa sabara fakana khayran lah",
      en:"How wonderful is the affair of the believer! If good happens he gives thanks, and if harm happens he bears patience, both are good for him.",
      de:"Wie wunderbar ist die Angelegenheit des Gläubigen! Trifft ihn Gutes, dankt er; trifft ihn Schlechtes, ist er geduldig.",
      source:"Muslim",
      source_ar:"مسلم",
      narrator:"Suhayb al-Rumi",
      narrator_ar:"صهيب الرومي رضي الله عنه",
    },
    {
      arabic:"مَنْ يَتَصَبَّرْ يُصَبِّرْهُ اللَّهُ",
      translit:"Man yatasabbaru yusabbirhu Allah",
      en:"Whoever tries to be patient, Allah will give him patience.",
      de:"Wer versucht geduldig zu sein, dem gibt Allah Geduld.",
      source:"Bukhari",
      source_ar:"البخاري",
      narrator:"Abu Said al-Khudri",
      narrator_ar:"أبو سعيد الخدري رضي الله عنه",
    },
    {
      arabic:"لَا يَزَالُ الْبَلَاءُ بِالْمُؤْمِنِ وَالْمُؤْمِنَةِ فِي نَفْسِهِ وَوَلَدِهِ وَمَالِهِ حَتَّى يَلْقَى اللَّهَ وَمَا عَلَيْهِ خَطِيئَةٌ",
      translit:"La yazalul-balau bil-mumini wal-muminati fi nafsihi wa waladihi wa malihi hatta yalqallaha wa ma alayhi khati-ah",
      en:"Trials continue to afflict the believing man and woman in their person, children and wealth until they meet Allah with no sin remaining.",
      de:"Prüfungen treffen den gläubigen Mann und die gläubige Frau in ihrer Person, ihren Kindern und ihrem Vermögen, bis sie Allah ohne Sünde begegnen.",
      source:"Tirmidhi - Sahih",
      source_ar:"الترمذي — صحيح",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
  ],
  usra: [
    {
      arabic:"خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ، وَأَنَا خَيْرُكُمْ لِأَهْلِي",
      translit:"Khayrukum khayrukum li-ahlihi, wa ana khayrukum li-ahli",
      en:"The best of you is the best to his family, and I am the best of you to my family.",
      de:"Der Beste von euch ist der Beste gegenüber seiner Familie.",
      source:"Tirmidhi - Sahih",
      source_ar:"الترمذي — صحيح",
      narrator:"Aisha",
      narrator_ar:"عائشة رضي الله عنها",
    },
    {
      arabic:"مَا زَالَ جِبْرِيلُ يُوصِينِي بِالْجَارِ حَتَّى ظَنَنْتُ أَنَّهُ سَيُوَرِّثُهُ",
      translit:"Ma zala Jibril yusini bil-jar, hatta dhannantu annahu sa-yuwwarithuhu",
      en:"Jibreel kept recommending me to treat the neighbor well until I thought he would make him an heir.",
      de:"Jibreel empfahl mir stets, den Nachbarn gut zu behandeln.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Aisha and Ibn Umar",
      narrator_ar:"عائشة وابن عمر رضي الله عنهما",
    },
    {
      arabic:"بِرُّ الْوَالِدَيْنِ أَفْضَلُ الْأَعْمَالِ بَعْدَ الصَّلَاةِ",
      translit:"Birrul-walidayni afdhalul-amali badas-salah",
      en:"Honoring the parents is the best of deeds after prayer.",
      de:"Die Eltern zu ehren ist die beste Tat nach dem Gebet.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Ibn Masud",
      narrator_ar:"ابن مسعود رضي الله عنه",
    },
    {
      arabic:"صِلَةُ الرَّحِمِ تَزِيدُ فِي الْعُمُرِ",
      translit:"Silatur-rahimi tazidu fil-umr",
      en:"Maintaining ties of kinship increases the lifespan.",
      de:"Die Pflege der Verwandtschaft verlängert das Leben.",
      source:"Bukhari",
      source_ar:"البخاري",
      narrator:"Anas ibn Malik",
      narrator_ar:"أنس بن مالك رضي الله عنه",
    },
    {
      arabic:"مَنْ كَانَ لَهُ ثَلَاثُ بَنَاتٍ فَصَبَرَ عَلَيْهِنَّ وَأَطْعَمَهُنَّ وَسَقَاهُنَّ وَكَسَاهُنَّ مِنْ جِدَتِهِ كُنَّ لَهُ حِجَابًا مِنَ النَّارِ يَوْمَ الْقِيَامَةِ",
      translit:"Man kana lahu thalatu banathin fasabara alayhinna wa atamahunna wa saqahunna wa kasahunna min jidatihi kunna lahu hijaban minan-nar",
      en:"Whoever has three daughters and is patient with them, feeds them, gives them to drink and clothes them, they will be a shield for him from the Fire on the Day of Resurrection.",
      de:"Wer drei Töchter hat, geduldig mit ihnen ist, sie ernährt, tränkt und kleidet, werden sie am Tag der Auferstehung ein Schutz vor dem Feuer für ihn sein.",
      source:"Ibn Majah - Sahih",
      source_ar:"ابن ماجه — صحيح",
      narrator:"Uqba ibn Amir",
      narrator_ar:"عقبة بن عامر رضي الله عنه",
    },
  ],
  ilm: [
    {
      arabic:"طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
      translit:"Talabul-ilmi faridhatun ala kulli muslim",
      en:"Seeking knowledge is an obligation upon every Muslim.",
      de:"Das Suchen nach Wissen ist eine Pflicht für jeden Muslim.",
      source:"Ibn Majah - Sahih",
      source_ar:"ابن ماجه — صحيح",
      narrator:"Anas ibn Malik",
      narrator_ar:"أنس بن مالك رضي الله عنه",
    },
    {
      arabic:"مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ",
      translit:"Man salaka tariqan yaltamisu fihi ilman, sahhala Allahu lahu tariqan ilal-jannah",
      en:"Whoever treads a path seeking knowledge, Allah will make easy for him a path to Paradise.",
      de:"Wer einen Weg geht um Wissen zu suchen, dem macht Allah einen Weg ins Paradies leicht.",
      source:"Muslim",
      source_ar:"مسلم",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
    {
      arabic:"إِذَا مَاتَ ابْنُ آدَمَ انْقَطَعَ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ",
      translit:"Idha mata ibnu Adama inqataa amaluhu illa min thalatha: sadaqatin jariyah, aw ilmin yuntafau bih, aw waladin salihin yaduu lah",
      en:"When a person dies all deeds end except three: ongoing charity, beneficial knowledge, or a righteous child who prays for him.",
      de:"Wenn ein Mensch stirbt, enden alle Taten außer drei.",
      source:"Muslim",
      source_ar:"مسلم",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
    {
      arabic:"الْحِكْمَةُ ضَالَّةُ الْمُؤْمِنِ فَحَيْثُ وَجَدَهَا فَهُوَ أَحَقُّ بِهَا",
      translit:"Al-hikmatu dhallatul-mumini, fa-haythu wajadaha fa-huwa ahaqqu biha",
      en:"Wisdom is the lost property of the believer, so wherever he finds it he has the most right to it.",
      de:"Weisheit ist das verlorene Eigentum des Gläubigen; wo immer er sie findet, hat er das meiste Recht darauf.",
      source:"Tirmidhi",
      source_ar:"الترمذي",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
  ],
  mal: [
    {
      arabic:"إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ",
      translit:"Innallaha yuhibbu idha amila ahadukum amalan an yutqinah",
      en:"Allah loves that when one of you does a deed, he does it with excellence.",
      de:"Allah liebt es, wenn einer von euch eine Tat vollbringt, dass er sie mit Exzellenz vollbringt.",
      source:"Bayhaqi - Sahih",
      source_ar:"البيهقي — صحيح",
      narrator:"Aisha",
      narrator_ar:"عائشة رضي الله عنها",
    },
    {
      arabic:"مَا أَكَلَ أَحَدٌ طَعَامًا قَطُّ خَيْرًا مِنْ أَنْ يَأْكُلَ مِنْ عَمَلِ يَدِهِ",
      translit:"Ma akala ahadun taamaan qattu khayran min an yakula min amali yadih",
      en:"No one has eaten food better than what he earned by his own hands.",
      de:"Niemand hat je besseres Essen gegessen als das was er durch seiner eigenen Hände Arbeit verdient hat.",
      source:"Bukhari",
      source_ar:"البخاري",
      narrator:"Al-Miqdad",
      narrator_ar:"المقداد بن معديكرب رضي الله عنه",
    },
    {
      arabic:"لَيْسَ الْغِنَى عَنْ كَثْرَةِ الْعَرَضِ، وَلَكِنَّ الْغِنَى غِنَى النَّفْسِ",
      translit:"Laysal-ghina an kathratil-arad, wa lakinnal-ghina ghinas-nafs",
      en:"Richneß is not having many possessions; trü richneß is the richneß of the soul.",
      de:"Reichtum besteht nicht darin viele Besitztümer zu haben; wahrer Reichtum ist der Reichtum der Seele.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
    {
      arabic:"إِنَّ اللَّهَ يُحِبُّ الْعَبْدَ الْمُؤْمِنَ الْمُحْتَرِفَ",
      translit:"Innallaha yuhibbul-abdalmuminaql-muhtarif",
      en:"Allah loves the believing servant who has a profession.",
      de:"Allah liebt den gläubigen Diener, der einen Beruf hat.",
      source:"Bayhaqi",
      source_ar:"البيهقي",
      narrator:"Ibn Umar",
      narrator_ar:"ابن عمر رضي الله عنهما",
    },
  ],
  adab: [
    {
      arabic:"أَفْشُوا السَّلَامَ بَيْنَكُمْ",
      translit:"Afshu as-salama baynakum",
      en:"Spread the greeting of peace among yourselves.",
      de:"Verbreitet den Friedensgruß untereinander.",
      source:"Muslim",
      source_ar:"مسلم",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
    {
      arabic:"لَا تَدْخُلُونَ الْجَنَّةَ حَتَّى تُؤْمِنُوا، وَلَا تُؤْمِنُوا حَتَّى تَحَابُّوا، أَوَلَا أَدُلُّكُمْ عَلَى شَيْءٍ إِذَا فَعَلْتُمُوهُ تَحَابَبْتُمْ؟ أَفْشُوا السَّلَامَ بَيْنَكُمْ",
      translit:"La tadkhulun al-jannata hatta tuminu, wa la tuminu hatta tahabbu, awa la adullukum ala shay-in idha faltumuh tahahabtum? Afshu as-salama baynakum",
      en:"You will not enter Paradise until you believe, and you will not believe until you love one another. Shall I not tell you of something that if you do it you will love one another? Spread the greeting of peace among yourselves.",
      de:"Ihr werdet das Paradies nicht betreten, bis ihr glaubt, und ihr werdet nicht glauben, bis ihr einander liebt. Soll ich euch nicht auf etwas hinweisen, durch das ihr einander lieben werdet? Verbreitet den Friedensgruß untereinander.",
      source:"Muslim",
      source_ar:"مسلم",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
    {
      arabic:"مَنْ صَمَتَ نَجَا",
      translit:"Man samata naja",
      en:"Whoever remains silent is saved.",
      de:"Wer schweigt, ist gerettet.",
      source:"Tirmidhi - Hasan",
      source_ar:"الترمذي — حسن",
      narrator:"Abdullah ibn Amr",
      narrator_ar:"عبد الله بن عمرو رضي الله عنهما",
    },
    {
      arabic:"مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ ضَيْفَهُ",
      translit:"Man kana yuminu billahi wal-yawmil-akhiri falyukrim dayfah",
      en:"Whoever believes in Allah and the Last Day, let him honor his guest.",
      de:"Wer an Allah und den Jüngsten Tag glaubt, soll seinen Gast ehren.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
    {
      arabic:"الطُّهُورُ شَطْرُ الْإِيمَانِ",
      translit:"At-tuhuru shatur al-iman",
      en:"Cleanliness is half of faith.",
      de:"Reinheit ist die Hälfte des Glaubens.",
      source:"Muslim",
      source_ar:"مسلم",
      narrator:"Abu Malik al-Ashari",
      narrator_ar:"أبو مالك الأشعري رضي الله عنه",
    },
    {
      arabic:"إِنَّ اللَّهَ طَيِّبٌ يُحِبُّ الطَّيِّبَ، نَظِيفٌ يُحِبُّ النَّظَافَةَ",
      translit:"Innallaha tayyibun yuhibbut-tayyib, nadhifun yuhibbun-nadhafa",
      en:"Allah is pure and loves purity, He is clean and loves cleanliness.",
      de:"Allah ist rein und liebt Reinheit, Er ist sauber und liebt Sauberkeit.",
      source:"Tirmidhi - Hasan",
      source_ar:"الترمذي — حسن",
      narrator:"Saad ibn Abi Waqqas",
      narrator_ar:"سعد بن أبي وقاص رضي الله عنه",
    },
    {
      arabic:"إِمَاطَةُ الْأَذَى عَنِ الطَّرِيقِ صَدَقَةٌ",
      translit:"Imatat al-adha anat-tariq sadaqah",
      en:"Removing harmful things from the road is charity.",
      de:"Das Entfernen von Hindernissen von der Straße ist eine Wohltätigkeit.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
    {
      arabic:"إِنَّ الْعَبْدَ لَيَتَكَلَّمُ بِالْكَلِمَةِ مِنْ رِضْوَانِ اللَّهِ لَا يُلْقِي لَهَا بَالًا يَرْفَعُهُ اللَّهُ بِهَا دَرَجَاتٍ",
      translit:"Innal-abda la-yatakalamu bil-kalimati min ridwanil-lahi la yulqi laha balan yarfauhu Allahu biha darajat",
      en:"A servant may speak a word that pleases Allah without giving it much thought, and Allah will raise him many degrees because of it.",
      de:"Ein Diener spricht vielleicht ein Wort, das Allah gefällt, ohne ihm viel zu denken, und Allah wird ihn deswegen um viele Grade erheben.",
      source:"Bukhari",
      source_ar:"البخاري",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
  ],
  sadaqa: [
    {
      arabic:"مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ",
      translit:"Ma naqasat sadaqatun min mal",
      en:"Charity does not decrease wealth.",
      de:"Eine Wohltätigkeit vermindert das Vermögen nicht.",
      source:"Muslim",
      source_ar:"مسلم",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
    {
      arabic:"كُلُّ امْرِئٍ فِي ظِلِّ صَدَقَتِهِ حَتَّى يُقْضَى بَيْنَ النَّاسِ",
      translit:"Kullu imri-in fi dhilli sadaqatihi hatta yuqda baynan-nas",
      en:"Every man will be in the shade of his charity until judgment is passed among the people.",
      de:"Jeder Mensch wird im Schatten seiner Wohltätigkeit sein, bis das Urteil unter den Menschen gesprochen wird.",
      source:"Ahmad - Sahih",
      source_ar:"أحمد — صحيح",
      narrator:"Uqba ibn Amir",
      narrator_ar:"عقبة بن عامر رضي الله عنه",
    },
    {
      arabic:"الصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ",
      translit:"As-sadaqatu tutfi-ul-khati-ata kama yutfi-ul-mau an-nar",
      en:"Charity extinguishes sin just as water extinguishes fire.",
      de:"Die Wohltätigkeit löscht die Sünde aus, wie Wasser das Feuer löscht.",
      source:"Tirmidhi - Sahih",
      source_ar:"الترمذي — صحيح",
      narrator:"Muadh ibn Jabal",
      narrator_ar:"معاذ بن جبل رضي الله عنه",
    },
    {
      arabic:"أَفْضَلُ الصَّدَقَةِ أَنْ تَتَصَدَّقَ وَأَنْتَ صَحِيحٌ شَحِيحٌ تَأْمُلُ الْغِنَى وَتَخْشَى الْفَقْرَ",
      translit:"Afdalu as-sadaqati an tasaddaqa wa anta sahihun shahihun tamulul-ghina wa takhshal-faqr",
      en:"The best charity is to give while you are healthy and miserly, hoping for wealth and fearing poverty.",
      de:"Die beste Wohltätigkeit ist es zu geben, während du gesund und geizig bist, Reichtum erhoffst und Armut fürchtest.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
    {
      arabic:"مَا مِنْ يَوْمٍ يُصْبِحُ الْعِبَادُ فِيهِ إِلَّا مَلَكَانِ يَنْزِلَانِ فَيَقُولُ أَحَدُهُمَا: اللَّهُمَّ أَعْطِ مُنْفِقًا خَلَفًا، وَيَقُولُ الْآخَرُ: اللَّهُمَّ أَعْطِ مُمْسِكًا تَلَفًا",
      translit:"Ma min yawmin yusbihul-ibadu fihi illa malakani yanzilani, fa-yaqulu ahaduhuma: Allahumma ati munfiqan khalafa, wa yaqulul-akharu: Allahumma ati mumsikan talafa",
      en:"Every day two angels descend, one says: O Allah give in place to the one who spends, and the other says: O Allah give loss to the one who withholds.",
      de:"Jeden Tag steigen zwei Engel herab. Einer sagt: O Allah, gib dem Spendenden Ersatz, und der andere sagt: O Allah, gib dem Zurückhaltenden Verlust.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
    {
      arabic:"مَنْ بَنَى مَسْجِدًا لِلَّهِ بَنَى اللَّهُ لَهُ بَيْتًا فِي الْجَنَّةِ",
      translit:"Man bana masjidan lillahi bana Allahu lahu baytan fil-jannah",
      en:"Whoever builds a mosque for Allah, Allah will build for him a house in Paradise.",
      de:"Wer eine Moschee für Allah baut, baut Allah für ihn ein Haus im Paradies.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Uthman ibn Affan",
      narrator_ar:"عثمان بن عفان رضي الله عنه",
    },
    {
      arabic:"سَبْعَةٌ يُظِلُّهُمُ اللَّهُ فِي ظِلِّهِ يَوْمَ لَا ظِلَّ إِلَّا ظِلُّهُ، وَمِنْهُمْ: رَجُلٌ تَصَدَّقَ بِصَدَقَةٍ فَأَخْفَاهَا حَتَّى لَا تَعْلَمَ شِمَالُهُ مَا تُنْفِقُ يَمِينُهُ",
      translit:"Sabatun yudhhillhumullahu fi dhillihi yawma la dhilla illa dhilluhu, wa minhum: rajulun tasaddaqa bisadaqatin fa-akhfaha hatta la talama shimalu ma tunfiqu yaminuh",
      en:"Seven will be shaded by Allah on the Day when there is no shade but His, among them: a man who gives charity and conceals it so that his left hand does not know what his right hand spends.",
      de:"Sieben werden von Allah beschattet an dem Tag, an dem es keinen Schatten außer Seinem gibt, darunter: ein Mann, der Wohltätigkeit gibt und sie verbirgt, sodass seine linke Hand nicht weiß, was seine rechte ausgibt.",
      source:"Bukhari, Muslim",
      source_ar:"البخاري، مسلم",
      narrator:"Abu Hurayra",
      narrator_ar:"أبو هريرة رضي الله عنه",
    },
  ],
};

var CATEGORIES = [
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

var ADHKAR = {
  morning:[
    {
      arabic:"اصبحنا واصبح الملك لله والحمد لله لا اله الا الله وحده لا شريك له له الملك وله الحمد وهو على كل شيء قدير",
      translit:"Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illallah wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa ala kulli shay-in qadir",
      en:"We have reached the morning and at this very time all sovereignty belongs to Allah.",
      source:"Abu Dawud",
      count:1,
    },
    {
      arabic:"اللهم بك اصبحنا وبك امسينا وبك نحيا وبك نموت واليك النشور",
      translit:"Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaykan-nushur",
      en:"O Allah, by You we enter the morning and by You we enter the evening.",
      source:"Tirmidhi",
      count:1,
    },
    {
      arabic:"اللهم انت ربي لا اله الا انت خلقتني وانا عبدك وانا على عهدك ووعدك ما استطعت",
      translit:"Allahumma anta rabbi la ilaha illa ant, khalaqtani wa ana abduk, wa ana ala ahdika wa wadika mastata-t",
      en:"O Allah, You are my Lord, none has the right to be worshipped except You.",
      source:"Bukhari",
      count:1,
    },
    {arabic:"سبحان الله وبحمده", translit:"Subhanallah", translit:"Subhanallahi wa bihamdih", en:"Glory is to Allah and praise is to Him.", source:"Muslim", count:100},
    {
      arabic:"لا اله الا الله وحده لا شريك له له الملك وله الحمد وهو على كل شيء قدير",
      translit:"La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa ala kulli shay-in qadir",
      translit:"La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa ala kulli shay-in qadir",
      en:"None has the right to be worshipped except Allah, alone, without partner.",
      source:"Bukhari, Muslim",
      count:10,
    },
  ],
  evening:[
    {
      arabic:"امسينا وامسى الملك لله والحمد لله لا اله الا الله وحده لا شريك له",
      translit:"Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallah, wahdahu la sharika lah",
      en:"We have reached the evening and at this very time all sovereignty belongs to Allah.",
      source:"Abu Dawud",
      count:1,
    },
    {
      arabic:"اللهم بك امسينا وبك اصبحنا وبك نحيا وبك نموت واليك المصير",
      translit:"Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu, wa ilaykal-masir",
      en:"O Allah, by You we enter the evening and by You we enter the morning.",
      source:"Tirmidhi",
      count:1,
    },
    {
      arabic:"اعوذ بكلمات الله التامات من شر ما خلق",
      translit:"Audhu bikalimatiLlahit-tammati min sharri ma khalaq",
      en:"I seek refuge in the perfect words of Allah from the evil of what He has created.",
      source:"Muslim",
      count:3,
    },
  ],
  sleep:[
    {arabic:"باسمك اللهم اموت واحيا", translit:"Bismika Allahumma amutu wa ahya", translit:"Bismika Allahumma amutu wa ahya", en:"In Your name O Allah, I die and I live.", source:"Bukhari", count:1},
    {
      arabic:"اللهم قني عذابك يوم تبعث عبادك",
      en:"O Allah, protect me from Your punishment on the Day You resurrect Your servants.",
      translit:"Allahumma qini adhabaka yawma tabathu ibadak",
      source:"Abu Dawud, Tirmidhi",
      count:3,
    },
    {arabic:"سبحان الله", translit:"Subhanallah", en:"Glory is to Allah.", source:"Bukhari, Muslim", count:33},
    {arabic:"الحمد لله", translit:"Alhamdulillah", en:"All praise is for Allah.", source:"Bukhari, Muslim", count:33},
    {arabic:"الله اكبر", translit:"Allahu Akbar", en:"Allah is the Greatest.", source:"Bukhari, Muslim", count:34},
  ],
  wakeup:[
    {
      arabic:"الحمد لله الذي احيانا بعد ما اماتنا واليه النشور",
      translit:"Alhamdu lillahil-ladhi ahyana badama amatana wa ilayhin-nushur, wa lahu asbahna wa lahu amsayna",
      translit:"Alhamdu lillahil-ladhi ahyana badama amatana wa ilayhin-nushur",
      en:"All praise is for Allah who gave us life after having taken it from us.",
      source:"Bukhari",
      count:1,
    },
    {
      arabic:"لا اله الا الله وحده لا شريك له له الملك وله الحمد وهو على كل شيء قدير سبحان الله والحمد لله ولا اله الا الله والله اكبر",
      translit:"La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa ala kulli shay-in qadir. Subhanallah walhamdu lillah wa la ilaha illallah wallahu akbar, wa la hawla wa la quwwata illa billah",
      translit:"La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa ala kulli shay-in qadir. Subhanallah walhamdu lillah wa la ilaha illallah wallahu akbar, wa la hawla wa la quwwata illa billah",
      en:"None has the right to be worshipped except Allah alone. Glory is to Allah, praise is to Allah, there is no god but Allah, and Allah is the Greatest.",
      source:"Bukhari",
      count:1,
    },
  ],
  prayer:[
    {
      arabic:"سبحانك اللهم وبحمدك وتبارك اسمك وتعالى جدك ولا اله غيرك",
      translit:"Subhanakallahumma wa bihamdika, wa tabarakasmuk, wa taala jadduk, wa la ilaha ghayruk",
      en:"Glory is to You O Allah, and praise. Blessed is Your name and exalted is Your majesty.",
      source:"Abu Dawud, Tirmidhi",
      count:1,
    },
    {arabic:"سبحان ربي العظيم", translit:"Subhana rabbiyal-adhim", en:"Glory is to my Lord the Most Great.", source:"Abu Dawud, Ibn Majah", count:3},
    {arabic:"سبحان ربي الاعلى", translit:"Subhana rabbiyal-ala", en:"Glory is to my Lord, the Most High.", source:"Abu Dawud, Ibn Majah", count:3},
    {arabic:"ربي اغفر لي", translit:"Rabbighfir li", en:"O Lord, forgive me.", source:"Ibn Majah", count:1},
    {
      arabic:"التحيات لله والصلوات والطيبات السلام عليك ايها النبي ورحمة الله وبركاته السلام علينا وعلى عباد الله الصالحين",
      en:"All compliments, prayers and pure words are dü to Allah. Peace be upon you, O Prophet.",
      translit:"At-tahiyyatu lillahi was-salawatu wat-tayyibat, as-salamu alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh. As-salamu alayna wa ala ibadillahis-salihin",
      source:"Bukhari, Muslim",
      count:1,
    },
    {
      arabic:"اللهم صل على محمد وعلى آل محمد كما صليت على إبراهيم وعلى آل إبراهيم إنك حميد مجيد اللهم بارك على محمد وعلى آل محمد كما باركت على إبراهيم وعلى آل إبراهيم إنك حميد مجيد",
      translit:"Allahumma salli ala Muhammadin wa ala ali Muhammadin kama sallayta ala Ibrahima wa ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik ala Muhammadin wa ala ali Muhammadin kama barakta ala Ibrahima wa ala ali Ibrahim, innaka Hamidun Majid",
      en:"O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim - You are Praiseworthy and Glorious. O Allah, send blessings upon Muhammad and upon the family of Muhammad, as You sent blessings upon Ibrahim and the family of Ibrahim - You are Praiseworthy and Glorious.",
      source:"Bukhari, Muslim",
      count:1,
    },
  ],
  after_prayer:[
    {arabic:"استغفر الله استغفر الله استغفر الله", en:"I seek the forgiveneß of Allah. (x3)", translit:"Astaghfirullah, astaghfirullah, astaghfirullah", source:"Muslim", count:3},
    {
      arabic:"اللهم انت السلام ومنك السلام تباركت ذا الجلال والاكرام",
      translit:"Allahumma antas-salam wa minkas-salam, tabarakta dhal-jalali wal-ikram",
      en:"O Allah, You are Peace and from You is peace. Blessed are You, O Owner of majesty and honour.",
      source:"Muslim",
      count:1,
    },
    {arabic:"سبحان الله", translit:"Subhanallah", en:"Glory is to Allah.", source:"Bukhari, Muslim", count:33},
    {arabic:"الحمد لله", translit:"Alhamdulillah", en:"All praise is for Allah.", source:"Bukhari, Muslim", count:33},
    {arabic:"الله اكبر", translit:"Allahu Akbar", en:"Allah is the Greatest.", source:"Bukhari, Muslim", count:34},
  ],
  wudu:[
    {arabic:"بسم الله", translit:"Bismillah", en:"In the name of Allah.", source:"Abu Dawud", count:1},
    {
      arabic:"اشهد ان لا اله الا الله وحده لا شريك له واشهد ان محمدا عبده ورسوله اللهم اجعلني من التوابين واجعلني من المتطهرين",
      en:"I bear witneß that none has the right to be worshipped except Allah. O Allah, make me of those who repent and purify themselves.",
      translit:"Ashhadu alla ilaha illallahu wahdahu la sharika lah, wa ashhadu anna Muhammadan abduhu wa rasuluh. Allahumma ij-alni minat-tawwabin waj-alni minal-mutatahhirin",
      source:"Muslim",
      count:1,
    },
  ],
  home_out:[
    {
      arabic:"بسم الله توكلت على الله ولا حول ولا قوة الا بالله",
      translit:"Bismillahi tawakkaltu alallah, wa la hawla wa la quwwata illa billah",
      translit:"Bismillah, tawakkaltu alallah, wa la hawla wa la quwwata illa billah",
      en:"In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
      source:"Abu Dawud, Tirmidhi",
      count:1,
    },
  ],
  home_in:[
    {
      arabic:"بسم الله ولجنا وبسم الله خرجنا وعلى الله ربنا توكلنا",
      translit:"Bismillahi walajna, wa bismillahi kharajna, wa alallahi rabbina tawakkalna",
      en:"In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we place our trust.",
      source:"Abu Dawud",
      count:1,
    },
  ],
  mosque:[
    {arabic:"اللهم افتح لي ابواب رحمتك", en:"O Allah, open the gates of Your mercy for me.", translit:"Allahumma aftah li abwaba rahmatik", source:"Muslim", count:1},
    {
      arabic:"اعوذ بالله العظيم وبوجهه الكريم وسلطانه القديم من الشيطان الرجيم",
      en:"I seek refuge with Allah the Magnificent, and with His noble Face, and His eternal authority from the accursed devil.",
      translit:"Audhu billahil-adhim, wa biwajhihil-karim, wa sultanihil-qadim, minash-shaytanir-rajim",
      source:"Abu Dawud",
      count:1,
    },
  ],
  food:[
    {arabic:"بسم الله", translit:"Bismillah", en:"In the name of Allah.", source:"Abu Dawud", count:1},
    {
      arabic:"الحمد لله الذي اطعمنا وسقانا وجعلنا مسلمين",
      translit:"Alhamdu lillahil-ladhi atamana wa saqana wa jaalna muslimin",
      translit:"Alhamdulillah",
      en:"All praise is for Allah Who fed us and gave us drink and made us Muslims.",
      source:"Abu Dawud, Tirmidhi",
      count:1,
    },
  ],
  travel:[
    {
      arabic:"الله اكبر الله اكبر الله اكبر سبحان الذي سخر لنا هذا وما كنا له مقرنين وانا الى ربنا لمنقلبون اللهم انا نسالك في سفرنا هذا البر والتقوى ومن العمل ما ترضى اللهم هون علينا سفرنا هذا واطو عنا بعده",
      translit:"Allahu Akbar, Allahu Akbar, Allahu Akbar. Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun. Allahumma inna nasaluka fi safarina hadhal-birra wat-taqwa wa minal-amali ma tarda. Allahumma hawwin alayna safarana hadha watwi anna budah",
      en:"Allah is Greatest x3. Glory is to Him Who has provided this for us. O Allah, we ask You on this journey for goodneß and piety.",
      source:"Muslim",
      count:1,
    },
    {
      arabic:"اللهم انت الصاحب في السفر والخليفة في الاهل اللهم اني اعوذ بك من وعثاء السفر وكابة المنظر وسوء المنقلب في المال والاهل والولد",
      en:"O Allah, You are the Companion on the journey. O Allah, I seek refuge in You from the hardships of travel.",
      translit:"Allahumma antas-sahibu fis-safari wal-khalifatu fil-ahl, Allahumma inni audhu bika min watha-is-safari wa kaabatil-mandhar wa su-il-munqalabi fil-mali wal-ahli wal-walad",
      source:"Muslim",
      count:1,
    },
        {
      arabic:"ايبون تايبون عابدون لربنا حامدون",
      en:"We return, repentant, worshipping and praising our Lord.",
      translit:"Ayibuna, ta-ibuna, abiduna, lirabbina hamidun",
      source:"Bukhari, Muslim",
      count:1,
    },
  ],
  distress:[
    {
      arabic:"لا اله الا الله العظيم الحليم لا اله الا الله رب العرش العظيم لا اله الا الله رب السماوات ورب الارض ورب العرش الكريم",
      translit:"La ilaha illallahul-adhimul-halim. La ilaha illallahu rabbul-arshil-adhim. La ilaha illallahu rabbus-samawati wa rabbul-ardi wa rabbul-arshil-karim",
      en:"There is no god but Allah, the Magnificent, the Forbearing. There is no god but Allah, Lord of the Magnificent Throne.",
      source:"Bukhari, Muslim",
      count:1,
    },
    {
      arabic:"لا اله الا انت سبحانك اني كنت من الظالمين",
      translit:"La ilaha illa anta subhanaka inni kuntu minadh-dhalimin",
      en:"There is no god but You, glory be to You; truly I have been one of the wrongdoers.",
      source:"Tirmidhi",
      count:1,
    },
    {
      arabic:"يا حي يا قيوم برحمتك استغيث اصلح لي شاني كله ولا تكلني الى نفسي طرفة عين",
      en:"O Ever-Living One, O Eternal One, by Your mercy I call on You to set right all my affairs.",
      translit:"Ya Hayyu ya Qayyumu, birahmatika astaghith, aslih li sha-ni kullahu wa la takilni ila nafsi tarfata ayn",
      translit:"Ya Hayyu ya Qayyumu, birahmatika astaghith, aslih li sha-ni kullahu wa la takilni ila nafsi tarfata ayn",
      source:"Al-Hakim",
      count:1,
    },
  ],
  sick:[
    {
      arabic:"بسم الله ارقيك من كل شيء يوذيك من شر كل نفس او عين حاسد الله يشفيك بسم الله ارقيك",
      translit:"Bismillahi arqik, min kulli shay-in yu-dhik, min sharri kulli nafsin aw ayni hasid, Allahu yashfik. Bismillahi arqik",
      en:"In the name of Allah I perform ruqya for you, from everything that is harming you. May Allah heal you.",
      source:"Muslim",
      count:3,
    },
    {
      arabic:"اللهم رب الناس اذهب الباس اشفه وانت الشافي لا شفاء الا شفاوك شفاء لا يغادر سقما",
      en:"O Allah, Lord of mankind, remove the affliction and heal. You are the Healer. There is no healing except Your healing.",
      translit:"Allahumma rabban-nas, adh-hibil-bas, ishfi antash-shafi, la shifa-a illa shifa-uk, shifa-an la yughadiru saqama",
      source:"Bukhari, Muslim",
      count:1,
    },
  ],
  baaqiyat:[
    {arabic:"سبحان الله", translit:"Subhanallah", en:"Glory is to Allah.", source:"Bukhari, Muslim", count:33},
    {arabic:"الحمد لله", translit:"Alhamdulillah", en:"All praise is for Allah.", source:"Bukhari, Muslim", count:33},
    {arabic:"الله اكبر", translit:"Allahu Akbar", en:"Allah is the Greatest.", source:"Bukhari, Muslim", count:34},
    {arabic:"لا اله الا الله", translit:"La ilaha illallah", en:"There is no god but Allah.", source:"Muslim", count:100},
    {
      arabic:"لا حول ولا قوة الا بالله",
      translit:"La hawla wa la quwwata illa billah",
      en:"There is no power or might except with Allah - it is a treasure from the treasures of Paradise.",
      source:"Bukhari, Muslim",
      count:1,
    },
    {
      arabic:"سبحان الله وبحمده",
      translit:"Subhanallah",
      translit:"Subhanallahi wa bihamdih",
      en:"Glory is to Allah and praise is to Him - whoever says it 100 times, his sins are forgiven even if they were like the foam of the sea.",
      source:"Bukhari, Muslim",
      count:100,
    },
  ],
  prophetic:[
    {
      arabic:"اللهم اني اسالك العافية في الدنيا والاخرة اللهم اني اسالك العفو والعافية في ديني ودنياي واهلي ومالي",
      en:"O Allah, I ask You for good health in this world and the Hereafter.",
      translit:"Allahumma inni as-alukal-afiyata fid-dunya wal-akhirah, Allahumma inni as-alukal-afwa wal-afiyata fi dini wa dunyaya wa ahli wa mali",
      source:"Abu Dawud, Ibn Majah",
      count:1,
    },
    {
      arabic:"اللهم اني اسالك الهدى والتقى والعفاف والغنى",
      en:"O Allah, I ask You for guidance, piety, chastity and self-sufficiency.",
      translit:"Allahumma inni as-alukal-huda wat-tuqa wal-afafa wal-ghina",
      source:"Muslim",
      count:1,
    },
    {
      arabic:"اللهم اتنا في الدنيا حسنة وفي الاخرة حسنة وقنا عذاب النار",
      en:"O Allah, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
      translit:"Allahumma atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar",
      source:"Bukhari, Muslim",
      count:1,
    },
    {
      arabic:"اللهم اني اعوذ بك من الهم والحزن واعوذ بك من العجز والكسل واعوذ بك من الجبن والبخل واعوذ بك من غلبة الدين وقهر الرجال",
      en:"O Allah, I seek refuge in You from worry and grief, from helplessneß and laziness, from cowardice and miserliness.",
      translit:"Allahumma inni audhu bika minal-hammi wal-hazan, wal-ajzi wal-kasal, wal-jubni wal-bukhl, wa dalatid-dayni wa ghalabatir-rijal",
      source:"Bukhari",
      count:1,
    },
    {
      arabic:"يا حي يا قيوم برحمتك استغيث اصلح لي شاني كله ولا تكلني الى نفسي طرفة عين",
      en:"O Ever-Living One, O Eternal One, by Your mercy I call on You to set right all my affairs.",
      translit:"Ya Hayyu ya Qayyumu, birahmatika astaghith, aslih li sha-ni kullahu wa la takilni ila nafsi tarfata ayn",
      source:"Al-Hakim",
      count:1,
    },
  ],
  exam:[
    {
      arabic:"رب اشرح لي صدري ويسر لي امري واحلل عقدة من لساني يفقهوا قولي",
      translit:"Rabbi ishrah li sadri, wa yassir li amri, wahlul uqdatan min lisani yafqahu qawli",
      en:"O Lord, expand my chest, ease my task for me and remove the impediment from my tongue.",
      source:"Quran - Taha 25-28",
      count:1,
    },
    {
      arabic:"اللهم لا سهل الا ما جعلته سهلا وانت تجعل الحزن اذا شئت سهلا",
      translit:"Allahumma la sahla illa ma jaaltahu sahlan, wa anta taj-alul-hazna idha shiata sahlan",
      en:"O Allah, there is no ease except in that which You have made easy.",
      source:"Ibn al-Sunni",
      count:1,
    },
    {arabic:"رب زدني علما", translit:"Rabbi zidni ilma", en:"O Lord, increase me in knowledge.", source:"Quran - Taha 114", count:1},
    {
      arabic:"اللهم انفعني بما علمتني وعلمني ما ينفعني وزدني علما",
      translit:"Allahumma anfani bima allamtani wa allimni ma yanfauni wa zidni ilma",
      en:"O Allah, benefit me with what You have taught me, and teach me what will benefit me, and increase me in knowledge.",
      source:"Tirmidhi, Ibn Majah",
      count:1,
    },
  ],
  quran:[
    {
      arabic:"سبحان الله وبحمده سبحان الله العظيم",
      translit:"Subhanallahi wa bihamdih, subhanallahil-adhim",
      translit:"Subhanallahi wa bihamdih",
      en:"Glory and praise is to Allah, glory is to Allah the Magnificent.",
      source:"Bukhari, Muslim",
      count:1,
    },
    {arabic:"استغفر الله واتوب اليه", translit:"Astaghfirullaha wa atubu ilayh", en:"I seek the forgiveneß of Allah and repent to Him.", source:"Bukhari, Muslim", count:100},
    {arabic:"اللهم صل وسلم على نبينا محمد", translit:"Allahumma salli wa sallim ala nabiyyina Muhammad", en:"O Allah, send prayers and peace upon our Prophet Muhammad.", source:"Sunnah", count:10},
    {
      arabic:"حسبي الله لا اله الا هو عليه توكلت وهو رب العرش العظيم",
      en:"Allah is sufficient for me; there is no god but He. In Him I have placed my trust.",
      translit:"Hasbiyallahu la ilaha illa huwa, alayhi tawakkaltu wa huwa rabbul-arshil-adhim",
      source:"Abu Dawud",
      count:7,
    },
  ],
};

// -- COMPONENT --------------------------------------

var BG = "#f5f0e8";
var GOLD = "#8b6914";
var TEXT = "#2c1810";
var CARD = "rgba(139,105,20,0.08)";
var S = {
  app:{minHeight:"100vh",background:"#f8f3e8",backgroundImage:"url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='60'%20height='60'%3E%3Cpolygon%20transform='translate(30,30)'%20fill='none'%20stroke='%238b6914'%20stroke-width='0.7'%20opacity='0.28'%20points='0.0,-21.0%206.2,-14.9%2014.9,-14.9%2014.9,-6.2%2021.0,0.0%2014.9,6.2%2014.9,14.9%206.2,14.9%200.0,21.0%20-6.2,14.9%20-14.9,14.9%20-14.9,6.2%20-21.0,0.0%20-14.9,-6.2%20-14.9,-14.9%20-6.2,-14.9'/%3E%3C/svg%3E\")",backgroundSize:"60px 60px",fontFamily:"Amiri,serif",color:"#2c1810",maxWidth:430,margin:"0 auto"},
  hdr:{padding:"12px 16px",background:"#f8f3e8",borderBottom:"1px solid rgba(139,105,20,0.25)",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100},
  ttl:{fontSize:22,fontWeight:700,color:"#8b6914",fontFamily:"Amiri,serif"},
  sub:{fontSize:10,color:"#9a8878",letterSpacing:2},
  btn:{background:"none",border:"none",cursor:"pointer",padding:"4px 8px",borderRadius:8},
  card:{background:"rgba(255,252,245,0.9)",border:"1px solid rgba(201,168,76,0.12)",borderRadius:16,padding:"16px 14px",cursor:"pointer",textAlign:"right",width:"100%",transition:"all 0.2s"},
  grid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,padding:"0 16px"},
  arabic:{fontSize:20,fontFamily:"Amiri,serif",color:"#2c1810",lineHeight:2,direction:"rtl",textAlign:"center"},
  trans:{fontSize:13,color:"#5a4a3a",fontFamily:"Arial,sans-serif",lineHeight:1.7,marginTop:12,paddingTop:12,borderTop:"1px solid rgba(201,168,76,0.1)"},
  src:{fontSize:11,color:"#8b6914",fontFamily:"Arial,sans-serif",marginTop:8,textAlign:"center"},
  counter:{textAlign:"center",margin:"16px 0"},
  tapBtn:{width:140,height:140,borderRadius:"50%",border:"2px solid rgba(201,168,76,0.3)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",margin:"0 auto",background:"rgba(139,105,20,0.08)"},
  progress:{height:3,background:"linear-gradient(90deg,#8b6914,#c49a28)",borderRadius:3,transition:"width 0.4s"},
};

var BG="#f5f0e8",GOLD="#8b6914",TEXT="#2c1810",CARD="rgba(139,105,20,0.06)";




export default function App() {
  var ls=useState("ar"),lang=ls[0],setLang=ls[1];
  var ss=useState("adhkar"),section=ss[0],setSection=ss[1];
  var vs=useState("home"),view=vs[0],setView=vs[1];
  var cs=useState(null),selCat=cs[0],setSelCat=cs[1];
  var di=useState(0),dhikrIdx=di[0],setDhikrIdx=di[1];
  var co=useState({}),counts=co[0],setCounts=co[1];
  var dn=useState({}),done=dn[0],setDone=dn[1];
  var tr=useState(true),showTr=tr[0],setShowTr=tr[1];
  var se=useState(false),showSet=se[0],setShowSet=se[1];
  var hc=useState(null),hCat=hc[0],setHCat=hc[1];
  var hi=useState(0),hIdx=hi[0],setHIdx=hi[1];
  var hl=useState(false),hList=hl[0],setHList=hl[1];
  var sp=useState(true),splash=sp[0],setSplash=sp[1];
  var sf=useState(false),fade=sf[0],setFade=sf[1];

  useEffect(function(){
    var t1=setTimeout(function(){setFade(true);},2800);
    var t2=setTimeout(function(){setSplash(false);},3500);
    return function(){clearTimeout(t1);clearTimeout(t2);};
  },[]);

  useEffect(function(){
    var el=document.createElement("style");
    el.textContent="@import url(https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&display=swap);*{box-sizing:border-box;margin:0;padding:0}body{background:#f5f0e8}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#c9a84c44;border-radius:4px}@keyframes sIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes fIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.fin{animation:fIn 0.3s ease}";
    document.head.appendChild(el);
    return function(){document.head.removeChild(el);};
  },[]);

  function T(o){if(!o)return"";if(lang==="ar")return o.ar||"";if(lang==="de")return o.de||o.en||"";return o.en||"";}

  var list=selCat?(ADHKAR[selCat]||[]):[];
  var dhikr=list[dhikrIdx]||null;
  var cKey=(selCat||"")+"-"+dhikrIdx;
  var cCount=counts[cKey]||0;
  var req=dhikr?(dhikr.count||1):1;
  var isDone=cCount>=req;
  var pct=req>0?Math.min(100,(cCount/req)*100):0;
  var doneInCat=list.filter(function(_,i){return done[(selCat||"")+"-"+i];}).length;

  function tap(){
    if(!dhikr||isDone)return;
    var n=cCount+1;
    var nc=Object.assign({},counts);nc[cKey]=n;setCounts(nc);
    if(n>=req){var nd=Object.assign({},done);nd[cKey]=true;setDone(nd);}
  }

  function reset(){var nc=Object.assign({},counts);nc[cKey]=0;setCounts(nc);}

  var A={Amiri:"Amiri,serif",mono:"Arial,sans-serif"};
  var FF=lang==="ar"?A.Amiri:A.mono;

  return (
    <div style={{minHeight:"100vh",background:"#f8f3e8",color:"#2c1810",maxWidth:430,margin:"0 auto",fontFamily:FF}}>

      {splash && (
        <div style={{position:"fixed",inset:0,background:"#f8f3e8",backgroundImage:"url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='60'%20height='60'%3E%3Cpolygon%20transform='translate(30,30)'%20fill='none'%20stroke='%238b6914'%20stroke-width='0.7'%20opacity='0.28'%20points='0.0,-21.0%206.2,-14.9%2014.9,-14.9%2014.9,-6.2%2021.0,0.0%2014.9,6.2%2014.9,14.9%206.2,14.9%200.0,21.0%20-6.2,14.9%20-14.9,14.9%20-14.9,6.2%20-21.0,0.0%20-14.9,-6.2%20-14.9,-14.9%20-6.2,-14.9'/%3E%3C/svg%3E\")",backgroundSize:"60px 60px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:999,opacity:fade?0:1,transition:"opacity 0.7s ease"}}>
          <svg width="130" height="130" viewBox="0 0 200 200" style={{marginBottom:24}}><polygon transform="translate(100,100)" fill="rgba(139,105,20,0.15)" stroke="#8b6914" strokeWidth="2" strokeLinejoin="miter" points="0.0,-77.8 22.8,-55.0 55.0,-55.0 55.0,-22.8 77.8,0.0 55.0,22.8 55.0,55.0 22.8,55.0 0.0,77.8 -22.8,55.0 -55.0,55.0 -55.0,22.8 -77.8,0.0 -55.0,-22.8 -55.0,-55.0 -22.8,-55.0"/></svg>
          <div style={{fontSize:48,fontFamily:A.Amiri,fontWeight:700,color:"#8b6914",animation:"sIn 0.8s ease 0.3s both"}}>ذكّر</div>
          <div style={{width:50,height:1,background:"linear-gradient(90deg,transparent,"+GOLD+",transparent)",margin:"16px 0"}} />
          <div style={{fontSize:19,fontFamily:A.Amiri,color:"#2c1810",textAlign:"center",direction:"rtl",lineHeight:2,animation:"sIn 0.8s ease 0.7s both",padding:"0 40px"}}>وَذَكِّرْ فَإِنَّ الذِّكْرَى تَنْفَعُ الْمُؤْمِنِينَ</div>
          <div style={{fontSize:13,color:"#8b6914",fontFamily:A.Amiri,marginTop:10}}>سورة الذاريات - 55</div>
          <div style={{fontSize:10,color:"#9a8878",marginTop:32,letterSpacing:3}}>DHAKKIR</div>
        </div>
      )}

      {!splash && showSet && (
        <div style={{minHeight:"100vh",background:"#f8f3e8",backgroundImage:"url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='60'%20height='60'%3E%3Cpolygon%20transform='translate(30,30)'%20fill='none'%20stroke='%238b6914'%20stroke-width='0.7'%20opacity='0.28'%20points='0.0,-21.0%206.2,-14.9%2014.9,-14.9%2014.9,-6.2%2021.0,0.0%2014.9,6.2%2014.9,14.9%206.2,14.9%200.0,21.0%20-6.2,14.9%20-14.9,14.9%20-14.9,6.2%20-21.0,0.0%20-14.9,-6.2%20-14.9,-14.9%20-6.2,-14.9'/%3E%3C/svg%3E\")",backgroundSize:"60px 60px"}}>
          <div style={{padding:"12px 16px",background:"#f8f3e8",borderBottom:"1px solid rgba(139,105,20,0.25)",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0}}>
            <button style={{background:"rgba(139,105,20,0.12)",border:"1px solid rgba(139,105,20,0.25)",color:"#8b6914",borderRadius:10,padding:"6px 14px",cursor:"pointer",fontSize:13}} onClick={function(){setShowSet(false);}}>
              {lang==="ar"?"رجوع":lang==="de"?"Zurück":"Back"}
            </button>
            <div style={{fontSize:16,color:"#8b6914",fontFamily:A.Amiri}}>{lang==="ar"?"الاعدادات":lang==="de"?"Einstellungen":"Settings"}</div>
            <div style={{width:60}} />
          </div>
          <div style={{padding:"24px 20px"}}>
            <div style={{fontSize:11,color:"#9a8878",letterSpacing:1,marginBottom:10}}>{lang==="ar"?"اللغة":lang==="de"?"SPRACHE":"LANGUAGE"}</div>
            <div style={{display:"flex",gap:8,marginBottom:28}}>
              {["ar","en","de"].map(function(l){return(
                <button key={l} onClick={function(){setLang(l);}} style={{flex:1,padding:"10px 0",background:lang===l?"rgba(139,105,20,0.25)":"rgba(139,105,20,0.06)",border:"1px solid "+(lang===l?"rgba(139,105,20,0.5)":"rgba(139,105,20,0.1)"),borderRadius:12,color:lang===l?GOLD:"#9a8878",cursor:"pointer",fontSize:13}}>
                  {l==="ar"?"العربية":l==="en"?"English":"Deutsch"}
                </button>
              );})}
            </div>
            <div style={{fontSize:11,color:"#9a8878",letterSpacing:1,marginBottom:10}}>{lang==="ar"?"خيارات العرض":lang==="de"?"ANZEIGEOPTIONEN":"DISPLAY"}</div>
            {[
              {lbl:lang==="ar"?"اظهار الترجمة":lang==="de"?"Übersetzung":"Show Translation",val:showTr,set:setShowTr},
            ].map(function(o){return(
              <div key={o.lbl} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <span style={{fontSize:13,color:"#2c1810"}}>{o.lbl}</span>
                <button onClick={function(){o.set(!o.val);}} style={{width:48,height:26,borderRadius:13,background:o.val?GOLD:"rgba(139,105,20,0.12)",border:"none",cursor:"pointer",position:"relative",transition:"background 0.2s"}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:o.val?24:4,transition:"left 0.2s"}} />
                </button>
              </div>
            );})}
          </div>
        </div>
      )}

      {!splash && !showSet && view==="dhikr" && dhikr && (
        <div style={{minHeight:"100vh",background:"#f8f3e8",backgroundImage:"url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='60'%20height='60'%3E%3Cpolygon%20transform='translate(30,30)'%20fill='none'%20stroke='%238b6914'%20stroke-width='0.7'%20opacity='0.28'%20points='0.0,-21.0%206.2,-14.9%2014.9,-14.9%2014.9,-6.2%2021.0,0.0%2014.9,6.2%2014.9,14.9%206.2,14.9%200.0,21.0%20-6.2,14.9%20-14.9,14.9%20-14.9,6.2%20-21.0,0.0%20-14.9,-6.2%20-14.9,-14.9%20-6.2,-14.9'/%3E%3C/svg%3E\")",backgroundSize:"60px 60px",paddingBottom:80}} className="fin">
          <div style={{padding:"12px 16px",background:"#f8f3e8",borderBottom:"1px solid rgba(139,105,20,0.25)",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0}}>
            <button style={{background:"rgba(139,105,20,0.12)",border:"1px solid rgba(139,105,20,0.25)",color:"#8b6914",fontSize:16,cursor:"pointer",borderRadius:10,padding:"6px 14px",fontFamily:"Arial,sans-serif"}} onClick={function(){setView("category");}}>{"< رجوع"}</button>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:11,color:"#9a8878"}}>{dhikrIdx+1} / {list.length}</div>
              <div style={{fontSize:14,color:"#8b6914",fontFamily:A.Amiri}}>{T(CATEGORIES.find(function(c){return c.id===selCat;}))}</div>
            </div>
            <button style={{background:"none",border:"none",color:"#9a8878",fontSize:16,cursor:"pointer"}} onClick={function(){setShowSet(true);}}>{"⚙"}</button>
          </div>
          <div style={{padding:"16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <button onClick={function(){if(dhikrIdx>0)setDhikrIdx(dhikrIdx-1);}} style={{background:"none",border:"none",color:dhikrIdx>0?GOLD:"#ccc0b0",fontSize:24,cursor:"pointer"}}>{"<"}</button>
              <div style={{height:4,flex:1,margin:"0 8px",background:"rgba(139,105,20,0.1)",borderRadius:2}}>
                <div style={{height:"100%",borderRadius:2,background:"linear-gradient(90deg,#8b6914,#c49a28)",width:pct+"%",transition:"width 0.4s"}} />
              </div>
              <button onClick={function(){if(dhikrIdx<list.length-1)setDhikrIdx(dhikrIdx+1);}} style={{background:"none",border:"none",color:dhikrIdx<list.length-1?GOLD:"#ccc0b0",fontSize:24,cursor:"pointer"}}>{">"}</button>
            </div>
            <div style={{background:"rgba(139,105,20,0.08)",border:"1px solid rgba(139,105,20,0.25)",borderRadius:20,padding:"24px 20px",marginBottom:16,position:"relative"}}>
              <svg style={{position:"absolute",top:0,right:0,opacity:0.25}} width="50" height="50" viewBox="0 0 50 50" fill="none" stroke="#8b6914" strokeWidth="0.8">
                <path d="M48,2 L30,2 Q25,2 25,8 L25,15 Q25,22 18,22 L10,22 Q4,22 2,28 L2,48" />
                <path d="M48,8 L35,8 Q30,8 30,15 L30,22 Q30,28 24,28 L15,28 Q8,28 8,35 L8,48" />
                <circle cx="48" cy="2" r="2" fill="#8b6914" />
                <circle cx="25" cy="15" r="1.5" fill="#8b6914" />
              </svg>
              <svg style={{position:"absolute",bottom:0,left:0,opacity:0.25,transform:"rotate(180deg)"}} width="50" height="50" viewBox="0 0 50 50" fill="none" stroke="#8b6914" strokeWidth="0.8">
                <path d="M48,2 L30,2 Q25,2 25,8 L25,15 Q25,22 18,22 L10,22 Q4,22 2,28 L2,48" />
                <path d="M48,8 L35,8 Q30,8 30,15 L30,22 Q30,28 24,28 L15,28 Q8,28 8,35 L8,48" />
                <circle cx="48" cy="2" r="2" fill="#8b6914" />
              </svg>
              <div style={{fontSize:22,fontFamily:A.Amiri,color:"#2c1810",lineHeight:2,direction:"rtl",textAlign:"center"}}>{dhikr.arabic}</div>
              <div style={{textAlign:"center",margin:"8px 0",opacity:0.35}}>
                <svg width="24" height="24" viewBox="0 0 160 160">
                  <polygon transform="translate(80,80)" fill="#8b6914" stroke="none"
                    points="0,-77.8 22.8,-55 55,-55 55,-22.8 77.8,0 55,22.8 55,55 22.8,55 0,77.8 -22.8,55 -55,55 -55,22.8 -77.8,0 -55,-22.8 -55,-55 -22.8,-55"/>
                </svg>
              </div>
              {dhikr.translit && (
                <div style={{fontSize:13,color:"#6a5a4a",fontStyle:"italic",textAlign:"center",marginTop:10,lineHeight:1.8,wordBreak:"break-word"}}>{dhikr.translit}</div>
              )}
              {showTr && dhikr.en && (
                <div style={{fontSize:13,color:"#5a4a3a",marginTop:12,paddingTop:12,borderTop:"1px solid rgba(201,168,76,0.1)",lineHeight:1.7}}>{lang==="de"&&dhikr.de?dhikr.de:dhikr.en}</div>
              )}
              <div style={{fontSize:11,color:"#8b6914",textAlign:"center",marginTop:10}}>{dhikr.source}</div>
            </div>
            
            <div style={{textAlign:"center"}}>
              <button onClick={tap} style={{background:"none",border:"none",cursor:isDone?"default":"pointer",padding:0,margin:"0 auto",display:"block"}}>
                <svg width="150" height="150" viewBox="0 0 160 160" style={{display:"block",filter:isDone?"drop-shadow(0 0 10px rgba(139,105,20,0.5))":"none",transition:"filter 0.3s"}}>
                  <polygon
                    transform="translate(80,80)"
                    points="0,-77.8 22.8,-55 55,-55 55,-22.8 77.8,0 55,22.8 55,55 22.8,55 0,77.8 -22.8,55 -55,55 -55,22.8 -77.8,0 -55,-22.8 -55,-55 -22.8,-55"
                    fill={isDone?"rgba(139,105,20,0.18)":"rgba(139,105,20,0.06)"}
                    stroke="#8b6914"
                    strokeWidth="2"
                    strokeLinejoin="miter"
                  />
                  <text x="80" y="74" textAnchor="middle" fontFamily="Amiri,serif" fontSize="30" fill="#8b6914" fontWeight="bold">{cCount}</text>
                  <line x1="58" y1="83" x2="102" y2="83" stroke="#8b6914" strokeWidth="0.8" opacity="0.5"/>
                  <text x="80" y="97" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="15" fill="#8b6914" opacity="0.7">{req}</text>
                  {isDone && <text x="80" y="116" textAnchor="middle" fontSize="12" fill="#8b6914" opacity="0.8">{lang==="ar"?"تم":"done"}</text>}
                  {!isDone && <text x="80" y="116" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="9" fill="#9a8878">{lang==="ar"?"اضغط":"tap"}</text>}
                </svg>
              </button>
              <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:16}}>
                <button onClick={reset} style={{background:"rgba(139,105,20,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#9a8878",borderRadius:10,padding:"7px 18px",cursor:"pointer",fontSize:12}}>
                  {lang==="ar"?"اعادة":lang==="de"?"Reset":"Reset"}
                </button>
                {isDone && dhikrIdx<list.length-1 && (
                  <button onClick={function(){setDhikrIdx(dhikrIdx+1);}} style={{background:"rgba(139,105,20,0.2)",border:"1px solid rgba(201,168,76,0.3)",color:"#8b6914",borderRadius:10,padding:"7px 18px",cursor:"pointer",fontSize:12}}>
                    {lang==="ar"?"التالي":lang==="de"?"Weiter":"Next"} {">"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!splash && !showSet && view==="category" && selCat && (
        <div style={{minHeight:"100vh",background:"#f8f3e8",backgroundImage:"url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='60'%20height='60'%3E%3Cpolygon%20transform='translate(30,30)'%20fill='none'%20stroke='%238b6914'%20stroke-width='0.7'%20opacity='0.28'%20points='0.0,-21.0%206.2,-14.9%2014.9,-14.9%2014.9,-6.2%2021.0,0.0%2014.9,6.2%2014.9,14.9%206.2,14.9%200.0,21.0%20-6.2,14.9%20-14.9,14.9%20-14.9,6.2%20-21.0,0.0%20-14.9,-6.2%20-14.9,-14.9%20-6.2,-14.9'/%3E%3C/svg%3E\")",backgroundSize:"60px 60px",paddingBottom:80}} className="fin">
          <div style={{padding:"12px 16px",background:"#f8f3e8",borderBottom:"1px solid rgba(139,105,20,0.25)",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0}}>
            <button style={{background:"rgba(139,105,20,0.12)",border:"1px solid rgba(139,105,20,0.25)",color:"#8b6914",fontSize:13,cursor:"pointer",borderRadius:10,padding:"6px 14px"}} onClick={function(){setView("home");setSelCat(null);}}>{"< رجوع"}</button>
            <div style={{fontSize:16,color:"#8b6914",fontFamily:A.Amiri}}>{T(CATEGORIES.find(function(c){return c.id===selCat;}))}</div>
            <button style={{background:"none",border:"none",color:"#9a8878",fontSize:16,cursor:"pointer"}} onClick={function(){setShowSet(true);}}>{"⚙"}</button>
          </div>
          <div style={{padding:"16px"}}>
            <div style={{background:"rgba(139,105,20,0.1)",borderRadius:12,padding:"12px 16px",marginBottom:16,border:"1px solid rgba(201,168,76,0.15)"}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#9a8878",marginBottom:6}}>
                <span>{lang==="ar"?"التقدم":lang==="de"?"Fortschritt":"Progress"}</span>
                <span style={{color:"#8b6914"}}>{doneInCat} / {list.length}</span>
              </div>
              <div style={{height:5,background:"rgba(139,105,20,0.1)",borderRadius:3}}>
                <div style={{height:"100%",borderRadius:3,background:"linear-gradient(90deg,#8b6914,#c49a28)",width:(list.length>0?doneInCat/list.length*100:0)+"%",transition:"width 0.5s"}} />
              </div>
            </div>
            {list.map(function(d,i){
              var dk=(selCat||"")+"-"+i;
              var isDk=done[dk];
              var cnt=counts[dk]||0;
              return (
                <button key={i} onClick={function(){setDhikrIdx(i);setView("dhikr");}} style={{width:"100%",textAlign:"right",background:isDk?"rgba(139,105,20,0.1)":CARD,border:"1px solid "+(isDk?"rgba(139,105,20,0.3)":"rgba(139,105,20,0.1)"),borderRadius:16,padding:"16px 18px",marginBottom:10,cursor:"pointer"}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:10,flexDirection:"row-reverse"}}>
                    <div style={{minWidth:28,height:28,borderRadius:"50%",background:isDk?GOLD:"rgba(139,105,20,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:isDk?"#f5f0e8":"#9a8878",flexShrink:0}}>{isDk?"✓":(i+1)}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:16,fontFamily:A.Amiri,color:isDk?GOLD:TEXT,lineHeight:1.7,direction:"rtl",marginBottom:4}}>
                        {(function(){var w=d.arabic.split(" "),r="";for(var j=0;j<w.length;j++){if((r+" "+w[j]).length>55)break;r=r?r+" "+w[j]:w[j];}return r+(d.arabic.length>r.length?" ...":"");})()}
                      </div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        <span style={{fontSize:11,color:"#8b6914",background:"rgba(139,105,20,0.12)",padding:"2px 8px",borderRadius:20}}>x{d.count}</span>
                        {cnt>0&&cnt<d.count&&<span style={{fontSize:11,color:"#9a8878"}}>{cnt}/{d.count}</span>}
                        <span style={{fontSize:10,color:"#9a8878"}}>{d.source}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!splash && !showSet && view==="home" && (
        <div style={{paddingBottom:80,minHeight:"100vh",background:"#f8f3e8",backgroundImage:"url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='60'%20height='60'%3E%3Cpolygon%20transform='translate(30,30)'%20fill='none'%20stroke='%238b6914'%20stroke-width='0.7'%20opacity='0.28'%20points='0.0,-21.0%206.2,-14.9%2014.9,-14.9%2014.9,-6.2%2021.0,0.0%2014.9,6.2%2014.9,14.9%206.2,14.9%200.0,21.0%20-6.2,14.9%20-14.9,14.9%20-14.9,6.2%20-21.0,0.0%20-14.9,-6.2%20-14.9,-14.9%20-6.2,-14.9'/%3E%3C/svg%3E\")",backgroundSize:"60px 60px"}}>
          <div style={{padding:"12px 16px",background:"rgba(250,247,240,0.98)",borderBottom:"1px solid rgba(139,105,20,0.25)",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,overflow:"hidden"}}>
            <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",opacity:0.06}}>
              <svg width="80" height="80" viewBox="0 0 120 120">
                <g fill="#8b6914" transform="translate(60,60)">
                  <polygon points="0,-50 11,-22 40,-31 22,-8 40,12 11,8 0,35 -11,8 -40,12 -22,-8 -40,-31 -11,-22" />
                  <polygon points="0,-50 11,-22 40,-31 22,-8 40,12 11,8 0,35 -11,8 -40,12 -22,-8 -40,-31 -11,-22" transform="rotate(22.5)" />
                </g>
              </svg>
            </div>
            <div style={{width:36}} />
            <div style={{textAlign:"center",position:"relative",zIndex:1}}>
              <div style={{fontSize:22,fontWeight:700,color:"#8b6914",fontFamily:A.Amiri}}>ذكّر</div>
              <div style={{fontSize:10,color:"#9a8878",letterSpacing:2}}>DHAKKIR</div>
            </div>
            <button style={{background:"none",border:"none",color:"#9a8878",fontSize:16,cursor:"pointer"}} onClick={function(){setShowSet(true);}}>{"⚙"}</button>
          </div>

          <div style={{display:"flex",gap:8,padding:"14px 16px 0"}}>
            {SECTIONS.map(function(s){return(
              <button key={s.id} onClick={function(){setSection(s.id);setHCat(null);}} style={{flex:1,padding:"10px 0",background:section===s.id?"rgba(139,105,20,0.25)":"rgba(139,105,20,0.06)",border:"1px solid "+(section===s.id?"rgba(139,105,20,0.5)":"rgba(139,105,20,0.1)"),borderRadius:12,cursor:"pointer",color:section===s.id?GOLD:"#9a8878",fontSize:13,fontFamily:FF}}>
                {lang==="ar"?s.ar:s.en}
              </button>
            );})}
          </div>

          <div style={{display:"flex",gap:8,padding:"10px 16px"}}>
            {["ar","en","de"].map(function(l){return(
              <button key={l} onClick={function(){setLang(l);}} style={{flex:1,padding:"7px 0",background:lang===l?"rgba(139,105,20,0.2)":"rgba(139,105,20,0.05)",border:"1px solid "+(lang===l?"rgba(139,105,20,0.35)":"rgba(139,105,20,0.08)"),borderRadius:10,color:lang===l?GOLD:"#9a8878",cursor:"pointer",fontSize:11}}>
                {l==="ar"?"عربي":l==="en"?"EN":"DE"}
              </button>
            );})}
          </div>

          {section==="hadiths" ? (
            <div style={{padding:"0 16px"}}>
              {!hCat ? (
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {HADITH_CATS.map(function(cat){return(
                    <button key={cat.id} onClick={function(){setHCat(cat.id);setHIdx(0);setHList(true);}} style={{background:"rgba(255,252,245,0.9)",border:"1px solid rgba(201,168,76,0.12)",borderRadius:16,padding:"16px 14px",cursor:"pointer",textAlign:"right"}}>
                      <div style={{fontSize:14,fontFamily:A.Amiri,color:"#2c1810",fontWeight:600}}>{lang==="ar"?cat.ar:lang==="de"?cat.de:cat.en}</div>
                      <div style={{fontSize:11,color:"#9a8878",marginTop:4}}>{(HADITHS[cat.id]||[]).length} {lang==="ar"?"حديث":"hadiths"}</div>
                    </button>
                  );})}
                </div>
              ) : !hList ? (
                <div>
                  <button onClick={function(){setHList(true);}} style={{background:"none",border:"none",color:"#8b6914",padding:"10px 0",cursor:"pointer",fontSize:13,display:"block",marginBottom:8}}>{"< "+(lang==="ar"?"رجوع":"Back")}</button>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <button onClick={function(){if(hIdx>0)setHIdx(hIdx-1);}} style={{background:"none",border:"none",color:hIdx>0?GOLD:"#ccc0b0",fontSize:26,cursor:"pointer"}}>{"<"}</button>
                    <span style={{fontSize:12,color:"#9a8878"}}>{hIdx+1} / {(HADITHS[hCat]||[]).length}</span>
                    <button onClick={function(){if(hIdx<(HADITHS[hCat]||[]).length-1)setHIdx(hIdx+1);}} style={{background:"none",border:"none",color:hIdx<(HADITHS[hCat]||[]).length-1?GOLD:"#ccc0b0",fontSize:26,cursor:"pointer"}}>{">"}</button>
                  </div>
                  {(function(){
                    var h=(HADITHS[hCat]||[])[hIdx];
                    if(!h)return null;
                    return(
                      <div style={{background:"rgba(139,105,20,0.08)",border:"1px solid rgba(139,105,20,0.25)",borderRadius:20,padding:"24px 20px",position:"relative"}}>
                                            <svg style={{position:"absolute",top:0,right:0,opacity:0.25}} width="50" height="50" viewBox="0 0 50 50" fill="none" stroke="#8b6914" strokeWidth="0.8">
                          <path d="M48,2 L30,2 Q25,2 25,8 L25,15 Q25,22 18,22 L10,22 Q4,22 2,28 L2,48" />
                          <path d="M48,8 L35,8 Q30,8 30,15 L30,22 Q30,28 24,28 L15,28 Q8,28 8,35 L8,48" />
                          <circle cx="48" cy="2" r="2" fill="#8b6914" />
                        </svg>
                        <svg style={{position:"absolute",bottom:0,left:0,opacity:0.25,transform:"rotate(180deg)"}} width="50" height="50" viewBox="0 0 50 50" fill="none" stroke="#8b6914" strokeWidth="0.8">
                          <path d="M48,2 L30,2 Q25,2 25,8 L25,15 Q25,22 18,22 L10,22 Q4,22 2,28 L2,48" />
                          <circle cx="48" cy="2" r="2" fill="#8b6914" />
                        </svg>
                        <div style={{fontSize:21,fontFamily:A.Amiri,color:"#2c1810",lineHeight:2,direction:"rtl",textAlign:"center",marginBottom:8}}>{h.arabic}</div>
                        <div style={{textAlign:"center",margin:"4px 0 12px",opacity:0.35}}>
                          <svg width="20" height="20" viewBox="0 0 160 160">
                            <polygon transform="translate(80,80)" fill="#8b6914" stroke="none"
                              points="0,-77.8 22.8,-55 55,-55 55,-22.8 77.8,0 55,22.8 55,55 22.8,55 0,77.8 -22.8,55 -55,55 -55,22.8 -77.8,0 -55,-22.8 -55,-55 -22.8,-55"/>
                          </svg>
                        </div>
                        {showTr&&<div style={{fontSize:13,color:"#5a4a3a",lineHeight:1.7,paddingTop:12,borderTop:"1px solid rgba(201,168,76,0.1)"}}>{lang==="de"&&h.de?h.de:h.en}</div>}
                        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginTop:12}}>
                          <div style={{fontSize:11,color:"#8b6914",background:"rgba(139,105,20,0.12)",padding:"4px 10px",borderRadius:20}}>{lang==="ar"?(h.source_ar||h.source):(h.source)}</div>
                          <div style={{fontSize:11,color:"#7a6a5a",direction:"rtl",fontFamily:A.Amiri}}>{lang==="ar"?(h.narrator_ar||h.narrator):(h.narrator)}</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div>
                  <button onClick={function(){setHCat(null);}} style={{background:"none",border:"none",color:"#8b6914",padding:"10px 0",cursor:"pointer",fontSize:13,display:"block",marginBottom:8}}>{"< "+(lang==="ar"?"الاحاديث":"Hadiths")}</button>
                  {(HADITHS[hCat]||[]).map(function(h,i){return(
                    <button key={i} onClick={function(){setHIdx(i);setHList(false);}} style={{width:"100%",textAlign:"right",background:"rgba(255,252,245,0.9)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"16px 18px",marginBottom:10,cursor:"pointer"}}>
                      <div style={{fontSize:16,fontFamily:A.Amiri,color:"#2c1810",lineHeight:1.8,direction:"rtl",marginBottom:6}}>
                        {(function(){var w=h.arabic.split(" "),r="";for(var j=0;j<w.length;j++){if((r+" "+w[j]).length>55)break;r=r?r+" "+w[j]:w[j];}return r+(h.arabic.length>r.length?" ...":"");})()}
                      </div>
                      <div style={{fontSize:11,color:"#8b6914"}}>{h.source}</div>
                    </button>
                  );})}
                </div>
              )}
            </div>
          ) : (
            <div style={{padding:"4px 16px"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {CATEGORIES.map(function(cat){
                  var items=ADHKAR[cat.id]||[];
                  var doneC=items.filter(function(_,i){return done[(cat.id||"")+"-"+i];}).length;
                  var p=items.length>0?doneC/items.length*100:0;
                  return(
                    <button key={cat.id} onClick={function(){setSelCat(cat.id);setDhikrIdx(0);setView("category");}} style={{background:"linear-gradient(135deg,rgba(255,252,245,0.9) 0%,rgba(245,240,228,0.95) 100%)",border:"1px solid rgba(139,105,20,0.25)",borderRadius:16,padding:"16px 14px",cursor:"pointer",textAlign:"right",position:"relative",overflow:"hidden"}}>
                      {p>0&&<div style={{position:"absolute",bottom:0,left:0,height:3,width:p+"%",background:"linear-gradient(90deg,#8b6914,#c49a28)",borderRadius:3,transition:"width 0.5s"}} />}
                      <div style={{fontSize:14,fontFamily:A.Amiri,color:"#2c1810",fontWeight:600}}>{lang==="ar"?cat.ar:lang==="de"?cat.de:cat.en}</div>
                      <div style={{fontSize:11,color:"#9a8878",marginTop:4}}>{items.length} {lang==="ar"?"ذكر":"adhkar"}{p===100?" ✓":""}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
