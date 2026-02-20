import { useState, useEffect } from "react";

function addDays(date, days) { const d = new Date(date); d.setDate(d.getDate() + days); return d; }
function startOfDay(date) { return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }
function isSameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function daysBetween(a, b) { return Math.round((startOfDay(b) - startOfDay(a)) / 86400000); }
function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfWeek(year, month) { return ((new Date(year, month, 1).getDay()) + 6) % 7; }

// ─── Traducciones ─────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  es: {
    appName: "Vitalia", welcome: "Bienvenida a Vitalia",
    cycleQuestion: "¿Cuántos días dura tu ciclo?", cycleHint: "Lo más común es entre 25 y 35 días.", cyclePlaceholder: "ej: 28",
    continueBtn: "Continuar →", dontKnow: "No lo sé, usar 28 días", cancel: "Cancelar",
    cycleError: "Introduce un número entre 21 y 45 días",
    daysUntilPeriod: "Días hasta tu período", periodDelay: "Días de retraso", periodActive: "Día de regla",
    registerPeriod: "Registra tu primer período", nextPeriod: "Próximo período:",
    ovulationDay: "Día de ovulación", fertilDay: "fértil",
    realCycle: "Ciclo real", configCycle: "Ciclo", change: "Cambiar",
    startPeriod: "🩸 Inicio del período", endPeriod: "✓ Fin del período",
    home: "Inicio", calendar: "Calendario", stats: "Stats", horoscope: "Horóscopo", settings: "Ajustes",
    calTitle: "📅 Calendario", calInstruction: "Toca un día para ver síntomas o marcar período",
    calPending: "Inicio", calPendingEnd: "toca el día final",
    periodSaved: "Período guardado ✓", periodDeleted: "Período eliminado ✕", newStart: "Nuevo inicio:",
    legend: { period: "Período", selection: "Selección", ovulation: "Ovulación", symptoms: "Síntomas" },
    weekDays: ["L","M","X","J","V","S","D"],
    diary: "📔 Diario", saveDiary: "Guardar", markPeriod: "🩸 Marcar período", removePeriod: "🗑 Quitar período",
    symptomsSaved: "Síntomas guardados ✓",
    dolor: "🩹 Dolor", humor: "💭 Humor", energia: "⚡ Energía", flujo: "💧 Flujo", hinchazon: "🫧 Hinchazón",
    dolorOpts: ["Ninguno","Cólicos","Cabeza","Espalda","Varios"],
    humorOpts: ["😊 Feliz","😤 Irritable","😢 Triste","😰 Ansiosa","😐 Neutro"],
    energiaOpts: ["🔋 Alta","🔶 Media","🪫 Baja"],
    flujoOpts: ["Ninguno","Escaso","Normal","Abundante"],
    hinchazonOpts: ["No","Sí"],
    statsTitle: "📊 Estadísticas", statsSubtitle: "Últimos 30 días",
    statsEmpty: "Aún no hay datos. Registra síntomas tocando días en el calendario.",
    statsResumen: "📝 Resumen", statsResumenText: "Has registrado síntomas en", statsResumenText2: "días de los últimos 30.",
    statsDays: "días",
    settingsTitle: "⚙️ Ajustes", notifTitle: "🔔 Notificaciones",
    notifDesc: "Recibirás un aviso el día antes de tu período y cuando llegue tu día de ovulación.",
    notifOn: "Activadas ✓", notifDenied: "Bloqueadas — actívalas en ajustes del móvil",
    notifUnsupported: "No disponibles en este navegador", notifOff: "Sin activar",
    notifBtn: "Activar notificaciones", notifNext: "Próximo aviso:",
    installTitle: "📱 Instalar en el móvil",
    installDesc: "Para instalar Vitalia como app en tu iPhone: abre en Safari, pulsa compartir y selecciona",
    installAdd: '"Añadir a pantalla de inicio"',
    installAndroid: 'En Android: abre en Chrome, tres puntos y selecciona "Añadir a pantalla de inicio".',
    cycleTitle: "⚙️ Ciclo menstrual", cycleAuto: "Ciclo calculado automáticamente:", cycleManual: "Ciclo configurado:",
    cycleChangeBtn: "Cambiar duración del ciclo",
    deleteTitle: "🗑 Borrar datos", deleteDesc: "Elimina todos los períodos y síntomas registrados.",
    deleteBtn: "Borrar todos los datos", deleteConfirm: "¿Borrar todos los datos de Vitalia?", deleteToast: "Datos eliminados",
    langTitle: "🌐 Idioma",
    horTitle: "🔮 Horóscopo", chooseSign: "Elige tu signo del zodiaco", planetsToday: "🪐 Posiciones planetarias de hoy",
    notifPeriod: "Mañana empieza tu período. ¡Prepárate!", notifOvulation: "Hoy es tu día de ovulación — máxima fertilidad.",
  },
  en: {
    appName: "Vitalia", welcome: "Welcome to Vitalia",
    cycleQuestion: "How many days does your cycle last?", cycleHint: "Most common is between 25 and 35 days.", cyclePlaceholder: "e.g. 28",
    continueBtn: "Continue →", dontKnow: "I don't know, use 28 days", cancel: "Cancel",
    cycleError: "Please enter a number between 21 and 45 days",
    daysUntilPeriod: "Days until period", periodDelay: "Days late", periodActive: "Period day",
    registerPeriod: "Register your first period", nextPeriod: "Next period:",
    ovulationDay: "Ovulation day", fertilDay: "fertile",
    realCycle: "Real cycle", configCycle: "Cycle", change: "Change",
    startPeriod: "🩸 Start period", endPeriod: "✓ End period",
    home: "Home", calendar: "Calendar", stats: "Stats", horoscope: "Horoscope", settings: "Settings",
    calTitle: "📅 Calendar", calInstruction: "Tap a day to log symptoms or mark period",
    calPending: "Start", calPendingEnd: "tap the end day",
    periodSaved: "Period saved ✓", periodDeleted: "Period deleted ✕", newStart: "New start:",
    legend: { period: "Period", selection: "Selection", ovulation: "Ovulation", symptoms: "Symptoms" },
    weekDays: ["M","T","W","T","F","S","S"],
    diary: "📔 Diary", saveDiary: "Save", markPeriod: "🩸 Mark period", removePeriod: "🗑 Remove period",
    symptomsSaved: "Symptoms saved ✓",
    dolor: "🩹 Pain", humor: "💭 Mood", energia: "⚡ Energy", flujo: "💧 Flow", hinchazon: "🫧 Bloating",
    dolorOpts: ["None","Cramps","Headache","Back pain","Multiple"],
    humorOpts: ["😊 Happy","😤 Irritable","😢 Sad","😰 Anxious","😐 Neutral"],
    energiaOpts: ["🔋 High","🔶 Medium","🪫 Low"],
    flujoOpts: ["None","Light","Normal","Heavy"],
    hinchazonOpts: ["No","Yes"],
    statsTitle: "📊 Statistics", statsSubtitle: "Last 30 days",
    statsEmpty: "No data yet. Log symptoms by tapping days in the calendar.",
    statsResumen: "📝 Summary", statsResumenText: "You logged symptoms on", statsResumenText2: "of the last 30 days.",
    statsDays: "days",
    settingsTitle: "⚙️ Settings", notifTitle: "🔔 Notifications",
    notifDesc: "You'll get an alert the day before your period and on your ovulation day.",
    notifOn: "Enabled ✓", notifDenied: "Blocked — enable in your phone settings",
    notifUnsupported: "Not available in this browser", notifOff: "Not enabled",
    notifBtn: "Enable notifications", notifNext: "Next alert:",
    installTitle: "📱 Install on mobile",
    installDesc: "To install Vitalia on iPhone: open in Safari, tap share and select",
    installAdd: '"Add to Home Screen"',
    installAndroid: 'On Android: open in Chrome, tap the three dots and select "Add to Home Screen".',
    cycleTitle: "⚙️ Menstrual cycle", cycleAuto: "Automatically calculated cycle:", cycleManual: "Configured cycle:",
    cycleChangeBtn: "Change cycle length",
    deleteTitle: "🗑 Delete data", deleteDesc: "Delete all registered periods and symptoms.",
    deleteBtn: "Delete all data", deleteConfirm: "Delete all Vitalia data?", deleteToast: "Data deleted",
    langTitle: "🌐 Language",
    horTitle: "🔮 Horoscope", chooseSign: "Choose your zodiac sign", planetsToday: "🪐 Today's planetary positions",
    notifPeriod: "Your period starts tomorrow. Get ready!", notifOvulation: "Today is your ovulation day — peak fertility.",
  },
  pt: {
    appName: "Vitalia", welcome: "Bem-vinda ao Vitalia",
    cycleQuestion: "Quantos dias dura o seu ciclo?", cycleHint: "O mais comum é entre 25 e 35 dias.", cyclePlaceholder: "ex: 28",
    continueBtn: "Continuar →", dontKnow: "Não sei, usar 28 dias", cancel: "Cancelar",
    cycleError: "Insira um número entre 21 e 45 dias",
    daysUntilPeriod: "Dias até a menstruação", periodDelay: "Dias de atraso", periodActive: "Dia de menstruação",
    registerPeriod: "Registe a sua primeira menstruação", nextPeriod: "Próxima menstruação:",
    ovulationDay: "Dia de ovulação", fertilDay: "fértil",
    realCycle: "Ciclo real", configCycle: "Ciclo", change: "Alterar",
    startPeriod: "🩸 Início da menstruação", endPeriod: "✓ Fim da menstruação",
    home: "Início", calendar: "Calendário", stats: "Stats", horoscope: "Horóscopo", settings: "Ajustes",
    calTitle: "📅 Calendário", calInstruction: "Toque num dia para ver sintomas ou marcar menstruação",
    calPending: "Início", calPendingEnd: "toque no dia final",
    periodSaved: "Menstruação guardada ✓", periodDeleted: "Menstruação eliminada ✕", newStart: "Novo início:",
    legend: { period: "Menstruação", selection: "Seleção", ovulation: "Ovulação", symptoms: "Sintomas" },
    weekDays: ["S","T","Q","Q","S","S","D"],
    diary: "📔 Diário", saveDiary: "Guardar", markPeriod: "🩸 Marcar menstruação", removePeriod: "🗑 Remover menstruação",
    symptomsSaved: "Sintomas guardados ✓",
    dolor: "🩹 Dor", humor: "💭 Humor", energia: "⚡ Energia", flujo: "💧 Fluxo", hinchazon: "🫧 Inchaço",
    dolorOpts: ["Nenhuma","Cólicas","Cabeça","Costas","Vários"],
    humorOpts: ["😊 Feliz","😤 Irritável","😢 Triste","😰 Ansiosa","😐 Neutro"],
    energiaOpts: ["🔋 Alta","🔶 Média","🪫 Baixa"],
    flujoOpts: ["Nenhum","Escasso","Normal","Abundante"],
    hinchazonOpts: ["Não","Sim"],
    statsTitle: "📊 Estatísticas", statsSubtitle: "Últimos 30 dias",
    statsEmpty: "Ainda sem dados. Registe sintomas tocando nos dias do calendário.",
    statsResumen: "📝 Resumo", statsResumenText: "Registou sintomas em", statsResumenText2: "dos últimos 30 dias.",
    statsDays: "dias",
    settingsTitle: "⚙️ Ajustes", notifTitle: "🔔 Notificações",
    notifDesc: "Receberá um aviso no dia antes da menstruação e no dia da ovulação.",
    notifOn: "Ativadas ✓", notifDenied: "Bloqueadas — ative nas configurações do telemóvel",
    notifUnsupported: "Não disponível neste navegador", notifOff: "Não ativadas",
    notifBtn: "Ativar notificações", notifNext: "Próximo aviso:",
    installTitle: "📱 Instalar no telemóvel",
    installDesc: "Para instalar o Vitalia no iPhone: abra no Safari, toque em partilhar e selecione",
    installAdd: '"Adicionar ao ecrã inicial"',
    installAndroid: 'No Android: abra no Chrome, toque nos três pontos e selecione "Adicionar ao ecrã inicial".',
    cycleTitle: "⚙️ Ciclo menstrual", cycleAuto: "Ciclo calculado automaticamente:", cycleManual: "Ciclo configurado:",
    cycleChangeBtn: "Alterar duração do ciclo",
    deleteTitle: "🗑 Apagar dados", deleteDesc: "Elimina todos os períodos e sintomas registados.",
    deleteBtn: "Apagar todos os dados", deleteConfirm: "Apagar todos os dados do Vitalia?", deleteToast: "Dados eliminados",
    langTitle: "🌐 Idioma",
    horTitle: "🔮 Horóscopo", chooseSign: "Escolha o seu signo do zodíaco", planetsToday: "🪐 Posições planetárias de hoje",
    notifPeriod: "A sua menstruação começa amanhã. Prepare-se!", notifOvulation: "Hoje é o seu dia de ovulação — máxima fertilidade.",
  },
  it: {
    appName: "Vitalia", welcome: "Benvenuta in Vitalia",
    cycleQuestion: "Quanti giorni dura il tuo ciclo?", cycleHint: "Il più comune è tra 25 e 35 giorni.", cyclePlaceholder: "es: 28",
    continueBtn: "Continua →", dontKnow: "Non lo so, usa 28 giorni", cancel: "Annulla",
    cycleError: "Inserisci un numero tra 21 e 45 giorni",
    daysUntilPeriod: "Giorni al ciclo", periodDelay: "Giorni di ritardo", periodActive: "Giorno del ciclo",
    registerPeriod: "Registra il tuo primo ciclo", nextPeriod: "Prossimo ciclo:",
    ovulationDay: "Giorno di ovulazione", fertilDay: "fertile",
    realCycle: "Ciclo reale", configCycle: "Ciclo", change: "Cambia",
    startPeriod: "🩸 Inizio ciclo", endPeriod: "✓ Fine ciclo",
    home: "Inizio", calendar: "Calendario", stats: "Stats", horoscope: "Oroscopo", settings: "Impostazioni",
    calTitle: "📅 Calendario", calInstruction: "Tocca un giorno per vedere sintomi o segnare il ciclo",
    calPending: "Inizio", calPendingEnd: "tocca il giorno finale",
    periodSaved: "Ciclo salvato ✓", periodDeleted: "Ciclo eliminato ✕", newStart: "Nuovo inizio:",
    legend: { period: "Ciclo", selection: "Selezione", ovulation: "Ovulazione", symptoms: "Sintomi" },
    weekDays: ["L","M","M","G","V","S","D"],
    diary: "📔 Diario", saveDiary: "Salva", markPeriod: "🩸 Segna ciclo", removePeriod: "🗑 Rimuovi ciclo",
    symptomsSaved: "Sintomi salvati ✓",
    dolor: "🩹 Dolore", humor: "💭 Umore", energia: "⚡ Energia", flujo: "💧 Flusso", hinchazon: "🫧 Gonfiore",
    dolorOpts: ["Nessuno","Crampi","Testa","Schiena","Vari"],
    humorOpts: ["😊 Felice","😤 Irritabile","😢 Triste","😰 Ansiosa","😐 Neutro"],
    energiaOpts: ["🔋 Alta","🔶 Media","🪫 Bassa"],
    flujoOpts: ["Nessuno","Scarso","Normale","Abbondante"],
    hinchazonOpts: ["No","Sì"],
    statsTitle: "📊 Statistiche", statsSubtitle: "Ultimi 30 giorni",
    statsEmpty: "Ancora nessun dato. Registra sintomi toccando i giorni nel calendario.",
    statsResumen: "📝 Riepilogo", statsResumenText: "Hai registrato sintomi in", statsResumenText2: "degli ultimi 30 giorni.",
    statsDays: "giorni",
    settingsTitle: "⚙️ Impostazioni", notifTitle: "🔔 Notifiche",
    notifDesc: "Riceverai un avviso il giorno prima del ciclo e nel giorno dell'ovulazione.",
    notifOn: "Attivate ✓", notifDenied: "Bloccate — attivale nelle impostazioni del telefono",
    notifUnsupported: "Non disponibile in questo browser", notifOff: "Non attivate",
    notifBtn: "Attiva notifiche", notifNext: "Prossimo avviso:",
    installTitle: "📱 Installa sul telefono",
    installDesc: "Per installare Vitalia su iPhone: apri in Safari, tocca condividi e seleziona",
    installAdd: '"Aggiungi alla schermata Home"',
    installAndroid: 'Su Android: apri in Chrome, tocca i tre puntini e seleziona "Aggiungi alla schermata Home".',
    cycleTitle: "⚙️ Ciclo mestruale", cycleAuto: "Ciclo calcolato automaticamente:", cycleManual: "Ciclo configurato:",
    cycleChangeBtn: "Cambia durata del ciclo",
    deleteTitle: "🗑 Elimina dati", deleteDesc: "Elimina tutti i cicli e sintomi registrati.",
    deleteBtn: "Elimina tutti i dati", deleteConfirm: "Eliminare tutti i dati di Vitalia?", deleteToast: "Dati eliminati",
    langTitle: "🌐 Lingua",
    horTitle: "🔮 Oroscopo", chooseSign: "Scegli il tuo segno zodiacale", planetsToday: "🪐 Posizioni planetarie di oggi",
    notifPeriod: "Il tuo ciclo inizia domani. Preparati!", notifOvulation: "Oggi è il tuo giorno di ovulazione — massima fertilità.",
  },
};


// ─── Notificaciones locales ───────────────────────────────────────────────────
async function registerSW() {
  if ("serviceWorker" in navigator) {
    try { await navigator.serviceWorker.register("/sw.js"); } catch (e) { console.warn("SW error", e); }
  }
}

async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  const result = await Notification.requestPermission();
  return result;
}

function scheduleLocalNotification(title, body, delayMs) {
  if (Notification.permission !== "granted") return;
  setTimeout(() => { new Notification(title, { body, icon: "/icon-192.png" }); }, delayMs);
}

function checkAndScheduleNotifications(nextPeriodStart, ovulationDays) {
  if (!nextPeriodStart) return;
  const now = new Date();
  const today = startOfDay(now);

  // 1 día antes del período
  const dayBefore = startOfDay(addDays(nextPeriodStart, -1));
  const msToDayBefore = dayBefore - today;
  if (msToDayBefore >= 0 && msToDayBefore < 86400000 * 2) {
    scheduleLocalNotification("🌸 Vitalia", "Mañana empieza tu período. ¡Prepárate!", msToDayBefore);
  }

  // Días fértiles / ovulación
  ovulationDays.forEach(({ date, fertility }) => {
    if (fertility === 1) {
      const ovDay = startOfDay(date);
      const msToOv = ovDay - today;
      if (msToOv >= 0 && msToOv < 86400000 * 2) {
        scheduleLocalNotification("🌺 Vitalia", "Hoy es tu día de ovulación — máxima fertilidad.", msToOv);
      }
    }
  });
}


const PHASE_DATA = {
  menstruacion: { nombre: "Menstruación", dias: "Días 1–5", color: "#f2bec7", colorDark: "#c4606f", emoji: "🩸",
    hormonas: [{ nombre: "Estrógeno", nivel: 15, descripcion: "Muy bajo" }, { nombre: "Progesterona", nivel: 10, descripcion: "Muy baja" }, { nombre: "FSH", nivel: 40, descripcion: "Empieza a subir" }, { nombre: "LH", nivel: 10, descripcion: "Baja" }],
    fisico: ["Cólicos y dolor abdominal", "Fatiga y cansancio", "Hinchazón", "Posibles dolores de cabeza", "Sensibilidad en pechos"],
    emocional: ["Mayor sensibilidad emocional", "Tendencia al aislamiento", "Necesidad de descanso", "Posible irritabilidad"],
    consejos: { alimentacion: ["Hierro: lentejas, espinacas, carnes rojas", "Magnesio para los cólicos: chocolate negro, frutos secos", "Evita la sal para reducir hinchazón", "Infusiones de jengibre o manzanilla"], ejercicio: ["Yoga suave o estiramientos", "Paseos tranquilos", "Escucha a tu cuerpo y descansa si lo necesitas"] } },
  folicular: { nombre: "Fase Folicular", dias: "Días 6–13", color: "#f9d8e0", colorDark: "#d4788a", emoji: "🌱",
    hormonas: [{ nombre: "Estrógeno", nivel: 75, descripcion: "Subiendo rápido" }, { nombre: "Progesterona", nivel: 15, descripcion: "Todavía baja" }, { nombre: "FSH", nivel: 60, descripcion: "Alta, estimula folículos" }, { nombre: "LH", nivel: 20, descripcion: "Empieza a subir" }],
    fisico: ["Aumento de energía", "Piel más luminosa", "Mayor apetito sexual", "Sensación de bienestar físico", "Más fuerza muscular"],
    emocional: ["Optimismo y buen humor", "Mayor creatividad", "Sociabilidad alta", "Confianza en ti misma", "Mente más clara y enfocada"],
    consejos: { alimentacion: ["Proteínas para apoyar la energía: huevos, legumbres", "Verduras crucíferas: brócoli, coliflor", "Semillas de lino (fitoestrógenos naturales)", "Frutas frescas y coloridas"], ejercicio: ["¡Momento ideal para entrenar fuerte!", "Cardio, pesas, HIIT", "Prueba actividades nuevas", "Tu rendimiento estará en su mejor momento"] } },
  ovulacion: { nombre: "Ovulación", dias: "Día ~14", color: "#f5cdd5", colorDark: "#b85068", emoji: "🌺",
    hormonas: [{ nombre: "Estrógeno", nivel: 95, descripcion: "Pico máximo" }, { nombre: "Progesterona", nivel: 20, descripcion: "Empieza a subir" }, { nombre: "FSH", nivel: 50, descripcion: "Bajando" }, { nombre: "LH", nivel: 100, descripcion: "Pico ovulatorio" }],
    fisico: ["Mayor flujo vaginal transparente y elástico", "Leve dolor en un lado del abdomen", "Temperatura basal ligeramente elevada", "Mayor libido", "Pechos más sensibles"],
    emocional: ["Máxima confianza y atractivo", "Muy sociable y comunicativa", "Libido en su punto más alto", "Energía y vitalidad máximas"],
    consejos: { alimentacion: ["Zinc: semillas de calabaza, mariscos", "Antioxidantes: frutos rojos, tomate", "Omega-3: salmón, nueces", "Mantente muy hidratada"], ejercicio: ["Aprovecha tu energía máxima", "Deportes en equipo o actividades sociales", "Entrena con intensidad alta", "Baile, spinning, crossfit"] } },
  lutea: { nombre: "Fase Lútea", dias: "Días 15–28", color: "#f5e6d8", colorDark: "#b07050", emoji: "🌙",
    hormonas: [{ nombre: "Estrógeno", nivel: 50, descripcion: "Bajando" }, { nombre: "Progesterona", nivel: 85, descripcion: "Pico alto" }, { nombre: "FSH", nivel: 20, descripcion: "Baja" }, { nombre: "LH", nivel: 15, descripcion: "Baja" }],
    fisico: ["Hinchazón y retención de líquidos", "Sensibilidad en pechos", "Antojos especialmente de dulce", "Posible acné", "Fatiga en la segunda mitad"],
    emocional: ["Mayor introspección", "Posible síndrome premenstrual (SPM)", "Irritabilidad o tristeza", "Necesidad de orden y rutina", "Ansiedad leve"],
    consejos: { alimentacion: ["Reduce azúcar y cafeína para el SPM", "Calcio: lácteos, almendras, sésamo", "Vitamina B6: plátano, pavo, patata", "Chocolate negro con moderación"], ejercicio: ["Yoga, pilates, natación suave", "Reduce la intensidad si te sientes cansada", "Paseos en la naturaleza", "Ejercicios de respiración y meditación"] } },
};

function getPhaseInfo(entries, cycleLength = 28) {
  if (!entries.length) return null;
  const sorted = [...entries].sort((a, b) => new Date(a.start) - new Date(b.start));
  const lastStart = new Date(sorted[sorted.length - 1].start);
  const today = startOfDay(new Date());
  const dayOfCycle = daysBetween(startOfDay(lastStart), today) + 1;
  const n = ((dayOfCycle - 1) % cycleLength) + 1;
  if (n <= 5) return { phase: PHASE_DATA.menstruacion, dayOfCycle: n };
  if (n <= 13) return { phase: PHASE_DATA.folicular, dayOfCycle: n };
  if (n === 14) return { phase: PHASE_DATA.ovulacion, dayOfCycle: n };
  return { phase: PHASE_DATA.lutea, dayOfCycle: n };
}

function computePredictions(entries, cycleLength = 28, lutealPhase = 14) {
  if (!entries.length) return { nextPeriodStart: null, ovulationDays: [] };
  const sorted = [...entries].sort((a, b) => new Date(a.start) - new Date(b.start));
  const lastStart = new Date(sorted[sorted.length - 1].start);
  const nextPeriodStart = addDays(lastStart, cycleLength);
  const ovulationDays = [];
  function pushOvWindow(ovDay) {
    for (let i = -2; i <= 2; i++) ovulationDays.push({ date: addDays(ovDay, i), fertility: i === 0 ? 1 : Math.abs(i) === 1 ? 0.75 : 0.4 });
  }
  sorted.forEach(e => pushOvWindow(addDays(new Date(e.start), lutealPhase)));
  for (let i = 1; i <= 4; i++) pushOvWindow(addDays(addDays(lastStart, cycleLength * i), lutealPhase));
  return { nextPeriodStart, ovulationDays };
}

function calcRealCycle(entries) {
  const sorted = [...entries].filter(e => e.end).sort((a, b) => new Date(a.start) - new Date(b.start));
  if (sorted.length < 2) return null;
  const diffs = [];
  for (let i = 1; i < sorted.length; i++) diffs.push(daysBetween(startOfDay(new Date(sorted[i-1].start)), startOfDay(new Date(sorted[i].start))));
  return Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
}

function FlowerIcon({ fertility }) {
  const opacity = 0.5 + fertility * 0.5;
  const size = 10 + fertility * 4;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity, filter: "drop-shadow(0 1px 2px rgba(196,96,111,0.25))" }}>
      {/* Pétalo izquierdo */}
      <ellipse cx={8} cy={12} rx={5} ry={3} transform="rotate(-30 8 12)" fill="#f2a0b0" opacity={0.85} />
      {/* Pétalo derecho */}
      <ellipse cx={16} cy={12} rx={5} ry={3} transform="rotate(30 16 12)" fill="#e8849a" opacity={0.85} />
      {/* Pétalo superior */}
      <ellipse cx={12} cy={7} rx={3} ry={5} transform="rotate(0 12 7)" fill="#f2a0b0" opacity={0.8} />
      {/* Pétalo inferior */}
      <ellipse cx={12} cy={17} rx={3} ry={5} transform="rotate(0 12 17)" fill="#e8849a" opacity={0.8} />
      {/* Centro */}
      <circle cx={12} cy={12} r={2.5} fill="#c4606f" opacity={0.9} />
    </svg>
  );
}

const HORMONE_INFO = {
  "Estrógeno": {
    que: "La hormona principal del ciclo femenino. La producen los ovarios y regula el desarrollo del ciclo.",
    fisico: "Aumenta la energía, mejora la piel y el cabello, reduce la retención de líquidos y disminuye el dolor.",
    emocional: "Eleva el ánimo, mejora la concentración y aumenta la sociabilidad y la confianza.",
    consejo: "Aprovecha cuando el estrógeno está alto para tareas que requieran energía y creatividad.",
  },
  "Progesterona": {
    que: "Hormona que prepara el útero para un posible embarazo y domina la fase lútea del ciclo.",
    fisico: "Puede causar hinchazón, sensibilidad en pechos, retención de líquidos y cansancio.",
    emocional: "Puede provocar cambios de humor, irritabilidad o sensación de calma según la persona.",
    consejo: "Descansa más, reduce el ejercicio intenso y prioriza alimentos ricos en magnesio.",
  },
  "FSH": {
    que: "Hormona foliculoestimulante. Estimula el crecimiento de los folículos en los ovarios.",
    fisico: "Su pico al inicio del ciclo activa la maduración del óvulo y prepara el cuerpo para la ovulación.",
    emocional: "Niveles altos pueden dar sensación de renovación y motivación al inicio del ciclo.",
    consejo: "Es el momento perfecto para empezar proyectos nuevos o retomar rutinas saludables.",
  },
  "LH": {
    que: "Hormona luteinizante. Su pico provoca la ovulación, el momento más fértil del ciclo.",
    fisico: "El pico de LH puede causar un ligero dolor pélvico (mittelschmerz) y aumento de la temperatura basal.",
    emocional: "Muchas mujeres se sienten más seguras, extrovertidas y con más energía durante el pico de LH.",
    consejo: "Si buscas embarazo, este es tu momento clave. Si no, es ideal para actividad física intensa.",
  },
  "Testosterona": {
    que: "Presente en cantidades pequeñas en mujeres, influye en la libido, energía y músculo.",
    fisico: "Niveles más altos cerca de la ovulación aumentan la fuerza, resistencia y deseo sexual.",
    emocional: "Contribuye a la seguridad en una misma, la asertividad y la motivación.",
    consejo: "Aprovecha el pico de testosterona para entrenamientos de fuerza o negociaciones importantes.",
  },
};

function HormoneBar({ nombre, nivel, descripcion, color }) {
  const [open, setOpen] = useState(false);
  const info = HORMONE_INFO[nombre];
  return (
    <div style={{ marginBottom: 10 }}>
      <div onClick={() => info && setOpen(o => !o)} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, cursor: info ? "pointer" : "default" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: 4 }}>
          {nombre}
          {info && <span style={{ fontSize: 9, color: color, fontWeight: 700 }}>ⓘ</span>}
        </span>
        <span style={{ fontSize: 11, color: "#9ca3af" }}>{descripcion}</span>
      </div>
      <div style={{ background: "#f3f4f6", borderRadius: 99, height: 8, overflow: "hidden" }}>
        <div style={{ width: `${nivel}%`, height: "100%", background: color, borderRadius: 99 }} />
      </div>
      {open && info && (
        <div style={{ marginTop: 10, background: "#fdf8f6", borderRadius: 14, padding: "12px 14px", border: "1px solid #f2dde1", fontSize: 12, color: "#3d2c2c", lineHeight: 1.6 }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 700, color }}>¿Qué es? </span>{info.que}
          </div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 700, color }}>🧍 Físico: </span>{info.fisico}
          </div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 700, color }}>💭 Emocional: </span>{info.emocional}
          </div>
          <div>
            <span style={{ fontWeight: 700, color }}>💡 Consejo: </span>{info.consejo}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Cálculo astronómico real ─────────────────────────────────────────────────

const ZODIAC_NAMES = ["Aries","Tauro","Géminis","Cáncer","Leo","Virgo","Libra","Escorpio","Sagitario","Capricornio","Acuario","Piscis"];

function calcPlanets() {
  const d = (new Date().getTime() / 86400000) + 2440587.5 - 2451545.0;
  const norm = lon => ((lon % 360) + 360) % 360;
  const signIdx = lon => Math.floor(norm(lon) / 30);
  const label = lon => `${Math.round(norm(lon) % 30)}° ${ZODIAC_NAMES[signIdx(lon)]}`;

  const Ms = (357.5291 + 0.98560028 * d) * Math.PI / 180;
  const lonSun = norm(280.4665 + 0.98564736*d + 1.9148*Math.sin(Ms) + 0.02*Math.sin(2*Ms));

  const Mm = (134.963 + 13.064993 * d) * Math.PI / 180;
  const L0r = (218.316 + 13.176396 * d) * Math.PI / 180;
  const lonMoon = norm(218.316 + 13.176396*d + 6.289*Math.sin(Mm) + 0.658*Math.sin(2*L0r) - 0.214*Math.sin(2*Mm) - 0.11*Math.sin(L0r));
  const moonAge = norm(lonMoon - lonSun);
  const moonPhase = moonAge < 45 ? "Luna Nueva 🌑" : moonAge < 90 ? "Creciente 🌒" : moonAge < 135 ? "Cuarto Creciente 🌓" : moonAge < 180 ? "Gibosa Creciente 🌔" : moonAge < 225 ? "Luna Llena 🌕" : moonAge < 270 ? "Gibosa Menguante 🌖" : moonAge < 315 ? "Cuarto Menguante 🌗" : "Menguante 🌘";

  const Mv = (212.2606 + 1.6021302 * d) * Math.PI / 180;
  const lonVenus = norm(76.68 + 1.60213*d + 0.7758*Math.sin(Mv));

  const Mma = (319.5294 + 0.5240207 * d) * Math.PI / 180;
  const lonMars = norm(49.558 + 0.52403*d + 10.6912*Math.sin(Mma));

  const Mme = (168.6562 + 4.0923344 * d) * Math.PI / 180;
  const lonMerc = norm(48.331 + 4.09235*d + 23.4405*Math.sin(Mme));

  const Mj = (19.895 + 0.0830853 * d) * Math.PI / 180;
  const lonJup = norm(100.464 + 0.08309*d + 5.5549*Math.sin(Mj));

  return {
    sol:      { idx: signIdx(lonSun),   label: label(lonSun) },
    luna:     { idx: signIdx(lonMoon),  label: label(lonMoon), fase: moonPhase, age: moonAge },
    venus:    { idx: signIdx(lonVenus), label: label(lonVenus) },
    marte:    { idx: signIdx(lonMars),  label: label(lonMars) },
    mercurio: { idx: signIdx(lonMerc),  label: label(lonMerc) },
    jupiter:  { idx: signIdx(lonJup),   label: label(lonJup) },
  };
}

function interpretPlanets(signIdx, p) {
  const dist = (a, b) => Math.min(Math.abs(a - b), 12 - Math.abs(a - b));
  const harm = (a, b) => [0, 4, 8].includes(dist(a, b));
  const tens = (a, b) => [3, 6].includes(dist(a, b));
  const { sol, luna, venus, marte, mercurio, jupiter } = p;

  let general;
  if (sol.idx === signIdx) general = `El Sol transita por tu signo iluminando tu identidad — es un momento de gran visibilidad y energía personal. Confía en tus instintos y toma la iniciativa.`;
  else if (harm(sol.idx, signIdx)) general = `El Sol en ${ZODIAC_NAMES[sol.idx]} forma un ángulo armonioso contigo, aportando vitalidad y fluidez a tus proyectos. El día tiene una energía favorable para avanzar.`;
  else if (tens(sol.idx, signIdx)) general = `El Sol en ${ZODIAC_NAMES[sol.idx]} crea cierta fricción que te invita a revisar tus planes con calma. Ser flexible hoy es tu mayor fortaleza.`;
  else general = `El Sol recorre ${ZODIAC_NAMES[sol.idx]}, aportando un tono neutro al día. Tu energía depende principalmente de tu estado interno; cuídate bien.`;

  let amor;
  if (venus.idx === signIdx) amor = `Venus visita tu signo, realzando tu magnetismo y capacidad de conexión. Las relaciones fluyen con especial ternura hoy.`;
  else if (harm(venus.idx, signIdx)) amor = `Venus en ${ZODIAC_NAMES[venus.idx]} favorece tus vínculos afectivos con dulzura. Es un buen día para expresar lo que sientes o dar un paso en el amor.`;
  else if (tens(venus.idx, signIdx)) amor = `Venus en ${ZODIAC_NAMES[venus.idx]} puede traer algo de tensión en las relaciones. Habla con claridad y paciencia para evitar malentendidos.`;
  else amor = `Venus en ${ZODIAC_NAMES[venus.idx]} no tiene influencia directa hoy. Un pequeño gesto cariñoso puede marcar la diferencia en tus relaciones.`;

  let salud;
  if (luna.age < 45) salud = `Luna Nueva: tu energía se renueva desde cero. Descansa bien y planta intenciones positivas para el ciclo que empieza.`;
  else if (luna.age < 180) salud = harm(luna.idx, signIdx) ? `Luna creciente en ${ZODIAC_NAMES[luna.idx]} en armonía contigo — tu vitalidad sube. Aprovecha para el ejercicio y actividades que requieran energía.` : `Luna creciente en ${ZODIAC_NAMES[luna.idx]}. Tu energía puede ser irregular; escucha a tu cuerpo y no te fuerces.`;
  else if (luna.age < 225) salud = `Luna Llena: momento de máxima intensidad emocional. Prioriza el descanso y evita decisiones impulsivas.`;
  else salud = harm(luna.idx, signIdx) ? `Luna menguante en armonía — ideal para desintoxicar y soltar lo que no te sirve. Buen momento para depurar hábitos.` : `Luna menguante en ${ZODIAC_NAMES[luna.idx]}. Cuida tu descanso; este es un momento de regeneración, no de máximo esfuerzo.`;

  let trabajo;
  if (harm(marte.idx, signIdx) && harm(mercurio.idx, signIdx)) trabajo = `Marte y Mercurio en posición favorable: tienes energía y claridad mental. Día excelente para negociar, presentar proyectos o tomar decisiones importantes.`;
  else if (harm(marte.idx, signIdx)) trabajo = `Marte en ${ZODIAC_NAMES[marte.idx]} te da impulso y determinación. Aprovecha para las tareas que requieren acción directa y liderazgo.`;
  else if (harm(mercurio.idx, signIdx)) trabajo = `Mercurio en ${ZODIAC_NAMES[mercurio.idx]} afina tu mente. Es un buen día para comunicar, escribir, estudiar o resolver problemas complejos.`;
  else if (tens(marte.idx, signIdx)) trabajo = `Marte en ${ZODIAC_NAMES[marte.idx]} puede generar impaciencia. Controla el impulso de forzar las cosas; la constancia hoy vale más que la velocidad.`;
  else trabajo = `Día sin influencias planetarias destacadas en el trabajo. Mantén tu rutina y avanza paso a paso en tus tareas pendientes.`;

  let consejo;
  if (harm(jupiter.idx, signIdx)) consejo = `Júpiter en ${ZODIAC_NAMES[jupiter.idx]} te acompaña con su energía expansiva. Hoy es un día para pensar en grande y confiar en que el universo te respalda.`;
  else if (tens(jupiter.idx, signIdx)) consejo = `Júpiter en ${ZODIAC_NAMES[jupiter.idx]} te invita a revisar si estás yendo demasiado lejos en algún aspecto. El equilibrio es tu mayor aliado hoy.`;
  else consejo = luna.age < 90 ? `Luna en crecimiento: planta hoy lo que quieres ver crecer. Pequeñas acciones consistentes tienen gran poder en este momento lunar.` : `Luna en descenso: es tiempo de soltar, reflexionar y prepararte para el próximo ciclo. La quietud también es avance.`;

  return { general, amor, salud, trabajo, consejo };
}

// ─── App principal ────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("home");
  const [hormoneTab, setHormoneTab] = useState("hormonas");
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "es");
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;
  useEffect(() => { localStorage.setItem("lang", lang); }, [lang]);
  const [userCycleLength, setUserCycleLength] = useState(() => { const s = localStorage.getItem("cycle-length"); return s ? parseInt(s) : null; });
  const [cycleInput, setCycleInput] = useState("");
  const [cycleError, setCycleError] = useState("");
  const [editingCycle, setEditingCycle] = useState(false);
  const [entries, setEntries] = useState(() => {
    try { const raw = localStorage.getItem("period-entries"); if (!raw) return []; return JSON.parse(raw).map(e => ({ ...e, start: new Date(e.start), end: e.end ? new Date(e.end) : null })); } catch { return []; }
  });
  const [pendingStart, setPendingStart] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [notifPermission, setNotifPermission] = useState(() => "Notification" in window ? Notification.permission : "unsupported");
  const [symptoms, setSymptoms] = useState(() => {
    try { return JSON.parse(localStorage.getItem("symptoms") || "{}"); } catch { return {}; }
  });

  useEffect(() => { localStorage.setItem("period-entries", JSON.stringify(entries)); }, [entries]);
  useEffect(() => { if (userCycleLength) localStorage.setItem("cycle-length", userCycleLength); }, [userCycleLength]);
  useEffect(() => { localStorage.setItem("symptoms", JSON.stringify(symptoms)); }, [symptoms]);
  useEffect(() => { registerSW(); }, []);

  function saveSymptomsForDay(dateKey, data) {
    setSymptoms(prev => ({ ...prev, [dateKey]: data }));
  }
  function getSymptomsForDay(date) {
    const key = date.toISOString().slice(0, 10);
    return symptoms[key] || {};
  }
  function hasSymptoms(date) {
    const key = date.toISOString().slice(0, 10);
    return symptoms[key] && Object.keys(symptoms[key]).length > 0;
  }
  function getDayEmoji(date) {
    const data = getSymptomsForDay(date);
    if (data.humor) {
      const map = { "😊 Feliz": "😊", "😤 Irritable": "😤", "😢 Triste": "😢", "😰 Ansiosa": "😰", "😐 Neutro": "😐" };
      return map[data.humor] || null;
    }
    if (data.energia) {
      const map = { "🔋 Alta": "🔋", "🔶 Media": "🔶", "🪫 Baja": "🪫" };
      return map[data.energia] || null;
    }
    if (data.dolor && data.dolor !== "Ninguno") return "🩹";
    if (data.hinchazon === "Sí") return "🫧";
    if (data.flujo && data.flujo !== "Ninguno") return "💧";
    return null;
  }

  const realCycle = calcRealCycle(entries);
  const cycleLength = realCycle ?? (userCycleLength && userCycleLength >= 21 && userCycleLength <= 45 ? userCycleLength : 28);
  const today = startOfDay(new Date());
  const activePeriod = entries.find(e => !e.end) ?? null;
  const { nextPeriodStart, ovulationDays } = computePredictions(entries, cycleLength);
  const phaseInfo = getPhaseInfo(entries, cycleLength);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (notifPermission === "granted") checkAndScheduleNotifications(nextPeriodStart, ovulationDays);
  }, [notifPermission, nextPeriodStart]);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 3000); }
  function handleCycleSubmit() {
    const val = parseInt(cycleInput);
    if (!cycleInput || isNaN(val) || val < 21 || val > 45) { setCycleError("Introduce un número entre 21 y 45 días"); return; }
    setUserCycleLength(val); setCycleError(""); setEditingCycle(false);
  }
  function handleDayClick(date) {
    if (!pendingStart) {
      // Abrir panel de síntomas para ese día
      setSelectedDay(date);
    } else {
      if (date >= pendingStart) { setEntries(prev => [...prev, { id: Date.now(), start: pendingStart, end: date }]); showToast(t.periodSaved); setPendingStart(null); }
      else { setPendingStart(date); showToast(`${t.newStart} ${date.getDate()}/${date.getMonth()+1}`); }
    }
  }
  function isPeriodDay(date) {
    return entries.some(e => {
      const start = startOfDay(new Date(e.start));
      const end = e.end ? startOfDay(new Date(e.end)) : (activePeriod && e.id === activePeriod.id ? today : null);
      if (!end) return isSameDay(date, start);
      return date >= start && date <= end;
    });
  }
  function isPendingRange(date) { if (!pendingStart) return false; return date >= pendingStart && date <= today; }
  function isPendingStart(date) { return pendingStart && isSameDay(date, pendingStart); }
  function getOvulationInfo(date) { return ovulationDays.find(o => isSameDay(o.date, date)) ?? null; }
  function handleStartPeriod() { if (activePeriod) return; setEntries(prev => [...prev, { id: Date.now(), start: new Date(), end: null }]); }
  function handleEndPeriod() { if (!activePeriod) return; setEntries(prev => prev.map(e => e.id === activePeriod.id ? { ...e, end: new Date() } : e)); }
  function deleteEntry(id) { setEntries(prev => prev.filter(e => e.id !== id)); }

  let statusText = "", statusSub = "", statusNumber = null;
  if (activePeriod) { statusNumber = daysBetween(new Date(activePeriod.start), today) + 1; statusText = t.periodActive; statusSub = ""; }
  else if (nextPeriodStart) { const diff = daysBetween(today, nextPeriodStart); statusNumber = Math.abs(diff); statusText = diff >= 0 ? t.daysUntilPeriod : t.periodDelay; statusSub = diff >= 0 ? `${nextPeriodStart.toLocaleDateString(lang === "en" ? "en-GB" : lang === "pt" ? "pt-PT" : lang === "it" ? "it-IT" : "es-ES", { day: "numeric", month: "long" })}` : "⚠️"; }
  else { statusText = t.registerPeriod; statusSub = ""; }

  // ─── Onboarding ──────────────────────────────────────────────────────────────
  function OnboardingScreen() {
    return (
      <div style={S.onboarding}>
        <div style={{ fontSize: 64, textAlign: "center" }}>🌸</div>
        <h1 style={S.onboardingTitle}>{t.welcome}</h1>
        <p style={S.onboardingText}>{t.cycleQuestion}</p>
        <p style={S.onboardingHint}>{t.cycleHint}</p>
        <div style={S.onboardingCard}>
          <label style={S.onboardingLabel}>{t.cycleQuestion}</label>
          <input type="tel" inputMode="numeric" pattern="[0-9]*" value={cycleInput} onChange={e => { setCycleInput(e.target.value.replace(/[^0-9]/g, '')); setCycleError(""); }} onKeyDown={e => e.key === "Enter" && handleCycleSubmit()} placeholder={t.cyclePlaceholder} style={S.onboardingInput} />
          {cycleError && <p style={{ color: "#ef4444", fontSize: 12 }}>{t.cycleError}</p>}
          <button onClick={handleCycleSubmit} style={S.onboardingBtn}>{t.continueBtn}</button>
          <button onClick={() => { setUserCycleLength(28); setEditingCycle(false); }} style={S.onboardingSkip}>{t.dontKnow}</button>
          {editingCycle && <button onClick={() => setEditingCycle(false)} style={S.onboardingSkip}>{t.cancel}</button>}
        </div>
      </div>
    );
  }

  // ─── Hormonas ─────────────────────────────────────────────────────────────────
  function HormoneSection() {
    if (!phaseInfo) return (
      <div style={{ ...S.hormoneCard, textAlign: "center", padding: 24 }}>
        <div style={{ fontSize: 32 }}>🔬</div>
        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 8 }}>{t.registerPeriod}</p>
      </div>
    );
    const { phase, dayOfCycle } = phaseInfo;
    const tabs = [{ id: "hormonas", label: "🧪 Hormonas" }, { id: "fisico", label: "💪 Físico" }, { id: "emocional", label: "💜 Emocional" }, { id: "consejos", label: "✨ Consejos" }];
    return (
      <div style={S.hormoneCard}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 28 }}>{phase.emoji}</div>
          <div><div style={{ fontSize: 15, fontWeight: 700, color: phase.colorDark }}>{phase.nombre}</div><div style={{ fontSize: 11, color: "#9ca3af" }}>{phase.dias} · Día {dayOfCycle} de tu ciclo</div></div>
        </div>
        <div style={S.tabRow}>{tabs.map(t => <button key={t.id} onClick={() => setHormoneTab(t.id)} style={{ ...S.tab, background: hormoneTab === t.id ? phase.colorDark : "#f3f4f6", color: hormoneTab === t.id ? "#fff" : "#6b7280" }}>{t.label}</button>)}</div>
        <div style={{ marginTop: 14 }}>
          {hormoneTab === "hormonas" && <div>{phase.hormonas.map(h => <HormoneBar key={h.nombre} {...h} color={phase.colorDark} />)}<p style={{ fontSize: 11, color: "#9ca3af", marginTop: 8, fontStyle: "italic" }}>Estimación basada en tu ciclo. No sustituye a un análisis médico.</p></div>}
          {hormoneTab === "fisico" && <div><p style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>Síntomas físicos más probables ahora:</p>{phase.fisico.map((item, i) => <div key={i} style={S.listItem}><span style={{ color: phase.colorDark, marginRight: 8 }}>●</span><span style={{ fontSize: 13, color: "#374151" }}>{item}</span></div>)}</div>}
          {hormoneTab === "emocional" && <div><p style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>Cómo puedes sentirte emocionalmente:</p>{phase.emocional.map((item, i) => <div key={i} style={S.listItem}><span style={{ color: phase.colorDark, marginRight: 8 }}>●</span><span style={{ fontSize: 13, color: "#374151" }}>{item}</span></div>)}</div>}
          {hormoneTab === "consejos" && <div><p style={{ fontSize: 12, fontWeight: 600, color: phase.colorDark, marginBottom: 6 }}>🥗 Alimentación</p>{phase.consejos.alimentacion.map((item, i) => <div key={i} style={S.listItem}><span style={{ color: phase.colorDark, marginRight: 8 }}>●</span><span style={{ fontSize: 13, color: "#374151" }}>{item}</span></div>)}<p style={{ fontSize: 12, fontWeight: 600, color: phase.colorDark, margin: "14px 0 6px" }}>🏃 Ejercicio</p>{phase.consejos.ejercicio.map((item, i) => <div key={i} style={S.listItem}><span style={{ color: phase.colorDark, marginRight: 8 }}>●</span><span style={{ fontSize: 13, color: "#374151" }}>{item}</span></div>)}</div>}
        </div>
      </div>
    );
  }

  // ─── Panel de síntomas ────────────────────────────────────────────────────────
  function SymptomsPanel({ date, onClose }) {
    const dateKey = date.toISOString().slice(0, 10);
    const [data, setData] = useState(() => symptoms[dateKey] || {});

    const DOLOR = ["Ninguno", "Cólicos", "Cabeza", "Espalda", "Varios"];
    const HUMOR = ["😊 Feliz", "😤 Irritable", "😢 Triste", "😰 Ansiosa", "😐 Neutro"];
    const ENERGIA = ["🔋 Alta", "🔶 Media", "🪫 Baja"];
    const FLUJO = ["Ninguno", "Escaso", "Normal", "Abundante"];

    function toggle(field, value) {
      setData(prev => ({ ...prev, [field]: prev[field] === value ? null : value }));
    }

    function save() {
      const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v));
      saveSymptomsForDay(dateKey, clean);
      onClose();
      showToast(t.symptomsSaved);
    }

    const dateStr = date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });

    return (
      <div style={S.panelOverlay} onClick={onClose}>
        <div style={S.panel} onClick={e => e.stopPropagation()}>
          <div style={S.panelHeader}>
            <div>
              <div style={S.panelTitle}>📔 Diario</div>
              <div style={S.panelDate}>{dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}</div>
            </div>
            <button onClick={onClose} style={S.panelClose}>✕</button>
          </div>

          {/* Dolor */}
          <div style={S.symptomGroup}>
            <div style={S.symptomLabel}>{t.dolor}</div>
            <div style={S.chipRow}>
              {t.dolorOpts.map(v => <button key={v} onClick={() => toggle("dolor", v)} style={{ ...S.chip, background: data.dolor === v ? "#c4606f" : "#f9f0f1", color: data.dolor === v ? "#fff" : "#3d2c2c" }}>{v}</button>)}
            </div>
          </div>
          {/* Humor */}
          <div style={S.symptomGroup}>
            <div style={S.symptomLabel}>{t.humor}</div>
            <div style={S.chipRow}>
              {t.humorOpts.map(v => <button key={v} onClick={() => toggle("humor", v)} style={{ ...S.chip, background: data.humor === v ? "#c4606f" : "#f9f0f1", color: data.humor === v ? "#fff" : "#3d2c2c" }}>{v}</button>)}
            </div>
          </div>
          {/* Energía */}
          <div style={S.symptomGroup}>
            <div style={S.symptomLabel}>{t.energia}</div>
            <div style={S.chipRow}>
              {t.energiaOpts.map(v => <button key={v} onClick={() => toggle("energia", v)} style={{ ...S.chip, background: data.energia === v ? "#c4606f" : "#f9f0f1", color: data.energia === v ? "#fff" : "#3d2c2c" }}>{v}</button>)}
            </div>
          </div>
          {/* Flujo */}
          <div style={S.symptomGroup}>
            <div style={S.symptomLabel}>{t.flujo}</div>
            <div style={S.chipRow}>
              {t.flujoOpts.map(v => <button key={v} onClick={() => toggle("flujo", v)} style={{ ...S.chip, background: data.flujo === v ? "#c4606f" : "#f9f0f1", color: data.flujo === v ? "#fff" : "#3d2c2c" }}>{v}</button>)}
            </div>
          </div>
          {/* Hinchazón */}
          <div style={S.symptomGroup}>
            <div style={S.symptomLabel}>{t.hinchazon}</div>
            <div style={S.chipRow}>
              {t.hinchazonOpts.map(v => <button key={v} onClick={() => toggle("hinchazon", v)} style={{ ...S.chip, background: data.hinchazon === v ? "#c4606f" : "#f9f0f1", color: data.hinchazon === v ? "#fff" : "#3d2c2c" }}>{v}</button>)}
            </div>
          </div>
          {/* Botones */}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            {isPeriodDay(date) ? (
              <button onClick={() => { const existing = entries.find(e => isSameDay(startOfDay(new Date(e.start)), date)); if (existing) { deleteEntry(existing.id); onClose(); showToast(t.periodDeleted); } else { setPendingStart(date); onClose(); } }} style={{ ...S.chip, background: "#fce8ea", color: "#c4606f", fontSize: 12, padding: "8px 14px" }}>{t.removePeriod}</button>
            ) : (
              <button onClick={() => { setPendingStart(date); onClose(); }} style={{ ...S.chip, background: "#fce8ea", color: "#c4606f", fontSize: 12, padding: "8px 14px" }}>{t.markPeriod}</button>
            )}
            <button onClick={save} style={{ ...S.onboardingBtn, flex: 1, padding: "10px", fontSize: 14 }}>{t.saveDiary}</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Calendario ───────────────────────────────────────────────────────────────
  function CalendarScreen() {
    const months = [];
    const startMonth = new Date(2026, 0, 1);
    for (let i = 0; i < 24; i++) months.push(new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1));
    return (
      <div style={{ ...S.calScreen, paddingBottom: 80 }}>
        <div style={S.calHeader}><h2 style={S.calTitle}>{t.calTitle}</h2></div>
        <div style={S.instruction}>{pendingStart ? `✦ ${t.calPending}: ${pendingStart.getDate()}/${pendingStart.getMonth()+1} — ${t.calPendingEnd}` : t.calInstruction}</div>
        <div style={S.calScroll}>
          {months.map(monthDate => {
            const year = monthDate.getFullYear(), month = monthDate.getMonth();
            const cells = [];
            for (let i = 0; i < getFirstDayOfWeek(year, month); i++) cells.push(null);
            for (let d = 1; d <= getDaysInMonth(year, month); d++) cells.push(new Date(year, month, d));
            return (
              <div key={`${year}-${month}`} style={S.monthCard}>
                <h3 style={S.monthLabel}>{monthDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}</h3>
                <div style={S.weekRow}>{t.weekDays.map((d,i) => <div key={i} style={S.weekDay}>{d}</div>)}</div>
                <div style={S.daysGrid}>
                  {cells.map((date, idx) => {
                    if (!date) return <div key={`e${idx}`} />;
                    const isToday = isSameDay(date, today), isPeriod = isPeriodDay(date);
                    const isPending = isPendingStart(date), isInRange = isPendingRange(date);
                    const ovInfo = getOvulationInfo(date);
                    const hasSym = hasSymptoms(date);
                    const dayEmoji = getDayEmoji(date);
                    let bg = "transparent";
                    if (isPeriod) bg = "#f9d8e0";
                    if (isInRange && !isPeriod) bg = "#fceef0";
                    if (isPending) bg = "#d4788a";
                    return (
                      <div key={date.getTime()} onClick={() => handleDayClick(date)} style={{ ...S.dayCell, background: bg, border: isToday ? "2px solid #c4606f" : "2px solid transparent", cursor: "pointer" }}>
                        {ovInfo && <div style={{ position: "absolute", top: 1, right: 1 }}><FlowerIcon fertility={ovInfo.fertility} /></div>}
                        {dayEmoji && <div style={{ position: "absolute", bottom: 1, left: "50%", transform: "translateX(-50%)", fontSize: 8, lineHeight: 1 }}>{dayEmoji}</div>}
                        <span style={{ fontSize: 13, fontWeight: isToday ? 700 : 400, color: isPending ? "#fff" : isPeriod ? "#c4606f" : "#3d2c2c" }}>{date.getDate()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div style={S.legend}>
          <div style={S.legendItem}><div style={{ ...S.legendDot, background: "#f9d8e0" }} /> {t.legend.period}</div>
          <div style={S.legendItem}><div style={{ ...S.legendDot, background: "#fceef0" }} /> {t.legend.selection}</div>
          <div style={S.legendItem}><FlowerIcon fertility={1} /> {t.legend.ovulation}</div>
          <div style={S.legendItem}><span style={{ fontSize: 10 }}>😊</span> {t.legend.symptoms}</div>
        </div>
        {toast && <div style={S.toast}>{toast}</div>}
        {selectedDay && <SymptomsPanel date={selectedDay} onClose={() => setSelectedDay(null)} />}
      </div>
    );
  }

  // ─── Horóscopo ───────────────────────────────────────────────────────────────
  function HoroscopeScreen() {
    const SIGNS = [
      { name: "Aries", emoji: "♈", dates: "21 mar – 19 abr", index: 0 },
      { name: "Tauro", emoji: "♉", dates: "20 abr – 20 may", index: 1 },
      { name: "Géminis", emoji: "♊", dates: "21 may – 20 jun", index: 2 },
      { name: "Cáncer", emoji: "♋", dates: "21 jun – 22 jul", index: 3 },
      { name: "Leo", emoji: "♌", dates: "23 jul – 22 ago", index: 4 },
      { name: "Virgo", emoji: "♍", dates: "23 ago – 22 sep", index: 5 },
      { name: "Libra", emoji: "♎", dates: "23 sep – 22 oct", index: 6 },
      { name: "Escorpio", emoji: "♏", dates: "23 oct – 21 nov", index: 7 },
      { name: "Sagitario", emoji: "♐", dates: "22 nov – 21 dic", index: 8 },
      { name: "Capricornio", emoji: "♑", dates: "22 dic – 19 ene", index: 9 },
      { name: "Acuario", emoji: "♒", dates: "20 ene – 18 feb", index: 10 },
      { name: "Piscis", emoji: "♓", dates: "19 feb – 20 mar", index: 11 },
    ];

    const savedSign = localStorage.getItem("horoscope-sign");
    const [selectedSign, setSelectedSign] = useState(savedSign || null);
    const [horoscope, setHoroscope] = useState(null);
    const [planets, setPlanets] = useState(null);

    function loadHoroscope(signName) {
      const p = calcPlanets();
      setPlanets(p);
      const s = SIGNS.find(x => x.name === signName);
      setHoroscope(interpretPlanets(s.index, p));
    }

    function selectSign(signName) {
      setSelectedSign(signName);
      localStorage.setItem("horoscope-sign", signName);
      loadHoroscope(signName);
    }

    useEffect(() => { if (savedSign && !horoscope) loadHoroscope(savedSign); }, []);

    const dateStr = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
    const signObj = SIGNS.find(s => s.name === selectedSign);

    return (
      <div style={{ ...S.horScreen, paddingBottom: 80 }}>
        <div style={S.horHeader}><span style={S.appName}>🔮 Horóscopo</span><span style={{ fontSize: 12, color: "#9ca3af" }}>{dateStr}</span></div>

        {!selectedSign ? (
          <div>
            <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center", marginBottom: 16 }}>{t.chooseSign}</p>
            <div style={S.signGrid}>
              {SIGNS.map(s => (
                <div key={s.name} onClick={() => selectSign(s.name)} style={S.signChip}>
                  <div style={{ fontSize: 22 }}>{s.emoji}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{s.name}</div>
                  <div style={{ fontSize: 9, color: "#9ca3af" }}>{s.dates}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={S.signHeader}>
              <div style={{ fontSize: 48 }}>{signObj?.emoji}</div>
              <div><div style={{ fontSize: 20, fontWeight: 700, color: "#c4606f" }}>{selectedSign}</div><div style={{ fontSize: 12, color: "#a89090" }}>{signObj?.dates}</div></div>
              <button onClick={() => { setSelectedSign(null); setHoroscope(null); setPlanets(null); localStorage.removeItem("horoscope-sign"); }} style={S.changeSignBtn}>Cambiar</button>
            </div>

            {planets && (
              <div style={S.planetCard}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#c4606f", marginBottom: 10 }}>{t.planetsToday}</div>
                <div style={S.planetGrid}>
                  {[{ label: "☀️ Sol", val: planets.sol.label }, { label: "🌙 Luna", val: `${planets.luna.label} · ${planets.luna.fase}` }, { label: "♀ Venus", val: planets.venus.label }, { label: "♂ Marte", val: planets.marte.label }, { label: "☿ Mercurio", val: planets.mercurio.label }, { label: "♃ Júpiter", val: planets.jupiter.label }].map(({ label, val }) => (
                    <div key={label} style={S.planetRow}><span style={{ fontSize: 11, fontWeight: 600, color: "#374151", minWidth: 90 }}>{label}</span><span style={{ fontSize: 11, color: "#6b7280" }}>{val}</span></div>
                  ))}
                </div>
              </div>
            )}

            {horoscope && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[{ key: "general", label: "✨ General", color: "#c4606f" }, { key: "amor", label: "💖 Amor", color: "#d4788a" }, { key: "salud", label: "🌿 Salud", color: "#7a9e7e" }, { key: "trabajo", label: "💼 Trabajo", color: "#b07050" }, { key: "consejo", label: "🌙 Consejo del día", color: "#8a6070" }].map(({ key, label, color }) => (
                  <div key={key} style={S.horCard}>
                    <div style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{horoscope[key]}</div>
                  </div>
                ))}
                <div style={{ fontSize: 10, color: "#9ca3af", textAlign: "center", fontStyle: "italic" }}>Basado en posiciones astronómicas reales calculadas para hoy</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ─── Inicio ───────────────────────────────────────────────────────────────────
  function HomeScreen() {
    const ovToday = getOvulationInfo(today);

    // Calcular próximos 3 períodos
    function getNextPeriods() {
      if (!entries.length) return [];
      const sorted = [...entries].sort((a, b) => new Date(a.start) - new Date(b.start));
      const lastStart = new Date(sorted[sorted.length - 1].start);
      const periods = [];
      for (let i = 1; i <= 3; i++) {
        const date = addDays(lastStart, cycleLength * i);
        if (date > today) periods.push(date);
      }
      return periods.slice(0, 1);
    }

    const nextPeriods = getNextPeriods();

    return (
      <div style={S.home}>
        <div style={S.homeHeader}>
          <span style={S.appName}>
            <svg width="28" height="28" viewBox="0 0 120 120" style={{ verticalAlign: "middle", marginRight: 6 }}>
              <defs>
                <radialGradient id="hbg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f9e4e8"/><stop offset="100%" stopColor="#f0c8d0"/></radialGradient>
                <radialGradient id="hc" cx="40%" cy="40%" r="60%"><stop offset="0%" stopColor="#e8849a"/><stop offset="100%" stopColor="#c4606f"/></radialGradient>
              </defs>
              <rect width="120" height="120" rx="28" fill="url(#hbg)"/>
              <ellipse cx="60" cy="32" rx="11" ry="20" fill="#e8a0b0" opacity="0.9"/>
              <ellipse cx="60" cy="88" rx="11" ry="20" fill="#e8a0b0" opacity="0.9"/>
              <ellipse cx="32" cy="60" rx="20" ry="11" fill="#d4788a" opacity="0.85"/>
              <ellipse cx="88" cy="60" rx="20" ry="11" fill="#d4788a" opacity="0.85"/>
              <ellipse cx="38" cy="38" rx="11" ry="20" transform="rotate(-45 38 38)" fill="#eab0be" opacity="0.8"/>
              <ellipse cx="82" cy="38" rx="11" ry="20" transform="rotate(45 82 38)" fill="#eab0be" opacity="0.8"/>
              <ellipse cx="38" cy="82" rx="11" ry="20" transform="rotate(45 38 82)" fill="#eab0be" opacity="0.8"/>
              <ellipse cx="82" cy="82" rx="11" ry="20" transform="rotate(-45 82 82)" fill="#eab0be" opacity="0.8"/>
              <circle cx="60" cy="60" r="16" fill="url(#hc)"/>
              <circle cx="60" cy="60" r="8" fill="#f5e0e4" opacity="0.6"/>
            </svg>
            Vitalia
          </span>
        </div>
        <div style={S.circleWrap}>
          <div style={{ ...S.circle, background: activePeriod ? "#c4606f" : "linear-gradient(135deg, #d4788a, #e8a0aa)" }}>
            <div style={S.circleNumber}>{statusNumber !== null ? statusNumber : "—"}</div>
            <div style={S.circleLabel}>{statusText}</div>
          </div>
          <div style={S.statusSub}>{statusSub}</div>
        </div>

        <div style={S.actionRow}>
          <button style={{ ...S.actionBtn, background: activePeriod ? "#f0e6e8" : "linear-gradient(135deg, #d4788a, #c4606f)", color: activePeriod ? "#c4a0a8" : "#fff", cursor: activePeriod ? "not-allowed" : "pointer" }} onClick={handleStartPeriod} disabled={!!activePeriod}>{t.startPeriod}</button>
          <button style={{ ...S.actionBtn, background: !activePeriod ? "#f0e6e8" : "#c4606f", color: !activePeriod ? "#c4a0a8" : "#fff", cursor: !activePeriod ? "not-allowed" : "pointer" }} onClick={handleEndPeriod} disabled={!activePeriod}>{t.endPeriod}</button>
        </div>

        {ovToday && <div style={S.ovBadge}><FlowerIcon fertility={ovToday.fertility} /><span style={{ marginLeft: 8 }}>{ovToday.fertility === 1 ? t.ovulationDay : t.fertilDay}</span></div>}

        <div style={S.cycleInfoRow}>
          <span style={S.cycleInfoText}>{realCycle ? `📊 ${t.realCycle}: ${realCycle} días` : `⚙️ ${t.configCycle}: ${cycleLength} días`}</span>
          <button onClick={() => { setCycleInput(String(cycleLength)); setEditingCycle(true); }} style={S.cycleEditBtn}>{t.change}</button>
        </div>
        <HormoneSection />
      </div>
    );
  }

  // ─── Estadísticas ─────────────────────────────────────────────────────────────
  function StatsScreen() {
    // Últimos 30 días con síntomas
    const last30 = [];
    for (let i = 29; i >= 0; i--) last30.push(addDays(today, -i));

    const entries30 = last30.map(d => ({ date: d, data: getSymptomsForDay(d) })).filter(e => Object.keys(e.data).length > 0);
    const total = entries30.length;

    function countByValue(field) {
      const counts = {};
      entries30.forEach(({ data }) => { if (data[field]) counts[data[field]] = (counts[data[field]] || 0) + 1; });
      return Object.entries(counts).sort((a, b) => b[1] - a[1]);
    }

    const humorStats = countByValue("humor");
    const dolorStats = countByValue("dolor");
    const energiaStats = countByValue("energia");
    const flujoStats = countByValue("flujo");
    const hinchazonSi = entries30.filter(e => e.data.hinchazon === "Sí").length;

    function StatBar({ label, count, max, color }) {
      return (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: "#3d2c2c" }}>{label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#c4606f" }}>{count} días</span>
          </div>
          <div style={{ background: "#f9f0f1", borderRadius: 99, height: 8 }}>
            <div style={{ width: max > 0 ? `${(count / max) * 100}%` : "0%", height: "100%", background: color || "#d4788a", borderRadius: 99, transition: "width 0.5s" }} />
          </div>
        </div>
      );
    }

    return (
      <div style={{ ...S.horScreen, paddingBottom: 80 }}>
        <div style={S.horHeader}>
          <span style={S.appName}>{t.statsTitle}</span>
          <span style={{ fontSize: 12, color: "#a89090" }}>{t.statsSubtitle}</span>
        </div>

        {total === 0 ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 48 }}>📔</div>
            <p style={{ fontSize: 14, color: "#a89090", marginTop: 12 }}>{t.statsEmpty}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={S.statCard}>
              <div style={S.statTitle}>{t.statsResumen}</div>
              <p style={{ fontSize: 13, color: "#a89090", marginTop: 6 }}>{t.statsResumenText} <span style={{ fontWeight: 700, color: "#c4606f" }}>{total} {t.statsDays}</span> {t.statsResumenText2}</p>
            </div>
            {humorStats.length > 0 && (
              <div style={S.statCard}>
                <div style={S.statTitle}>{t.humor}</div>
                <div style={{ marginTop: 12 }}>
                  {humorStats.map(([val, count]) => (
                    <StatBar key={val} label={val} count={count} max={total} color="#d4788a" />
                  ))}
                </div>
              </div>
            )}

            {/* Dolor */}
            {dolorStats.length > 0 && (
              <div style={S.statCard}>
                <div style={S.statTitle}>🩹 Dolor</div>
                <div style={{ marginTop: 12 }}>
                  {dolorStats.map(([val, count]) => (
                    <StatBar key={val} label={val} count={count} max={total} color="#c4606f" />
                  ))}
                </div>
              </div>
            )}
            {energiaStats.length > 0 && (
              <div style={S.statCard}>
                <div style={S.statTitle}>{t.energia}</div>
                <div style={{ marginTop: 12 }}>
                  {energiaStats.map(([val, count]) => (
                    <StatBar key={val} label={val} count={count} max={total} color="#b07050" />
                  ))}
                </div>
              </div>
            )}
            {flujoStats.length > 0 && (
              <div style={S.statCard}>
                <div style={S.statTitle}>{t.flujo}</div>
                <div style={{ marginTop: 12 }}>
                  {flujoStats.map(([val, count]) => (
                    <StatBar key={val} label={val} count={count} max={total} color="#8a9ec4" />
                  ))}
                </div>
              </div>
            )}
            {hinchazonSi > 0 && (
              <div style={S.statCard}>
                <div style={S.statTitle}>{t.hinchazon}</div>
                <div style={{ marginTop: 12 }}>
                  <StatBar label={t.hinchazon} count={hinchazonSi} max={total} color="#c4a0c4" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ─── Ajustes ──────────────────────────────────────────────────────────────────
  function SettingsScreen() {
    async function handleEnableNotifications() {
      const result = await requestNotificationPermission();
      setNotifPermission(result);
      if (result === "granted") {
        showToast(`🔔 ${t.notifOn}`);
        checkAndScheduleNotifications(nextPeriodStart, ovulationDays);
      } else if (result === "denied") {
        showToast(t.notifDenied);
      }
    }

    const notifStatus = notifPermission === "granted" ? { text: t.notifOn, color: "#7a9e7e", bg: "#f0faf0" }
      : notifPermission === "denied" ? { text: t.notifDenied, color: "#c4606f", bg: "#fce8ea" }
      : notifPermission === "unsupported" ? { text: t.notifUnsupported, color: "#a89090", bg: "#f9f0f1" }
      : { text: t.notifOff, color: "#a89090", bg: "#f9f0f1" };

    const locale = lang === "en" ? "en-GB" : lang === "pt" ? "pt-PT" : lang === "it" ? "it-IT" : "es-ES";

    return (
      <div style={{ ...S.horScreen, paddingBottom: 80 }}>
        <div style={S.horHeader}><span style={S.appName}>{t.settingsTitle}</span></div>

        {/* Idioma */}
        <div style={S.statCard}>
          <div style={S.statTitle}>{t.langTitle}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            {[{ code: "es", label: "🇪🇸 Español" }, { code: "en", label: "🇬🇧 English" }, { code: "pt", label: "🇵🇹 Português" }, { code: "it", label: "🇮🇹 Italiano" }].map(l => (
              <button key={l.code} onClick={() => setLang(l.code)} style={{ ...S.chip, background: lang === l.code ? "#c4606f" : "#f9f0f1", color: lang === l.code ? "#fff" : "#3d2c2c" }}>{l.label}</button>
            ))}
          </div>
        </div>

        {/* Notificaciones */}
        <div style={S.statCard}>
          <div style={S.statTitle}>{t.notifTitle}</div>
          <p style={{ fontSize: 12, color: "#a89090", margin: "8px 0 14px" }}>{t.notifDesc}</p>
          <div style={{ background: notifStatus.bg, borderRadius: 12, padding: "10px 14px", marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: notifStatus.color }}>{notifStatus.text}</span>
          </div>
          {notifPermission !== "granted" && notifPermission !== "unsupported" && (
            <button onClick={handleEnableNotifications} style={{ ...S.onboardingBtn, padding: "12px", fontSize: 14 }}>{t.notifBtn}</button>
          )}
          {notifPermission === "granted" && nextPeriodStart && (
            <div style={{ fontSize: 12, color: "#a89090", marginTop: 8 }}>
              📅 {t.notifNext} {addDays(nextPeriodStart, -1).toLocaleDateString(locale, { day: "numeric", month: "long" })}
            </div>
          )}
        </div>

        {/* Instalar app */}
        <div style={S.statCard}>
          <div style={S.statTitle}>{t.installTitle}</div>
          <p style={{ fontSize: 12, color: "#a89090", margin: "8px 0 8px" }}>{t.installDesc} <strong>{t.installAdd}</strong>.</p>
          <p style={{ fontSize: 12, color: "#a89090" }}>{t.installAndroid}</p>
        </div>

        {/* Ciclo */}
        <div style={S.statCard}>
          <div style={S.statTitle}>{t.cycleTitle}</div>
          <p style={{ fontSize: 12, color: "#a89090", margin: "8px 0 14px" }}>
            {realCycle ? `${t.cycleAuto} ${realCycle} días.` : `${t.cycleManual} ${cycleLength} días.`}
          </p>
          <button onClick={() => { setCycleInput(String(cycleLength)); setEditingCycle(true); setScreen("home"); }}
            style={{ ...S.chip, background: "#fff0f3", color: "#c4606f", padding: "10px 18px" }}>
            {t.cycleChangeBtn}
          </button>
        </div>

        {/* Borrar datos */}
        <div style={S.statCard}>
          <div style={{ ...S.statTitle, color: "#c47070" }}>{t.deleteTitle}</div>
          <p style={{ fontSize: 12, color: "#a89090", margin: "8px 0 14px" }}>{t.deleteDesc}</p>
          <button onClick={() => { if (window.confirm(t.deleteConfirm)) { setEntries([]); setSymptoms({}); localStorage.clear(); showToast(t.deleteToast); } }}
            style={{ ...S.chip, background: "#fce8ea", color: "#c4606f", padding: "10px 18px" }}>
            {t.deleteBtn}
          </button>
        </div>
      </div>
    );
  }

  const NAV = [
    { id: "home", label: t.home, emoji: "🌸" },
    { id: "calendar", label: t.calendar, emoji: "📅" },
    { id: "stats", label: t.stats, emoji: "📊" },
    { id: "horoscope", label: t.horoscope, emoji: "🔮" },
    { id: "settings", label: t.settings, emoji: "⚙️" },
  ];

  return (
    <div style={S.root}>
      {(!userCycleLength && !realCycle) || editingCycle ? <OnboardingScreen /> : (
        <>
          <div style={{ paddingBottom: 64 }}>
            {screen === "home" && <HomeScreen />}
            {screen === "calendar" && <CalendarScreen />}
            {screen === "stats" && <StatsScreen />}
            {screen === "horoscope" && <HoroscopeScreen />}
            {screen === "settings" && <SettingsScreen />}
          </div>
          <div style={S.navBar}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => setScreen(n.id)} style={{ ...S.navBtn, color: screen === n.id ? "#c4606f" : "#a89090", borderTop: screen === n.id ? "2px solid #c4606f" : "2px solid transparent" }}>
                <span style={{ fontSize: 20 }}>{n.emoji}</span>
                <span style={{ fontSize: 10, fontWeight: 600 }}>{n.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
// ─── Paleta rosa/nude/blanco ──────────────────────────────────────────────────
// Primario: #d4788a (rosa oscuro)   Claro: #f9e4e8   Nude: #f5ede8
// Fondo: #fdf8f6   Texto: #3d2c2c   Gris: #a89090
const S = {
  root: { fontFamily: "'Inter', 'Helvetica Neue', sans-serif", minHeight: "100vh", background: "linear-gradient(160deg, #fdf8f6 0%, #fceef0 60%, #f5ede8 100%)", maxWidth: 430, margin: "0 auto", position: "relative" },
  home: { padding: "24px 18px 40px", display: "flex", flexDirection: "column", gap: 22 },
  homeHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  appName: { fontSize: 22, fontWeight: 700, color: "#c4606f", letterSpacing: -0.5 },
  circleWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  circle: { width: 200, height: 200, borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(212,120,138,0.30)" },
  circleNumber: { fontSize: 72, fontWeight: 200, color: "#fff", lineHeight: 1, letterSpacing: -4 },
  circleLabel: { fontSize: 10, color: "rgba(255,255,255,0.85)", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 6 },
  statusSub: { fontSize: 13, color: "#a89090", textAlign: "center" },
  ovBadge: { display: "inline-flex", alignItems: "center", alignSelf: "center", background: "#fff0f3", border: "1px solid #f2bec7", borderRadius: 20, padding: "6px 16px", fontSize: 13, color: "#c4606f" },
  cycleInfoRow: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff0f3", borderRadius: 14, padding: "9px 16px" },
  cycleInfoText: { fontSize: 12, color: "#c4606f" },
  cycleEditBtn: { background: "none", border: "none", color: "#d4788a", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, textDecoration: "underline" },
  hormoneCard: { background: "white", borderRadius: 22, padding: 18, border: "1px solid #f2dde1", boxShadow: "0 2px 14px rgba(212,120,138,0.08)" },
  tabRow: { display: "flex", gap: 6, flexWrap: "wrap" },
  tab: { border: "none", borderRadius: 20, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" },
  listItem: { display: "flex", alignItems: "flex-start", marginBottom: 8 },
  actionRow: { display: "flex", gap: 12 },
  actionBtn: { flex: 1, padding: "15px 8px", borderRadius: 18, border: "none", fontSize: 14, fontWeight: 600, fontFamily: "inherit" },
  calScreen: { display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative" },
  calHeader: { display: "flex", alignItems: "center", gap: 12, padding: "18px 18px 0", position: "sticky", top: 0, background: "rgba(253,248,246,0.96)", zIndex: 10, backdropFilter: "blur(8px)" },
  calTitle: { margin: 0, fontSize: 18, fontWeight: 700, color: "#c4606f" },
  instruction: { textAlign: "center", fontSize: 12, color: "#c4606f", background: "#fff0f3", padding: "9px 16px", borderBottom: "1px solid #f2dde1", fontWeight: 600 },
  calScroll: { overflowY: "auto", padding: "14px 18px", flex: 1 },
  monthCard: { marginBottom: 22, background: "white", borderRadius: 18, padding: 14, border: "1px solid #f2dde1", boxShadow: "0 1px 6px rgba(212,120,138,0.06)" },
  monthLabel: { fontSize: 14, color: "#c4606f", fontWeight: 700, margin: "0 0 10px", textTransform: "capitalize" },
  weekRow: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", marginBottom: 4 },
  weekDay: { fontSize: 11, color: "#a89090", fontWeight: 600, padding: "4px 0" },
  daysGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 },
  dayCell: { aspectRatio: "1", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", position: "relative", transition: "background 0.15s" },
  legend: { display: "flex", gap: 16, justifyContent: "center", padding: "12px 16px", borderTop: "1px solid #f2dde1", flexWrap: "wrap", background: "rgba(253,248,246,0.96)" },
  legendItem: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#a89090" },
  legendDot: { width: 14, height: 14, borderRadius: 4 },
  toast: { position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", background: "#c4606f", color: "white", padding: "10px 22px", borderRadius: 22, fontSize: 13, fontWeight: 600, zIndex: 100, whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(196,96,111,0.4)" },
  onboarding: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", gap: 18 },
  onboardingTitle: { fontSize: 28, fontWeight: 700, color: "#c4606f", textAlign: "center", margin: 0 },
  onboardingText: { fontSize: 15, color: "#3d2c2c", textAlign: "center", margin: 0 },
  onboardingHint: { fontSize: 12, color: "#a89090", textAlign: "center", margin: 0, fontStyle: "italic" },
  onboardingCard: { background: "white", borderRadius: 22, padding: 24, width: "100%", maxWidth: 340, border: "1px solid #f2dde1", boxShadow: "0 4px 20px rgba(212,120,138,0.10)", display: "flex", flexDirection: "column", gap: 12 },
  onboardingLabel: { fontSize: 14, fontWeight: 600, color: "#3d2c2c" },
  onboardingInput: { border: "2px solid #f2bec7", borderRadius: 14, padding: "12px 16px", fontSize: 22, fontWeight: 300, color: "#c4606f", textAlign: "center", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" },
  onboardingBtn: { background: "linear-gradient(135deg, #d4788a, #c4606f)", color: "white", border: "none", borderRadius: 16, padding: "15px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  onboardingSkip: { background: "none", border: "none", color: "#a89090", fontSize: 12, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" },
  navBar: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", display: "flex", borderTop: "1px solid #f2dde1", zIndex: 50 },
  navBtn: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, padding: "10px 0", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", transition: "color 0.2s" },
  horScreen: { padding: "24px 18px", display: "flex", flexDirection: "column", gap: 20, minHeight: "100vh" },
  horHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  signGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 },
  signChip: { background: "white", borderRadius: 18, padding: "14px 8px", textAlign: "center", cursor: "pointer", border: "1px solid #f2dde1", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, boxShadow: "0 2px 8px rgba(212,120,138,0.07)" },
  signHeader: { display: "flex", alignItems: "center", gap: 16, background: "white", borderRadius: 22, padding: 18, border: "1px solid #f2dde1" },
  changeSignBtn: { marginLeft: "auto", background: "none", border: "1px solid #f2bec7", borderRadius: 12, padding: "6px 12px", fontSize: 12, color: "#c4606f", cursor: "pointer", fontFamily: "inherit" },
  horCard: { background: "white", borderRadius: 18, padding: 16, border: "1px solid #f2dde1", boxShadow: "0 2px 8px rgba(212,120,138,0.05)" },
  planetCard: { background: "#fff8f9", borderRadius: 16, padding: 14, border: "1px solid #f2dde1" },
  planetGrid: { display: "flex", flexDirection: "column", gap: 6 },
  planetRow: { display: "flex", gap: 8, alignItems: "center" },
  predictCard: { background: "white", borderRadius: 22, padding: 18, border: "1px solid #f2dde1", boxShadow: "0 2px 14px rgba(212,120,138,0.08)" },
  predictTitle: { fontSize: 13, fontWeight: 700, color: "#c4606f" },
  predictRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#fdf8f6", borderRadius: 14 },
  predictLabel: { fontSize: 10, fontWeight: 700, color: "#a89090", textTransform: "uppercase", letterSpacing: 0.5 },
  predictDate: { fontSize: 13, fontWeight: 600, color: "#3d2c2c", marginTop: 2 },
  predictBadge: { fontSize: 12, fontWeight: 700, borderRadius: 12, padding: "4px 12px" },
  panelOverlay: { position: "fixed", inset: 0, background: "rgba(60,30,30,0.35)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" },
  panel: { background: "white", borderRadius: "24px 24px 0 0", padding: "24px 20px 36px", width: "100%", maxWidth: 430, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 -8px 32px rgba(196,96,111,0.15)" },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  panelTitle: { fontSize: 18, fontWeight: 700, color: "#c4606f" },
  panelDate: { fontSize: 12, color: "#a89090", marginTop: 2 },
  panelClose: { background: "#f9f0f1", border: "none", borderRadius: "50%", width: 32, height: 32, fontSize: 14, cursor: "pointer", color: "#a89090" },
  symptomGroup: { marginBottom: 18 },
  symptomLabel: { fontSize: 12, fontWeight: 700, color: "#3d2c2c", marginBottom: 8 },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { border: "none", borderRadius: 20, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" },
  statCard: { background: "white", borderRadius: 20, padding: 18, border: "1px solid #f2dde1", boxShadow: "0 2px 10px rgba(212,120,138,0.07)" },
  statTitle: { fontSize: 14, fontWeight: 700, color: "#c4606f" },
};
