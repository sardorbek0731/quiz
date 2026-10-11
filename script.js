const $ = (id) => document.getElementById(id);
const L = ["A", "B", "C", "D"],
  TIME = 45, // bir savolga beriladigan soniya
  PAUSE = 600; // javobdan keyin keyingi savolga o'tishdan oldingi qisqa pauza (ms)
let order = [],
  pos = 0,
  score = 0,
  cur = null,
  rec = null;
let timer = null,
  deadline = 0,
  qStart = 0,
  active = false,
  answered = false,
  leaving = false; // sahifa yangilanyapti yoki yopilyapti

const norm = (s) => s.trim().replace(/\s+/g, " ");
// Apostrof turlarini birlashtiramiz (O'tkir, O‘tkir, Oʻtkir bir xil bo'ladi)
const makeId = (n) =>
  norm(n)
    .toLowerCase()
    .replace(/[’‘ʻʼ`´]/g, "'");
const okName = (s) => /^\p{L}[\p{L}'’‘ʻʼ`´ -]{1,29}$/u.test(s);
const shuffle = (a) => {
  const x = a.slice();
  for (let k = x.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [x[k], x[j]] = [x[j], x[k]];
  }
  return x;
};
const show = (id) => {
  ["start", "quiz", "end"].forEach((s) =>
    $(s).classList.toggle("hidden", s !== id),
  );
  const credit = document.querySelector(".credit");
  if (credit) credit.classList.toggle("hidden", id === "quiz");
  window.scrollTo(0, 0);
};
const getMe = () => {
  try {
    return localStorage.getItem("qz_me");
  } catch (e) {
    return null;
  }
};
const setMe = (id) => {
  try {
    localStorage.setItem("qz_me", id);
  } catch (e) {}
};
const persist = () => Store.save(rec).catch(() => {});

// Sahifa aynan "yangilash" bilan ochilganmi? Yopib qayta ochish yoki "orqaga" bilan
// qaytish yangilash hisoblanmaydi. Brauzer turini aniqlay olmasak, ehtiyot uchun false.
function isReload() {
  const n = performance.getEntriesByType("navigation")[0];
  if (n) return n.type === "reload";
  return !!performance.navigation && performance.navigation.type === 1;
}

// Progress bar: faqat javob berilgan/berilmaganini ko'rsatadi, to'g'ri-noto'g'rini emas
function drawBar() {
  const el = $("bar");
  el.innerHTML = "";
  QS.forEach((_, k) => {
    const s = document.createElement("span");
    if (k < pos || (k === pos && answered)) s.className = "done";
    else if (k === pos) s.className = "now";
    el.appendChild(s);
  });
}

// Sahifa ochilganda: tugagan urinish bo'lsa natija ko'rsatiladi.
// Tugamagan bo'lsa: sahifa yangilangan bo'lsa test to'xtagan joyidan davom etadi,
// sahifadan chiqib qayta kirilgan bo'lsa test bekor qilinadi.
async function init() {
  const id = getMe();
  if (id) {
    const r = await Store.get(id);
    if (r) {
      rec = r;
      if (r.status === "jarayonda") {
        if (Array.isArray(r.order) && isReload()) return resume();
        r.status = "bekor";
        r.reason = "sahifadan chiqib, qayta kirdingiz";
        r.score = 0;
        r.finishedAt = Date.now();
        await Store.save(r);
      }
      showEnd();
      return;
    }
  }
  show("start");
}

async function begin() {
  const btn = $("go"),
    err = $("err");
  if (btn.disabled) return; // Enter ikki marta bosilsa, test ikki marta boshlanmasin
  const fail = (m) => {
    err.textContent = m;
    err.classList.remove("hidden");
    btn.disabled = false;
  };
  btn.disabled = true;
  err.classList.add("hidden");
  const fn = norm($("fn").value),
    ln = norm($("ln").value);
  if (!okName(fn) || !okName(ln))
    return fail(
      "Ism va familiyani alohida yozing: faqat harflar, kamida 2 ta harf.",
    );
  const n = fn + " " + ln;
  const id = makeId(n);
  if (await Store.get(id))
    return fail(
      "Bu ism va familiya bilan test topshirilgan. Xato bo'lsa, ustozga murojaat qiling.",
    );
  rec = {
    id,
    name: n,
    status: "jarayonda",
    score: 0,
    total: QS.length,
    startedAt: Date.now(),
    finishedAt: null,
    answers: [],
    reason: "",
  };
  try {
    await Store.save(rec);
  } catch (e) {
    return fail(
      "Natijani saqlab bo'lmadi. Brauzerni oddiy (maxfiy bo'lmagan) rejimda oching.",
    );
  }
  setMe(id);
  order = shuffle(QS.map((_, i) => i));
  pos = 0;
  score = 0;
  active = true;
  show("quiz");
  render();
}

// Sahifa yangilangandan keyin testni to'xtagan joyidan davom ettirish.
// Taymer yangilash bilan nolga tushmaydi: tugash vaqti saqlangan.
function resume() {
  order = rec.order;
  pos = rec.pos;
  score = rec.score;
  active = true;
  show("quiz");
  if (rec.answers[pos]) {
    pos++; // bu savolga javob berilgan, keyingisiga o'tamiz
    render();
  } else {
    render(rec.deadline); // vaqti o'tib ketgan bo'lsa, savol "vaqt tugadi" bo'ladi
  }
}

// dl: davom ettirilayotgan savolning saqlangan tugash vaqti
function render(dl) {
  const d = QS[order[pos]];
  cur = shuffle(d.o.map((t, k) => ({ t, ok: k === d.a })));
  answered = false;
  $("count").textContent = "Savol " + (pos + 1) + " / " + QS.length;
  drawBar();
  $("q").textContent = d.q;
  $("note").classList.add("hidden");
  const ul = $("opts");
  ul.innerHTML = "";
  cur.forEach((c, k) => {
    const li = document.createElement("li"),
      b = document.createElement("button");
    b.className = "opt";
    b.type = "button";
    b.innerHTML = '<span class="let">' + L[k] + "</span><span></span>";
    b.lastChild.textContent = c.t;
    b.addEventListener("click", () => answer(k));
    li.appendChild(b);
    ul.appendChild(li);
  });
  deadline = dl || Date.now() + TIME * 1000;
  rec.order = order;
  rec.pos = pos;
  rec.deadline = deadline;
  persist();
  startTimer();
}

// k = tanlangan variant; k = -1: vaqt tugadi. To'g'ri javob hech qachon ko'rsatilmaydi.
function answer(k) {
  if (!active || answered) return;
  answered = true;
  stopTimer();
  const good = k >= 0 && cur[k].ok;
  if (good) score++;
  rec.answers[pos] = {
    q: order[pos],
    correct: good,
    ms: Date.now() - qStart,
  };
  rec.score = score;
  // Oxirgi savol: darrov yakunlanadi, natija ko'rsatilguncha kutilmaydi
  if (pos === QS.length - 1) return finish();
  persist();
  $("opts")
    .querySelectorAll(".opt")
    .forEach((b, i) => {
      b.disabled = true;
      b.classList.toggle("picked", i === k);
    });
  drawBar();
  if (k < 0) {
    const note = $("note");
    note.textContent = "Vaqt tugadi.";
    note.classList.remove("hidden");
  }
  setTimeout(next, PAUSE);
}

function next() {
  if (!active) return; // pauza paytida test bekor bo'lgan bo'lishi mumkin
  pos++;
  render();
}

function finish() {
  active = false;
  stopTimer();
  rec.status = "tugadi";
  rec.finishedAt = Date.now();
  persist();
  showEnd();
}

function disqualify() {
  if (!active || !rec) return;
  active = false;
  stopTimer();
  rec.status = "bekor";
  rec.reason = "boshqa sahifa yoki ilovaga o'tdingiz";
  rec.score = 0;
  rec.finishedAt = Date.now();
  persist();
  showEnd();
}

// Faqat yakuniy ball. Savollar va to'g'ri javoblar ko'rsatilmaydi.
function showEnd() {
  show("end");
  const dq = rec.status === "bekor",
    sc = dq ? 0 : rec.score,
    r = sc / rec.total;
  $("who").textContent = rec.name;
  $("score").textContent = sc + " / " + rec.total;
  $("msg").textContent = dq
    ? "Test bekor qilindi: " + rec.reason + ". Qoidaga ko'ra natija 0."
    : r >= 0.9
      ? "Ajoyib natija!"
      : r >= 0.6
        ? "Yaxshi natija."
        : "Mavzuni yana bir bor ko'rib chiqing.";
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
function tick() {
  const left = Math.max(0, deadline - Date.now()),
    s = Math.ceil(left / 1000),
    f = $("fill");
  $("sec").textContent = s;
  f.style.width = (left / (TIME * 1000)) * 100 + "%";
  f.classList.toggle("low", s <= 10);
  if (left <= 0) {
    stopTimer();
    answer(-1);
  }
}
function startTimer() {
  stopTimer();
  qStart = deadline - TIME * 1000;
  tick();
  timer = setInterval(tick, 200);
}

$("go").addEventListener("click", begin);
$("fn").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    $("ln").focus();
  }
});
$("ln").addEventListener("keydown", (e) => {
  if (e.key === "Enter") begin();
});

// Boshqa ilovaga o'tish test bekor qiladi, lekin sahifani yangilash yoki yopish emas:
// yangilashda brauzer ham "yashirin" hodisasini yuboradi, shuning uchun avval
// pagehide belgisi tekshiriladi (pagehide faqat sahifa haqiqatan yopilganda ishlaydi).
window.addEventListener("pagehide", () => (leaving = true));
window.addEventListener("pageshow", (e) => {
  leaving = false;
  if (e.persisted) disqualify(); // boshqa sahifaga o'tib, "orqaga" bilan qaytgan
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden)
    setTimeout(() => {
      if (!leaving) disqualify();
    }, 0);
});
init();
