import { useState, useEffect, useRef } from 'react'

const STEPS = [
  {
    tag:   'Welcome',
    title: 'Welcome to XWeather Vigilant Lens',
    body:  'UW\'s real-time campus heat monitoring and emergency coordination platform. This quick tour walks you through the key areas — feel free to interact with the dashboard as you go.',
    color: '#7cc8ff',
    hint:  null,
  },
  {
    tag:   'Campus Map',
    title: 'Live Sensor Map',
    body:  'Four sensors are deployed across campus, each reporting temperature in real time. The colored blobs show heat intensity by zone — red means hot, blue means cool.',
    color: '#ffb38a',
    hint:  'Try clicking a sensor node on the map to see live conditions and a 72h forecast.',
  },
  {
    tag:   'Navigation',
    title: 'Six Dashboard Areas',
    body:  'Use the sidebar to move between Command Center, TempCast Analytics, Departmental Thresholds, Response Hub, Reports, and Settings.',
    color: '#6ee2b9',
    hint:  'Try clicking "TempCast Analytics" in the sidebar now — then come back.',
  },
  {
    tag:   'TempCast',
    title: '72-Hour Heat Forecast',
    body:  'TempCast fuses National Weather Service data with on-campus sensor readings to predict temperature trends for the next 72 hours per zone.',
    color: '#ff6b6b',
    hint:  'Hover over the forecast chart to see temperatures at any point in time.',
  },
  {
    tag:   'Response',
    title: 'Emergency Coordination',
    body:  'During an active event: notify department leads from Departmental Thresholds, dispatch field units from Response Hub, and trigger a full emergency alert from the sidebar CTA.',
    color: '#ffb38a',
    hint:  'The "Trigger Emergency Alert" button is always visible at the bottom of the sidebar.',
  },
  {
    tag:   'Ready',
    title: 'You\'re all set',
    body:  'You can reopen this tour anytime via the Support link at the bottom of the sidebar. Stay safe and stay prepared.',
    color: '#6ee2b9',
    hint:  null,
  },
]

export default function OnboardingOverlay({ onDone }) {
  const [step, setStep]     = useState(0)
  const [entered, setEntered] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const closeRef = useRef(null)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true))
    closeRef.current?.focus()
    return () => cancelAnimationFrame(frame)
  }, [])

  function handleDone() {
    setLeaving(true)
    setTimeout(onDone, 280)
  }

  const current  = STEPS[step]
  const isLast   = step === STEPS.length - 1
  const isFirst  = step === 0
  const isVisible = entered && !leaving

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="tour-title"
      className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[340px] flex flex-col rounded-l-[16px] motion-safe:transition-transform motion-safe:duration-280 motion-safe:ease-out`}
      style={{
        background: '#10141e',
        borderLeft: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '-12px 0 40px rgba(0,0,0,0.40)',
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      }}
    >
      {/* Colored top accent */}
      <div className="h-1 w-full rounded-tl-[16px] transition-colors duration-300"
        style={{ background: current.color }} />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.10em]"
            style={{ color: current.color }}>
            {current.tag}
          </span>
          <span className="text-[11px] text-ink-3">
            {step + 1} / {STEPS.length}
          </span>
        </div>
        <button
          ref={closeRef}
          onClick={handleDone}
          aria-label="Close tour"
          className="w-7 h-7 grid place-items-center rounded-lg text-ink-2 hover:text-ink-0 hover:bg-bg-2 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-5 flex flex-col gap-4 overflow-y-auto">
        <h2 id="tour-title" className="m-0 text-[16px] font-bold text-ink-0 leading-snug">
          {current.title}
        </h2>
        <p className="m-0 text-[13px] text-ink-2 leading-[1.75]">
          {current.body}
        </p>

        {current.hint && (
          <div className="rounded-[10px] px-4 py-3.5 flex items-start gap-3"
            style={{ background: `${current.color}10`, border: `1px solid ${current.color}28` }}>
            <span className="text-[13px] flex-shrink-0 mt-0.5" aria-hidden="true">👆</span>
            <p className="m-0 text-[12.5px] leading-relaxed" style={{ color: current.color }}>
              {current.hint}
            </p>
          </div>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 py-3">
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            aria-label={`Go to step ${i + 1}`}
            className="rounded-full transition-all"
            style={{
              width:   i === step ? 20 : 6,
              height:  6,
              background: i === step
                ? current.color
                : i < step
                ? `${current.color}50`
                : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 flex items-center justify-between gap-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 16 }}>
        <button
          onClick={handleDone}
          className="text-[12.5px] text-ink-3 hover:text-ink-1 transition-colors"
        >
          Skip tour
        </button>
        <div className="flex items-center gap-2">
          {!isFirst && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-3.5 py-2 rounded-lg text-[12.5px] font-semibold bg-bg-3 text-ink-1 border border-line hover:bg-bg-2 transition-colors"
            >
              ← Back
            </button>
          )}
          <button
            onClick={() => isLast ? handleDone() : setStep(s => s + 1)}
            className="px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-all hover:brightness-110"
            style={{ background: current.color, color: '#0b1520' }}
          >
            {isLast ? 'Get started' : 'Next →'}
          </button>
        </div>
      </div>
    </aside>
  )
}
