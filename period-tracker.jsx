import { useState, useEffect } from "react";

// ─── Utility functions ────────────────────────────────────────────────────────

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function daysBetween(a, b) {
  return Math.round((startOfDay(b) - startOfDay(a)) / 86400000);
}

// ─── Period logic ─────────────────────────────────────────────────────────────

/**
 * Given a list of period entries [{start, end}] and a cycle length,
 * returns predicted next period start + ovulation window for the next N months.
 */
function computePredictions(entries, cycleLength = 28, lutealPhase = 14) {
  if (!entries.length) return { nextPeriodStart: null, ovulationDays: [] };

  const sorted = [...entries].sort((a, b) => new Date(a.start) - new Date(b.start));
  const lastStart = new Date(sorted[sorted.length - 1].start);

  const nextPeriodStart = addDays(lastStart, cycleLength);
  const ovulationDay = addDays(nextPeriodStart, -lutealPhase);

  // Fertile window: 5 days before ovulation + ovulation day + 1 day after
  const ovulationDays = [];
  for (let i = -5; i <= 1; i++) {
    ovulationDays.push({
      date: addDays(ovulationDay, i),
      fertility: i === 0 ? 1 : i === -1 || i === 1 ? 0.75 : i === -2 || i === -3 ? 0.5 : 0.25,
    });
  }

  return { nextPeriodStart, ovulationDays };
}

// ─── Flower SVG component (fertility indicator) ───────────────────────────────

function FlowerIcon({ fertility }) {
  // fertility 0..1  → color goes from pale pink (low) to deep magenta (high)
  const hue = 320;
  const sat = Math.round(30 + fertility * 70);
  const light = Math.round(80 - fertility * 30);
  const color = `hsl(${hue}, ${sat}%, ${light}%)`;
  const size = 16 + fertility * 8;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ filter: "drop-shadow(0 0 2px rgba(180,0,120,0.3))" }}
    >
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <ellipse
          key={i}
          cx={12 + 5 * Math.cos((angle * Math.PI) / 180)}
          cy={12 + 5 * Math.sin((angle * Math.PI) / 180)}
          rx={3.5}
          ry={2}
          transform={`rotate(${angle}, ${12 + 5 * Math.cos((angle * Math.PI) / 180)}, ${12 + 5 * Math.sin((angle * Math.PI) / 180)})`}
          fill={color}
          opacity={0.85}
        />
      ))}
      <circle cx={12} cy={12} r={3} fill={color} />
    </svg>
  );
}

// ─── Calendar helpers ─────────────────────────────────────────────────────────

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  // 0=Sun … Mon=1
  const d = new Date(year, month, 1).getDay();
  return (d + 6) % 7; // convert to Mon=0 … Sun=6
}

// ─── Main App ─────────────────────────────────────────────────────────────────

const CYCLE_LENGTH = 28;
const PERIOD_DURATION = 5;

export default function App() {
  const [screen, setScreen] = useState("home"); // "home" | "calendar"

  // Stored period entries: [{id, start: Date, end: Date|null}]
  const [entries, setEntries] = useState(() => {
    try {
      const raw = localStorage.getItem("period-entries");
      if (!raw) return [];
      return JSON.parse(raw).map((e) => ({
        ...e,
        start: new Date(e.start),
        end: e.end ? new Date(e.end) : null,
      }));
    } catch {
      return [];
    }
  });

  // Calendar selection state
  const [selecting, setSelecting] = useState(null); // "start" | "end"

  // Persist
  useEffect(() => {
    localStorage.setItem("period-entries", JSON.stringify(entries));
  }, [entries]);

  const today = startOfDay(new Date());

  // Current active period (no end yet)
  const activePeriod = entries.find((e) => !e.end) ?? null;

  const { nextPeriodStart, ovulationDays } = computePredictions(entries, CYCLE_LENGTH);

  // Days until next period (or days into current period)
  let statusText = "";
  let statusNumber = null;
  let statusSub = "";

  if (activePeriod) {
    const days = daysBetween(new Date(activePeriod.start), today) + 1;
    statusNumber = days;
    statusText = "Día de regla";
    statusSub = "Tu período está activo";
  } else if (nextPeriodStart) {
    const diff = daysBetween(today, nextPeriodStart);
    if (diff >= 0) {
      statusNumber = diff;
      statusText = "Días hasta tu período";
      statusSub = `Próximo período: ${nextPeriodStart.toLocaleDateString("es-ES", { day: "numeric", month: "long" })}`;
    } else {
      statusNumber = Math.abs(diff);
      statusText = "Días de retraso";
      statusSub = "¡Posible retraso!";
    }
  } else {
    statusText = "Registra tu primer período";
    statusSub = "Pulsa el botón de abajo para empezar";
  }

  function handleStartPeriod() {
    if (activePeriod) return;
    setEntries((prev) => [
      ...prev,
      { id: Date.now(), start: new Date(), end: null },
    ]);
  }

  function handleEndPeriod() {
    if (!activePeriod) return;
    setEntries((prev) =>
      prev.map((e) => (e.id === activePeriod.id ? { ...e, end: new Date() } : e))
    );
  }

  // ── Check if a day is in a period range ──
  function isPeriodDay(date) {
    return entries.some((e) => {
      const start = startOfDay(new Date(e.start));
      const end = e.end ? startOfDay(new Date(e.end)) : (activePeriod && e.id === activePeriod.id ? today : null);
      if (!end) return isSameDay(date, start);
      return date >= start && date <= end;
    });
  }

  function getOvulationInfo(date) {
    return ovulationDays.find((o) => isSameDay(o.date, date)) ?? null;
  }

  // ─── Calendar view ───────────────────────────────────────────────────────────

  function CalendarScreen() {
    const months = [];
    const startMonth = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    for (let i = 0; i < 14; i++) {
      months.push(new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1));
    }

    function handleDayClick(date) {
      if (!selecting) return;
      if (selecting === "start") {
        setEntries((prev) => [
          ...prev,
          { id: Date.now(), start: date, end: null },
        ]);
        setSelecting(null);
      } else if (selecting === "end") {
        const last = entries[entries.length - 1];
        if (!last) return;
        setEntries((prev) =>
          prev.map((e) => (e.id === last.id ? { ...e, end: date } : e))
        );
        setSelecting(null);
      }
    }

    return (
      <div style={styles.calendarScreen}>
        <div style={styles.calendarHeader}>
          <button style={styles.backBtn} onClick={() => setScreen("home")}>← Inicio</button>
          <h2 style={styles.calendarTitle}>Calendario</h2>
        </div>

        <div style={styles.calendarActions}>
          <button
            style={{ ...styles.calAction, background: selecting === "start" ? "#c084fc" : "#ede9fe" }}
            onClick={() => setSelecting(selecting === "start" ? null : "start")}
          >
            {selecting === "start" ? "✕ Cancelar" : "＋ Inicio período"}
          </button>
          <button
            style={{ ...styles.calAction, background: selecting === "end" ? "#f9a8d4" : "#fce7f3" }}
            onClick={() => setSelecting(selecting === "end" ? null : "end")}
          >
            {selecting === "end" ? "✕ Cancelar" : "＋ Fin período"}
          </button>
        </div>

        {selecting && (
          <p style={styles.selectHint}>
            Toca un día para marcar el {selecting === "start" ? "inicio" : "fin"} del período
          </p>
        )}

        <div style={styles.calendarScroll}>
          {months.map((monthDate) => {
            const year = monthDate.getFullYear();
            const month = monthDate.getMonth();
            const daysInMonth = getDaysInMonth(year, month);
            const firstDow = getFirstDayOfWeek(year, month);
            const cells = [];

            for (let i = 0; i < firstDow; i++) cells.push(null);
            for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

            return (
              <div key={`${year}-${month}`} style={styles.monthBlock}>
                <h3 style={styles.monthLabel}>
                  {monthDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                </h3>
                <div style={styles.weekRow}>
                  {["L","M","X","J","V","S","D"].map((d) => (
                    <div key={d} style={styles.weekDay}>{d}</div>
                  ))}
                </div>
                <div style={styles.daysGrid}>
                  {cells.map((date, idx) => {
                    if (!date) return <div key={`empty-${idx}`} />;
                    const isToday = isSameDay(date, today);
                    const isPeriod = isPeriodDay(date);
                    const ovInfo = getOvulationInfo(date);

                    return (
                      <div
                        key={date.getTime()}
                        onClick={() => handleDayClick(date)}
                        style={{
                          ...styles.dayCell,
                          background: isPeriod ? "#ddd6fe" : "transparent",
                          border: isToday ? "2px solid #7c3aed" : "2px solid transparent",
                          cursor: selecting ? "pointer" : "default",
                          position: "relative",
                        }}
                      >
                        <span style={{
                          fontSize: 13,
                          fontWeight: isToday ? 700 : 400,
                          color: isPeriod ? "#6d28d9" : "#374151",
                        }}>
                          {date.getDate()}
                        </span>
                        {ovInfo && (
                          <div style={{ position: "absolute", bottom: 1, right: 1 }}>
                            <FlowerIcon fertility={ovInfo.fertility} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, background: "#ddd6fe" }} /> Período
          </div>
          <div style={styles.legendItem}>
            <FlowerIcon fertility={1} /> Alta fertilidad
          </div>
          <div style={styles.legendItem}>
            <FlowerIcon fertility={0.3} /> Baja fertilidad
          </div>
        </div>
      </div>
    );
  }

  // ─── Home screen ─────────────────────────────────────────────────────────────

  function HomeScreen() {
    const ovulationToday = getOvulationInfo(today);

    return (
      <div style={styles.home}>
        {/* Header */}
        <div style={styles.homeHeader}>
          <span style={styles.appName}>🌸 Luna</span>
          <button style={styles.calBtn} onClick={() => setScreen("calendar")}>📅 Calendario</button>
        </div>

        {/* Main card */}
        <div style={styles.mainCard}>
          <div style={styles.bigNumber}>{statusNumber !== null ? statusNumber : "—"}</div>
          <div style={styles.statusText}>{statusText}</div>
          <div style={styles.statusSub}>{statusSub}</div>

          {ovulationToday && (
            <div style={styles.ovulationBadge}>
              <FlowerIcon fertility={ovulationToday.fertility} />
              <span style={{ marginLeft: 8 }}>
                Día {ovulationToday.fertility === 1 ? "de ovulación" : "fértil"}
              </span>
            </div>
          )}
        </div>

        {/* Phase rings */}
        <div style={styles.phaseRow}>
          {[
            { label: "Menstruación", days: "1–5", color: "#c4b5fd" },
            { label: "Folicular", days: "6–13", color: "#fbcfe8" },
            { label: "Ovulación", days: "14", color: "#f9a8d4" },
            { label: "Lútea", days: "15–28", color: "#fde68a" },
          ].map((p) => (
            <div key={p.label} style={{ ...styles.phaseChip, background: p.color }}>
              <div style={styles.phaseLabel}>{p.label}</div>
              <div style={styles.phaseDays}>Día {p.days}</div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={styles.actionRow}>
          <button
            style={{
              ...styles.actionBtn,
              background: activePeriod ? "#e5e7eb" : "#7c3aed",
              color: activePeriod ? "#9ca3af" : "#fff",
              cursor: activePeriod ? "not-allowed" : "pointer",
            }}
            onClick={handleStartPeriod}
            disabled={!!activePeriod}
          >
            🩸 Inicio del período
          </button>
          <button
            style={{
              ...styles.actionBtn,
              background: !activePeriod ? "#e5e7eb" : "#db2777",
              color: !activePeriod ? "#9ca3af" : "#fff",
              cursor: !activePeriod ? "not-allowed" : "pointer",
            }}
            onClick={handleEndPeriod}
            disabled={!activePeriod}
          >
            ✓ Fin del período
          </button>
        </div>

        {/* Recent history */}
        {entries.length > 0 && (
          <div style={styles.historyBox}>
            <h4 style={styles.historyTitle}>Historial reciente</h4>
            {[...entries].reverse().slice(0, 3).map((e) => (
              <div key={e.id} style={styles.historyItem}>
                <span>🗓 {new Date(e.start).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</span>
                <span style={{ color: "#6b7280" }}>→</span>
                <span>{e.end ? new Date(e.end).toLocaleDateString("es-ES", { day: "numeric", month: "short" }) : "activo"}</span>
                <span style={{ color: "#a78bfa", marginLeft: "auto" }}>
                  {e.end ? `${daysBetween(new Date(e.start), new Date(e.end)) + 1} días` : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.root}>
      {screen === "home" ? <HomeScreen /> : <CalendarScreen />}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  root: {
    fontFamily: "'Georgia', serif",
    minHeight: "100vh",
    background: "linear-gradient(160deg, #faf5ff 0%, #fce7f3 50%, #fff7ed 100%)",
    maxWidth: 430,
    margin: "0 auto",
    position: "relative",
  },
  home: {
    padding: "20px 16px 40px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  homeHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appName: {
    fontSize: 22,
    fontWeight: 700,
    color: "#6d28d9",
    letterSpacing: -0.5,
  },
  calBtn: {
    background: "white",
    border: "1px solid #e9d5ff",
    borderRadius: 20,
    padding: "6px 14px",
    fontSize: 13,
    cursor: "pointer",
    color: "#7c3aed",
    fontFamily: "inherit",
  },
  mainCard: {
    background: "white",
    borderRadius: 24,
    padding: "32px 24px",
    textAlign: "center",
    boxShadow: "0 4px 24px rgba(124,58,237,0.10)",
    border: "1px solid #ede9fe",
  },
  bigNumber: {
    fontSize: 80,
    fontWeight: 300,
    color: "#7c3aed",
    lineHeight: 1,
    letterSpacing: -4,
  },
  statusText: {
    fontSize: 16,
    color: "#374151",
    marginTop: 8,
    fontWeight: 600,
  },
  statusSub: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 4,
  },
  ovulationBadge: {
    display: "inline-flex",
    alignItems: "center",
    marginTop: 16,
    background: "#fdf4ff",
    border: "1px solid #f0abfc",
    borderRadius: 20,
    padding: "6px 14px",
    fontSize: 13,
    color: "#7e22ce",
  },
  phaseRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
  },
  phaseChip: {
    borderRadius: 14,
    padding: "10px 6px",
    textAlign: "center",
  },
  phaseLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: "#374151",
  },
  phaseDays: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 2,
  },
  actionRow: {
    display: "flex",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    padding: "14px 8px",
    borderRadius: 16,
    border: "none",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "inherit",
    transition: "opacity 0.2s",
  },
  historyBox: {
    background: "white",
    borderRadius: 16,
    padding: "16px",
    border: "1px solid #f3e8ff",
  },
  historyTitle: {
    margin: "0 0 12px",
    fontSize: 14,
    color: "#6d28d9",
  },
  historyItem: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    fontSize: 13,
    padding: "6px 0",
    borderBottom: "1px solid #f9fafb",
    color: "#374151",
  },
  // Calendar
  calendarScreen: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    padding: "0 0 40px",
  },
  calendarHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px 16px 0",
    position: "sticky",
    top: 0,
    background: "rgba(250,245,255,0.95)",
    zIndex: 10,
    backdropFilter: "blur(8px)",
  },
  backBtn: {
    background: "none",
    border: "none",
    fontSize: 14,
    color: "#7c3aed",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  calendarTitle: {
    margin: 0,
    fontSize: 18,
    color: "#6d28d9",
  },
  calendarActions: {
    display: "flex",
    gap: 10,
    padding: "12px 16px 0",
    position: "sticky",
    top: 52,
    zIndex: 10,
    backdropFilter: "blur(8px)",
  },
  calAction: {
    flex: 1,
    border: "none",
    borderRadius: 12,
    padding: "10px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    color: "#4c1d95",
  },
  selectHint: {
    textAlign: "center",
    fontSize: 12,
    color: "#7c3aed",
    margin: "8px 0 0",
    background: "#f5f3ff",
    padding: "6px",
  },
  calendarScroll: {
    overflowY: "auto",
    padding: "12px 16px",
    flex: 1,
  },
  monthBlock: {
    marginBottom: 28,
  },
  monthLabel: {
    fontSize: 15,
    color: "#7c3aed",
    fontWeight: 600,
    margin: "0 0 8px",
    textTransform: "capitalize",
  },
  weekRow: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    textAlign: "center",
    marginBottom: 4,
  },
  weekDay: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: 600,
    padding: "4px 0",
  },
  daysGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 3,
  },
  dayCell: {
    aspectRatio: "1",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    position: "relative",
    transition: "background 0.15s",
  },
  legend: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    padding: "12px 16px",
    borderTop: "1px solid #f3e8ff",
    flexWrap: "wrap",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#6b7280",
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
};
