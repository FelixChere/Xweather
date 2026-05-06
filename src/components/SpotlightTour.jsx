import { useState, useEffect } from 'react'

const TW = 316  // tooltip width

const STEPS = [
  {
    target:    null,
    placement: 'center',
    pad:       0,
    tag:       'Welcome',
    title:     'Welcome to XWeather Vigilant Lens',
    body:      "UW's real-time campus heat monitoring and emergency coordination platform. This tour highlights each area — you can interact with the dashboard as we go.",
    color:     '#7cc8ff',
  },
  {
    target:    '[data-tour="sidebar"]',
    placement: 'right',
    pad:       6,
    tag:       'Navigation',
    title:     'Six Dashboard Areas',
    body:      'Command Center, TempCast Analytics, Departmental Thresholds, Response Hub, Reports, and Settings. The badge on Departmental Thresholds shows the live exceeded count.',
    color:     '#6ee2b9',
  },
  {
    target:    '[data-tour="alert-banner"]',
    placement: 'below',
    pad:       6,
    tag:       'Alert System',
    title:     'Active Incident Alert',
    body:      'Appears automatically when a heat threshold is breached. Click "View Details" for affected zones, AI recommendations, and response actions.',
    color:     '#ffb38a',
  },
  {
    target:    '[data-tour="map"]',
    placement: 'inside-bottom',
    pad:       6,
    tag:       'Campus Map',
    title:     'Live Sensor Network',
    body:      'Four sensors report every 30 seconds. The colored heat blobs show temperature intensity by zone. Click any node to see live conditions and a 72h forecast.',
    color:     '#ff6b6b',
  },
  {
    target:    '[data-tour="minicards"] > div',
    placement: 'above',
    pad:       6,
    tag:       'Quick Stats',
    title:     'Active Protocols · Response Units · Network Health',
    body:      'Click any card to open the full panel — approve protocols, dispatch field units, or inspect sensor diagnostics.',
    color:     '#7cc8ff',
  },
  {
    target:    '[data-tour="emergency-btn"]',
    placement: 'right-bottom',
    pad:       8,
    tag:       'Emergency',
    title:     'Trigger Emergency Alert',
    body:      'Sends a campus-wide alert at Level 1, 2, or 3. Requires explicit acknowledgment before dispatching. Always reachable at the bottom of the sidebar.',
    color:     '#ff6b6b',
  },
]

const SIDEBAR_SELECTOR = '[data-tour="sidebar"]'

function useTargetRect(target) {
  const [rect,  setRect]  = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!target) { setRect(null); setReady(true); return }
    setRect(null)
    setReady(false)

    // Find the first on-screen match — avoids picking the mobile drawer duplicate
    // which is translated off-screen (left < 0) and has opacity:0
    const el = Array.from(document.querySelectorAll(target)).find(el => {
      const r = el.getBoundingClientRect()
      return r.width > 0 && r.height > 0 && r.left >= 0 && r.top >= 0
    })
    if (!el) { setReady(true); return }

    // Only scrollIntoView for main-content elements — sidebar doesn't scroll
    const sidebar = document.querySelector(SIDEBAR_SELECTOR)
    const inSidebar = sidebar?.contains(el)
    if (!inSidebar) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })

    const t = setTimeout(() => {
      const r = el.getBoundingClientRect()
      setRect({ x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, right: r.right, bottom: r.bottom, left: r.left })
      setReady(true)
    }, inSidebar ? 50 : 250)

    const onResize = () => {
      const r2 = el.getBoundingClientRect()
      setRect({ x: r2.x, y: r2.y, width: r2.width, height: r2.height, top: r2.top, right: r2.right, bottom: r2.bottom, left: r2.left })
    }
    window.addEventListener('resize', onResize)
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize) }
  }, [target])

  return { rect, ready }
}

function getTooltipStyle(rect, placement) {
  const sw = window.innerWidth, sh = window.innerHeight
  const TH = 230
  const GAP = 12
  const EDGE = 16

  if (!rect || placement === 'center') {
    return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }
  }

  const cx = rect.left + rect.width / 2

  switch (placement) {
    case 'right': {
      const cy = rect.top + rect.height / 2
      return {
        position: 'fixed',
        top:  Math.max(EDGE, Math.min(cy - TH / 2, sh - TH - EDGE)),
        left: Math.min(rect.right + GAP, sw - TW - EDGE),
      }
    }
    case 'left': {
      const cy = rect.top + rect.height / 2
      return {
        position: 'fixed',
        top:  Math.max(EDGE, Math.min(cy - TH / 2, sh - TH - EDGE)),
        left: Math.max(EDGE, rect.left - TW - GAP),
      }
    }
    case 'below':
      return {
        position: 'fixed',
        top:  Math.min(rect.bottom + GAP, sh - TH - EDGE),
        left: Math.max(EDGE, Math.min(cx - TW / 2, sw - TW - EDGE)),
      }
    case 'above':
      return {
        position: 'fixed',
        top:  Math.max(EDGE, rect.top - TH - GAP),
        left: Math.max(EDGE, Math.min(cx - TW / 2, sw - TW - EDGE)),
      }
    case 'right-bottom': {
      // Align tooltip bottom with target bottom — best for elements at screen bottom
      return {
        position: 'fixed',
        bottom:   Math.max(EDGE, sh - rect.bottom),
        top:      'auto',
        left:     Math.min(rect.right + GAP, sw - TW - EDGE),
      }
    }
    case 'inside-bottom':
      // Tooltip sits inside the spotlight in the bottom-left corner
      return {
        position: 'fixed',
        top:  Math.min(rect.bottom - TH - EDGE, sh - TH - EDGE),
        left: rect.left + EDGE,
      }
    default:
      // Auto: try below → above → right → left
      if (rect.bottom + GAP + TH < sh)
        return { position: 'fixed', top: rect.bottom + GAP, left: Math.max(EDGE, Math.min(cx - TW / 2, sw - TW - EDGE)) }
      if (rect.top - GAP - TH > 0)
        return { position: 'fixed', top: rect.top - GAP - TH, left: Math.max(EDGE, Math.min(cx - TW / 2, sw - TW - EDGE)) }
      if (rect.right + GAP + TW < sw)
        return { position: 'fixed', top: Math.max(EDGE, Math.min(rect.top, sh - TH - EDGE)), left: rect.right + GAP }
      return { position: 'fixed', top: Math.max(EDGE, Math.min(rect.top, sh - TH - EDGE)), left: Math.max(EDGE, rect.left - TW - GAP) }
  }
}

export default function SpotlightTour({ onDone }) {
  const [step, setStep] = useState(0)
  const current        = STEPS[step]
  const { rect, ready } = useTargetRect(current.target)
  const isLast         = step === STEPS.length - 1
  const isFirst        = step === 0

  // Don't render spotlight until the rect measurement is done — prevents blink
  if (!ready) return (
    <div className="fixed inset-0 z-[65] pointer-events-none"
      style={{ background: 'rgba(0,0,0,0.72)' }} />
  )

  const sw  = typeof window !== 'undefined' ? window.innerWidth  : 1200
  const sh  = typeof window !== 'undefined' ? window.innerHeight : 800
  const pad = current.pad

  const rx = rect ? rect.x      - pad : 0
  const ry = rect ? rect.y      - pad : 0
  const rw = rect ? rect.width  + pad * 2 : 0
  const rh = rect ? rect.height + pad * 2 : 0
  const rr = 10

  // Spotlight hole path (evenodd)
  const holePath = rect
    ? `M${rx + rr},${ry} h${rw - rr*2} a${rr},${rr} 0 0 1 ${rr},${rr} v${rh - rr*2} a${rr},${rr} 0 0 1 -${rr},${rr} h-${rw - rr*2} a${rr},${rr} 0 0 1 -${rr},-${rr} v-${rh - rr*2} a${rr},${rr} 0 0 1 ${rr},-${rr} z`
    : ''

  const tipStyle = getTooltipStyle(rect, current.placement)

  return (
    <>
      {/* Overlay */}
      <svg
        className="fixed inset-0 z-[65] pointer-events-none"
        width={sw} height={sh}
        viewBox={`0 0 ${sw} ${sh}`}
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          fill="rgba(0,0,0,0.72)"
          d={`M0,0 h${sw} v${sh} h-${sw} z ${holePath}`}
        />
        {rect && (
          <rect
            x={rx} y={ry} width={rw} height={rh} rx={rr}
            fill="none"
            stroke={current.color}
            strokeWidth="1.5"
            opacity="0.7"
          />
        )}
      </svg>

      {/* Tooltip */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="spotlight-title"
        className="z-[66] rounded-[14px] overflow-hidden"
        style={{
          ...tipStyle,
          width: TW,
          background: '#10141e',
          border: `1px solid ${current.color}45`,
          boxShadow: `0 16px 48px rgba(0,0,0,0.65), 0 0 0 1px ${current.color}18`,
          pointerEvents: 'all',
        }}
      >
        {/* Color bar */}
        <div className="h-[3px] transition-colors duration-300" style={{ background: current.color }} />

        <div className="px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.10em]"
              style={{ color: current.color }}>{current.tag}</span>
            <span className="text-[11px] text-ink-3">{step + 1} / {STEPS.length}</span>
          </div>

          <h2 id="spotlight-title" className="m-0 text-[14.5px] font-bold text-ink-0 leading-snug">
            {current.title}
          </h2>
          <p className="m-0 text-[12.5px] text-ink-2 leading-relaxed">{current.body}</p>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                aria-label={`Jump to step ${i + 1}`}
                className="rounded-full transition-all"
                style={{
                  width:  i === step ? 18 : 5,
                  height: 5,
                  background: i === step
                    ? current.color
                    : i < step
                    ? `${current.color}55`
                    : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={onDone}
              className="text-[12px] text-ink-3 hover:text-ink-1 transition-colors"
            >
              Skip tour
            </button>
            <div className="flex gap-2">
              {!isFirst && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-bg-3 text-ink-1 border border-line hover:bg-bg-2 transition-colors"
                >←</button>
              )}
              <button
                onClick={() => isLast ? onDone() : setStep(s => s + 1)}
                className="px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all hover:brightness-110"
                style={{ background: current.color, color: '#0b1520' }}
              >
                {isLast ? 'Get started' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
