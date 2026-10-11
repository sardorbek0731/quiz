// Savollar: q = savol, o = variantlar, a = to'g'ri javob raqami (0 dan boshlanadi), w = izoh
// Variantlar test vaqtida har safar aralashtiriladi, shuning uchun `a` ning qiymati javob harfiga ta'sir qilmaydi.
const QS = [
  // Q1
  {
    q: "DataReportal ma'lumotiga ko'ra, 2025-yil oxirida O'zbekiston aholisining necha foizi internetdan foydalangan?",
    o: ["59%", "74%", "89%", "97%"],
    a: 2,
    w: "33,1 million kishi, ya'ni aholining 89,0 foizi (DataReportal, Digital 2026: Uzbekistan).",
  },
  // Q2
  {
    q: "DataReportal ma'lumotiga ko'ra, 2025-yil oktabrida O'zbekistonda 14,1 million ijtimoiy tarmoq profili qayd etilgan. Bu raqam haqida qaysi gap to'g'ri?",
    o: [
      "Bu aniq odamlar soni, chunki har bir odamda bitta profil bor",
      "Bu profillar soni, bir odamda bir nechta profil bo'lishi mumkin",
      "Bu Telegram'dagi faol foydalanuvchilar soni, boshqa tarmoqlar hisobga olinmagan",
      "Bu talabalar va o'quvchilar soni, kattalar hisobga olinmagan",
    ],
    a: 1,
    w: "Bu profillar soni (taxminiy reklama qamrovi). Bir odamda bir nechta profil bo'lishi mumkin, shuning uchun uni aniq odamlar soni deb bo'lmaydi.",
  },
  // Q3
  {
    q: "UNESCO ta'rifiga ko'ra, madaniyat qaysi javobda eng to'liq ifodalangan?",
    o: [
      "Madaniyat — bu san'at, adabiyot va musiqa, ya'ni ijodiy sohalar majmuasi",
      "Madaniyat — bu xalqning bayramlari, urf-odatlari va marosimlari majmuasi",
      "Madaniyat — bu san'at, hayot tarzi, qadriyatlar va e'tiqodlar majmuasi",
      "Madaniyat — bu xalqning tili, dini va tarixiy yodgorliklari majmuasi",
    ],
    a: 2,
    w: "UNESCO (Mexiko deklaratsiyasi, 1982): madaniyat san'at va adabiyotdan tashqari hayot tarzi, qadriyatlar, an'ana va e'tiqodlarni ham o'z ichiga oladi.",
  },
  // Q4
  {
    q: "Ijtimoiy tarmoqqa qaramlik va talabalar o'zlashtirishi haqidagi 2025-yilgi meta-tahlil nimani topgan?",
    o: [
      "Kuchli ijobiy bog'liqlik (r ≈ +0,70)",
      "Kichik salbiy bog'liqlik (r ≈ −0,17)",
      "Kuchli salbiy bog'liqlik (r ≈ −0,70)",
      "Hech qanday bog'liqlik topilmagan (r ≈ 0)",
    ],
    a: 1,
    w: "Korrelyatsiya −0,172. Bu qaramlik haqida, odatiy foydalanish haqida emas, va u sababiyatni isbotlamaydi.",
  },
  // Q5
  {
    q: "UNICEF ta'rifiga ko'ra, kiberbulling qaysi javobda to'g'ri tasvirlangan?",
    o: [
      "Yuzma-yuz sodir bo'ladigan, raqamli texnologiyalarsiz davom etadigan takroriy xatti-harakat",
      "Qurbonni qo'rqitish yoki sharmanda qilishga qaratilgan takroriy raqamli xatti-harakat",
      "Raqamli texnologiyalar orqali aytilgan, hech kimni xafa qilish niyati bo'lmagan bir martalik hazil",
      "Internetdan boshqa odamning rasmini yoki matnini olib, o'zinikidek ko'rsatish",
    ],
    a: 1,
    w: "UNICEF: kiberbulling raqamli texnologiyalar yordamidagi takrorlanuvchi bulling bo'lib, qurbonni qo'rqitish, g'azablantirish yoki sharmanda qilishga qaratilgan.",
  },
  // Q6
  {
    q: "Kiberbullingga duch kelsangiz, UNICEF qaysi maslahatni beradi?",
    o: [
      "Hammasini o'chirib tashlab, hech kimga aytmasdan jim o'tirib qolish",
      "Ishonchli kishiga aytish, bloklash, shikoyat qilish va skrinshot saqlash",
      "Javoban xuddi shunday haqoratli xabarlar yuborib, o'ch olish",
      "Barcha ijtimoiy tarmoqlardan butunlay voz kechib, hech qachon qaytib kirmaslik",
    ],
    a: 1,
    w: "Kiberbulling raqamli iz qoldiradi va dalil bo'lishi mumkin. Birinchi qadam: ishonchli kishidan yordam so'rash.",
  },
  // Q7
  {
    q: "MIT tadqiqotiga ko'ra, yolg'on xabarlarni haqiqiy xabarlardan ko'proq kim tarqatgan?",
    o: [
      "Avtomatik dasturlar, ya'ni botlar",
      "Oddiy foydalanuvchilar, ya'ni odamlar",
      "Mustaqil faktchek tashkilotlari",
      "Ommaviy axborot vositalarining o'zi",
    ],
    a: 1,
    w: "Botlar olib tashlanganda ham farq saqlanib qolgan: yolg'onni asosan odamlar tarqatadi. Tadqiqotchilar buni yangilik gipotezasi bilan tushuntiradi: yolg'on yangiroq tuyuladi, yangilik esa ko'proq ulashiladi.",
  },
  // Q8
  {
    q: "Virginia Shea'ning netiketdagi birinchi qoidasi qaysi?",
    o: [
      "Diqqatni tortish uchun gaplarni katta harflarda yozing",
      "Insonni unutmang: yuziga aytmaydigan gapni yozmang",
      "Muloqotda tezlik muhim, shuning uchun darrov javob bering",
      "Boshqalarning rasmi va ma'lumotlarini ruxsatsiz ulashing",
    ],
    a: 1,
    w: "Ekran ortida his-tuyg'ulari bor haqiqiy odam o'qiydi (Shea, Netiquette, 1994).",
  },
  // Q9
  {
    q: "MIT tadqiqoti qaysi ijtimoiy tarmoqda o'tkazilgan?",
    o: ["Telegram", "Instagram", "Twitter (hozirgi X)", "TikTok"],
    a: 2,
    w: "Tadqiqot Twitter'da (hozirgi X), faktchek qilingan xabarlar bilan o'tkazilgan, shuning uchun natijani boshqa tarmoqlarga to'g'ridan-to'g'ri umumlashtirib bo'lmaydi.",
  },
  // Q10
  {
    q: "2024-yilda imzolangan bolalarni zo'ravonlikdan himoya qilish qonuni haqida qaysi gap to'g'ri?",
    o: [
      "U oiladagi zo'ravonlikni tartibga soladi, maktab va internetdagi zo'ravonlikni esa qamramaydi",
      "U faqat jismoniy zo'ravonlikni tan oladi, onlayn zo'ravonlikni esa e'tirof etmaydi",
      "U kiberbullingni ham bolalarga nisbatan zo'ravonlik shakli deb e'tirof etadi",
      "U hamma yoshdagi shaxslar uchun kiberbullingni taqiqlaydi",
    ],
    a: 2,
    w: "Qonun zo'ravonlik shakllarini oltitaga kengaytirgan va bullingni, shu jumladan kiberbullingni, o'z ichiga olgan. U bolalar, ya'ni 18 yoshgacha bo'lganlar uchun.",
  },
  // Q11
  {
    q: "Avstraliya universitetlaridagi 25 ta maqolani tahlil qilgan 2026-yilgi sharhga ko'ra, talabalar ijtimoiy tarmoqdan o'qishda nima uchun foydalanadi?",
    o: [
      "Guruh ishini boshqarish, resurslarga kirish va tengdoshlar bilan aloqa uchun",
      "Imtihon savollarining javoblarini o'zaro almashish va ko'chirish uchun",
      "O'qituvchilar bilan rasmiy yozishmalar va hujjat almashinuvi uchun",
      "O'quv dasturlari va baholarni rasmiy tarzda e'lon qilish uchun",
    ],
    a: 0,
    w: "Sharh ijtimoiy tarmoq talabalar va o'qituvchilar o'rtasida muloqot, hamkorlik va faollikni oshirishini ko'rsatadi, ayniqsa onlayn va xalqaro talabalarga foyda beradi. Bu Avstraliya misoli.",
  },
  // Q12
  {
    q: "2025-yilgi ilmiy sharhga ko'ra, talabalar ruhiy salomatligiga salbiy ta'sirning muhim omillari sifatida qaysilar doimiy chiqqan?",
    o: [
      "FoMO, uyqu sifati va uzoq foydalanish",
      "Tarmoqdagi do'stlar soni va profil rasmi",
      "Telefon markasi va ekran o'lchami",
      "O'qish yo'nalishi va guruh raqami",
    ],
    a: 0,
    w: "FoMO biror narsani o'tkazib yuborish qo'rquvi degani. Sharh bu omillarni ruhiy qiyinchiliklar bilan bog'liq deb topgan, sabab-oqibat isbotlanmagan.",
  },
  // Q13
  {
    q: "Toshkent davlat texnika universiteti mualliflari maqolasining xulosasini qaysi javob to'liqroq ifodalaydi?",
    o: [
      "Ijtimoiy tarmoqlar yozma nutqni boyitishi va savodxonlikni oshirishi mumkin, salbiy ta'siri esa kuzatilmaydi",
      "Ijtimoiy tarmoqlar savodxonlikni pasaytirishi va rasmiy yozuvni susaytirishi mumkin, ijobiy ta'siri esa kuzatilmaydi",
      "Ijtimoiy tarmoqlar ijodkorlikni rivojlantirishi ham, rasmiy yozuvni susaytirishi ham mumkin",
      "Ijtimoiy tarmoqlar yozma nutqqa ta'sir qilmasligi mumkin, chunki til asosan maktabda shakllanadi",
    ],
    a: 2,
    w: "Maqola yangi so'rov o'tkazmagan, mavjud adabiyotlarni tahlil qilgan. Mualliflar ikki tomonlama ta'sirni ko'rsatadi.",
  },
  // Q14
  {
    q: "2019-yilda qabul qilingan 'Shaxsiy ma'lumotlar to'g'risida'gi qonunning asosiy talablaridan biri qaysi?",
    o: [
      "Ma'lumotni qayta ishlashda egasining roziligi",
      "Ma'lumotlarni hamma uchun ochiq e'lon qilish",
      "Ma'lumotlarni cheksiz muddat saqlab turish",
      "Ma'lumot egasini qayta ishlashdan xabardor qilmaslik",
    ],
    a: 0,
    w: "Qonun ma'lumot egasining roziligi, qayta ishlash maqsadlari va uchinchi shaxsga berishda xabardor qilish talablarini belgilaydi.",
  },
  // Q15
  {
    q: "Shea'ning netiketdagi ikkinchi qoidasiga ko'ra, onlayn qanday harakat qilish kerak?",
    o: [
      "Onlayn qoidalar hayotdagidan farq qiladi, shuning uchun hammasi mumkin",
      "Hayotdagi me'yorlarga amal qilish: axloqli bo'lish va qonunni buzmaslik",
      "Haqiqiy ismni yashirib, anonim akkaunt orqali fikr bildirish",
      "Boshqalarning gapini nusxalab, o'zinikidek qilib ulashish",
    ],
    a: 1,
    w: "Shea: onlayn ham hayotdagi xulq-atvor me'yorlariga amal qiling, axloqli bo'ling, qonunni buzmang va iqtiboslarga manba ko'rsating.",
  },
];
