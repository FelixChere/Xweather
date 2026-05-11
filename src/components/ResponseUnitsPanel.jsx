import { useState, useEffect, useRef } from 'react'

const initialUnits = [
  {
    id: 'RU-01',
    name: 'Emergency Medical Team Alpha',
    type: 'Medical',
    status: 'ready',
    location: 'Health Sciences Hub',
    eta: null,
    members: 4,
  },
  {
    id: 'RU-02',
    name: 'Facilities Response Team',
    type: 'Facilities',
    status: 'deployed',
    location: 'Zone 4 — Red Square',
    eta: '2 min',
    members: 3,
  },
  {
    id: 'RU-03',
    name: 'Campus Safety Unit',
    type: 'Safety',
    status: 'en-route',
    location: 'En route to Zone 9',
    eta: '4 min',
    members: 2,
  },
  {
    id: 'RU-04',
    name: 'Environmental Health Team',
    type: 'Environmental',
    status: 'ready',
    location: 'EH&S Building',
    eta: null,
    members: 3,
  },
  {
    id: 'RU-05',
    name: 'Utilities Emergency Crew',
    type: 'Utilities',
    status: 'ready',
    location: 'Power Plant — West',
    eta: null,
    members: 2,
  },
  {
    id: 'RU-06',
    name: 'Student Services Support',
    type: 'Support',
    status: 'ready',
    location: 'HUB Building',
    eta: null,
    members: 5,
  },
]

const typeColors = {
  Medical:      { color: '#ff6b6b', bg: 'rgba(255,107,107,0.10)' },
  Facilities:   { color: '#7cc8ff', bg: 'rgba(124,200,255,0.10)' },
  Safety:       { color: '#ffb38a', bg: 'rgba(255,179,138,0.10)' },
  Environmental:{ color: '#6ee2b9', bg: 'rgba(110,226,185,0.10)' },
  Utilities:    { color: '#8893a8', bg: 'rgba(136,147,168,0.10)' },
  Support:      { color: '#7cc8ff', bg: 'rgba(124,200,255,0.10)' },
}

const statusConfig = {
  ready:    { label: 'Ready',     color: '#6ee2b9', bg: 'rgba(110,226,185,0.12)' },
  deployed: { label: 'Deployed',  color: '#ff6b6b', bg: 'rgba(255,107,107,0.12)' },
  'en-route': { label: 'En Route', color: '#ffb38a', bg: 'rgba(255,179,138,0.12)' },
}

const ZONES = ['Zone 4 — Red Square', 'Zone 9 — Stadium', 'Zone 2 — Engineering', 'Zone 7 — North Campus']

export { initialUnits }

export default function ResponseUnitsPanel({ onClose, units, setUnits }) {
  const [dispatchTarget, setDispatchTarget] = useState(null)
  const [selectedZone, setSelectedZone] = useState(ZONES[0])
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

  function dispatch(unitId) {
    setUnits(prev => prev.map(u =>
      u.id === unitId
        ? { ...u, status: 'en-route', location: `En route to ${selectedZone}`, eta: `${Math.floor(Math.random() * 5) + 2} min` }
        : u
    ))
    setDispatchTarget(null)
  }

  const ready    = units.filter(u => u.status === 'ready')
  const deployed = units.filter(u => u.status !== 'ready')
  const isVisible = entered && !leaving

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 motion-safe:transition-opacity motion-safe:duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="response-panel-title"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[90vw] md:max-w-[520px] flex flex-col overflow-hidden rounded-l-[16px] motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background: '#10141e', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 id="response-panel-title" className="m-0 text-[15px] font-bold text-ink-0">
                Response Units
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-ok/10 text-ok">
                {ready.length} ready
              </span>
              {deployed.length > 0 && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-critical/10 text-critical">
                  {deployed.length} deployed
                </span>
              )}
            </div>
            <p className="text-ink-3 text-[12px] mt-0.5 m-0">Avg ETA · 4 min across all active units</p>
          </div>
          <button
            ref={closeRef}
            onClick={handleClose}
            aria-label="Close response units panel"
            className="w-8 h-8 grid place-items-center rounded-lg text-ink-2 hover:text-ink-0 hover:bg-bg-2 transition-colors flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scroll-area px-6 py-5 flex flex-col gap-6">

          {/* Deployed / En Route */}
          {deployed.length > 0 && (
            <section>
              <h3 className="m-0 mb-3 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-ink-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-critical inline-block" aria-hidden="true" />
                Active in Field
              </h3>
              <div className="flex flex-col gap-2.5">
                {deployed.map(u => <UnitCard key={u.id} unit={u} />)}
              </div>
            </section>
          )}

          {/* Ready units */}
          <section>
            <h3 className="m-0 mb-3 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-ink-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ok inline-block" aria-hidden="true" />
              Standby
            </h3>
            <div className="flex flex-col gap-2.5">
              {ready.map(u => (
                <UnitCard
                  key={u.id}
                  unit={u}
                  onDispatch={() => setDispatchTarget(u.id)}
                  isDispatchTarget={dispatchTarget === u.id}
                  selectedZone={selectedZone}
                  setSelectedZone={setSelectedZone}
                  zones={ZONES}
                  onConfirmDispatch={() => dispatch(u.id)}
                  onCancelDispatch={() => setDispatchTarget(null)}
                />
              ))}
            </div>
          </section>
        </div>
      </aside>
    </>
  )
}

function UnitCard({ unit, onDispatch, isDispatchTarget, selectedZone, setSelectedZone, zones, onConfirmDispatch, onCancelDispatch }) {
  const type   = typeColors[unit.type]   || typeColors.Support
  const status = statusConfig[unit.status]

  return (
    <div
      className="rounded-[12px] border transition-colors"
      style={{
        background: isDispatchTarget ? 'rgba(124,200,255,0.06)' : '#161b25',
        borderColor: isDispatchTarget ? 'rgba(124,200,255,0.25)' : 'rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex items-start gap-3.5 px-4 py-3.5">
        {/* Type badge */}
        <div className="w-9 h-9 rounded-lg grid place-items-center flex-shrink-0 mt-0.5"
          style={{ background: type.bg }}>
          <span className="text-[10px] font-bold" style={{ color: type.color }}>
            {unit.id.split('-')[1]}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="m-0 text-[13px] font-semibold text-ink-0 leading-snug">{unit.name}</p>
              <p className="m-0 mt-0.5 text-[11.5px] text-ink-3">
                {unit.location}
                {unit.eta && <span className="text-warn"> · ETA {unit.eta}</span>}
              </p>
            </div>
            <span
              className="flex-shrink-0 text-[10.5px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <span className="text-[11px] text-ink-3"
              style={{ color: type.color, background: type.bg, padding: '2px 8px', borderRadius: 999 }}>
              {unit.type}
            </span>
            <span className="text-[11px] text-ink-3">{unit.members} members</span>
          </div>
        </div>
      </div>

      {/* Dispatch controls */}
      {onDispatch && !isDispatchTarget && (
        <div className="px-4 pb-3.5 flex justify-end">
          <button
            onClick={onDispatch}
            className="text-[12px] font-semibold px-3.5 py-1.5 rounded-lg transition-colors"
            style={{ background: 'rgba(124,200,255,0.10)', color: '#7cc8ff', border: '1px solid rgba(124,200,255,0.22)' }}
          >
            Dispatch →
          </button>
        </div>
      )}

      {isDispatchTarget && (
        <div className="px-4 pb-4 flex flex-col gap-2.5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 12, marginTop: 4 }}>
          <label className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">
            Dispatch to
          </label>
          <select
            value={selectedZone}
            onChange={e => setSelectedZone(e.target.value)}
            className="w-full bg-bg-3 border border-line text-ink-0 text-[13px] rounded-lg px-3 py-2 outline-none focus-visible:border-info/50"
          >
            {zones.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
          <div className="flex gap-2">
            <button
              onClick={onCancelDispatch}
              className="flex-1 py-2 rounded-lg text-[12.5px] font-semibold bg-bg-3 text-ink-1 border border-line hover:bg-bg-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmDispatch}
              className="flex-1 py-2 rounded-lg text-[12.5px] font-semibold text-white transition-colors"
              style={{ background: 'linear-gradient(180deg,#7cc8ff,#5ab0f0)', color: '#0b1520' }}
            >
              Confirm Dispatch
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
