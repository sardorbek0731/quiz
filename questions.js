// Savollar: q = savol, o = variantlar, a = to'g'ri javob raqami (0 dan boshlanadi), w = izoh
const QS = [
  {
    q: "DataReportal ma'lumotiga ko'ra, 2025-yil oxirida O'zbekiston aholisining necha foizi internetdan foydalangan?",
    o: ["59%", "74%", "89%", "97%"],
    a: 2,
    w: "33,1 million kishi, ya'ni aholining 89,0 foizi (DataReportal, Digital 2026: Uzbekistan).",
  },
  {
    q: "DataReportal'dagi 14,1 million raqami nimani bildiradi?",
    o: [
      "Aniq faol foydalanuvchi odamlar sonini",
      "Ijtimoiy tarmoq profillari sonini (reklama qamrovi, taxminiy ko'rsatkich)",
      "Faqat Telegram foydalanuvchilarini",
      "Faqat talabalar sonini",
    ],
    a: 1,
    w: "Bu profillar soni. Bir odamda bir nechta profil bo'lishi mumkin, shuning uchun uni aniq odamlar soni deb bo'lmaydi.",
  },
  {
    q: "UNESCO ta'rifiga ko'ra madaniyatga nimalar kiradi?",
    o: [
      "Faqat san'at va adabiyot",
      "Faqat an'analar",
      "San'at va adabiyot bilan birga hayot tarzi, qadriyatlar tizimi, an'ana va e'tiqodlar",
      "Faqat til va din",
    ],
    a: 2,
    w: "UNESCO (Mexiko deklaratsiyasi, 1982): madaniyat san'at va adabiyotdan tashqari hayot tarzi, qadriyatlar, an'ana va e'tiqodlarni ham o'z ichiga oladi.",
  },
  {
    q: "Ijtimoiy tarmoqqa qaramlik va talabalar o'zlashtirishi haqidagi meta-tahlil nimani topgan?",
    o: [
      "Kuchli ijobiy bog'liqlik",
      "Salbiy, lekin ancha kichik bog'liqlik (r ≈ −0,17)",
      "Kuchli salbiy bog'liqlik",
      "Hech qanday bog'liqlik topilmagan",
    ],
    a: 1,
    w: "Korrelyatsiya −0,172. Bu qaramlik haqida, odatiy foydalanish haqida emas, va u sababiyatni isbotlamaydi.",
  },
  {
    q: "UNICEF ta'rifiga ko'ra kiberbulling qanday xatti-harakat?",
    o: [
      "Bir martalik hazil",
      "Takrorlanuvchi, qurbonni qo'rqitish, g'azablantirish yoki sharmanda qilishga qaratilgan xatti-harakat",
      "Faqat shaxsiy xabarlardagi haqorat",
      "Faqat bolalar orasida uchraydi",
    ],
    a: 1,
    w: "UNICEF: kiberbulling raqamli texnologiyalar yordamidagi takrorlanuvchi bulling bo'lib, qurbonni qo'rqitish, g'azablantirish yoki sharmanda qilishga qaratilgan.",
  },
  {
    q: "Kiberbullingga duch kelsangiz, UNICEF qaysi maslahatni beradi?",
    o: [
      "Hammasini o'chirib, hech kimga aytmaslik",
      "Ishonchli kishiga aytish, bloklash va shikoyat qilish, xabar va skrinshotlarni saqlash",
      "Javoban haqorat qilish",
      "Internetdan butunlay voz kechish",
    ],
    a: 1,
    w: "Kiberbulling raqamli iz qoldiradi va dalil bo'lishi mumkin. Birinchi qadam: ishonchli kishidan yordam so'rash.",
  },
  {
    q: "MIT tadqiqotida botlar olib tashlanganda ham yolg'on xabarlarning tezroq tarqalishi saqlanib qoldi. Demak, ularni asosan kim tarqatgan?",
    o: ["Botlar", "Odamlar", "Faktchek tashkilotlari", "Jurnalistlar"],
    a: 1,
    w: "Yolg'onni asosan odamlar tarqatadi. Tadqiqotchilar buni yangilik gipotezasi bilan tushuntiradi: yolg'on yangiroq tuyuladi, yangilik esa ko'proq ulashiladi.",
  },
  {
    q: "Virginia Shea'ning netiketdagi birinchi qoidasi qaysi?",
    o: [
      "Katta harflarda yozing",
      "Insonni unutmang: yuziga aytmaydigan gapni yozmang",
      "Darrov javob bering",
      "Hamma narsani ulashing",
    ],
    a: 1,
    w: "Ekran ortida his-tuyg'ulari bor haqiqiy odam o'qiydi (Shea, Netiquette, 1994).",
  },
  {
    q: "MIT tadqiqoti qaysi ijtimoiy tarmoqda o'tkazilgan?",
    o: ["Telegram", "Instagram", "Twitter", "TikTok"],
    a: 2,
    w: "Tadqiqot Twitter'da, faktchek qilingan xabarlar bilan o'tkazilgan, shuning uchun natijani boshqa tarmoqlarga to'g'ridan-to'g'ri umumlashtirib bo'lmaydi.",
  },
  {
    q: "2024-yilda imzolangan bolalarni zo'ravonlikdan himoya qilish qonuni haqida qaysi gap to'g'ri?",
    o: [
      "U faqat kattalarga tegishli",
      "U 2026-yilda qabul qilingan",
      "Bullingni, shu jumladan kiberbullingni, bolalarga nisbatan zo'ravonlik shakli sifatida e'tirof etadi",
      "U hamma yoshdagilar uchun kiberbullingni taqiqlaydi",
    ],
    a: 2,
    w: "Qonun zo'ravonlik shakllarini oltitaga kengaytirgan va bullingni, shu jumladan kiberbullingni, o'z ichiga olgan. U bolalar, ya'ni 18 yoshgacha bo'lganlar uchun.",
  },
  {
    q: "BMT ma'lumotiga ko'ra, O'zbekiston aholisining median yoshi qancha?",
    o: ["21,0", "27,0", "35,0", "42,0"],
    a: 1,
    w: "Median yosh 27,0, ya'ni aholining yarmi 27 yoshdan kichik (DataReportal, BMT ma'lumoti asosida).",
  },
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
  {
    q: "Toshkent davlat texnika universiteti mualliflari maqolasiga ko'ra, ijtimoiy tarmoqlar yozma nutqqa qanday ta'sir qilishi mumkin?",
    o: [
      "Faqat yaxshilaydi",
      "Faqat yomonlashtiradi",
      "Ham til materialiga duch kelishni va ijodkorlikni rivojlantirishi, ham rasmiy yozuvning susayishiga hissa qo'shishi mumkin",
      "Hech qanday ta'sir qilmaydi",
    ],
    a: 2,
    w: "Maqola yangi so'rov o'tkazmagan, mavjud adabiyotlarni tahlil qilgan. Mualliflar ikki tomonlama ta'sirni ko'rsatadi.",
  },
  {
    q: "2019-yilda qabul qilingan 'Shaxsiy ma'lumotlar to'g'risida'gi qonunning asosiy talablaridan biri qaysi?",
    o: [
      "Ma'lumot egasining roziligi",
      "Ma'lumotlarni hamma uchun ochiq e'lon qilish",
      "Ma'lumotlarni cheksiz muddat saqlash",
      "Ma'lumot egasini xabardor qilmaslik",
    ],
    a: 0,
    w: "Qonun ma'lumot egasining roziligi, qayta ishlash maqsadlari va uchinchi shaxsga berishda xabardor qilish talablarini belgilaydi.",
  },
  {
    q: "Shea'ning netiketdagi ikkinchi qoidasiga ko'ra, onlayn qanday harakat qilish kerak?",
    o: [
      "Onlayn qoidalar hayotdagidan farq qiladi, shuning uchun hammasi mumkin",
      "Hayotdagi me'yorlarga amal qilish: axloqli bo'lish, qonunni buzmaslik, manbalarni ko'rsatish",
      "Faqat ismsiz akkauntdan yozish",
      "Boshqalarning gapini nusxalab ulashish",
    ],
    a: 1,
    w: "Shea: onlayn ham hayotdagi xulq-atvor me'yorlariga amal qiling, axloqli bo'ling, qonunni buzmang va iqtiboslarga manba ko'rsating.",
  },
];
