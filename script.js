// Theme toggle (remembered per browser; storage may be unavailable)
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
} catch { /* ignore */ }
document.getElementById("theme").addEventListener("click", () => {
  const dark = root.getAttribute("data-theme") === "dark" ||
    (!root.hasAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
  const next = dark ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch { /* ignore */ }
});

// WhatsApp assistant demo. Synthetic data. The language switch exists only in this demo;
// the production assistant replies in the customer's language.
const SCRIPTS = {
  en: {
    next: "Next message", end: "End of conversation",
    steps: [
      { role: "user", text: "Hi, do you still have the 2019 Toyota Corolla?" },
      { role: "tool", text: 'tool: search_vehicle(model="Corolla", year=2019)\n→ 1 result · available · 41,200 mi · RD$ 1,150,000' },
      { role: "bot", text: "Hi! Yes, the 2019 Corolla is still available. It has 41,200 miles and is priced at RD$ 1,150,000. Would you like photos?" },
      { role: "user", text: "Yes please, and does it have a sunroof?" },
      { role: "tool", text: 'tool: send_photos(vehicle_id=…)\ntool: lookup_specs(model="Corolla 2019", question="sunroof")\n→ web source: the LE trim has no sunroof' },
      { role: "bot", text: "I sent you the photos. According to the specs for that trim (LE), it has no sunroof. Would you like to book a visit to see it?" },
      { role: "user", text: "Could you do RD$ 1,000,000?" },
      { role: "tool", text: 'tool: escalate_to_owner(reason="discount request")\n→ notification sent · conversation flagged for human follow-up' },
      { role: "bot", text: "Pricing is set by the owner. I passed your request along and he will message you directly. Meanwhile, what day works for a visit?" },
    ],
  },
  es: {
    next: "Siguiente mensaje", end: "Fin de la conversación",
    steps: [
      { role: "user", text: "Hola, ¿todavía tienen la Toyota Corolla 2019?" },
      { role: "tool", text: 'tool: buscar_vehiculo(modelo="Corolla", año=2019)\n→ 1 resultado · disponible · 41,200 mi · RD$ 1,150,000' },
      { role: "bot", text: "¡Hola! Sí, la Corolla 2019 sigue disponible. Tiene 41,200 millas y está en RD$ 1,150,000. ¿Quieres que te mande fotos?" },
      { role: "user", text: "Sí, y dime si tiene sunroof" },
      { role: "tool", text: 'tool: enviar_fotos(vehiculo_id=…)\ntool: buscar_specs(modelo="Corolla 2019", pregunta="sunroof")\n→ fuente web: la versión LE no incluye sunroof' },
      { role: "bot", text: "Te mandé las fotos. Según las especificaciones de esa versión (LE), no trae sunroof. ¿Quieres agendar una visita para verla?" },
      { role: "user", text: "¿Me pueden dejar el precio en RD$ 1,000,000?" },
      { role: "tool", text: 'tool: escalar_a_dueno(motivo="solicitud de descuento")\n→ notificación enviada · conversación marcada para seguimiento humano' },
      { role: "bot", text: "Los precios los define el dueño. Ya le pasé tu solicitud y te escribe él directamente. Mientras tanto, ¿qué día te vendría bien para la visita?" },
    ],
  },
};

const chat = document.getElementById("chat");
const stepBtn = document.getElementById("step");
const langBtns = { en: document.getElementById("lang-en"), es: document.getElementById("lang-es") };
let lang = "en";
let i = 0;

function addMessage(m) {
  const el = document.createElement("div");
  el.className = `msg ${m.role}`;
  el.textContent = m.text;
  chat.appendChild(el);
  // scroll inside the chat box only; scrolling the page would jump to the demo on load
  chat.scrollTop = chat.scrollHeight;
}

// One click reveals a customer message together with the tool calls and reply that follow it.
function next() {
  const steps = SCRIPTS[lang].steps;
  if (i >= steps.length) return;
  do { addMessage(steps[i++]); } while (i < steps.length && steps[i].role !== "user");
  if (i >= steps.length) { stepBtn.disabled = true; stepBtn.textContent = SCRIPTS[lang].end; }
}

function reset() {
  chat.replaceChildren();
  i = 0;
  stepBtn.disabled = false;
  stepBtn.textContent = SCRIPTS[lang].next;
  next();
}

function setLang(l) {
  lang = l;
  for (const [k, b] of Object.entries(langBtns)) {
    b.classList.toggle("on", k === l);
    b.setAttribute("aria-pressed", String(k === l));
  }
  reset();
}

stepBtn.addEventListener("click", next);
document.getElementById("reset").addEventListener("click", reset);
langBtns.en.addEventListener("click", () => setLang("en"));
langBtns.es.addEventListener("click", () => setLang("es"));
reset();
