import { useState, useEffect } from 'react'
import AlertBanner from './AlertBanner.jsx'

const ZONES = ['Zone 4 — Red Square', 'Zone 9 — Stadium', 'Zone 2 — Engineering', 'Zone 6 — Facilities', 'Zone 7 — North Campus']

const initialLog = [
  { time: '12:17 PST', unit: null,    msg: 'Heat event declared. Response Hub activated.', type: 'system' },
  { time: '12:18 PST', unit: 'RU-02', msg: 'RU-02 dispatched to Zone 4 — Red Square.',     type: 'dispatch' },
  { time: '12:19 PST', unit: 'RU-03', msg: 'RU-03 en route to Zone 9 — Stadium.',           type: 'dispatch' },
  { time: '12:22 PST', unit: null,    msg: 'All units accounted for. Standby units on alert.', type: 'system' },
]

const typeColors = {
  Medical:       { color: '#8893a8', bg: 'rgba(136,147,168,0.10)' },
  Facilities:    { color: '#8893a8', bg: 'rgba(136,147,168,0.10)' },
  Safety:        { color: '#8893a8', bg: 'rgba(136,147,168,0.10)' },
  Environmental: { color: '#8893a8', bg: 'rgba(136,147,168,0.10)' },
  Utilities:     { color: '#8893a8', bg: 'rgba(136,147,168,0.10)' },
  Support:       { color: '#8893a8', bg: 'rgba(136,147,168,0.10)' },
}

const statusStyle = {
  ready:      { label: 'Ready',      color: '#6ee2b9', bg: 'rgba(110,226,185,0.12)', border: 'rgba(110,226,185,0.25)' },
  'en-route': { label: 'En Route',   color: '#ffb38a', bg: 'rgba(255,179,138,0.12)', border: 'rgba(255,179,138,0.25)' },
  deployed:   { label: 'Deployed',   color: '#ff6b6b', bg: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.25)' },
}

const logTypeStyle = {
  dispatch: '#7cc8ff',
  system:   '#8893a8',
  recall:   '#6ee2b9',
}

function now() {
  const d = new Date()
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')} PST`
}

function useElapsed(startMinutes = 23) {
  const [elapsed, setElapsed] = useState(startMinutes)
  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 60000)
    return () => clearInterval(t)
  }, [])
  return elapsed >= 60
    ? `${Math.floor(elapsed / 60)}h ${elapsed % 60}m`
    : `${elapsed} min`
}

export default function ResponseHubPage({ units, setUnits }) {
  const [log, setLog]               = useState(initialLog)
  const elapsed = useElapsed(23)
  const [dispatchTarget, setDispatchTarget] = useState(null)
  const [selectedZone, setSelectedZone]     = useState(ZONES[0])
  const [recallTarget, setRecallTarget]     = useState(null)

  const ready    = units.filter(u => u.status === 'ready').length
  const enRoute  = units.filter(u => u.status === 'en-route').length
  const deployed = units.filter(u => u.status === 'deployed').length

  function dispatch(unitId, comment) {
    setUnits(prev => prev.map(u =>
      u.id === unitId
        ? { ...u, status: 'en-route', location: `En route to ${selectedZone}`, eta: `${Math.floor(Math.random() * 4) + 2} min` }
        : u
    ))
    setLog(prev => [...prev, {
      time: now(), unit: unitId,
      msg: `${unitId} dispatched to ${selectedZone}.${comment ? ` Note: ${comment}` : ''}`,
      type: 'dispatch',
    }])
    setDispatchTarget(null)
  }

  function recall(unitId, comment) {
    setUnits(prev => prev.map(u =>
      u.id === unitId
        ? { ...u, status: 'ready', location: 'Returning to base', eta: null }
        : u
    ))
    setLog(prev => [...prev, {
      time: now(), unit: unitId,
      msg: `${unitId} recalled — returning to base.${comment ? ` Reason: ${comment}` : ''}`,
      type: 'recall',
    }])
    setRecallTarget(null)
  }

  const activeAssignments = units.filter(u => u.status !== 'ready')

  return (
    <div className="flex flex-col gap-4 md:gap-5 xl:gap-6">
      {recallTarget && (
        <RecallModal
          unit={recallTarget}
          onConfirm={(comment) => recall(recallTarget.id, comment)}
          onClose={() => setRecallTarget(null)}
        />
      )}
      <AlertBanner />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="m-0 text-[18px] font-bold text-ink-0 tracking-[-0.01em]">Response Hub</h1>
          <p className="m-0 mt-0.5 text-[12.5px] text-ink-3">Field operations · Heat Advisory Level 2 · Active {elapsed}</p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <Chip value={ready}    label="Ready"     color="#6ee2b9" />
          <Chip value={enRoute}  label="En Route"  color="#ffb38a" />
          <Chip value={deployed} label="Deployed"  color="#ff6b6b" />
        </div>
      </div>

      {/* Unit cards */}
      <section>
        <h2 className="m-0 mb-3 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-ink-3">
          Field Units — {units.length} total
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 xl:gap-6">
          {units.map(unit => (
            <UnitCard
              key={unit.id}
              unit={unit}
              isDispatching={dispatchTarget === unit.id}
              selectedZone={selectedZone}
              zones={ZONES}
              onDispatch={() => setDispatchTarget(unit.id)}
              onCancelDispatch={() => setDispatchTarget(null)}
              onSelectZone={setSelectedZone}
              onConfirmDispatch={(comment) => dispatch(unit.id, comment)}
              onRecall={() => setRecallTarget(unit)}
            />
          ))}
        </div>
      </section>

      {/* Active assignments + log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 xl:gap-6">

        {/* Active assignments */}
        <section>
          <h2 className="m-0 mb-3 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-ink-3">
            Active Assignments
          </h2>
          <div className="bg-bg-1 border border-line rounded-card overflow-hidden">
            {activeAssignments.length === 0 && (
              <p className="text-ink-3 text-[13px] text-center py-8 m-0">No units currently deployed</p>
            )}
            {activeAssignments.map((u, i) => {
              const s = statusStyle[u.status]
              const tc = typeColors[u.type] || typeColors.Support
              return (
                <div key={u.id}
                  className="flex items-center gap-3.5 px-4 py-3.5"
                  style={{ borderBottom: i < activeAssignments.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <span className="font-mono text-[11px] font-bold flex-shrink-0" style={{ color: tc.color }}>{u.id}</span>
                  <div className="flex-1 min-w-0">
                    <p className="m-0 text-[13px] font-medium text-ink-0 truncate">{u.name}</p>
                    <p className="m-0 text-[11.5px] text-ink-3 mt-0.5">
                      {u.location}{u.eta && <span className="text-warn ml-2">ETA {u.eta}</span>}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                    {s.label}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Dispatch log */}
        <section>
          <h2 className="m-0 mb-3 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-ink-3">
            Dispatch Log
          </h2>
          <div className="bg-bg-1 border border-line rounded-card p-4 flex flex-col gap-3">
            {[...log].reverse().map((entry, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="font-mono text-[11px] text-ink-3 flex-shrink-0 w-[68px] mt-0.5">{entry.time}</span>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[5px]"
                  style={{ background: logTypeStyle[entry.type] }} aria-hidden="true" />
                <div className="min-w-0">
                  {entry.unit && (
                    <span className="font-mono text-[11px] font-semibold mr-1.5" style={{ color: '#7cc8ff' }}>{entry.unit}</span>
                  )}
                  <span className="text-[12.5px] text-ink-2">{entry.msg}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function RecallModal({ unit, onConfirm, onClose }) {
  const [comment, setComment] = useState('')
  const tc = typeColors[unit.type] || typeColors.Support

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-[400px] max-w-[min(400px,calc(100vw-2rem))] rounded-[16px] overflow-hidden"
          style={{ background: '#10141e', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
          role="dialog" aria-modal="true"
        >
          <div className="px-6 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <h2 className="m-0 text-[15px] font-bold text-ink-0">Recall Unit?</h2>
            <p className="m-0 mt-1 text-[12.5px] text-ink-3">This will remove the unit from its current assignment.</p>
          </div>

          <div className="px-6 py-5 flex flex-col gap-3">
            <div className="rounded-[10px] px-4 py-3.5 flex items-center gap-3"
              style={{ background: tc.bg, border: `1px solid ${tc.color}30` }}>
              <span className="font-mono text-[12px] font-bold" style={{ color: tc.color }}>{unit.id}</span>
              <div>
                <p className="m-0 text-[13px] font-semibold text-ink-0">{unit.name}</p>
                <p className="m-0 text-[11.5px] text-ink-3 mt-0.5">{unit.location}</p>
              </div>
            </div>
            <p className="m-0 text-[12.5px] text-ink-3 leading-relaxed">
              Recalling this unit will leave its assigned zone without coverage. Make sure another unit is available before proceeding.
            </p>
            <div>
              <label htmlFor="recall-comment" className="block text-[10.5px] font-semibold uppercase tracking-[0.09em] text-ink-3 mb-1.5">
                Reason for recall <span className="text-ink-3 normal-case tracking-normal font-normal">(optional)</span>
              </label>
              <textarea
                id="recall-comment"
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="e.g. Unit needed at higher-priority zone…"
                rows={3}
                className="w-full bg-bg-3 border border-line rounded-lg px-3 py-2.5 text-[12.5px] text-ink-0 placeholder:text-ink-3 resize-none outline-none focus-within:border-info/50 transition-colors"
              />
            </div>
          </div>

          <div className="px-6 pb-6 flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-[10px] text-[13px] font-semibold bg-bg-3 text-ink-0 border border-line hover:bg-bg-2 transition-colors">
              Cancel
            </button>
            <button onClick={() => onConfirm(comment)}
              className="flex-1 py-2.5 rounded-[10px] text-[13px] font-semibold transition-all hover:brightness-110"
              style={{ background: 'rgba(255,107,107,0.15)', color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.35)' }}>
              Confirm Recall
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function UnitCard({ unit, isDispatching, selectedZone, zones, onDispatch, onCancelDispatch, onSelectZone, onConfirmDispatch, onRecall }) {
  const [comment, setComment] = useState('')
  const s  = statusStyle[unit.status]
  const tc = typeColors[unit.type] || typeColors.Support

  return (
    <div
      className="bg-bg-1 border border-line rounded-card overflow-hidden"
      style={{ borderColor: isDispatching ? 'rgba(124,200,255,0.30)' : undefined }}
    >
      {/* Card header */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] font-bold" style={{ color: tc.color }}>{unit.id}</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: tc.bg, color: tc.color }}>{unit.type}</span>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
            {s.label}
          </span>
        </div>
        <p className="m-0 text-[13px] font-semibold text-ink-0 leading-snug">{unit.name}</p>
      </div>

      {/* Card body */}
      <div className="px-4 py-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11.5px] text-ink-3 truncate">{unit.location}</span>
          {unit.eta && <span className="text-[11.5px] font-semibold text-warn flex-shrink-0 ml-2">ETA {unit.eta}</span>}
        </div>
        <span className="text-[11.5px] text-ink-3">{unit.members} members</span>
      </div>

      {/* Dispatch controls */}
      {unit.status === 'ready' && !isDispatching && (
        <div className="px-4 pb-4">
          <button
            onClick={onDispatch}
            className="w-full py-2 rounded-lg text-[12.5px] font-semibold transition-colors"
            style={{ background: 'rgba(124,200,255,0.12)', color: '#7cc8ff', border: '1px solid rgba(124,200,255,0.25)' }}
          >
            Dispatch →
          </button>
        </div>
      )}

      {isDispatching && (
        <div className="px-4 pb-4 flex flex-col gap-2">
          <select
            value={selectedZone}
            onChange={e => onSelectZone(e.target.value)}
            className="w-full bg-bg-3 border border-line text-ink-0 text-[12.5px] rounded-lg px-3 py-2 outline-none"
          >
            {zones.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Add a note (optional)…"
            rows={2}
            className="w-full bg-bg-3 border border-line rounded-lg px-3 py-2 text-[12px] text-ink-0 placeholder:text-ink-3 resize-none outline-none focus-within:border-info/50 transition-colors"
          />
          <div className="flex gap-2">
            <button onClick={() => { onCancelDispatch(); setComment('') }}
              className="flex-1 py-2 rounded-lg text-[12px] font-semibold bg-bg-3 text-ink-1 border border-line hover:bg-bg-2 transition-colors">
              Cancel
            </button>
            <button onClick={() => { onConfirmDispatch(comment); setComment('') }}
              className="flex-1 py-2 rounded-lg text-[12px] font-semibold text-white transition-colors"
              style={{ background: 'linear-gradient(180deg,#7cc8ff,#5ab0f0)', color: '#0b1520' }}>
              Confirm
            </button>
          </div>
        </div>
      )}

      {unit.status !== 'ready' && (
        <div className="px-4 pb-4">
          <button
            onClick={onRecall}
            className="w-full py-2 rounded-lg text-[12.5px] font-semibold transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#8893a8', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            Recall Unit
          </button>
        </div>
      )}
    </div>
  )
}

function Chip({ value, label, color }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-2 border border-line">
      <span className="text-[14px] font-bold" style={{ color }}>{value}</span>
      <span className="text-[11.5px] text-ink-3">{label}</span>
    </div>
  )
}
