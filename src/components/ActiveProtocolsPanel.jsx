import { useState, useEffect, useRef } from 'react'

const initialProtocols = [
  // Awaiting approval
  {
    id: 'HEAT-2A',
    name: 'Zone Cooling Activation',
    desc: 'Override HVAC systems in Zone 4 and Zone 9 to maximum cooling capacity.',
    department: 'UW Facilities Services',
    triggered: '12:18 PST',
    waitingMins: 23,
    status: 'pending',
    category: 'Infrastructure',
  },
  {
    id: 'EVAC-1B',
    name: 'Partial Evacuation Advisory',
    desc: 'Issue evacuation advisory for outdoor areas in Red Square and adjacent zones.',
    department: 'UW Public Health Department',
    triggered: '12:22 PST',
    waitingMins: 19,
    status: 'pending',
    category: 'Safety',
  },
  // Active
  {
    id: 'NOTIF-1',
    name: 'Campus-Wide Heat Advisory',
    desc: 'Push notification sent to all campus devices and department leads.',
    department: 'All Departments',
    triggered: '12:18 PST',
    status: 'active',
    category: 'Notification',
  },
  {
    id: 'MONITOR-2',
    name: 'Elevated Sensor Polling',
    desc: 'Sensor read frequency increased from 5 min to 30 sec intervals.',
    department: 'XWeather System',
    triggered: '12:18 PST',
    status: 'active',
    category: 'System',
  },
  {
    id: 'DEPART-1',
    name: 'Department Contact Chain',
    desc: 'Sequential notification of all 8 department emergency contacts.',
    department: 'All Departments',
    triggered: '12:19 PST',
    status: 'active',
    category: 'Communication',
  },
  {
    id: 'RESTRICT-1',
    name: 'Outdoor Activity Restriction',
    desc: 'Advisory issued to halt outdoor gatherings and non-essential activities.',
    department: 'UW Office of Student Life',
    triggered: '12:22 PST',
    status: 'active',
    category: 'Safety',
  },
  {
    id: 'COOL-3',
    name: 'Engineering Building Cooling',
    desc: 'HVAC override applied to Zone 2 engineering complex as precautionary measure.',
    department: 'UW Campus Energy & Utilities',
    triggered: '12:24 PST',
    status: 'active',
    category: 'Infrastructure',
  },
  {
    id: 'LOG-1',
    name: 'Emergency Event Logging',
    desc: 'All sensor readings and actions logged at 10-second intervals for incident report.',
    department: 'XWeather System',
    triggered: '12:17 PST',
    status: 'active',
    category: 'System',
  },
]

const categoryColors = {
  Infrastructure: { color: '#7cc8ff', bg: 'rgba(124,200,255,0.10)' },
  Safety:         { color: '#ff6b6b', bg: 'rgba(255,107,107,0.10)' },
  Notification:   { color: '#ffb38a', bg: 'rgba(255,179,138,0.10)' },
  Communication:  { color: '#6ee2b9', bg: 'rgba(110,226,185,0.10)' },
  System:         { color: '#8893a8', bg: 'rgba(136,147,168,0.10)'  },
}

export { initialProtocols }

export default function ActiveProtocolsPanel({ onClose, protocols, setProtocols }) {
  const [entered, setEntered] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const closeRef = useRef(null)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true))
    closeRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('keydown', onKey) }
  }, [])

  function handleClose() {
    if (reducedMotion) { onClose(); return }
    setLeaving(true)
    setTimeout(onClose, 280)
  }

  function approve(id) {
    setProtocols(prev => prev.map(p => p.id === id ? { ...p, status: 'active' } : p))
  }

  function reject(id) {
    setProtocols(prev => prev.filter(p => p.id !== id))
  }

  const pending = protocols.filter(p => p.status === 'pending')
  const active  = protocols.filter(p => p.status === 'active')
  const isVisible = entered && !leaving

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 motion-safe:transition-opacity motion-safe:duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="protocols-panel-title"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[520px] flex flex-col overflow-hidden rounded-l-[16px] motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background: '#10141e', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 id="protocols-panel-title" className="m-0 text-[15px] font-bold text-ink-0">
                Active Protocols
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-warn/10 text-warn">
                {protocols.length} running
              </span>
            </div>
            <p className="text-ink-3 text-[12px] mt-0.5 m-0">
              {pending.length > 0
                ? `${pending.length} awaiting your approval`
                : 'All protocols approved and active'}
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={handleClose}
            aria-label="Close protocols panel"
            className="w-8 h-8 grid place-items-center rounded-lg text-ink-2 hover:text-ink-0 hover:bg-bg-2 transition-colors flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto scroll-area px-6 py-5 flex flex-col gap-6">

          {/* Awaiting approval */}
          {pending.length > 0 && (
            <section>
              <h3 className="m-0 mb-3 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-warn flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-warn animate-pulse inline-block" aria-hidden="true" />
                Awaiting Approval
              </h3>
              <div className="flex flex-col gap-3">
                {pending.map(p => (
                  <PendingCard key={p.id} protocol={p} onApprove={() => approve(p.id)} onReject={() => reject(p.id)} />
                ))}
              </div>
            </section>
          )}

          {/* Active protocols */}
          <section>
            <h3 className="m-0 mb-3 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-ink-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ok inline-block" aria-hidden="true" />
              Running
            </h3>
            <div className="flex flex-col gap-2.5">
              {active.map(p => (
                <ActiveCard key={p.id} protocol={p} />
              ))}
              {active.length === 0 && (
                <p className="text-ink-3 text-[13px] text-center py-6 m-0">No active protocols</p>
              )}
            </div>
          </section>
        </div>
      </aside>
    </>
  )
}

function PendingCard({ protocol, onApprove, onReject }) {
  const cat = categoryColors[protocol.category] || categoryColors.System
  return (
    <div className="rounded-[12px] p-4 flex flex-col gap-3"
      style={{ background: 'rgba(255,179,138,0.06)', border: '1px solid rgba(255,179,138,0.22)' }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] font-semibold text-ink-3">{protocol.id}</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
              style={{ background: cat.bg, color: cat.color }}>
              {protocol.category}
            </span>
          </div>
          <p className="m-0 mt-1 text-[13.5px] font-semibold text-ink-0">{protocol.name}</p>
          <p className="m-0 mt-1 text-[12px] text-ink-2 leading-relaxed">{protocol.desc}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-[11px] text-ink-3">
          {protocol.department} · <span className="text-warn">{protocol.waitingMins} min waiting</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onReject}
            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-bg-3 text-ink-1 border border-line hover:bg-bg-2 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={onApprove}
            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white transition-colors"
            style={{ background: 'rgba(110,226,185,0.18)', color: '#6ee2b9', border: '1px solid rgba(110,226,185,0.30)' }}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  )
}

function ActiveCard({ protocol }) {
  const cat = categoryColors[protocol.category] || categoryColors.System
  return (
    <div className="flex items-start gap-3.5 px-4 py-3 rounded-[10px] bg-bg-2 border border-line-soft">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[11px] font-semibold text-ink-3">{protocol.id}</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
            style={{ background: cat.bg, color: cat.color }}>
            {protocol.category}
          </span>
        </div>
        <p className="m-0 mt-0.5 text-[13px] font-semibold text-ink-0">{protocol.name}</p>
        <p className="m-0 mt-0.5 text-[11.5px] text-ink-3">{protocol.department} · Since {protocol.triggered}</p>
      </div>
      <span className="flex-shrink-0 flex items-center gap-1.5 text-[11px] font-semibold text-ok mt-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-ok" aria-hidden="true" />
        Active
      </span>
    </div>
  )
}
