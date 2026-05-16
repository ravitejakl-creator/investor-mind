import { useState } from "react";

const COLORS = {
  bg: "#0D0F14",
  surface: "#141720",
  card: "#1A1E2A",
  border: "#252A3A",
  accent: "#4FFFB0",
  accentDim: "#1A3D2E",
  gold: "#F5C842",
  goldDim: "#3A3010",
  muted: "#6B7280",
  text: "#E8EBF2",
  textDim: "#9CA3AF",
};

const TABS = [
  { id: "daily", label: "Daily Signal", icon: "⚡" },
  { id: "market", label: "Dashboard", icon: "📊" },
  { id: "sprint", label: "Sector Sprint", icon: "🎯" },
  { id: "five", label: "5 Questions", icon: "🧠" },
];

const MARKET_INDICATORS = [
  { label: "Brent Crude", value: "$83.4", change: "+1.2%", up: true, context: "Oil up → GCC fiscal surplus expands → infrastructure spend likely sustained" },
  { label: "Fed Funds Rate", value: "5.25%", change: "Held", up: null, context: "Rates on hold → dollar stays strong → GCC pegs stable → imported inflation persists" },
  { label: "UAE PMI", value: "54.2", change: "+0.8", up: true, context: "Above 50 = expansion. UAE business activity accelerating → logistics demand likely rising" },
  { label: "Baltic Dry Index", value: "1,847", change: "-3.1%", up: false, context: "Falling BDI → global freight demand softening → watch cross-border volumes" },
  { label: "DXY (USD Index)", value: "104.3", change: "+0.3%", up: true, context: "Strong dollar → EM cost of capital rises → investors more selective on EM deals" },
  { label: "UAE EIBOR 3M", value: "5.18%", change: "-0.02%", up: false, context: "Slightly easing → local borrowing costs nudging down → capex projects more viable" },
  { label: "KSA PMI", value: "56.1", change: "+1.3", up: true, context: "Strong KSA expansion → Vision 2030 projects accelerating → cross-border opportunity" },
  { label: "INR/AED", value: "22.8", change: "-0.4%", up: false, context: "Rupee weakening → Indian imports to UAE get costlier → potential trade flow shift" },
];

const DAILY_SIGNALS = [
  {
    source: "Bloomberg Markets",
    time: "07:14",
    headline: "Fed signals rates on hold through Q3 as core PCE stays elevated",
    coach: "What this means for you: Cost of capital stays high globally. Investors will price TruKKer's growth more conservatively — unit economics matter more than revenue growth right now.",
    questions: ["Which part of TruKKer's cost structure is most exposed to high rates?", "If an investor asks about your funding runway today, what do you say?"],
    tags: ["Macro", "Rates", "Investor sentiment"],
  },
  {
    source: "Axios Markets",
    time: "07:30",
    headline: "Gulf sovereign wealth funds increase allocation to logistics & supply chain assets",
    coach: "Direct signal: SWFs are moving into your sector. This is a tailwind for TruKKer's fundraising narrative — but also means more institutional scrutiny on metrics.",
    questions: ["Which GCC SWFs are most active in logistics?", "What metrics would an SWF diligence team focus on?"],
    tags: ["GCC", "Investor", "Logistics"],
  },
  {
    source: "MEED",
    time: "08:00",
    headline: "Saudi Arabia fast-tracks $12B in logistics infrastructure under Vision 2030",
    coach: "This is a structural tailwind for cross-border freight. Translate it: more infrastructure → lower friction on KSA lanes → TruKKer's unit economics improve over time.",
    questions: ["How does this appear in TruKKer's investor narrative?", "Which specific corridors benefit most?"],
    tags: ["KSA", "Infrastructure", "Cross-border"],
  },
];

const SECTORS = [
  { name: "Fintech", icon: "💳", keyMetrics: ["Take rate", "TPV", "CAC/LTV ratio"], moat: "Data network effects + switching cost", cycle: "Early growth → consolidation", color: "#4FFFB0" },
  { name: "Healthcare", icon: "🏥", keyMetrics: ["EBITDA/bed", "Occupancy %", "Revenue/patient"], moat: "Regulatory licences + physician ties", cycle: "Defensive, counter-cyclical", color: "#60A5FA" },
  { name: "Real Estate", icon: "🏙️", keyMetrics: ["NAV", "Cap rate", "Occupancy"], moat: "Location + scale + relationships", cycle: "Rate-sensitive, long duration", color: "#F5C842" },
  { name: "Energy", icon: "⚡", keyMetrics: ["EV/EBITDA", "Reserve life", "Break-even $/barrel"], moat: "Reserve base + pipeline infra", cycle: "Commodity cycle, geopolitical", color: "#FB923C" },
  { name: "Consumer", icon: "🛍️", keyMetrics: ["Gross margin", "Repeat rate", "Brand NPS"], moat: "Brand loyalty + distribution", cycle: "Macro-sensitive, discretionary", color: "#C084FC" },
  { name: "Logistics", icon: "🚛", keyMetrics: ["GMV", "Take rate", "Utilisation %"], moat: "Network density + lane data", cycle: "Trade-cycle linked", color: "#34D399" },
];

const FIVE_QUESTIONS = [
  { num: "Q1", question: "What is the unit economics?", prompt: "Describe CAC, LTV, payback period, contribution margin. Does this business make money per transaction?", placeholder: "e.g. CAC is $X, LTV is $Y, payback in Z months. Each transaction generates $A gross profit..." },
  { num: "Q2", question: "What is the moat?", prompt: "Network effects? Switching costs? Scale? Regulation? Brand? Why can't someone just copy this tomorrow?", placeholder: "e.g. The moat is switching costs — once a customer integrates their ERP, migration costs 6+ months and $200K..." },
  { num: "Q3", question: "Who captures the value?", prompt: "In the value chain, who holds pricing power? Who gets squeezed? Why does this company win vs suppliers and customers?", placeholder: "e.g. The platform captures value because it owns the demand side. Suppliers are fragmented and price-taking..." },
  { num: "Q4", question: "What does the cycle look like?", prompt: "Every sector has a cycle. Where is this business in it — early growth, mature, downturn? What happens at the turn?", placeholder: "e.g. This sector is mid-cycle. Rising rates are starting to compress multiples. At the turn, expect..." },
  { num: "Q5", question: "What has to be true for the bull case?", prompt: "Work backwards from the upside. What assumptions sit underneath the optimistic scenario — and how fragile are they?", placeholder: "e.g. For the bull case to work, you need: (1) market grows at 20%+ for 5 years, (2) take rate holds above 8%, (3) no new regulation..." },
];

function Tag({ label, color = COLORS.accent }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: "2px 8px",
      borderRadius: 99, background: color + "22", color,
      letterSpacing: "0.04em", textTransform: "uppercase",
    }}>{label}</span>
  );
}

function CoachBubble({ text }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${COLORS.accentDim}, #1A2E28)`,
      border: `1px solid ${COLORS.accent}44`,
      borderRadius: 12, padding: "10px 14px", marginTop: 10,
    }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <span style={{ fontSize: 14 }}>🎓</span>
        <p style={{ fontSize: 12, color: COLORS.accent, lineHeight: 1.6, margin: 0 }}>{text}</p>
      </div>
    </div>
  );
}

function DailyTab() {
  const [expanded, setExpanded] = useState(null);
  const [checked, setChecked] = useState([]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: COLORS.card, borderRadius: 16, padding: "14px 16px", border: `1px solid ${COLORS.border}` }}>
        <p style={{ fontSize: 11, color: COLORS.muted, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Friday, May 15</p>
        <p style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 4px", fontFamily: "Georgia, serif" }}>Good morning.</p>
        <p style={{ fontSize: 13, color: COLORS.textDim, margin: 0, lineHeight: 1.5 }}>3 signals today worth your attention. Read each, then answer the coach questions before moving on.</p>
      </div>

      {DAILY_SIGNALS.map((s, i) => (
        <div key={i} style={{
          background: COLORS.card, borderRadius: 16, border: `1px solid ${checked.includes(i) ? COLORS.accent + "55" : COLORS.border}`,
          overflow: "hidden", transition: "border 0.2s",
        }}>
          <div style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600 }}>{s.source}</span>
                <span style={{ fontSize: 11, color: COLORS.border }}>·</span>
                <span style={{ fontSize: 11, color: COLORS.muted }}>{s.time}</span>
              </div>
              {checked.includes(i) && <span style={{ fontSize: 13, color: COLORS.accent }}>✓ Done</span>}
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, margin: "0 0 8px", lineHeight: 1.5 }}>{s.headline}</p>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {s.tags.map(t => <Tag key={t} label={t} />)}
            </div>
          </div>

          <button onClick={() => setExpanded(expanded === i ? null : i)} style={{
            width: "100%", background: "none", border: "none", borderTop: `1px solid ${COLORS.border}`,
            padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
            cursor: "pointer", color: COLORS.textDim, fontSize: 12,
          }}>
            <span>{expanded === i ? "Hide" : "Coach me on this"}</span>
            <span style={{ transform: expanded === i ? "rotate(180deg)" : "none", transition: "0.2s" }}>▾</span>
          </button>

          {expanded === i && (
            <div style={{ padding: "0 16px 16px" }}>
              <CoachBubble text={s.coach} />
              <div style={{ marginTop: 12 }}>
                <p style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>Think about</p>
                {s.questions.map((q, qi) => (
                  <div key={qi} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: COLORS.accent, fontSize: 12, minWidth: 14 }}>→</span>
                    <p style={{ fontSize: 12, color: COLORS.textDim, margin: 0, lineHeight: 1.5 }}>{q}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setChecked([...checked, i])} style={{
                marginTop: 12, width: "100%", background: COLORS.accentDim,
                border: `1px solid ${COLORS.accent}44`, borderRadius: 10, padding: "10px",
                color: COLORS.accent, fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>Mark as done ✓</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MarketTab() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: COLORS.card, borderRadius: 16, padding: "14px 16px", border: `1px solid ${COLORS.border}` }}>
        <p style={{ fontSize: 13, color: COLORS.textDim, margin: 0, lineHeight: 1.5 }}>Tap any indicator to understand what it means for your work and how to think about it.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {MARKET_INDICATORS.map((m, i) => (
          <div key={i} onClick={() => setSelected(selected === i ? null : i)} style={{
            background: selected === i ? `linear-gradient(135deg, #1A2E28, ${COLORS.card})` : COLORS.card,
            border: `1px solid ${selected === i ? COLORS.accent + "66" : COLORS.border}`,
            borderRadius: 14, padding: "14px 14px", cursor: "pointer", transition: "all 0.2s",
            gridColumn: selected === i ? "span 2" : "span 1",
          }}>
            <p style={{ fontSize: 11, color: COLORS.muted, margin: "0 0 4px", fontWeight: 600 }}>{m.label}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0, fontFamily: "Georgia, serif" }}>{m.value}</p>
              <span style={{ fontSize: 12, fontWeight: 600, color: m.up === null ? COLORS.muted : m.up ? COLORS.accent : "#F87171" }}>{m.change}</span>
            </div>
            {selected === i && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COLORS.border}` }}>
                <CoachBubble text={m.context} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ background: COLORS.card, borderRadius: 16, padding: "14px 16px", border: `1px solid ${COLORS.border}` }}>
        <p style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>Weekly journal</p>
        <textarea placeholder="What moved this week and why? Write 2–3 sentences in your own words..." style={{
          width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
          borderRadius: 10, padding: "10px 12px", color: COLORS.text, fontSize: 13,
          lineHeight: 1.6, resize: "none", height: 80, boxSizing: "border-box", fontFamily: "inherit",
        }} />
        <button style={{
          marginTop: 8, width: "100%", background: COLORS.goldDim, border: `1px solid ${COLORS.gold}44`,
          borderRadius: 10, padding: "10px", color: COLORS.gold, fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>Save this week's entry</button>
      </div>
    </div>
  );
}

function SprintTab() {
  const [activeSector, setActiveSector] = useState(null);
  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState({});

  const STEPS = ["Annual Report", "Five Questions", "Analyst Check", "Key Numbers"];

  if (activeSector !== null) {
    const s = SECTORS[activeSector];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={() => { setActiveSector(null); setStep(0); }} style={{
            background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10,
            padding: "8px 12px", color: COLORS.textDim, fontSize: 12, cursor: "pointer",
          }}>← Back</button>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: 0 }}>{s.icon} {s.name} Sprint</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {STEPS.map((st, i) => (
            <div key={i} onClick={() => setStep(i)} style={{
              flex: 1, height: 4, borderRadius: 99, cursor: "pointer",
              background: i <= step ? s.color : COLORS.border, transition: "background 0.3s",
            }} />
          ))}
        </div>
        <p style={{ fontSize: 11, color: COLORS.muted, margin: 0, textAlign: "center" }}>Step {step + 1} of 4: {STEPS[step]}</p>

        {step === 0 && (
          <div style={{ background: COLORS.card, borderRadius: 16, padding: 16, border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 8px" }}>Read the annual report</p>
            <CoachBubble text={`For ${s.name}, read only: CEO letter, business overview, and key metrics page. Target: 20 minutes. Don't go deeper yet.`} />
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>Key metrics to find</p>
              {s.keyMetrics.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                  <div style={{ width: 6, height: 6, borderRadius: 99, background: s.color, flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: COLORS.textDim, margin: 0 }}>{m}</p>
                </div>
              ))}
            </div>
            <textarea placeholder="Note the company you picked and first impressions..." value={notes.step0 || ""} onChange={e => setNotes({ ...notes, step0: e.target.value })} style={{
              width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
              borderRadius: 10, padding: "10px 12px", color: COLORS.text, fontSize: 13,
              lineHeight: 1.6, resize: "none", height: 80, boxSizing: "border-box", marginTop: 12, fontFamily: "inherit",
            }} />
          </div>
        )}

        {step === 1 && (
          <div style={{ background: COLORS.card, borderRadius: 16, padding: 16, border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 8px" }}>Apply the five questions</p>
            <CoachBubble text="Write your own answers before looking at analyst reports. The gap between your view and theirs is your lesson." />
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {FIVE_QUESTIONS.slice(0, 3).map((q, i) => (
                <div key={i}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: s.color, margin: "0 0 4px" }}>{q.num}: {q.question}</p>
                  <textarea placeholder={q.placeholder} value={notes[`q${i}`] || ""} onChange={e => setNotes({ ...notes, [`q${i}`]: e.target.value })} style={{
                    width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                    borderRadius: 10, padding: "10px 12px", color: COLORS.text, fontSize: 12,
                    lineHeight: 1.6, resize: "none", height: 60, boxSizing: "border-box", fontFamily: "inherit",
                  }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ background: COLORS.card, borderRadius: 16, padding: 16, border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 8px" }}>Compare with analysts</p>
            <CoachBubble text={`Now read one sell-side analyst report on your ${s.name} company. Where did your thinking match? Where did it break? The gap is the lesson.`} />
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>Where to find reports</p>
              {["Bloomberg (free tier)", "Company investor relations page", "Seeking Alpha (free articles)", "Reuters / FT analysis"].map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: s.color, fontSize: 12 }}>→</span>
                  <p style={{ fontSize: 12, color: COLORS.textDim, margin: 0 }}>{r}</p>
                </div>
              ))}
            </div>
            <textarea placeholder="What did analysts see that you missed? What did you get right?" value={notes.step2 || ""} onChange={e => setNotes({ ...notes, step2: e.target.value })} style={{
              width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
              borderRadius: 10, padding: "10px 12px", color: COLORS.text, fontSize: 13,
              lineHeight: 1.6, resize: "none", height: 80, boxSizing: "border-box", marginTop: 12, fontFamily: "inherit",
            }} />
          </div>
        )}

        {step === 3 && (
          <div style={{ background: COLORS.card, borderRadius: 16, padding: 16, border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 8px" }}>Lock in the key numbers</p>
            <CoachBubble text={`These are your ${s.name} sector anchors. Write the 2–3 numbers that define this sector's health — add them to your market dashboard.`} />
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {s.keyMetrics.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <p style={{ fontSize: 12, color: COLORS.textDim, margin: 0, width: 130, flexShrink: 0 }}>{m}</p>
                  <input placeholder="Your value" style={{
                    flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                    borderRadius: 8, padding: "8px 10px", color: COLORS.text, fontSize: 13, fontFamily: "inherit",
                  }} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, background: COLORS.accentDim, border: `1px solid ${COLORS.accent}44`, borderRadius: 12, padding: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.accent, margin: "0 0 4px" }}>Sprint complete 🎯</p>
              <p style={{ fontSize: 12, color: COLORS.accent + "BB", margin: 0, lineHeight: 1.5 }}>You now have a {s.name} sector antenna. Come back next month with a different sector.</p>
            </div>
          </div>
        )}

        <button onClick={() => step < 3 ? setStep(step + 1) : null} style={{
          width: "100%", background: step === 3 ? COLORS.accentDim : s.color,
          border: "none", borderRadius: 12, padding: "14px",
          color: step === 3 ? COLORS.accent : COLORS.bg, fontSize: 14, fontWeight: 700, cursor: "pointer",
        }}>{step < 3 ? `Next: ${STEPS[step + 1]} →` : "Sprint Complete ✓"}</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: COLORS.card, borderRadius: 16, padding: "14px 16px", border: `1px solid ${COLORS.border}` }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 6px", fontFamily: "Georgia, serif" }}>One sector per month.</p>
        <p style={{ fontSize: 13, color: COLORS.textDim, margin: 0, lineHeight: 1.5 }}>Pick any sector below. The coach walks you through 4 steps — annual report, five questions, analyst comparison, key numbers.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {SECTORS.map((s, i) => (
          <div key={i} onClick={() => setActiveSector(i)} style={{
            background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14,
            padding: "16px 14px", cursor: "pointer", transition: "all 0.2s",
            borderTop: `3px solid ${s.color}`,
          }}>
            <p style={{ fontSize: 22, margin: "0 0 6px" }}>{s.icon}</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, margin: "0 0 6px" }}>{s.name}</p>
            <p style={{ fontSize: 11, color: COLORS.muted, margin: 0, lineHeight: 1.4 }}>{s.moat}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FiveQuestionsTab() {
  const [company, setCompany] = useState("");
  const [answers, setAnswers] = useState({});
  const [activeQ, setActiveQ] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const completedCount = Object.keys(answers).filter(k => answers[k]?.trim()).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: COLORS.card, borderRadius: 16, padding: "14px 16px", border: `1px solid ${COLORS.border}` }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 8px", fontFamily: "Georgia, serif" }}>Evaluate any company.</p>
        <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Enter company name (e.g. Aldar Properties, Noon, FAB)..." style={{
          width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
          borderRadius: 10, padding: "10px 12px", color: COLORS.text, fontSize: 13,
          boxSizing: "border-box", fontFamily: "inherit",
        }} />
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {FIVE_QUESTIONS.map((q, i) => (
          <div key={i} onClick={() => setActiveQ(i)} style={{
            flex: 1, padding: "6px 0", borderRadius: 8, cursor: "pointer",
            background: activeQ === i ? COLORS.gold : answers[i]?.trim() ? COLORS.accentDim : COLORS.card,
            border: `1px solid ${activeQ === i ? COLORS.gold : answers[i]?.trim() ? COLORS.accent + "44" : COLORS.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700,
            color: activeQ === i ? COLORS.bg : answers[i]?.trim() ? COLORS.accent : COLORS.muted,
            transition: "all 0.2s",
          }}>{q.num}</div>
        ))}
      </div>

      {FIVE_QUESTIONS.map((q, i) => activeQ === i && (
        <div key={i} style={{ background: COLORS.card, borderRadius: 16, padding: 16, border: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
              background: COLORS.goldDim, color: COLORS.gold,
            }}>{q.num}</span>
            <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: 0, lineHeight: 1.4 }}>{q.question}</p>
          </div>
          <CoachBubble text={q.prompt} />
          <textarea
            value={answers[i] || ""}
            onChange={e => setAnswers({ ...answers, [i]: e.target.value })}
            placeholder={q.placeholder}
            style={{
              width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
              borderRadius: 10, padding: "12px", color: COLORS.text, fontSize: 13,
              lineHeight: 1.6, resize: "none", height: 110, boxSizing: "border-box",
              marginTop: 12, fontFamily: "inherit",
            }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {i > 0 && <button onClick={() => setActiveQ(i - 1)} style={{
              flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.border}`,
              borderRadius: 10, padding: "10px", color: COLORS.textDim, fontSize: 13, cursor: "pointer",
            }}>← Previous</button>}
            {i < 4 && <button onClick={() => setActiveQ(i + 1)} style={{
              flex: 2, background: COLORS.goldDim, border: `1px solid ${COLORS.gold}44`,
              borderRadius: 10, padding: "10px", color: COLORS.gold, fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>Next question →</button>}
            {i === 4 && <button onClick={() => setSubmitted(true)} style={{
              flex: 2, background: COLORS.gold, border: "none",
              borderRadius: 10, padding: "10px", color: COLORS.bg, fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>Complete analysis ✓</button>}
          </div>
        </div>
      ))}

      {submitted && (
        <div style={{ background: `linear-gradient(135deg, ${COLORS.goldDim}, ${COLORS.card})`, border: `1px solid ${COLORS.gold}44`, borderRadius: 16, padding: 16 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: COLORS.gold, margin: "0 0 6px" }}>Analysis complete{company ? ` — ${company}` : ""}</p>
          <p style={{ fontSize: 12, color: COLORS.textDim, margin: "0 0 12px", lineHeight: 1.5 }}>{completedCount} of 5 questions answered. Now find one analyst report on this company and see where your thinking differed.</p>
          <button onClick={() => { setSubmitted(false); setAnswers({}); setCompany(""); setActiveQ(0); }} style={{
            width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
            borderRadius: 10, padding: "10px", color: COLORS.textDim, fontSize: 13, cursor: "pointer",
          }}>Start a new analysis</button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("daily");

  return (
    <div style={{
      background: COLORS.bg, minHeight: "100vh", maxWidth: 420,
      margin: "0 auto", fontFamily: "'DM Sans', system-ui, sans-serif",
      color: COLORS.text, paddingBottom: 80,
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 20px 0",
        background: `linear-gradient(180deg, #0D0F14 0%, transparent 100%)`,
        position: "sticky", top: 0, zIndex: 10,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Investor Mind</p>
            <p style={{ fontSize: 13, color: COLORS.muted, margin: 0 }}>Your daily thinking coach</p>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: 99,
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.gold})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>R</div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              background: activeTab === t.id ? COLORS.accent : COLORS.card,
              border: `1px solid ${activeTab === t.id ? COLORS.accent : COLORS.border}`,
              borderRadius: 10, padding: "8px 14px", cursor: "pointer", whiteSpace: "nowrap",
              color: activeTab === t.id ? COLORS.bg : COLORS.textDim,
              fontSize: 12, fontWeight: activeTab === t.id ? 700 : 400,
              display: "flex", gap: 5, alignItems: "center", transition: "all 0.2s",
              fontFamily: "inherit",
            }}>
              <span>{t.icon}</span><span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "4px 20px 20px" }}>
        {activeTab === "daily" && <DailyTab />}
        {activeTab === "market" && <MarketTab />}
        {activeTab === "sprint" && <SprintTab />}
        {activeTab === "five" && <FiveQuestionsTab />}
      </div>
    </div>
  );
}
