// Scripted replay of the assistant. Synthetic data only.
const SCRIPT = [
  { role: "user", text: "Hola, ¿todavía tienen la Toyota Corolla 2019?" },
  { role: "tool", text: 'tool: buscar_vehiculo(modelo="Corolla", año=2019)\n→ 1 resultado · disponible · 41,200 mi · RD$ 1,150,000' },
  { role: "bot", text: "¡Hola! Sí, la Corolla 2019 sigue disponible. Tiene 41,200 millas y está en RD$ 1,150,000. ¿Quieres que te mande fotos?" },
  { role: "user", text: "Sí, y dime si tiene sunroof" },
  { role: "tool", text: 'tool: enviar_fotos(vehiculo_id=…)\ntool: buscar_specs(modelo="Corolla 2019", pregunta="sunroof")\n→ fuente web: la versión LE no incluye sunroof' },
  { role: "bot", text: "Te mandé las fotos. Según las especificaciones de esa versión (LE), no trae sunroof. ¿Quieres agendar una visita para verla?" },
  { role: "user", text: "¿Me pueden dejar el precio en RD$ 1,000,000?" },
  { role: "tool", text: 'tool: escalar_a_dueno(motivo="solicitud de descuento")\n→ notificación enviada · conversación marcada para seguimiento humano' },
  { role: "bot", text: "Los precios los define el dueño. Ya le pasé tu solicitud y te escribe él directamente. Mientras tanto, ¿qué día te vendría bien para la visita?" },
];

const chat = document.getElementById("chat");
const stepBtn = document.getElementById("step");
let i = 0;

function addMessage(m) {
  const el = document.createElement("div");
  el.className = `msg ${m.role}`;
  el.textContent = m.text;
  chat.appendChild(el);
  el.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

// One click reveals the user message together with the tool calls and reply that follow it.
function next() {
  if (i >= SCRIPT.length) return;
  do { addMessage(SCRIPT[i++]); } while (i < SCRIPT.length && SCRIPT[i].role !== "user");
  if (i >= SCRIPT.length) { stepBtn.disabled = true; stepBtn.textContent = "End of conversation"; }
}

function reset() {
  chat.replaceChildren();
  i = 0;
  stepBtn.disabled = false;
  stepBtn.textContent = "Next message";
  next();
}

stepBtn.addEventListener("click", next);
document.getElementById("reset").addEventListener("click", reset);
reset();
