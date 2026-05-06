import { useState, useEffect, useRef } from 'react'
import { AlertIcon } from './Icons.jsx'

const LEVELS = [
  {
    value: 1,
    label: 'Level 1 — Precautionary',
    desc: 'Campus-wide advisory. Department heads notified. No protocol activation.',
    color: '#ffb38a',
    bg: 'rgba(255,179,138,0.08)',
    border: 'rgba(255,179,138,0.30)',
  },
  {
    value: 2,
    label: 'Level 2 — Active',
    desc: 'Departmental protocols activated. All 8 department leads contacted immediately.',
    color: '#ff8a4c',
    bg: 'rgba(255,138,76,0.10)',
    border: 'rgba(255,138,76,0.35)',
  },
  {
    value: 3,
    label: 'Level 3 — Critical',
    desc: 'Full emergency response. External services (EMS, City of Seattle) alerted. Campus closure may follow.',
    color: '#ff6b6b',
    bg: 'rgba(255,107,107,0.10)',
    border: 'rgba(255,107,107,0.40)',
  },
]

const DEPARTMENTS = [
  'UW Public Health Department',
  'UW Medicine',
  'UW Environmental Health & Safety',
  'UW Campus Energy, Utilities & Operations',
  'UW Department of Atmospheric Sciences',
  'UW Facilities Services',
  'UW Housing & Food Services',
  'UW Office of Student Life',
]

export default function EmergencyAlertModal({ onClose }) {
  const [level, setLevel] = useState(2)
  const [acknowledged, setAcknowledged] = useState(false)
  const [phase, setPhase] = useState('confirm') // 'confirm' | 'sending' | 'sent'
  const [entered, setEntered] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const cancelRef = useRef(null)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true))
    cancelRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape' && phase === 'confirm') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('keydown', onKey) }
  }, [phase])

  function handleClose() {
    if (reducedMotion) { onClose(); return }
    setLeaving(true)
    setTimeout(onClose, 280)
  }

  function handleDispatch() {
    setPhase('sending')
    setTimeout(() => setPhase('sent'), 2200)
  }

  const selectedLevel = LEVELS.find(l => l.value === level)
  const isVisible = entered && !leaving

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 motion-safe:transition-opacity motion-safe:duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={phase === 'confirm' ? handleClose : undefined}
      />

      {/* Modal */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none`}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="emergency-modal-title"
          className={`pointer-events-auto w-full max-w-[480px] rounded-[16px] overflow-hidden motion-safe:transition-[transform,opacity] motion-safe:duration-300 motion-safe:ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
          style={{ background: '#10141e', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
        >
          {phase === 'confirm' && (
            <ConfirmView
              level={level}
              setLevel={setLevel}
              selectedLevel={selectedLevel}
              acknowledged={acknowledged}
              setAcknowledged={setAcknowledged}
              onCancel={handleClose}
              onDispatch={handleDispatch}
              cancelRef={cancelRef}
            />
          )}
          {phase === 'sending' && <SendingView />}
          {phase === 'sent' && (
            <SentView
              selectedLevel={selectedLevel}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </>
  )
}

function ConfirmView({ level, setLevel, selectedLevel, acknowledged, setAcknowledged, onCancel, onDispatch, cancelRef }) {
  return (
    <>
      {/* Header */}
      <div className="px-6 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-[10px] grid place-items-center flex-shrink-0"
            style={{ background: 'rgba(255,107,107,0.15)' }}>
            <AlertIcon className="w-5 h-5 text-critical" aria-hidden="true" />
          </div>
          <div>
            <h2 id="emergency-modal-title" className="text-[15px] font-bold text-ink-0 m-0 leading-tight">
              Trigger Emergency Alert
            </h2>
            <p className="text-ink-3 text-[12px] mt-0.5 m-0">
              This will immediately notify all department leads and activate protocols.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5">
        {/* Alert level selector */}
        <div>
          <label className="text-[10.5px] font-semibold uppercase tracking-[0.09em] text-ink-3 block mb-2.5">
            Alert Level
          </label>
          <div className="flex flex-col gap-2">
            {LEVELS.map(l => (
              <button
                key={l.value}
                onClick={() => setLevel(l.value)}
                className="w-full text-left px-4 py-3 rounded-[10px] border transition-colors"
                style={{
                  background: level === l.value ? l.bg : 'rgba(255,255,255,0.03)',
                  borderColor: level === l.value ? l.border : 'rgba(255,255,255,0.08)',
                }}
                aria-pressed={level === l.value}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0 transition-colors"
                    style={{ background: level === l.value ? l.color : 'rgba(255,255,255,0.15)' }}
                    aria-hidden="true"
                  />
                  <span className="text-[13px] font-semibold" style={{ color: level === l.value ? l.color : '#c8cfde' }}>
                    {l.label}
                  </span>
                </div>
                <p className="text-ink-3 text-[11.5px] mt-1 ml-[22px] m-0 leading-relaxed">{l.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Acknowledgment */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={e => setAcknowledged(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded accent-critical flex-shrink-0"
            aria-required="true"
          />
          <span className="text-[12.5px] text-ink-1 leading-relaxed">
            I confirm this is a real emergency situation requiring immediate campus-wide response.
            I understand this action cannot be undone.
          </span>
        </label>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 flex gap-3">
        <button
          ref={cancelRef}
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-[10px] text-[13px] font-semibold bg-bg-3 text-ink-0 border border-line hover:bg-bg-2 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onDispatch}
          disabled={!acknowledged}
          className="flex-1 py-2.5 rounded-[10px] text-[13px] font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: acknowledged ? 'linear-gradient(180deg,#ff6b4c,#e8492a)' : '#e8492a',
            boxShadow: acknowledged ? '0 4px 14px rgba(232,73,42,0.35)' : 'none',
          }}
          aria-disabled={!acknowledged}
        >
          Dispatch Alert
        </button>
      </div>
    </>
  )
}

function SendingView() {
  return (
    <div className="px-6 py-12 flex flex-col items-center gap-4">
      <div className="relative w-12 h-12">
        <svg className="animate-spin w-12 h-12 text-critical" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="20" stroke="rgba(255,107,107,0.2)" strokeWidth="4" />
          <path d="M44 24a20 20 0 0 0-20-20" stroke="#ff6b6b" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-[15px] font-semibold text-ink-0 m-0">Dispatching Alert</p>
        <p className="text-ink-3 text-[12.5px] mt-1 m-0">Notifying all department leads…</p>
      </div>
    </div>
  )
}

function SentView({ selectedLevel, onClose }) {
  return (
    <>
      <div className="px-6 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] grid place-items-center flex-shrink-0"
            style={{ background: 'rgba(110,226,185,0.15)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10l4.5 4.5L16 6" stroke="#6ee2b9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-ok m-0 leading-tight">Alert Dispatched</h2>
            <p className="text-ink-3 text-[12px] mt-0.5 m-0">{selectedLevel.label} · Sent just now</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.09em] text-ink-3 m-0 mb-2.5">
          Departments Notified
        </p>
        <div className="flex flex-col gap-1.5">
          {DEPARTMENTS.map(d => (
            <div key={d} className="flex items-center gap-2.5 text-[12.5px] text-ink-1">
              <span className="w-1.5 h-1.5 rounded-full bg-ok flex-shrink-0" aria-hidden="true" />
              {d}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={onClose}
          autoFocus
          className="w-full py-2.5 rounded-[10px] text-[13px] font-semibold bg-bg-3 text-ink-0 border border-line hover:bg-bg-2 transition-colors"
        >
          Done
        </button>
      </div>
    </>
  )
}
