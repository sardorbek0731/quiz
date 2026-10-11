const $ = (id) => document.getElementById(id);
const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const LBL = { tugadi: "Tugatdi", bekor: "Bekor", jarayonda: "Jarayonda" };
let rows = [];

const secs = (r) =>
  Math.round(r.answers.reduce((s, a) => s + (a ? a.ms : 0), 0) / 1000);
const hm = (t) =>
  t
    ? new Date(t).toLocaleTimeString("uz-UZ", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

async function load() {
  rows = (await Store.list()).sort(
    (a, b) => (b.startedAt || 0) - (a.startedAt || 0),
  );
  draw();
}

function draw() {
  const done = rows.filter((r) => r.status === "tugadi");
  $("n-done").textContent = done.length;
  $("n-dq").textContent = rows.filter((r) => r.status === "bekor").length;
  $("n-run").textContent = rows.filter((r) => r.status === "jarayonda").length;
  $("avg").textContent = done.length
    ? (done.reduce((s, r) => s + r.score, 0) / done.length).toFixed(1) +
      " / " +
      QS.length
    : "—";

  // Savollar bo'yicha statistika (faqat tugatganlar)
  const st = QS.map((d, i) => ({ i, d, n: 0, ok: 0 }));
  done.forEach((r) =>
    r.answers.forEach((a) => {
      if (a) {
        st[a.q].n++;
        if (a.correct) st[a.q].ok++;
      }
    }),
  );
  const ranked = st.filter((x) => x.n).sort((a, b) => a.ok / a.n - b.ok / b.n);
  $("qnote").textContent = ranked.length
    ? "Eng kam to'g'ri javob berilgan savollar tepada. Muhokama uchun shulardan boshlang."
    : "Hali tugatilgan test yo'q.";
  $("qstats").innerHTML = ranked
    .map((x, k) => {
      const p = Math.round((x.ok / x.n) * 100);
      return (
        '<div class="qrow' +
        (k < 2 ? " worst" : "") +
        '"><div class="t"><span>' +
        (x.i + 1) +
        ". " +
        esc(x.d.q.length > 90 ? x.d.q.slice(0, 90) + "…" : x.d.q) +
        "</span><b>" +
        p +
        "%</b></div>" +
        '<div class="tr"><div class="fl" style="width:' +
        p +
        '%"></div></div></div>'
      );
    })
    .join("");

  // Jadval
  const f = $("flt").value,
    list = f === "all" ? rows : rows.filter((r) => r.status === f);
  $("rows").innerHTML =
    list
      .map(
        (r) =>
          "<tr><td>" +
          esc(r.name) +
          "</td><td>" +
          esc(r.group || "") +
          '</td><td><span class="pill ' +
          r.status +
          '">' +
          LBL[r.status] +
          "</span></td><td>" +
          (r.status === "tugadi"
            ? r.score + "/" + r.total
            : r.status === "bekor"
              ? "0"
              : "…") +
          "</td><td>" +
          secs(r) +
          "</td><td>" +
          hm(r.startedAt) +
          '</td><td><button class="link" data-id="' +
          esc(r.id) +
          '">Qayta ochish</button></td></tr>',
      )
      .join("") ||
    '<tr><td colspan="7" class="muted">Ma\'lumot yo\'q.</td></tr>';
}

$("rows").addEventListener("click", async (e) => {
  const id = e.target.dataset && e.target.dataset.id;
  if (
    id &&
    confirm(
      "Bu urinishni o'chirib, o'quvchiga qayta topshirish imkonini berasizmi?",
    )
  ) {
    await Store.remove(id);
    load();
  }
});
$("flt").addEventListener("change", draw);
$("wipe").addEventListener("click", async () => {
  if (confirm("Barcha natijalar o'chiriladi. Davom etasizmi?")) {
    await Store.clear();
    load();
  }
});
$("csv").addEventListener("click", () => {
  const q = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
  const head = [
    "Ism",
    "Guruh",
    "Holat",
    "Ball",
    "Jami",
    "Vaqt (s)",
    "Boshlandi",
    "Sabab",
  ];
  const lines = [head.map(q).join(",")].concat(
    rows.map((r) =>
      [
        r.name,
        r.group,
        LBL[r.status],
        r.status === "tugadi" ? r.score : 0,
        r.total,
        secs(r),
        r.startedAt ? new Date(r.startedAt).toLocaleString("uz-UZ") : "",
        r.reason,
      ]
        .map(q)
        .join(","),
    ),
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" }),
  );
  a.download = "natijalar.csv";
  a.click();
  URL.revokeObjectURL(a.href);
});
window.addEventListener("storage", load);
setInterval(load, 5000);
load();
