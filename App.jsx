import { useState, useEffect, useRef } from "react";

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
    home: "Inicio", calendar: "Calendario", stats: "Estadísticas", horoscope: "Horóscopo", settings: "Ajustes",
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
    statsResumen: "📝 Resumen", statsResumenText: "Has registrado síntomas en", statsResumenText2: "días en total registrados.",
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
    notifPeriod: "Mañana empieza tu período. ¡Prepárate!", notifOvulation: "Hoy es tu día de ovulación — máxima fertilidad.",
    phases: {
      menstruacion: { nombre: "Menstruación", dias: "Días 1–5" },
      folicular: { nombre: "Fase Folicular", dias: "Días 6–13" },
      ovulacion: { nombre: "Ovulación", dias: "Día ~14" },
      lutea: { nombre: "Fase Lútea", dias: "Días 15–28" },
    },
    horDesc: {
      "Estrógeno": ["Muy bajo","Subiendo rápido","Pico máximo","Bajando"],
      "Progesterona": ["Muy baja","Todavía baja","Empieza a subir","Pico alto"],
      "FSH": ["Empieza a subir","Alta, estimula folículos","Bajando","Baja"],
      "LH": ["Baja","Empieza a subir","Pico ovulatorio","Baja"],
      "Testosterona": ["Baja","Subiendo","Pico","Bajando"],
    },
    horSections: { general: "✨ General", amor: "💖 Amor", salud: "🌿 Salud", trabajo: "💼 Trabajo", consejo: "🌙 Consejo del día" },
    horFooter: "Basado en posiciones astronómicas reales calculadas para hoy",
    signs: ["Aries","Tauro","Géminis","Cáncer","Leo","Virgo","Libra","Escorpio","Sagitario","Capricornio","Acuario","Piscis"],
    horTabs: ["🧪 Hormonas","💪 Físico","💜 Emocional","✨ Consejos"],
    horTabIds: ["hormonas","fisico","emocional","consejos"],
    horFisicoLabel: "Síntomas físicos más probables ahora:", horEmocionalLabel: "Cómo puedes sentirte emocionalmente:",
    horAlimLabel: "🥗 Alimentación", horEjercLabel: "🏃 Ejercicio",
    horDisclaimer: "Estimación basada en tu ciclo. No sustituye a un análisis médico.",
    horDayOf: "Día", horDayOfCycle: "de tu ciclo",
    contraLabel: "💊 Anticonceptivos", contraOpts: ["Pastilla","Anillo","DIU","Parche","Implante","Otro"],
    contraTomada: "💊 Pastilla tomada hoy", contraHora: "Hora:",
    sexLabel: "🫀 Relaciones sexuales", sexOpts: ["No","Sí con protección","Sí sin protección"],
    enfermedadLabel: "🤒 Salud general", enfermedadOpts: ["Ninguna","Resfriado","Fiebre","Dolor fuerte de cabeza","Náuseas","Infección","Otro"],
    itsLabel: "🦠 Enfermedades", itsOpts: ["Ninguna","Candidiasis","Clamidia","Gonorrea","Herpes","VPH","Vaginosis bacteriana","Otro"],
    pillReminderTitle: "💊 Recordatorio pastilla", pillReminderDesc: "Recibirás una notificación diaria a la hora que elijas.",
    pillReminderTime: "Hora del recordatorio:", pillReminderOn: "Recordatorio activado ✓", pillReminderBtn: "Activar recordatorio",
    phases: {
      menstruacion: { nombre: "Menstruación", dias: "Días 1–5",
        fisico: ["Cólicos y dolor abdominal","Fatiga y cansancio","Hinchazón","Posibles dolores de cabeza","Sensibilidad en pechos"],
        emocional: ["Mayor sensibilidad emocional","Tendencia al aislamiento","Necesidad de descanso","Posible irritabilidad"],
        alimentacion: ["Hierro: lentejas, espinacas, carnes rojas","Magnesio para los cólicos: chocolate negro, frutos secos","Evita la sal para reducir hinchazón","Infusiones de jengibre o manzanilla"],
        ejercicio: ["Yoga suave o estiramientos","Paseos tranquilos","Escucha a tu cuerpo y descansa si lo necesitas"] },
      folicular: { nombre: "Fase Folicular", dias: "Días 6–13",
        fisico: ["Aumento de energía","Piel más luminosa","Mayor apetito sexual","Sensación de bienestar físico","Más fuerza muscular"],
        emocional: ["Optimismo y buen humor","Mayor creatividad","Sociabilidad alta","Confianza en ti misma","Mente más clara y enfocada"],
        alimentacion: ["Proteínas para apoyar la energía: huevos, legumbres","Verduras crucíferas: brócoli, coliflor","Semillas de lino (fitoestrógenos naturales)","Frutas frescas y coloridas"],
        ejercicio: ["¡Momento ideal para entrenar fuerte!","Cardio, pesas, HIIT","Prueba actividades nuevas","Tu rendimiento estará en su mejor momento"] },
      ovulacion: { nombre: "Ovulación", dias: "Día ~14",
        fisico: ["Mayor flujo vaginal transparente y elástico","Leve dolor en un lado del abdomen","Temperatura basal ligeramente elevada","Mayor libido","Pechos más sensibles"],
        emocional: ["Máxima confianza y atractivo","Muy sociable y comunicativa","Libido en su punto más alto","Energía y vitalidad máximas"],
        alimentacion: ["Zinc: semillas de calabaza, mariscos","Antioxidantes: frutos rojos, tomate","Omega-3: salmón, nueces","Mantente muy hidratada"],
        ejercicio: ["Aprovecha tu energía máxima","Deportes en equipo o actividades sociales","Entrena con intensidad alta","Baile, spinning, crossfit"] },
      lutea: { nombre: "Fase Lútea", dias: "Días 15–28",
        fisico: ["Hinchazón y retención de líquidos","Sensibilidad en pechos","Antojos especialmente de dulce","Posible acné","Fatiga en la segunda mitad"],
        emocional: ["Mayor introspección","Posible síndrome premenstrual (SPM)","Irritabilidad o tristeza","Necesidad de orden y rutina","Ansiedad leve"],
        alimentacion: ["Reduce azúcar y cafeína para el SPM","Calcio: lácteos, almendras, sésamo","Vitamina B6: plátano, pavo, patata","Chocolate negro con moderación"],
        ejercicio: ["Yoga, pilates, natación suave","Reduce la intensidad si te sientes cansada","Paseos en la naturaleza","Ejercicios de respiración y meditación"] },
    },
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
    home: "Home", calendar: "Calendar", stats: "Statistics", horoscope: "Horoscope", settings: "Settings",
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
    statsResumen: "📝 Summary", statsResumenText: "You logged symptoms on", statsResumenText2: "days logged in total.",
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
    notifPeriod: "Your period starts tomorrow. Get ready!", notifOvulation: "Today is your ovulation day — peak fertility.",
    phases: {
      menstruacion: { nombre: "Menstruation", dias: "Days 1–5" },
      folicular: { nombre: "Follicular Phase", dias: "Days 6–13" },
      ovulacion: { nombre: "Ovulation", dias: "Day ~14" },
      lutea: { nombre: "Luteal Phase", dias: "Days 15–28" },
    },
    horDesc: {
      "Estrógeno": ["Very low","Rising fast","Peak","Dropping"],
      "Progesterona": ["Very low","Still low","Starting to rise","Peak high"],
      "FSH": ["Starting to rise","High, stimulates follicles","Dropping","Low"],
      "LH": ["Low","Starting to rise","Ovulatory peak","Low"],
      "Testosterona": ["Low","Rising","Peak","Dropping"],
    },
    horSections: { general: "✨ General", amor: "💖 Love", salud: "🌿 Health", trabajo: "💼 Work", consejo: "🌙 Daily tip" },
    horFooter: "Based on real astronomical positions calculated for today",
    signs: ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"],
    horTabs: ["🧪 Hormones","💪 Physical","💜 Emotional","✨ Tips"],
    horTabIds: ["hormonas","fisico","emocional","consejos"],
    horFisicoLabel: "Most likely physical symptoms now:", horEmocionalLabel: "How you may feel emotionally:",
    horAlimLabel: "🥗 Nutrition", horEjercLabel: "🏃 Exercise",
    horDisclaimer: "Estimate based on your cycle. Not a substitute for medical advice.",
    horDayOf: "Day", horDayOfCycle: "of your cycle",
    contraLabel: "💊 Contraceptives", contraOpts: ["Pill","Ring","IUD","Patch","Implant","Other"],
    contraTomada: "💊 Pill taken today", contraHora: "Time:",
    sexLabel: "🫀 Sexual activity", sexOpts: ["No","Yes with protection","Yes without protection"],
    enfermedadLabel: "🤒 General health", enfermedadOpts: ["None","Cold","Fever","Severe headache","Nausea","Infection","Other"],
    itsLabel: "🦠 Infections & STIs", itsOpts: ["None","Candidiasis","Chlamydia","Gonorrhea","Herpes","HPV","Bacterial vaginosis","Other"],
    pillReminderTitle: "💊 Pill reminder", pillReminderDesc: "You'll receive a daily notification at the time you choose.",
    pillReminderTime: "Reminder time:", pillReminderOn: "Reminder enabled ✓", pillReminderBtn: "Enable reminder",
    horDayOf: "Day", horDayOfCycle: "of your cycle",
    phases: {
      menstruacion: { nombre: "Menstruation", dias: "Days 1–5",
        fisico: ["Cramps and abdominal pain","Fatigue and tiredness","Bloating","Possible headaches","Breast tenderness"],
        emocional: ["Greater emotional sensitivity","Tendency to withdraw","Need for rest","Possible irritability"],
        alimentacion: ["Iron: lentils, spinach, red meat","Magnesium for cramps: dark chocolate, nuts","Avoid salt to reduce bloating","Ginger or chamomile tea"],
        ejercicio: ["Gentle yoga or stretching","Light walks","Listen to your body and rest if needed"] },
      folicular: { nombre: "Follicular Phase", dias: "Days 6–13",
        fisico: ["Energy boost","Glowing skin","Higher sex drive","Sense of physical wellbeing","More muscle strength"],
        emocional: ["Optimism and good mood","Greater creativity","High sociability","Confidence in yourself","Clearer and more focused mind"],
        alimentacion: ["Proteins to support energy: eggs, legumes","Cruciferous vegetables: broccoli, cauliflower","Flax seeds (natural phytoestrogens)","Fresh colorful fruits"],
        ejercicio: ["Perfect time to train hard!","Cardio, weights, HIIT","Try new activities","Your performance will be at its best"] },
      ovulacion: { nombre: "Ovulation", dias: "Day ~14",
        fisico: ["Clear stretchy vaginal discharge","Mild pain on one side of abdomen","Slightly elevated basal temperature","Higher libido","More sensitive breasts"],
        emocional: ["Peak confidence and attractiveness","Very social and communicative","Libido at its highest","Maximum energy and vitality"],
        alimentacion: ["Zinc: pumpkin seeds, seafood","Antioxidants: berries, tomato","Omega-3: salmon, walnuts","Stay very hydrated"],
        ejercicio: ["Harness your peak energy","Team sports or social activities","Train at high intensity","Dance, spinning, crossfit"] },
      lutea: { nombre: "Luteal Phase", dias: "Days 15–28",
        fisico: ["Bloating and water retention","Breast tenderness","Cravings especially for sweets","Possible acne","Fatigue in the second half"],
        emocional: ["Greater introspection","Possible premenstrual syndrome (PMS)","Irritability or sadness","Need for order and routine","Mild anxiety"],
        alimentacion: ["Reduce sugar and caffeine for PMS","Calcium: dairy, almonds, sesame","Vitamin B6: banana, turkey, potato","Dark chocolate in moderation"],
        ejercicio: ["Yoga, pilates, gentle swimming","Reduce intensity if you feel tired","Nature walks","Breathing exercises and meditation"] },
    },
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
    home: "Início", calendar: "Calendário", stats: "Estatísticas", horoscope: "Horóscopo", settings: "Ajustes",
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
    statsResumen: "📝 Resumo", statsResumenText: "Registou sintomas em", statsResumenText2: "dias registados no total.",
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
    notifPeriod: "A sua menstruação começa amanhã. Prepare-se!", notifOvulation: "Hoje é o seu dia de ovulação — máxima fertilidade.",
    phases: {
      menstruacion: { nombre: "Menstruação", dias: "Dias 1–5" },
      folicular: { nombre: "Fase Folicular", dias: "Dias 6–13" },
      ovulacion: { nombre: "Ovulação", dias: "Dia ~14" },
      lutea: { nombre: "Fase Lútea", dias: "Dias 15–28" },
    },
    horDesc: {
      "Estrógeno": ["Muito baixo","A subir rápido","Pico máximo","A descer"],
      "Progesterona": ["Muito baixa","Ainda baixa","A começar a subir","Pico alto"],
      "FSH": ["A começar a subir","Alta, estimula folículos","A descer","Baixa"],
      "LH": ["Baixa","A começar a subir","Pico ovulatório","Baixa"],
      "Testosterona": ["Baixa","A subir","Pico","A descer"],
    },
    horSections: { general: "✨ Geral", amor: "💖 Amor", salud: "🌿 Saúde", trabajo: "💼 Trabalho", consejo: "🌙 Conselho do dia" },
    horFooter: "Baseado em posições astronômicas reais calculadas para hoje",
    signs: ["Áries","Touro","Gémeos","Caranguejo","Leão","Virgem","Balança","Escorpião","Sagitário","Capricórnio","Aquário","Peixes"],
    horTabs: ["🧪 Hormonas","💪 Físico","💜 Emocional","✨ Conselhos"],
    horTabIds: ["hormonas","fisico","emocional","consejos"],
    horFisicoLabel: "Sintomas físicos mais prováveis agora:", horEmocionalLabel: "Como pode sentir-se emocionalmente:",
    horAlimLabel: "🥗 Alimentação", horEjercLabel: "🏃 Exercício",
    horDisclaimer: "Estimativa baseada no seu ciclo. Não substitui aconselhamento médico.",
    horDayOf: "Dia", horDayOfCycle: "do seu ciclo",
    contraLabel: "💊 Anticoncepcionais", contraOpts: ["Pílula","Anel","DIU","Adesivo","Implante","Outro"],
    contraTomada: "💊 Pílula tomada hoje", contraHora: "Hora:",
    sexLabel: "🫀 Relações sexuais", sexOpts: ["Não","Sim com proteção","Sim sem proteção"],
    enfermedadLabel: "🤒 Saúde geral", enfermedadOpts: ["Nenhuma","Constipação","Febre","Dor de cabeça forte","Náuseas","Infeção","Outro"],
    itsLabel: "🦠 Doenças & ISTs", itsOpts: ["Nenhuma","Candidíase","Clamídia","Gonorreia","Herpes","HPV","Vaginose bacteriana","Outro"],
    pillReminderTitle: "💊 Lembrete da pílula", pillReminderDesc: "Receberá uma notificação diária à hora que escolher.",
    pillReminderTime: "Hora do lembrete:", pillReminderOn: "Lembrete ativado ✓", pillReminderBtn: "Ativar lembrete",
    phases: {
      menstruacion: { nombre: "Menstruação", dias: "Dias 1–5",
        fisico: ["Cólicas e dor abdominal","Fadiga e cansaço","Inchaço","Possíveis dores de cabeça","Sensibilidade nos seios"],
        emocional: ["Maior sensibilidade emocional","Tendência ao isolamento","Necessidade de descanso","Possível irritabilidade"],
        alimentacion: ["Ferro: lentilhas, espinafre, carne vermelha","Magnésio para cólicas: chocolate negro, frutos secos","Evite o sal para reduzir o inchaço","Infusões de gengibre ou camomila"],
        ejercicio: ["Yoga suave ou alongamentos","Caminhadas tranquilas","Ouça o seu corpo e descanse se necessário"] },
      folicular: { nombre: "Fase Folicular", dias: "Dias 6–13",
        fisico: ["Aumento de energia","Pele mais luminosa","Maior apetite sexual","Sensação de bem-estar físico","Mais força muscular"],
        emocional: ["Otimismo e bom humor","Maior criatividade","Alta sociabilidade","Confiança em si mesma","Mente mais clara e focada"],
        alimentacion: ["Proteínas para apoiar a energia: ovos, leguminosas","Vegetais crucíferos: brócolis, couve-flor","Sementes de linhaça (fitoestrogênios naturais)","Frutas frescas e coloridas"],
        ejercicio: ["Momento ideal para treinar forte!","Cardio, pesos, HIIT","Experimente atividades novas","O seu desempenho estará no seu melhor"] },
      ovulacion: { nombre: "Ovulação", dias: "Dia ~14",
        fisico: ["Corrimento vaginal transparente e elástico","Leve dor num lado do abdômen","Temperatura basal ligeiramente elevada","Maior libido","Seios mais sensíveis"],
        emocional: ["Máxima confiança e atratividade","Muito sociável e comunicativa","Libido no seu ponto mais alto","Energia e vitalidade máximas"],
        alimentacion: ["Zinco: sementes de abóbora, frutos do mar","Antioxidantes: frutos vermelhos, tomate","Ômega-3: salmão, nozes","Mantenha-se muito hidratada"],
        ejercicio: ["Aproveite a sua energia máxima","Desportos em equipa ou atividades sociais","Treine com alta intensidade","Dança, spinning, crossfit"] },
      lutea: { nombre: "Fase Lútea", dias: "Dias 15–28",
        fisico: ["Inchaço e retenção de líquidos","Sensibilidade nos seios","Desejos especialmente por doces","Possível acne","Fadiga na segunda metade"],
        emocional: ["Maior introspecção","Possível síndrome pré-menstrual (SPM)","Irritabilidade ou tristeza","Necessidade de ordem e rotina","Ansiedade leve"],
        alimentacion: ["Reduza açúcar e cafeína para SPM","Cálcio: laticínios, amêndoas, sésamo","Vitamina B6: banana, peru, batata","Chocolate negro com moderação"],
        ejercicio: ["Yoga, pilates, natação suave","Reduza a intensidade se se sentir cansada","Caminhadas na natureza","Exercícios de respiração e meditação"] },
    },
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
    home: "Inizio", calendar: "Calendario", stats: "Statistiche", horoscope: "Oroscopo", settings: "Impostazioni",
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
    statsResumen: "📝 Riepilogo", statsResumenText: "Hai registrato sintomi in", statsResumenText2: "giorni registrati in totale.",
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
    notifPeriod: "Il tuo ciclo inizia domani. Preparati!", notifOvulation: "Oggi è il tuo giorno di ovulazione — massima fertilità.",
    phases: {
      menstruacion: { nombre: "Mestruazione", dias: "Giorni 1–5" },
      folicular: { nombre: "Fase Follicolare", dias: "Giorni 6–13" },
      ovulacion: { nombre: "Ovulazione", dias: "Giorno ~14" },
      lutea: { nombre: "Fase Luteale", dias: "Giorni 15–28" },
    },
    horDesc: {
      "Estrógeno": ["Molto basso","In rapida salita","Picco massimo","In calo"],
      "Progesterona": ["Molto bassa","Ancora bassa","Inizia a salire","Picco alto"],
      "FSH": ["Inizia a salire","Alta, stimola i follicoli","In calo","Bassa"],
      "LH": ["Bassa","Inizia a salire","Picco ovulatorio","Bassa"],
      "Testosterona": ["Bassa","In salita","Picco","In calo"],
    },
    horSections: { general: "✨ Generale", amor: "💖 Amore", salud: "🌿 Salute", trabajo: "💼 Lavoro", consejo: "🌙 Consiglio del giorno" },
    horFooter: "Basato su posizioni astronomiche reali calcolate per oggi",
    signs: ["Ariete","Toro","Gemelli","Cancro","Leone","Vergine","Bilancia","Scorpione","Sagittario","Capricorno","Acquario","Pesci"],
    horTabs: ["🧪 Ormoni","💪 Fisico","💜 Emotivo","✨ Consigli"],
    horTabIds: ["hormonas","fisico","emocional","consejos"],
    horFisicoLabel: "Sintomi fisici più probabili ora:", horEmocionalLabel: "Come potresti sentirti emotivamente:",
    horAlimLabel: "🥗 Alimentazione", horEjercLabel: "🏃 Esercizio",
    horDisclaimer: "Stima basata sul tuo ciclo. Non sostituisce un consulto medico.",
    horDayOf: "Giorno", horDayOfCycle: "del tuo ciclo",
    contraLabel: "💊 Contraccettivi", contraOpts: ["Pillola","Anello","IUD","Cerotto","Impianto","Altro"],
    contraTomada: "💊 Pillola presa oggi", contraHora: "Ora:",
    sexLabel: "🫀 Rapporti sessuali", sexOpts: ["No","Sì con protezione","Sì senza protezione"],
    enfermedadLabel: "🤒 Salute generale", enfermedadOpts: ["Nessuna","Raffreddore","Febbre","Forte mal di testa","Nausea","Infezione","Altro"],
    itsLabel: "🦠 Malattie & ITS", itsOpts: ["Nessuna","Candidosi","Clamidia","Gonorrea","Herpes","HPV","Vaginosi batterica","Altro"],
    pillReminderTitle: "💊 Promemoria pillola", pillReminderDesc: "Riceverai una notifica giornaliera all'ora che scegli.",
    pillReminderTime: "Ora del promemoria:", pillReminderOn: "Promemoria attivato ✓", pillReminderBtn: "Attiva promemoria",
    phases: {
      menstruacion: { nombre: "Mestruazione", dias: "Giorni 1–5",
        fisico: ["Crampi e dolore addominale","Stanchezza e affaticamento","Gonfiore","Possibili mal di testa","Sensibilità al seno"],
        emocional: ["Maggiore sensibilità emotiva","Tendenza all'isolamento","Bisogno di riposo","Possibile irritabilità"],
        alimentacion: ["Ferro: lenticchie, spinaci, carne rossa","Magnesio per i crampi: cioccolato fondente, frutta secca","Evita il sale per ridurre il gonfiore","Tisane di zenzero o camomilla"],
        ejercicio: ["Yoga dolce o stretching","Passeggiate tranquille","Ascolta il tuo corpo e riposati se ne hai bisogno"] },
      folicular: { nombre: "Fase Follicolare", dias: "Giorni 6–13",
        fisico: ["Aumento di energia","Pelle più luminosa","Maggiore appetito sessuale","Sensazione di benessere fisico","Più forza muscolare"],
        emocional: ["Ottimismo e buon umore","Maggiore creatività","Alta socievolezza","Fiducia in te stessa","Mente più chiara e concentrata"],
        alimentacion: ["Proteine per supportare l'energia: uova, legumi","Verdure crocifere: broccoli, cavolfiore","Semi di lino (fitoestrogeni naturali)","Frutta fresca e colorata"],
        ejercicio: ["Momento ideale per allenarsi forte!","Cardio, pesi, HIIT","Prova nuove attività","Le tue prestazioni saranno al massimo"] },
      ovulacion: { nombre: "Ovulazione", dias: "Giorno ~14",
        fisico: ["Perdite vaginali trasparenti ed elastiche","Lieve dolore su un lato dell'addome","Temperatura basale leggermente elevata","Maggiore libido","Seno più sensibile"],
        emocional: ["Massima fiducia e attrattività","Molto socievole e comunicativa","Libido al suo punto più alto","Energia e vitalità massime"],
        alimentacion: ["Zinco: semi di zucca, frutti di mare","Antiossidanti: frutti di bosco, pomodoro","Omega-3: salmone, noci","Rimani molto idratata"],
        ejercicio: ["Sfrutta la tua energia massima","Sport di squadra o attività sociali","Allenati ad alta intensità","Danza, spinning, crossfit"] },
      lutea: { nombre: "Fase Luteale", dias: "Giorni 15–28",
        fisico: ["Gonfiore e ritenzione idrica","Sensibilità al seno","Voglie specialmente di dolci","Possibile acne","Stanchezza nella seconda metà"],
        emocional: ["Maggiore introspezione","Possibile sindrome premestruale (SPM)","Irritabilità o tristezza","Bisogno di ordine e routine","Leggera ansia"],
        alimentacion: ["Riduci zucchero e caffeina per la SPM","Calcio: latticini, mandorle, sesamo","Vitamina B6: banana, tacchino, patata","Cioccolato fondente con moderazione"],
        ejercicio: ["Yoga, pilates, nuoto dolce","Riduci l'intensità se ti senti stanca","Passeggiate nella natura","Esercizi di respirazione e meditazione"] },
    },
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
  if (n <= 5) return { phase: PHASE_DATA.menstruacion, phaseKey: "menstruacion", dayOfCycle: n };
  if (n <= 13) return { phase: PHASE_DATA.folicular, phaseKey: "folicular", dayOfCycle: n };
  if (n === 14) return { phase: PHASE_DATA.ovulacion, phaseKey: "ovulacion", dayOfCycle: n };
  return { phase: PHASE_DATA.lutea, phaseKey: "lutea", dayOfCycle: n };
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

function CycleWheel({ entries, cycleLength, today, t, lang, activePeriod }) {
  const SIZE = 260, CX = 130, CY = 130, R = 100, TRACK = 20;

  // Calcular día actual del ciclo
  const currentDay = (() => {
    if (!entries.length) return null;
    const sorted = [...entries].sort((a, b) => new Date(a.start) - new Date(b.start));
    const raw = new Date(sorted[sorted.length - 1].start);
    const lastMidnight = new Date(raw.getFullYear(), raw.getMonth(), raw.getDate());
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = Math.round((todayMidnight - lastMidnight) / 86400000); // 0 = mismo día = día 1
    return (diffDays % cycleLength) + 1;
  })();

  const lastStart = entries.length > 0
    ? (() => {
        const sorted = [...entries].sort((a,b) => new Date(a.start)-new Date(b.start));
        const raw = new Date(sorted[sorted.length-1].start);
        return new Date(raw.getFullYear(), raw.getMonth(), raw.getDate());
      })()
    : null;

  const ovDay = Math.max(1, cycleLength - 14);
  const fertStart = Math.max(1, ovDay - 2);
  const fertEnd = Math.min(cycleLength, ovDay + 1);

  function dayToAngle(day) {
    // Día 1 = arriba (−90°), avanza en sentido horario
    return ((day - 1) / cycleLength) * 360 - 90;
  }
  function polarToXY(deg, r) {
    const rad = deg * Math.PI / 180;
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
  }
  function arc(d1, d2, r, thick, color, key) {
    const a1 = dayToAngle(d1), a2 = dayToAngle(d2 + 1);
    const R1 = r, R2 = r - thick;
    const p1 = polarToXY(a1, R1), p2 = polarToXY(a2, R1);
    const p3 = polarToXY(a2, R2), p4 = polarToXY(a1, R2);
    const span = ((a2 - a1) + 360) % 360;
    const lg = span > 180 ? 1 : 0;
    return <path key={key} d={`M${p1.x} ${p1.y} A${R1} ${R1} 0 ${lg} 1 ${p2.x} ${p2.y} L${p3.x} ${p3.y} A${R2} ${R2} 0 ${lg} 0 ${p4.x} ${p4.y}Z`} fill={color} />;
  }

  // Posición de la bolita
  const dotPos = currentDay ? polarToXY(dayToAngle(currentDay), R) : null;

  // Colores según fase del día actual
  const isMens = currentDay && currentDay <= 5;
  const isOv = currentDay === ovDay;
  const isFert = currentDay >= fertStart && currentDay <= fertEnd && !isOv;
  const dotColor = isMens ? "#c4606f" : isOv ? "#b85068" : isFert ? "#d4788a" : "#b07050";

  // Centro: días de regla activa o días hasta próxima regla
  const centerNum = activePeriod
    ? currentDay
    : currentDay !== null
      ? cycleLength - currentDay + 1  // días restantes incluyendo hoy
      : null;

  const centerLabel = activePeriod
    ? (lang==="en"?"day of period":lang==="pt"?"dia da regra":lang==="it"?"giorno ciclo":"día de regla")
    : centerNum !== null
      ? (centerNum >= 0
          ? (lang==="en"?"days until period":lang==="pt"?"dias até regra":lang==="it"?"giorni al ciclo":"días para la regla")
          : (lang==="en"?"days late":lang==="pt"?"dias atraso":lang==="it"?"giorni ritardo":"días de retraso"))
      : "";

  const centerColor = activePeriod ? "#c4606f" : (centerNum !== null && centerNum < 0) ? "#c4606f" : "#c4606f";
  const todayStr = today.toLocaleDateString(lang==="en"?"en-GB":lang==="pt"?"pt-BR":lang==="it"?"it-IT":"es-ES", { day:"numeric", month:"short" });

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <div style={{ position:"relative", width:SIZE, height:SIZE }}>
        <svg width={SIZE} height={SIZE}>
          {/* Track fondo */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f5eaec" strokeWidth={TRACK}/>

          {/* Arcos de fase */}
          {arc(1, 5, R, TRACK, "#f5b8c4", "m")}
          {fertStart > 6 && arc(6, fertStart-1, R, TRACK, "#fce8f0", "f")}
          {arc(fertStart, fertEnd, R, TRACK, "#f9c8d8", "fe")}
          {arc(ovDay, ovDay, R, TRACK, "#e8849a", "o")}
          {fertEnd < cycleLength && arc(fertEnd+1, cycleLength, R, TRACK, "#f5e6d8", "l")}

          {/* Números 1, 7, 14, 21 */}
          {[1, 7, 14, 21].filter(d => d <= cycleLength).map(d => {
            const p = polarToXY(dayToAngle(d), R + 14);
            return <text key={d} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#a08090" fontWeight="700">{d}</text>;
          })}

          {/* Emoji regla */}
          {(() => { const p = polarToXY(dayToAngle(1), R - TRACK/2); return <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="12">🩸</text>; })()}
          {/* Emoji ovulación */}
          {(() => { const p = polarToXY(dayToAngle(ovDay), R - TRACK/2); return <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="12">🌸</text>; })()}

          {/* Centro blanco */}
          <circle cx={CX} cy={CY} r={R - TRACK - 4} fill="white"/>

          {/* Bolita del día actual */}
          {dotPos && (<>
            <circle cx={dotPos.x} cy={dotPos.y} r={16} fill={dotColor} opacity={0.2}/>
            <circle cx={dotPos.x} cy={dotPos.y} r={11} fill={dotColor}/>
            <text x={dotPos.x} y={dotPos.y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="white" fontWeight="800">{currentDay}</text>
          </>)}
        </svg>

        {/* Texto central */}
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center", pointerEvents:"none", width:(R-TRACK-4)*2-12 }}>
          {currentDay ? (<>
            <div style={{ fontSize:36, fontWeight:800, color:centerColor, lineHeight:1 }}>{centerNum !== null ? Math.abs(centerNum) : "—"}</div>
            <div style={{ fontSize:10, color:"#a89090", fontWeight:600, marginTop:3, lineHeight:1.3 }}>{centerLabel}</div>
            <div style={{ fontSize:9, color:"#c8b8b8", marginTop:4 }}>{todayStr}</div>
          </>) : (
            <div style={{ fontSize:10, color:"#a89090", lineHeight:1.5 }}>{t.registerPeriod}</div>
          )}
        </div>
      </div>

      {/* Leyenda */}
      <div style={{ display:"flex", gap:12, fontSize:10, color:"#a89090" }}>
        <span><span style={{ background:"#f5b8c4", borderRadius:4, padding:"1px 6px", marginRight:3 }}> </span>{lang==="en"?"Period":lang==="pt"?"Regra":lang==="it"?"Ciclo":"Regla"}</span>
        <span><span style={{ background:"#e8849a", borderRadius:4, padding:"1px 6px", marginRight:3 }}> </span>{lang==="en"?"Ovulation":lang==="pt"?"Ovulação":lang==="it"?"Ovulazione":"Ovulación"}</span>
        <span><span style={{ background:"#f9c8d8", borderRadius:4, padding:"1px 6px", marginRight:3 }}> </span>{lang==="en"?"Fertile":lang==="pt"?"Fértil":lang==="it"?"Fertile":"Fértil"}</span>
      </div>
    </div>
  );
}

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
  const [pillReminder, setPillReminder] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pill-reminder") || "null"); } catch { return null; }
  });

  useEffect(() => { localStorage.setItem("period-entries", JSON.stringify(entries)); }, [entries]);
  useEffect(() => { if (userCycleLength) localStorage.setItem("cycle-length", userCycleLength); }, [userCycleLength]);
  useEffect(() => { localStorage.setItem("pill-reminder", JSON.stringify(pillReminder)); }, [pillReminder]);
  useEffect(() => { localStorage.setItem("symptoms", JSON.stringify(symptoms)); }, [symptoms]);
  useEffect(() => { registerSW(); }, []);

  function saveSymptomsForDay(dateKey, data) {
    setSymptoms(prev => ({ ...prev, [dateKey]: data }));
  }
  function getSymptomsForDay(date) {
    const key = date.toISOString().slice(0, 10);
    return symptoms[key] || {};
  }
  function getDayEmojis(date) {
    const d = getSymptomsForDay(date);
    const emojis = [];
    const HUMOR_EMOJIS = ["😊","😤","😢","😰","😐"];
    const ENERGIA_EMOJIS = ["🔋","🔶","🪫"];
    if (d.humor !== null && d.humor !== undefined) emojis.push(HUMOR_EMOJIS[d.humor] || "😊");
    if (d.energia !== null && d.energia !== undefined) emojis.push(ENERGIA_EMOJIS[d.energia] || "🔋");
    if (d.contra !== null && d.contra !== undefined) emojis.push("💊");
    if (d.sex !== null && d.sex !== undefined && d.sex > 0) emojis.push("🫀");
    if (d.its !== null && d.its !== undefined && d.its > 0) emojis.push("🦠");
    if (d.enfermedad !== null && d.enfermedad !== undefined && d.enfermedad > 0) emojis.push("🤒");
    if (d.dolor !== null && d.dolor !== undefined && d.dolor > 0) emojis.push("🩹");
    if (d.hinchazon === 1) emojis.push("🫧");
    if (d.flujo !== null && d.flujo !== undefined && d.flujo > 0) emojis.push("💧");
    return emojis;
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

  const locale = lang === "en" ? "en-GB" : lang === "pt" ? "pt-PT" : lang === "it" ? "it-IT" : "es-ES";



  // ─── Onboarding ──────────────────────────────────────────────────────────────
  function OnboardingScreen() {
    const [step, setStep] = useState(() => localStorage.getItem("onboarding-lang-done") ? "cycle" : "lang");

    function pressNum(n) {
      setCycleInput(prev => { const next = prev + n; if (parseInt(next) > 45) return prev; return next; });
      setCycleError("");
    }
    function pressDelete() { setCycleInput(prev => prev.slice(0, -1)); }

    if (step === "lang") return (
      <div style={S.onboarding}>
        <div style={{ fontSize: 64, textAlign: "center" }}>🌸</div>
        <h1 style={S.onboardingTitle}>Vitalia</h1>
        <p style={{ ...S.onboardingText, marginBottom: 28 }}>Choose your language · Elige tu idioma</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 300 }}>
          {[{code:"es", flag:"🇪🇸", name:"Español"}, {code:"en", flag:"🇬🇧", name:"English"}, {code:"pt", flag:"🇧🇷", name:"Português"}, {code:"it", flag:"🇮🇹", name:"Italiano"}].map(l => (
            <button key={l.code} onClick={() => { setLang(l.code); localStorage.setItem("lang", l.code); localStorage.setItem("onboarding-lang-done", "1"); setStep("cycle"); }}
              style={{ ...S.onboardingBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 17, padding: "14px 20px",
                background: lang === l.code ? "#c4606f" : "#fdf0f2", color: lang === l.code ? "#fff" : "#3d2c2c" }}>
              <span style={{ fontSize: 24 }}>{l.flag}</span> {l.name}
            </button>
          ))}
        </div>
      </div>
    );

    return (
      <div style={S.onboarding}>
        <div style={{ fontSize: 64, textAlign: "center" }}>🌸</div>
        <h1 style={S.onboardingTitle}>{t.welcome}</h1>
        <p style={S.onboardingText}>{t.cycleQuestion}</p>
        <p style={S.onboardingHint}>{t.cycleHint}</p>
        <div style={S.onboardingCard}>
          <label style={S.onboardingLabel}>{t.cycleQuestion}</label>
          <div style={{ fontSize: 52, fontWeight: 200, color: cycleInput ? "#c4606f" : "#d8c0c4", textAlign: "center", letterSpacing: -2, minHeight: 64, lineHeight: "64px" }}>
            {cycleInput || "—"}
          </div>
          {cycleError && <p style={{ color: "#ef4444", fontSize: 12, textAlign: "center" }}>{t.cycleError}</p>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, margin: "12px 0" }}>
            {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((n, i) => (
              <button key={i} onClick={() => n === "⌫" ? pressDelete() : n ? pressNum(n) : null}
                style={{ ...S.numBtn, opacity: n === "" ? 0 : 1, pointerEvents: n === "" ? "none" : "auto",
                  background: n === "⌫" ? "#f9d8e0" : "#fdf0f2", color: n === "⌫" ? "#c4606f" : "#3d2c2c" }}>
                {n}
              </button>
            ))}
          </div>
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
    const { phase, phaseKey, dayOfCycle } = phaseInfo;
    const phaseTrans = t.phases?.[phaseKey] || { nombre: phase.nombre, dias: phase.dias };
    const phaseIdx = ["menstruacion","folicular","ovulacion","lutea"].indexOf(phaseKey);
    const tabs = t.horTabs.map((label, i) => ({ id: t.horTabIds[i], label }));
    return (
      <div style={S.hormoneCard}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 28 }}>{phase.emoji}</div>
          <div><div style={{ fontSize: 15, fontWeight: 700, color: phase.colorDark }}>{phaseTrans.nombre}</div><div style={{ fontSize: 11, color: "#9ca3af" }}>{phaseTrans.dias} · {t.horDayOf} {dayOfCycle} {t.horDayOfCycle}</div></div>
        </div>
        <div style={S.tabRow}>{tabs.map(tab => <button key={tab.id} onClick={() => setHormoneTab(tab.id)} style={{ ...S.tab, background: hormoneTab === tab.id ? phase.colorDark : "#f3f4f6", color: hormoneTab === tab.id ? "#fff" : "#6b7280" }}>{tab.label}</button>)}</div>
        <div style={{ marginTop: 14 }}>
          {hormoneTab === "hormonas" && <div>{phase.hormonas.map(h => {
            const descArr = t.horDesc?.[h.nombre];
            const desc = descArr ? descArr[phaseIdx] : h.descripcion;
            return <HormoneBar key={h.nombre} nombre={h.nombre} nivel={h.nivel} descripcion={desc} color={phase.colorDark} />;
          })}<p style={{ fontSize: 11, color: "#9ca3af", marginTop: 8, fontStyle: "italic" }}>{t.horDisclaimer}</p></div>}
          {hormoneTab === "fisico" && <div><p style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>{t.horFisicoLabel}</p>{(phaseTrans.fisico || phase.fisico).map((item, i) => <div key={i} style={S.listItem}><span style={{ color: phase.colorDark, marginRight: 8 }}>●</span><span style={{ fontSize: 13, color: "#374151" }}>{item}</span></div>)}</div>}
          {hormoneTab === "emocional" && <div><p style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>{t.horEmocionalLabel}</p>{(phaseTrans.emocional || phase.emocional).map((item, i) => <div key={i} style={S.listItem}><span style={{ color: phase.colorDark, marginRight: 8 }}>●</span><span style={{ fontSize: 13, color: "#374151" }}>{item}</span></div>)}</div>}
          {hormoneTab === "consejos" && <div><p style={{ fontSize: 12, fontWeight: 600, color: phase.colorDark, marginBottom: 6 }}>{t.horAlimLabel}</p>{(phaseTrans.alimentacion || phase.consejos.alimentacion).map((item, i) => <div key={i} style={S.listItem}><span style={{ color: phase.colorDark, marginRight: 8 }}>●</span><span style={{ fontSize: 13, color: "#374151" }}>{item}</span></div>)}<p style={{ fontSize: 12, fontWeight: 600, color: phase.colorDark, margin: "14px 0 6px" }}>{t.horEjercLabel}</p>{(phaseTrans.ejercicio || phase.consejos.ejercicio).map((item, i) => <div key={i} style={S.listItem}><span style={{ color: phase.colorDark, marginRight: 8 }}>●</span><span style={{ fontSize: 13, color: "#374151" }}>{item}</span></div>)}</div>}
        </div>
      </div>
    );
  }

  // ─── Panel de síntomas ────────────────────────────────────────────────────────
  function SymptomsPanel({ date, onClose }) {
    const dateKey = date.toISOString().slice(0, 10);
    const [data, setData] = useState(() => symptoms[dateKey] || {});

    // Guarda índice numérico para campos multi-opción (language-independent)
    // Para humor y energía guarda el emoji prefix (siempre igual en todos los idiomas)
    function toggle(field, idx) {
      setData(prev => ({ ...prev, [field]: prev[field] === idx ? null : idx }));
    }

    function isSelected(field, idx) { return data[field] === idx; }

    function save() {
      const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== ""));
      saveSymptomsForDay(dateKey, clean);
      onClose();
      showToast(t.symptomsSaved);
    }

    const dateStr = date.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });

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
              {t.dolorOpts.map((v,i) => <button key={i} onClick={() => toggle("dolor", i)} style={{ ...S.chip, background: isSelected("dolor",i) ? "#c4606f" : "#f9f0f1", color: isSelected("dolor",i) ? "#fff" : "#3d2c2c" }}>{v}</button>)}
            </div>
          </div>
          {/* Humor */}
          <div style={S.symptomGroup}>
            <div style={S.symptomLabel}>{t.humor}</div>
            <div style={S.chipRow}>
              {t.humorOpts.map((v,i) => <button key={i} onClick={() => toggle("humor", i)} style={{ ...S.chip, background: isSelected("humor",i) ? "#c4606f" : "#f9f0f1", color: isSelected("humor",i) ? "#fff" : "#3d2c2c" }}>{v}</button>)}
            </div>
          </div>
          {/* Energía */}
          <div style={S.symptomGroup}>
            <div style={S.symptomLabel}>{t.energia}</div>
            <div style={S.chipRow}>
              {t.energiaOpts.map((v,i) => <button key={i} onClick={() => toggle("energia", i)} style={{ ...S.chip, background: isSelected("energia",i) ? "#c4606f" : "#f9f0f1", color: isSelected("energia",i) ? "#fff" : "#3d2c2c" }}>{v}</button>)}
            </div>
          </div>
          {/* Flujo */}
          <div style={S.symptomGroup}>
            <div style={S.symptomLabel}>{t.flujo}</div>
            <div style={S.chipRow}>
              {t.flujoOpts.map((v,i) => <button key={i} onClick={() => toggle("flujo", i)} style={{ ...S.chip, background: isSelected("flujo",i) ? "#c4606f" : "#f9f0f1", color: isSelected("flujo",i) ? "#fff" : "#3d2c2c" }}>{v}</button>)}
            </div>
          </div>
          {/* Hinchazón */}
          <div style={S.symptomGroup}>
            <div style={S.symptomLabel}>{t.hinchazon}</div>
            <div style={S.chipRow}>
              {t.hinchazonOpts.map((v,i) => <button key={i} onClick={() => toggle("hinchazon", i)} style={{ ...S.chip, background: isSelected("hinchazon",i) ? "#c4606f" : "#f9f0f1", color: isSelected("hinchazon",i) ? "#fff" : "#3d2c2c" }}>{v}</button>)}
            </div>
          </div>

          {/* Anticonceptivos */}
          <div style={S.symptomGroup}>
            <div style={S.symptomLabel}>{t.contraLabel}</div>
            <div style={S.chipRow}>
              {t.contraOpts.map((v,i) => <button key={i} onClick={() => toggle("contra", i)} style={{ ...S.chip, background: isSelected("contra",i) ? "#8a6090" : "#f9f0f1", color: isSelected("contra",i) ? "#fff" : "#3d2c2c" }}>{v}</button>)}
            </div>
            {data.contra === 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                <button onClick={() => toggle("pastillaTomada", 1)} style={{ ...S.chip, background: data.pastillaTomada === 1 ? "#8a6090" : "#f9f0f1", color: data.pastillaTomada === 1 ? "#fff" : "#3d2c2c" }}>{t.contraTomada}</button>
                {data.pastillaTomada === 1 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "#a89090" }}>{t.contraHora}</span>
                    <select value={data.pastillaHora || "08:00"} onChange={e => setData(prev => ({ ...prev, pastillaHora: e.target.value }))}
                      style={{ fontSize: 12, border: "1px solid #f2bec7", borderRadius: 8, padding: "4px 8px", color: "#3d2c2c", background: "#fdf8f6" }}>
                      {Array.from({length:24},(_,i) => `${String(i).padStart(2,"0")}:00`).map(h => <option key={h}>{h}</option>)}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Relaciones sexuales */}
          <div style={S.symptomGroup}>
            <div style={S.symptomLabel}>{t.sexLabel}</div>
            <div style={S.chipRow}>
              {t.sexOpts.map((v,i) => <button key={i} onClick={() => toggle("sex", i)} style={{ ...S.chip, background: isSelected("sex",i) ? "#b07050" : "#f9f0f1", color: isSelected("sex",i) ? "#fff" : "#3d2c2c" }}>{v}</button>)}
            </div>
          </div>

          {/* Salud general */}
          <div style={S.symptomGroup}>
            <div style={S.symptomLabel}>{t.enfermedadLabel}</div>
            <div style={S.chipRow}>
              {t.enfermedadOpts.map((v,i) => <button key={i} onClick={() => toggle("enfermedad", i)} style={{ ...S.chip, background: isSelected("enfermedad",i) ? "#7a9e7e" : "#f9f0f1", color: isSelected("enfermedad",i) ? "#fff" : "#3d2c2c" }}>{v}</button>)}
            </div>
          </div>

          {/* Enfermedades / ITS */}
          <div style={S.symptomGroup}>
            <div style={S.symptomLabel}>{t.itsLabel}</div>
            <div style={S.chipRow}>
              {t.itsOpts.map((v,i) => <button key={i} onClick={() => toggle("its", i)} style={{ ...S.chip, background: isSelected("its",i) ? "#8a7e9e" : "#f9f0f1", color: isSelected("its",i) ? "#fff" : "#3d2c2c" }}>{v}</button>)}
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
                <h3 style={S.monthLabel}>{monthDate.toLocaleDateString(locale, { month: "long", year: "numeric" })}</h3>
                <div style={S.weekRow}>{t.weekDays.map((d,i) => <div key={i} style={S.weekDay}>{d}</div>)}</div>
                <div style={S.daysGrid}>
                  {cells.map((date, idx) => {
                    if (!date) return <div key={`e${idx}`} />;
                    const isToday = isSameDay(date, today), isPeriod = isPeriodDay(date);
                    const isPending = isPendingStart(date), isInRange = isPendingRange(date);
                    const ovInfo = getOvulationInfo(date);

                    const dayEmojis = getDayEmojis(date);
                    let bg = "transparent";
                    if (isPeriod) bg = "#f9d8e0";
                    if (isInRange && !isPeriod) bg = "#fceef0";
                    if (isPending) bg = "#d4788a";
                    return (
                      <div key={date.getTime()} onClick={() => handleDayClick(date)} style={{ ...S.dayCell, background: bg, border: isToday ? "2px solid #c4606f" : "2px solid transparent", cursor: "pointer" }}>
                        {ovInfo && <div style={{ position: "absolute", top: 1, right: 1 }}><FlowerIcon fertility={ovInfo.fertility} /></div>}
                        {dayEmojis.length > 0 && (
                          <div style={{ position: "absolute", bottom: 1, left: "50%", transform: "translateX(-50%)", fontSize: 7, lineHeight: 1, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 0, maxWidth: "100%" }}>
                            {dayEmojis.slice(0,4).join("")}
                          </div>
                        )}
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

  // ─── Inicio ───────────────────────────────────────────────────────────────────
  function HomeScreen() {
    const ovToday = getOvulationInfo(today);

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
          <CycleWheel entries={entries} cycleLength={cycleLength} today={today} t={t} lang={lang} activePeriod={activePeriod} />
        </div>

        <div style={S.actionRow}>
          <button style={{ ...S.actionBtn, background: activePeriod ? "#f0e6e8" : "linear-gradient(135deg, #d4788a, #c4606f)", color: activePeriod ? "#c4a0a8" : "#fff", cursor: activePeriod ? "not-allowed" : "pointer" }} onClick={handleStartPeriod} disabled={!!activePeriod}>{t.startPeriod}</button>
          <button style={{ ...S.actionBtn, background: !activePeriod ? "#f0e6e8" : "#c4606f", color: !activePeriod ? "#c4a0a8" : "#fff", cursor: !activePeriod ? "not-allowed" : "pointer" }} onClick={handleEndPeriod} disabled={!activePeriod}>{t.endPeriod}</button>
        </div>

        {ovToday && <div style={S.ovBadge}><FlowerIcon fertility={ovToday.fertility} /><span style={{ marginLeft: 8 }}>{ovToday.fertility === 1 ? t.ovulationDay : t.fertilDay}</span></div>}

        <HormoneSection />
      </div>
    );
  }

  // ─── Estadísticas ─────────────────────────────────────────────────────────────
  function StatsScreen() {
    // TODOS los días con síntomas registrados
    const allEntries = Object.entries(symptoms)
      .filter(([, data]) => Object.keys(data).length > 0)
      .map(([dateKey, data]) => ({ date: new Date(dateKey), data }))
      .sort((a, b) => a.date - b.date);

    const total = allEntries.length;

    function StatBar({ label, dates, color }) {
      const [expanded, setExpanded] = useState(false);
      return (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, cursor: "pointer" }} onClick={() => setExpanded(e => !e)}>
            <span style={{ fontSize: 12, color: "#3d2c2c" }}>{label}</span>
            <span style={{ fontSize: 11, color, fontWeight: 600 }}>{dates.length}× {expanded ? "▲" : "▼"}</span>
          </div>
          <div style={{ background: "#f9f0f1", borderRadius: 99, height: 7, marginBottom: expanded ? 8 : 0 }}>
            <div style={{ width: `${(dates.length / total) * 100}%`, height: "100%", background: color || "#d4788a", borderRadius: 99 }} />
          </div>
          {expanded && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
              {dates.map(dateKey => (
                <div key={dateKey} style={{ display: "flex", alignItems: "center", gap: 4, background: "#fdf0f2", borderRadius: 8, padding: "3px 8px" }}>
                  <span style={{ fontSize: 11, color: "#3d2c2c" }}>{new Date(dateKey).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}</span>
                  <button onClick={() => {
                    const updated = { ...symptoms };
                    if (updated[dateKey]) {
                      delete updated[dateKey];
                      setSymptoms(updated);
                      localStorage.setItem("symptoms", JSON.stringify(updated));
                    }
                  }} style={{ background: "none", border: "none", color: "#c4606f", cursor: "pointer", fontSize: 12, padding: 0, lineHeight: 1 }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    function countWithDates(field, opts, skipFirst = false) {
      const map = {};
      allEntries.forEach(({ date, data }) => {
        const idx = data[field];
        if (idx === null || idx === undefined) return;
        if (skipFirst && idx === 0) return;
        const label = opts?.[idx] ?? String(idx);
        if (!map[label]) map[label] = [];
        map[label].push(date.toISOString().slice(0,10));
      });
      return Object.entries(map).sort((a, b) => b[1].length - a[1].length);
    }

    const humorMap = {};
    allEntries.forEach(({ date, data }) => {
      if (data.humor === null || data.humor === undefined) return;
      const label = t.humorOpts[data.humor] || String(data.humor);
      if (!humorMap[label]) humorMap[label] = [];
      humorMap[label].push(date.toISOString().slice(0,10));
    });
    const humorStats = Object.entries(humorMap).sort((a,b) => b[1].length - a[1].length);

    const energiaMap = {};
    allEntries.forEach(({ date, data }) => {
      if (data.energia === null || data.energia === undefined) return;
      const label = t.energiaOpts[data.energia] || String(data.energia);
      if (!energiaMap[label]) energiaMap[label] = [];
      energiaMap[label].push(date.toISOString().slice(0,10));
    });
    const energiaStats = Object.entries(energiaMap).sort((a,b) => b[1].length - a[1].length);

    const dolorStats = countWithDates("dolor", t.dolorOpts, true);
    const flujoStats = countWithDates("flujo", t.flujoOpts, true);
    const contraStats = countWithDates("contra", t.contraOpts, false);
    const sexStats = countWithDates("sex", t.sexOpts, true);
    const itsStats = countWithDates("its", t.itsOpts, true);
    const enfermedadStats = countWithDates("enfermedad", t.enfermedadOpts, true);

    const hinchazonDates = allEntries.filter(e => e.data.hinchazon === 1).map(e => e.date.toISOString().slice(0,10));

    const firstDate = allEntries.length > 0 ? allEntries[0].date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }) : "";
    const lastDate = allEntries.length > 0 ? allEntries[allEntries.length-1].date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }) : "";

    return (
      <div style={{ ...S.horScreen, paddingBottom: 80 }}>
        <div style={S.horHeader}>
          <span style={S.appName}>{t.statsTitle}</span>
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
              <p style={{ fontSize: 13, color: "#a89090", marginTop: 6 }}>
                {t.statsResumenText} <span style={{ fontWeight: 700, color: "#c4606f" }}>{total} {t.statsDays}</span> {t.statsResumenText2}
              </p>
              {firstDate && <p style={{ fontSize: 11, color: "#b8a8a8", marginTop: 4 }}>📅 {firstDate} → {lastDate}</p>}
              <p style={{ fontSize: 10, color: "#c8b8b8", marginTop: 6, fontStyle: "italic" }}>
                {lang==="en"?"Tap any row to see dates and delete entries":lang==="pt"?"Toque numa linha para ver datas e eliminar":lang==="it"?"Tocca una riga per vedere date ed eliminare":"Toca una fila para ver fechas y eliminar entradas"}
              </p>
            </div>

            {humorStats.length > 0 && <div style={S.statCard}><div style={S.statTitle}>{t.humor}</div><div style={{ marginTop: 12 }}>{humorStats.map(([val, dates]) => <StatBar key={val} label={val} dates={dates} color="#d4788a" />)}</div></div>}
            {energiaStats.length > 0 && <div style={S.statCard}><div style={S.statTitle}>{t.energia}</div><div style={{ marginTop: 12 }}>{energiaStats.map(([val, dates]) => <StatBar key={val} label={val} dates={dates} color="#b07050" />)}</div></div>}
            {dolorStats.length > 0 && <div style={S.statCard}><div style={S.statTitle}>{t.dolor}</div><div style={{ marginTop: 12 }}>{dolorStats.map(([val, dates]) => <StatBar key={val} label={val} dates={dates} color="#c4606f" />)}</div></div>}
            {flujoStats.length > 0 && <div style={S.statCard}><div style={S.statTitle}>{t.flujo}</div><div style={{ marginTop: 12 }}>{flujoStats.map(([val, dates]) => <StatBar key={val} label={val} dates={dates} color="#8a9ec4" />)}</div></div>}
            {hinchazonDates.length > 0 && <div style={S.statCard}><div style={S.statTitle}>{t.hinchazon}</div><div style={{ marginTop: 12 }}><StatBar label={t.hinchazonOpts[1]} dates={hinchazonDates} color="#c4a0c4" /></div></div>}
            {contraStats.length > 0 && <div style={S.statCard}><div style={S.statTitle}>{t.contraLabel}</div><div style={{ marginTop: 12 }}>{contraStats.map(([val, dates]) => <StatBar key={val} label={val} dates={dates} color="#8a6090" />)}</div></div>}
            {sexStats.length > 0 && <div style={S.statCard}><div style={S.statTitle}>{t.sexLabel}</div><div style={{ marginTop: 12 }}>{sexStats.map(([val, dates]) => <StatBar key={val} label={val} dates={dates} color="#b07080" />)}</div></div>}
            {enfermedadStats.length > 0 && <div style={S.statCard}><div style={S.statTitle}>{t.enfermedadLabel}</div><div style={{ marginTop: 12 }}>{enfermedadStats.map(([val, dates]) => <StatBar key={val} label={val} dates={dates} color="#7a9e7e" />)}</div></div>}
            {itsStats.length > 0 && <div style={S.statCard}><div style={S.statTitle}>{t.itsLabel}</div><div style={{ marginTop: 12 }}>{itsStats.map(([val, dates]) => <StatBar key={val} label={val} dates={dates} color="#8a7e9e" />)}</div></div>}
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

        {/* Recordatorio pastilla */}
        <div style={S.statCard}>
          <div style={S.statTitle}>{t.pillReminderTitle}</div>
          <p style={{ fontSize: 12, color: "#a89090", margin: "8px 0 14px" }}>{t.pillReminderDesc}</p>
          {pillReminder ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ background: "#f0faf0", borderRadius: 12, padding: "10px 14px" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#7a9e7e" }}>{t.pillReminderOn}</span>
              </div>
              <span style={{ fontSize: 13, color: "#8a6090", fontWeight: 600 }}>⏰ {pillReminder.time}</span>
              <button onClick={() => setPillReminder(null)} style={{ ...S.chip, background: "#fce8ea", color: "#c4606f", fontSize: 12 }}>✕</button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "#a89090" }}>{t.pillReminderTime}</span>
              <select id="pill-time" defaultValue="08:00"
                style={{ fontSize: 14, border: "1px solid #f2bec7", borderRadius: 10, padding: "8px 12px", color: "#3d2c2c", background: "#fdf8f6" }}>
                {Array.from({length:24},(_,i) => `${String(i).padStart(2,"0")}:00`).map(h => <option key={h}>{h}</option>)}
              </select>
              <button onClick={() => {
                const time = document.getElementById("pill-time").value;
                setPillReminder({ time });
                if (notifPermission === "granted") {
                  const [h, m] = time.split(":").map(Number);
                  const now = new Date(); const fire = new Date(); fire.setHours(h, m, 0, 0);
                  if (fire <= now) fire.setDate(fire.getDate() + 1);
                  scheduleLocalNotification("💊 Vitalia", `${t.pillReminderTitle} — ${time}`, fire - now);
                }
                showToast(`⏰ ${t.pillReminderOn}`);
              }} style={{ ...S.onboardingBtn, padding: "10px 16px", fontSize: 13, marginTop: 0 }}>
                {notifPermission !== "granted" ? t.notifBtn : t.pillReminderBtn}
              </button>
            </div>
          )}
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
  numBtn: { border: "none", borderRadius: 16, padding: "16px", fontSize: 20, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.1s", textAlign: "center" },
  statCard: { background: "white", borderRadius: 20, padding: 18, border: "1px solid #f2dde1", boxShadow: "0 2px 10px rgba(212,120,138,0.07)" },
  statTitle: { fontSize: 14, fontWeight: 700, color: "#c4606f" },
};
