// Savollar: q = savol, o = variantlar, a = to'g'ri javob raqami (0 dan boshlanadi), w = izoh
// Variantlar test vaqtida har safar aralashtiriladi, shuning uchun `a` ning qiymati javob harfiga ta'sir qilmaydi.
const QS = [
  // ===== 1-QISM: Ta'sir =====
  // Q1
  {
    q: "DataReportal ma'lumotiga ko'ra, 2025-yil oxirida O'zbekiston aholisining necha foizi internetdan foydalangan?",
    o: ["59,0%", "74,5%", "89,0%", "97,0%"],
    a: 2,
    w: "33,1 million kishi, ya'ni aholining 89,0 foizi (DataReportal, Digital 2026: Uzbekistan).",
  },
  // Q2
  {
    q: "DataReportal ma'lumotiga ko'ra, 2025-yil oktabrida O'zbekistonda 14,1 million ijtimoiy tarmoq foydalanuvchi profili qayd etilgan. Bu raqamni qanday to'g'ri talqin qilish kerak?",
    o: [
      "O'zbekistondagi aniq, takrorlanmaydigan odamlar soni, chunki har bir kishi faqat bitta tarmoqdan foydalanadi",
      "Taxminiy ko'rsatkich: u noyob odamlar sonini ko'rsatmasligi mumkin",
      "Faqat Telegram'dagi faol foydalanuvchilar soni, chunki boshqa tarmoqlar hisobga olinmagan",
      "Faqat 18 yoshgacha bo'lgan talabalar va o'quvchilar soni, kattalar hisobga olinmagan",
    ],
    a: 1,
    w: "DataReportal o'zi ta'kidlaydi: bu raqamlar noyob shaxslar sonini ko'rsatmasligi mumkin. Telegram bu hisobotda yo'q, 18 yoshdan oshganlar uchun esa alohida ko'rsatkich (53,7%) berilgan.",
  },
  // Q3
  {
    q: "UNESCO'ning 1982-yilgi Mexiko deklaratsiyasiga ko'ra, madaniyat qaysi javobda eng to'g'ri ifodalangan?",
    o: [
      "Madaniyat — san'at, adabiyot, musiqa va teatr kabi ijodiy sohalar hamda ularning mahsulotlari majmui",
      "Madaniyat — xalqning bayramlari, urf-odatlari, marosimlari va milliy taomlari majmui, boshqa hech narsa emas",
      "Madaniyat — xalqning tili, dini va tarixiy yodgorliklari majmui, hayot tarzi va qadriyatlar unga kirmaydi",
      "Madaniyat — san'atdan tashqari hayot tarzi, qadriyatlar, an'ana va e'tiqodlarni ham qamragan majmui",
    ],
    a: 3,
    w: "UNESCO: madaniyat jamiyat yoki ijtimoiy guruhni xarakterlaydigan ma'naviy, moddiy, intellektual va hissiy xususiyatlar majmui. Unga san'at va adabiyot bilan birga hayot tarzi, inson huquqlari, qadriyatlar, an'analar va e'tiqodlar ham kiradi.",
  },
  // Q4
  {
    q: "Toshkent davlat texnika universiteti mualliflarining 2025-yilgi maqolasi (ijtimoiy tarmoq va yozma nutq) haqida qaysi gap to'g'ri?",
    o: [
      "U adabiyotlar tahliliga asoslangan va ijtimoiy tarmoqning ham foydali, ham zararli tomonlarini ko'rsatadi",
      "U yangi so'rov o'tkazgan va ijtimoiy tarmoq faqat savodxonlikni oshiradi, salbiy ta'siri kuzatilmaydi degan xulosaga kelgan",
      "U tajriba o'tkazgan va ijtimoiy tarmoq faqat savodxonlikni pasaytiradi, ijobiy ta'siri kuzatilmaydi degan xulosaga kelgan",
      "U ijtimoiy tarmoq yozma nutqqa umuman ta'sir qilmaydi, chunki til faqat maktabda shakllanadi degan xulosaga kelgan",
    ],
    a: 0,
    w: "Maqola yangi so'rov o'tkazmagan: u adabiyotlar va nazariy tahlilga tayanadi. Mualliflar bir tomondan til materiallariga duch kelish, muloqot ko'nikmalari va ijodkorlikni, ikkinchi tomondan rasmiy yozuvning susayishi va grammatik xatolarni ko'rsatadi.",
  },
  // Q5
  {
    q: "Avstraliya universitetlaridagi 25 ta maqolani tahlil qilgan 2026-yilgi sharhga ko'ra, talabalar ijtimoiy tarmoqdan o'qishda nima uchun foydalanadi?",
    o: [
      "Faqat dam olish va o'yin-kulgi uchun, o'qishga hech qanday aloqasi bo'lmagan holda",
      "Guruh ishini boshqarish, resurslarga kirish va tengdoshlar bilan aloqa uchun",
      "Faqat o'qituvchi bilan rasmiy yozishmalar olib borish va hujjatlar almashish uchun",
      "Faqat chet tilini o'rganish va dars jadvallarini rasmiy e'lon qilish uchun",
    ],
    a: 1,
    w: "Sharh ijtimoiy tarmoq muloqot, hamkorlik va faollikni oshirishini, ayniqsa onlayn va xalqaro talabalarga foyda berishini ko'rsatadi. Shu bilan birga maxfiylik va axloqiy xavotirlar kabi muammolarni ham sanaydi. Bu Avstraliya misoli.",
  },
  // Q6
  {
    q: "2025-yilda Healthcare jurnalida chop etilgan qamrov sharhiga ko'ra, talabalar ruhiy salomatligiga salbiy ta'sirning muhim omillari sifatida qaysilar doimiy chiqqan?",
    o: [
      "FoMO, uyqu sifati va uzoq foydalanish",
      "Obunachilar va layklar soni",
      "Faqat o'qish maqsadida va guruh chatlarida foydalanish",
      "Telefon markasi va internet tezligi",
    ],
    a: 0,
    w: "FoMO — biror narsani o'tkazib yuborish qo'rquvi. Sharh muammoli foydalanish ko'proq ruhiy muammolar bilan bog'liqligini topgan, lekin bu sabab-oqibat isboti emas.",
  },
  // Q7
  {
    q: "2025-yilgi meta-tahlil ijtimoiy tarmoqqa qaramlik va talabalar o'zlashtirishi o'rtasida korrelyatsiya −0,172 ekanini topgan. Bu natija nimani anglatadi?",
    o: [
      "Ijtimoiy tarmoqdan foydalanish o'zlashtirishni kuchli pasaytirishini va uning sababi ekanini isbotlaydi",
      "Har qanday foydalanish, hatto qaramlik darajasida ham, o'zlashtirishni yaxshilaydi",
      "Kichik salbiy bog'liqlik bor, lekin bu sababni isbotlamaydi",
      "Qaramlik va o'zlashtirish o'rtasida hech qanday bog'liqlik yo'q, natija tasodifiy",
    ],
    a: 2,
    w: "−0,172 kichik salbiy bog'liqlik (ishonch oralig'i −0,320 dan −0,016 gacha). U odatiy foydalanish haqida emas, aynan qaramlik haqida, va korrelyatsiya sababni isbotlamaydi.",
  },
  // Q8
  {
    q: "Ijtimoiy tarmoqni o'qitishda ishlatish haqidagi 2026-yilgi meta-tahlil haqida qaysi gap to'g'ri?",
    o: [
      "U yuzlab tadqiqotga tayanib, ijtimoiy tarmoq o'zlashtirishni sezilarli darajada oshirishini isbotlagan",
      "U ijtimoiy tarmoq o'zlashtirishni sezilarli darajada pasaytirishini aniq isbotlagan",
      "U faqat Avstraliya universitetlaridagi tadqiqotlarni qamragan va kuchli ijobiy ta'sir topgan",
      "Ijobiy ta'sir topmagan, lekin atigi to'rtta tadqiqotga tayanadi, shuning uchun ehtiyotkorlik kerak",
    ],
    a: 3,
    w: "Meta-tahlil to'rtta tadqiqotga tayangan, natijalar bir-biridan keskin farq qilgan va mualliflarning o'zi natijalarga ehtiyotkorlik bilan qarashni tavsiya qilgan.",
  },

  // ===== 2-QISM: Axloqiy masalalar =====
  // Q9
  {
    q: "Virginia Shea'ning netiketdagi «insonni unutmang» qoidasi nimani anglatadi?",
    o: [
      "Ekran ortida haqiqiy odam o'qiydi, shuning uchun yuziga aytmaydigan gapni yozmang",
      "Onlayn muloqotda tezlik muhim, shuning uchun o'ylab o'tirmay, darrov va qisqa javob bering",
      "Internetdagi gaplar hayotdagidan farq qiladi, shuning uchun u yerda qat'iy axloqiy me'yorlar kerak emas",
      "Anonim akkaunt orqali yozilgan fikr uchun muallif javobgar bo'lmaydi, shuning uchun erkin yozish mumkin",
    ],
    a: 0,
    w: "Shea (Netiquette, 1994): ekran ortida haqiqiy odam o'qiydi. Yuziga aytmaydigan gapni yozmaslik yoki joylamaslik kerak.",
  },
  // Q10
  {
    q: "UNICEF ta'rifiga ko'ra, kiberbulling nima?",
    o: [
      "Yuzma-yuz sodir bo'ladigan va raqamli texnologiyalarsiz davom etadigan takroriy xatti-harakat, masalan maktab hovlisidagi janjal",
      "Raqamli texnologiya orqali aytilgan, hech kimni xafa qilish niyati bo'lmagan bir martalik hazil yoki hajviy izoh",
      "Internetdan boshqa odamning matni, rasmi yoki ishini olib, o'zinikidek ko'rsatib ulashish",
      "Raqamli texnologiya yordamida qurbonni qo'rqitish, g'azablantirish yoki sharmanda qilishga qaratilgan takroriy xatti-harakat",
    ],
    a: 3,
    w: "UNICEF: kiberbulling raqamli texnologiyalar yordamidagi takrorlanuvchi bulling bo'lib, ijtimoiy tarmoq, messenjer, o'yin platformalari va telefonlarda sodir bo'lishi mumkin. Variant C — plagiatning tavsifi.",
  },
  // Q11
  {
    q: "Kiberbullingga duch kelganda UNICEF qaysi harakatlarni maslahat beradi?",
    o: [
      "Barcha xabarlarni darhol o'chirib tashlab, hech kimga aytmay, muammo o'z-o'zidan tugashini kutish",
      "Javoban xuddi shunday haqoratli xabarlar yuborib, o'ch olish va muloqotni shu tarzda davom ettirish",
      "Ishonchli kishiga aytish, bloklash va shikoyat qilish, xabar va skrinshotlarni dalil sifatida saqlash",
      "Barcha ijtimoiy tarmoqlardan butunlay chiqib ketib, hech qachon qaytmaslik va hamma hisoblarni o'chirish",
    ],
    a: 2,
    w: "Kiberbulling raqamli iz qoldiradi va bu dalil bo'lishi mumkin. UNICEF internetdan butunlay voz kechishni uzoq muddatli yechim deb hisoblamaydi.",
  },
  // Q12
  {
    q: "2024-yil noyabrda imzolangan bolalarni zo'ravonlikdan himoya qilish to'g'risidagi qonun haqida qaysi gap to'g'ri?",
    o: [
      "U kiberbullingni barcha yoshdagi shaxslar uchun alohida jinoyat deb belgilab, jazoni sezilarli kuchaytirgan",
      "Zo'ravonlik shakllari uchtadan oltitaga kengaygan va bulling, jumladan kiberbulling, kiritilgan",
      "U faqat jismoniy zo'ravonlikni tan oladi, onlayn va psixologik zo'ravonlikni esa umuman qamramaydi",
      "U faqat maktab hovlisidagi, yuzma-yuz bullingni tartibga soladi va internetdagi holatlarga tegmaydi",
    ],
    a: 1,
    w: "Qonun zo'ravonlik shakllarini oltitaga kengaytirgan; bulling tengdoshlar tomonidan jismoniy, og'zaki yoki psixologik zarar yetkazish bo'lib, kiberbullingni ham o'z ichiga oladi. Qonun bolalar, ya'ni 18 yoshgacha bo'lganlar uchun.",
  },
  // Q13
  {
    q: "O'zbekistonda kattalar uchun kiberbulling bo'yicha huquqiy holat haqida qaysi gap to'g'ri?",
    o: [
      "«Kiberbulling» nomli alohida jinoyat moddasi bor va u internetdagi barcha haqorat va tuhmatni qamrab oladi",
      "Internetdagi haqorat va tuhmat uchun hech qanday ma'muriy yoki jinoiy javobgarlik belgilanmagan",
      "«Kiberbulling» nomli alohida norma yo'q, lekin haqorat va tuhmat uchun javobgarlik bor",
      "Faqat 18 yoshgacha bo'lganlar javobgarlikka tortiladi, kattalar esa hech qanday javobgar bo'lmaydi",
    ],
    a: 2,
    w: "Times of Central Asia: «kiberbulling» nomli alohida norma yo'q. Haqorat va tuhmat uchun esa javobgarlik bor: Oliy sud ma'lumotiga ko'ra, 2024-yilning dastlabki o'n oyida 30 mingdan ortiq kishi javobgarlikka tortilgan (bu faqat internetdagi emas, barcha ishlar).",
  },
  // Q14
  {
    q: "2018-yilda Science jurnalida chop etilgan MIT tadqiqotiga ko'ra, yolg'on xabarlarni haqiqiylardan ko'proq kim tarqatgan va tadqiqot qaysi tarmoqda o'tkazilgan?",
    o: [
      "Odamlar, botlar emas; tadqiqot Twitter'da o'tkazilgan",
      "Botlar, odamlar emas; tadqiqot Twitter'da o'tkazilgan",
      "Odamlar, botlar emas; tadqiqot Instagram'da o'tkazilgan",
      "Botlar, odamlar emas; tadqiqot Telegram'da o'tkazilgan",
    ],
    a: 0,
    w: "Yolg'on xabarlarning qayta ulashilish ehtimoli 70 foiz yuqori bo'lgan va uni asosan odamlar tarqatgan. Tadqiqot faqat Twitter'da, faktchek qilingan xabarlar bilan o'tkazilgan, shuning uchun natijani boshqa tarmoqlarga to'g'ridan-to'g'ri umumlashtirib bo'lmaydi.",
  },
  // Q15
  {
    q: "2019-yilda qabul qilingan «Shaxsiy ma'lumotlar to'g'risida»gi qonunning asosiy talablaridan biri qaysi?",
    o: [
      "Ma'lumotni qayta ishlashni egasining roziligisiz ham, istalgan maqsadda va cheksiz muddat davom ettirish",
      "Qayta ishlash uchun ma'lumot egasining roziligi va maqsadlarning belgilanishi",
      "Barcha shaxsiy ma'lumotlarni, egasining xohishidan qat'i nazar, hamma uchun ochiq e'lon qilish",
      "Ma'lumot uchinchi shaxsga berilganini egasidan yashirish va uni hech qachon xabardor qilmaslik",
    ],
    a: 1,
    w: "Qonun ma'lumot egasining roziligi, qayta ishlash maqsadlari va uchinchi shaxsga berishda ma'lumot egasini xabardor qilish talablarini belgilaydi.",
  },
  // Q16
  {
    q: "Mualliflik huquqiga oid 2025-yil noyabrdan kuchga kirgan o'zgartirishlar haqida huquqiy firmalar xabariga ko'ra, qaysi gap to'g'ri?",
    o: [
      "Qalbaki nusxalarni ko'paytirish va tarqatish hech qanday holatda javobgarlik keltirmaydi, chunki bu faqat axloqiy masala",
      "Manba ko'rsatilgan bo'lsa ham, har qanday iqtibos keltirish jinoyat hisoblanadi va qamoq bilan jazolanadi",
      "Faqat ma'muriy jarima belgilangan, jinoiy javobgarlik esa umuman nazarda tutilmagan",
      "Zarar yetkazilsa jinoiy javobgarlik bor, lekin birinchi marta sodir etilib zarar 30 kunda qoplansa, ozod qilish mumkin",
    ],
    a: 3,
    w: "Xabarlarga ko'ra, asarlarning qalbaki nusxalarini ko'paytirish va tarqatish, agar zarar yetkazilsa, jinoiy javobgarlik keltiradi. Birinchi marta sodir etilib, zarar aniqlangandan keyin 30 kun ichida to'liq qoplansa, shaxs javobgarlikdan ozod qilinadi. Amaldagi matnni lex.uz'dan tekshiring.",
  },
];