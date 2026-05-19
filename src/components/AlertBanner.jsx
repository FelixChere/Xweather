import { useState } from 'react'
import { AlertIcon } from './Icons.jsx'
import AlertDetailPanel from './AlertDetailPanel.jsx'

export default function AlertBanner({ setPage }) {
  const [state, setState] = useState('visible') // 'visible' | 'leaving' | 'gone'
  const [detailOpen, setDetailOpen] = useState(false)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function dismiss() {
    setState('leaving')
    setTimeout(() => setState('gone'), 400)
  }

  if (state === 'gone') return null



  return (
    <>
    {detailOpen && <AlertDetailPanel onClose={() => setDetailOpen(false)} setPage={setPage} onAcknowledge={() => { setDetailOpen(false); setState('leaving'); setTimeout(() => setState('gone'), 400) }} />}
    <div
      style={{
        overflow: 'hidden',
        maxHeight: state === 'leaving' ? '0px'  : '200px',
        opacity:   state === 'leaving' ? 0      : 1,
        marginBottom: state === 'leaving' ? '0px' : undefined,
        transition: reducedMotion ? 'none' : 'max-height 380ms ease, opacity 240ms ease, margin-bottom 380ms ease',
      }}
      className="mb-4 md:mb-5 xl:mb-6"
    >
      <div
        data-tour="alert-banner"
        className="grid grid-cols-[auto_1fr_auto] gap-4 md:gap-5 xl:gap-6 items-center rounded-card border border-accent/35 px-4 md:px-5 xl:px-6 py-3.5"
        style={{
          background: 'linear-gradient(90deg, rgba(255,138,76,0.10), rgba(255,138,76,0.02) 70%), #11151d',
          borderLeft: '3px solid #ff8a4c',
        }}
      >
        <div className="w-[38px] h-[38px] rounded-[10px] grid place-items-center text-accent" style={{ background: 'rgba(255,138,76,0.15)' }}>
          <AlertIcon className="w-[18px] h-[18px]" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <span
              className="text-[10.5px] uppercase tracking-[0.08em] px-2 py-0.5 rounded font-semibold text-accent border"
              style={{ background: 'rgba(255,138,76,0.10)', borderColor: 'rgba(255,138,76,0.35)' }}
            >
              Heat Advisory · Level 2
            </span>
            <span className="text-[14.5px] font-semibold">
              Sensor cluster in Central Campus exceeded threshold
            </span>
          </div>
          <div className="text-ink-1 text-[13px]">
            2 nodes have measured above 88°F for more than 120 minutes. Departmental protocols have been triggered automatically.
          </div>
          <div className="text-ink-3 text-xs mt-1 flex gap-3.5">
            <span><strong className="text-ink-1 font-medium">Affected zones:</strong> Zone 4, Zone 9</span>
            <span><strong className="text-ink-1 font-medium">Triggered:</strong> 12:18 PST</span>
            <span><strong className="text-ink-1 font-medium">Protocol:</strong> HEAT-2A</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={dismiss}
            className="px-3.5 py-2 rounded-lg text-[12.5px] font-medium border border-line bg-bg-2 text-ink-0 hover:bg-bg-3 transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={() => setDetailOpen(true)}
            className="px-3.5 py-2 rounded-lg text-[12.5px] font-medium bg-accent-strong text-[#20120a] hover:brightness-110 transition-all"
          >
            View details
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
