// Ma'lumot qatlami. Keyin Firebase'ga o'tganda faqat shu fayl almashadi.
const Store = (() => {
  const P = "qz:";
  const ok = () => { try { localStorage.setItem(P+"t","1"); localStorage.removeItem(P+"t"); return true } catch(e){ return false } };
  return {
    available: ok(),
    async get(id){ try { return JSON.parse(localStorage.getItem(P+id)) } catch(e){ return null } },
    async save(rec){ localStorage.setItem(P+rec.id, JSON.stringify(rec)); return rec },
    async list(){
      const out = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith(P) && k !== P+"t") { try { out.push(JSON.parse(localStorage.getItem(k))) } catch(e){} }
      }
      return out;
    },
    async remove(id){ localStorage.removeItem(P+id) },
    async clear(){ for (const r of await this.list()) localStorage.removeItem(P+r.id) }
  };
})();