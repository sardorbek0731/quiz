const $ = (id) => document.getElementById(id);
const L = ["A", "B", "C", "D"],
  TIME = 45;
let order = [],
  pos = 0,
  score = 0,
  cur = null,
  rec = null;
let timer = null,
  deadline = 0,
  qStart = 0,
  active = false,
  answered = false;

const norm = (s) => s.trim().replace(/\s+/g, " ");
const makeId = (n, g) => (norm(n) + "|" + norm(g)).toLowerCase();
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

function bar(el, now) {
  el.innerHTML = "";
  const dq = rec && rec.status === "bekor";
  QS.forEach((_, k) => {
    const s = document.createElement("span"),
      a = rec && rec.answers[k];
    if (dq) s.className = "bad";
    else if (a) s.className = a.correct ? "ok" : "bad";
    else if (k === now) s.className = "now";
    el.appendChild(s);
  });
}

// Sahifa ochilganda: bu qurilmada urinish bo'lsa, qayta boshlab bo'lmaydi
async function init() {
  const id = getMe();
  if (id) {
    const r = await Store.get(id);
    if (r) {
      if (r.status === "jarayonda") {
        // yangilangan yoki yopilgan
        r.status = "bekor";
        r.reason = "sahifa yangilandi yoki yopildi";
        r.score = 0;
        r.finishedAt = Date.now();
        await Store.save(r);
      }
      rec = r;
      showEnd();
      return;
    }
  }
  show("start");
}

async function begin() {
  const btn = $("go"),
    err = $("err");
  const fail = (m) => {
    err.textContent = m;
    err.classList.remove("hidden");
    btn.disabled = false;
  };
  btn.disabled = true;
  err.classList.add("hidden");
  const n = norm($("nm").value),
    g = norm($("gr").value);
  if (n.length < 5 || n.split(" ").length < 2)
    return fail("Ism va familiyangizni to'liq yozing.");
  const id = makeId(n, g);
  if (await Store.get(id))
    return fail(
      "Bu ism va guruh bilan test topshirilgan. Xato bo'lsa, ustozga murojaat qiling.",
    );
  rec = {
    id,
    name: n,
    group: g,
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

function render() {
  const d = QS[order[pos]];
  cur = shuffle(d.o.map((t, k) => ({ t, ok: k === d.a })));
  answered = false;
  $("count").textContent = "Savol " + (pos + 1) + " / " + QS.length;
  bar($("bar"), pos);
  $("q").textContent = d.q;
  $("why").classList.add("hidden");
  $("next").classList.add("hidden");
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
  startTimer();
}

function answer(k) {
  // k = -1: vaqt tugadi
  if (!active || answered) return;
  answered = true;
  stopTimer();
  const qi = order[pos],
    d = QS[qi],
    good = k >= 0 && cur[k].ok;
  if (good) score++;
  rec.answers[pos] = {
    q: qi,
    picked: k >= 0 ? cur[k].t : null,
    correct: good,
    ms: Date.now() - qStart,
  };
  rec.score = score;
  persist();
  [...$("opts").querySelectorAll(".opt")].forEach((b, n) => {
    b.disabled = true;
    if (cur[n].ok) b.classList.add("right");
    else if (n === k) b.classList.add("wrong");
  });
  bar($("bar"), -1);
  const w = $("why");
  w.innerHTML = "<strong></strong><span></span>";
  w.firstChild.textContent = good
    ? "To'g'ri!"
    : k < 0
      ? "Vaqt tugadi."
      : "Noto'g'ri.";
  w.lastChild.textContent = d.w;
  w.classList.remove("hidden");
  const n = $("next");
  n.textContent = pos === QS.length - 1 ? "Natijani ko'rish" : "Keyingi savol";
  n.classList.remove("hidden");
  n.focus();
}

function finish() {
  active = false;
  stopTimer();
  rec.status = "tugadi";
  rec.finishedAt = Date.now();
  rec.score = score;
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

function showEnd() {
  show("end");
  active = false;
  stopTimer();
  const dq = rec.status === "bekor",
    sc = dq ? 0 : rec.score,
    r = sc / rec.total;
  $("who").textContent = rec.name + (rec.group ? " (" + rec.group + ")" : "");
  $("score").textContent = sc + " / " + rec.total;
  $("msg").textContent = dq
    ? "Test bekor qilindi: " + rec.reason + ". Qoidaga ko'ra natija 0."
    : r >= 0.9
      ? "Ajoyib natija!"
      : r >= 0.6
        ? "Yaxshi natija."
        : "Mavzuni yana bir bor ko'rib chiqing.";
  bar($("bar2"), -1);
  const m = $("missed");
  m.innerHTML = "";
  const wrong = dq ? [] : rec.answers.filter((a) => a && !a.correct);
  if (wrong.length) {
    const h = document.createElement("p");
    h.className = "muted";
    h.textContent = "Xato javob bergan savollaringiz:";
    m.appendChild(h);
    wrong.forEach((a) => {
      const d = QS[a.q],
        div = document.createElement("div");
      div.className = "miss";
      const p1 = document.createElement("p"),
        p2 = document.createElement("p"),
        p3 = document.createElement("p");
      p1.innerHTML = "<strong></strong>";
      p1.firstChild.textContent = d.q;
      p2.textContent =
        "Sizning javobingiz: " + (a.picked || "javob berilmagan (vaqt tugadi)");
      p3.textContent = "To'g'ri javob: " + d.o[d.a];
      div.append(p1, p2, p3);
      m.appendChild(div);
    });
  }
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
  qStart = Date.now();
  deadline = qStart + TIME * 1000;
  tick();
  timer = setInterval(tick, 200);
}

$("go").addEventListener("click", begin);
$("nm").addEventListener("keydown", (e) => {
  if (e.key === "Enter") begin();
});
$("next").addEventListener("click", () => {
  if (pos < QS.length - 1) {
    pos++;
    render();
  } else finish();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) disqualify();
});
init();
