import { useEffect, useRef, useState } from 'react'
import { AlertIcon } from './Icons.jsx'

const triggeredSensors = [
  { location: 'Red Square',  temp: 98.2,  limit: 95,  zone: 'Zone 4' },
  { location: 'Stadium',     temp: 101.4, limit: 95,  zone: 'Zone 9' },
]

const departmentalImpact = [
  { name: 'UW Public Health Department',          status: 'Exceeded', statusClass: 'bg-critical/10 text-critical' },
  { name: 'UW Campus Energy, Utilities & Ops',    status: 'Exceeded', statusClass: 'bg-critical/10 text-critical' },
  { name: 'UW Facilities Services',               status: 'Exceeded', statusClass: 'bg-critical/10 text-critical' },
  { name: 'UW Housing & Food Services',           status: 'Monitoring', statusClass: 'bg-warn/10 text-warn'     },
  { name: 'UW Office of Student Life',            status: 'Monitoring', statusClass: 'bg-warn/10 text-warn'     },
]

const recommendations = [
  {
    priority: 'Critical',
    accentColor: '#ff6b6b',
    accentBg: 'rgba(255,107,107,0.07)',
    badgeBg: 'rgba(255,107,107,0.15)',
    badgeColor: '#ff6b6b',
    title: 'Activate Cooling Protocol HEAT-2A',
    text: 'Deploy HVAC override for Zone 4 and Zone 9 immediately. Coordinate with UW Facilities Services to maximise cooling capacity in affected buildings.',
  },
  {
    priority: 'High',
    accentColor: '#ffb38a',
    accentBg: 'rgba(255,179,138,0.07)',
    badgeBg: 'rgba(255,179,138,0.15)',
    badgeColor: '#ffb38a',
    title: 'Notify Affected Departments',
    text: 'Contact UW Public Health Department and UW Facilities Services via emergency channels. Confirm all departmental leads have acknowledged the alert per protocol.',
  },
  {
    priority: 'High',
    accentColor: '#ffb38a',
    accentBg: 'rgba(255,179,138,0.07)',
    badgeBg: 'rgba(255,179,138,0.15)',
    badgeColor: '#ffb38a',
    title: 'Restrict Outdoor Activity in Zones 4 & 9',
    text: 'Issue advisory to halt outdoor gatherings at Red Square and Stadium. Recommend relocation of affected events and activities to air-conditioned venues.',
  },
  {
    priority: 'Monitor',
    accentColor: '#7cc8ff',
    accentBg: 'rgba(124,200,255,0.06)',
    badgeBg: 'rgba(124,200,255,0.12)',
    badgeColor: '#7cc8ff',
    title: 'Elevate Monitoring on Adjacent Zones',
    text: 'Place Zone 2 and Zone 7 sensors on high-frequency polling. Thermal spread to adjacent zones is projected within 45–60 min based on current trend.',
  },
]

export default function AlertDetailPanel({ onClose, setPage, onAcknowledge }) {
  const closeRef = useRef(null)
  const [entered, setEntered]       = useState(false)
  const [leaving, setLeaving]       = useState(false)
  const [escalateOpen, setEscalate] = useState(false)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function handleClose() {
    if (reducedMotion) { onClose(); return }
    setLeaving(true)
    setTimeout(onClose, 280)
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true))
    closeRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 motion-safe:transition-opacity motion-safe:duration-300 ${entered && !leaving ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-panel-title"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[90vw] md:max-w-[520px] flex flex-col overflow-hidden rounded-l-[16px] motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out ${entered && !leaving ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background: '#10141e', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 px-6 py-5 flex items-start gap-4"
          style={{ background: 'linear-gradient(90deg, rgba(255,138,76,0.12), rgba(255,138,76,0.03) 70%), #13171f', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="w-10 h-10 rounded-[10px] grid place-items-center text-accent flex-shrink-0 mt-0.5" style={{ background: 'rgba(255,138,76,0.15)' }}>
            <AlertIcon className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className="text-[10.5px] uppercase tracking-[0.08em] px-2 py-0.5 rounded font-semibold text-accent border"
                style={{ background: 'rgba(255,138,76,0.10)', borderColor: 'rgba(255,138,76,0.35)' }}
              >
                Heat Advisory · Level 2
              </span>
              <span className="text-[11px] text-ink-3">Protocol HEAT-2A</span>
            </div>
            <div id="alert-panel-title" className="text-[15px] font-semibold mt-1.5 leading-snug">
              Sensor cluster in Central Campus exceeded threshold
            </div>
            <div className="text-ink-3 text-[12px] mt-1">
              Triggered 12:18 PST · <span className="text-warn">Active for 23 min</span> · Zones 4 &amp; 9
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={handleClose}
            aria-label="Close alert details"
            className="w-8 h-8 grid place-items-center rounded-lg text-ink-2 hover:text-ink-0 hover:bg-bg-2 transition-colors flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto scroll-area px-6 py-5 flex flex-col gap-6">

          {/* Triggered Sensors */}
          <section>
            <SectionLabel>Triggered Sensors</SectionLabel>
            <div className="flex flex-col gap-2.5 mt-3">
              {triggeredSensors.map(s => {
                const over = (s.temp - s.limit).toFixed(1)
                return (
                  <div key={s.location}
                    className="flex items-center gap-4 px-4 py-3 rounded-[10px] border"
                    style={{ background: 'rgba(255,107,107,0.06)', borderColor: 'rgba(255,107,107,0.20)' }}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-[13px] text-ink-0">{s.location}</div>
                      <div className="text-ink-3 text-[11.5px] mt-0.5">{s.zone} · limit {s.limit}°F</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-[18px] text-critical leading-none">{s.temp}°F</div>
                      <div className="text-critical text-[11px] mt-0.5">+{over}°F over limit</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Departmental Impact */}
          <section>
            <SectionLabel>Departmental Impact</SectionLabel>
            <div className="flex flex-col gap-2 mt-3">
              {departmentalImpact.map(d => (
                <div key={d.name} className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-[10px] bg-bg-2 border border-line-soft">
                  <span className="text-[12.5px] text-ink-1 leading-snug">{d.name}</span>
                  <span className={`text-[10.5px] uppercase tracking-[0.06em] font-semibold px-2.5 py-[3px] rounded-full flex-shrink-0 ${d.statusClass}`}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* AI Recommendations */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <SectionLabel>AI‑Generated Recommendations</SectionLabel>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold tracking-wide"
                style={{ background: 'rgba(124,200,255,0.12)', color: '#7cc8ff', border: '1px solid rgba(124,200,255,0.25)' }}>
                Auto
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {recommendations.map((r, i) => (
                <div
                  key={i}
                  className="rounded-[10px] px-4 py-3.5"
                  style={{
                    background: r.accentBg,
                    borderLeft: `3px solid ${r.accentColor}`,
                    border: `1px solid rgba(255,255,255,0.07)`,
                    borderLeftColor: r.accentColor,
                    borderLeftWidth: '3px',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] uppercase tracking-[0.07em] font-semibold px-2 py-[3px] rounded-full"
                      style={{ background: r.badgeBg, color: r.badgeColor }}
                    >
                      {r.priority}
                    </span>
                    <span className="text-[12.5px] font-semibold text-ink-0">{r.title}</span>
                  </div>
                  <p className="text-ink-2 text-[12.5px] leading-relaxed m-0">{r.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Action footer */}
        <div
          className="flex-shrink-0 px-6 py-4 flex flex-col gap-2.5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: '#10141e' }}
        >
          <button
            onClick={() => { handleClose(); setTimeout(() => setPage?.('hub'), 300) }}
            className="w-full py-2.5 rounded-[10px] font-semibold text-[13px] text-white transition hover:brightness-110"
            style={{ background: 'linear-gradient(180deg,#ff6b4c,#e8492a)', boxShadow: '0 4px 14px rgba(232,73,42,0.25)' }}>
            Dispatch Response Unit
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => { onAcknowledge?.() }}
              className="py-2.5 rounded-[10px] font-semibold text-[13px] bg-bg-3 text-ink-0 border border-line hover:bg-bg-2 transition">
              Acknowledge
            </button>
            <button
              onClick={() => setEscalate(true)}
              className="py-2.5 rounded-[10px] font-semibold text-[13px] border transition-colors hover:bg-[rgba(255,107,107,0.15)]"
              style={{ background: 'rgba(255,107,107,0.08)', borderColor: 'rgba(255,107,107,0.30)', color: '#ff6b6b' }}
            >
              Escalate to Level 3
            </button>
          </div>

          {escalateOpen && <EscalateModal onConfirm={() => { setEscalate(false); handleClose() }} onClose={() => setEscalate(false)} />}
        </div>
      </aside>
    </>
  )
}

function EscalateModal({ onConfirm, onClose }) {
  const [confirmed, setConfirmed] = useState(false)

  function confirm() {
    setConfirmed(true)
    setTimeout(onConfirm, 1200)
  }

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/60" onClick={onClose} />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[420px] rounded-[16px] overflow-hidden"
          style={{ background: '#10141e', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
          role="dialog" aria-modal="true">

          {confirmed ? (
            <div className="px-6 py-10 flex flex-col items-center gap-3 text-center">
              <div className="w-10 h-10 rounded-full grid place-items-center" style={{ background: 'rgba(255,107,107,0.15)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <p className="m-0 text-[14px] font-bold text-ink-0">Escalated to Level 3</p>
              <p className="m-0 text-[12.5px] text-ink-3">Full emergency response protocols activated. External services notified.</p>
            </div>
          ) : (
            <>
              <div className="px-6 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <h2 className="m-0 text-[15px] font-bold text-ink-0">Escalate to Level 3?</h2>
                <p className="m-0 mt-1 text-[12.5px] text-ink-3">This will activate full emergency response protocols.</p>
              </div>
              <div className="px-6 py-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 text-center px-3 py-2.5 rounded-lg" style={{ background: 'rgba(255,179,138,0.10)', border: '1px solid rgba(255,179,138,0.25)' }}>
                    <p className="m-0 text-[10px] uppercase tracking-[0.07em] text-ink-3">Current</p>
                    <p className="m-0 mt-1 text-[14px] font-bold text-warn">Level 2</p>
                  </div>
                  <span className="text-ink-3 text-lg">→</span>
                  <div className="flex-1 text-center px-3 py-2.5 rounded-lg" style={{ background: 'rgba(255,107,107,0.10)', border: '1px solid rgba(255,107,107,0.25)' }}>
                    <p className="m-0 text-[10px] uppercase tracking-[0.07em] text-ink-3">Escalating to</p>
                    <p className="m-0 mt-1 text-[14px] font-bold text-critical">Level 3</p>
                  </div>
                </div>
                <p className="m-0 text-[12.5px] text-ink-3 leading-relaxed">EMS and the City of Seattle will be contacted. A campus closure advisory may follow.</p>
              </div>
              <div className="px-6 pb-6 flex gap-3">
                <button onClick={onClose}
                  className="flex-1 py-2.5 rounded-[10px] text-[13px] font-semibold bg-bg-3 text-ink-0 border border-line hover:bg-bg-2 transition-colors">
                  Cancel
                </button>
                <button onClick={confirm}
                  className="flex-1 py-2.5 rounded-[10px] text-[13px] font-semibold text-white hover:brightness-110 transition-all"
                  style={{ background: 'linear-gradient(180deg,#ff6b4c,#e8492a)', boxShadow: '0 4px 14px rgba(232,73,42,0.35)' }}>
                  Confirm Escalation
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

function SectionLabel({ children }) {
  return (
    <h3 className="m-0 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-ink-3">
      {children}
    </h3>
  )
}
