import { useState, useEffect, useRef } from 'react'

const sensors = [
  {
    id: 'SEN-01',
    label: 'U District',
    location: 'U District',
    status: 'online',
    uptime: '99.8%',
    lastPing: '2s ago',
    signal: 92,
    battery: 87,
    temp: '96.8°F',
  },
  {
    id: 'SEN-02',
    label: 'Red Square',
    location: 'Red Square',
    status: 'online',
    uptime: '99.1%',
    lastPing: '4s ago',
    signal: 85,
    battery: 74,
    temp: '98.2°F',
  },
  {
    id: 'SEN-03',
    label: 'College of Environment',
    location: 'College of Environment',
    status: 'online',
    uptime: '100%',
    lastPing: '1s ago',
    signal: 97,
    battery: 91,
    temp: '73.6°F',
  },
  {
    id: 'SEN-04',
    label: 'Stadium',
    location: 'Husky Stadium',
    status: 'online',
    uptime: '98.6%',
    lastPing: '3s ago',
    signal: 78,
    battery: 62,
    temp: '101.4°F',
  },
]

const diagnostics = [
  { name: 'Data Pipeline',       status: 'operational', latency: '18ms'  },
  { name: 'Alert System',        status: 'operational', latency: '22ms'  },
  { name: 'XWeather API',        status: 'operational', latency: '45ms'  },
  { name: 'Department Relay',    status: 'operational', latency: '31ms'  },
  { name: 'Backup Data Store',   status: 'degraded',    latency: '210ms' },
]

const events = [
  { time: '14:28:04', type: 'info',    msg: 'SEN-04 signal strength dropped to 78% — monitoring.' },
  { time: '14:22:11', type: 'warn',    msg: 'Backup Data Store latency elevated above threshold.' },
  { time: '14:18:00', type: 'info',    msg: 'Sensor polling interval increased to 30s (MONITOR-2).' },
  { time: '14:17:43', type: 'ok',      msg: 'All 4 sensors confirmed online. Network initialised.' },
  { time: '13:55:20', type: 'warn',    msg: 'SEN-02 brief timeout (1.2s). Auto-reconnected.' },
  { time: '13:40:05', type: 'ok',      msg: 'Scheduled diagnostics passed — all systems nominal.' },
]

const eventStyle = {
  ok:   { color: '#6ee2b9', bg: 'rgba(110,226,185,0.10)' },
  warn: { color: '#ffb38a', bg: 'rgba(255,179,138,0.10)' },
  info: { color: '#7cc8ff', bg: 'rgba(124,200,255,0.10)' },
}

function SignalBar({ value }) {
  const color = value >= 85 ? '#6ee2b9' : value >= 65 ? '#ffb38a' : '#ff6b6b'
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end gap-[3px] h-3">
        {[25, 50, 75, 100].map((threshold, i) => (
          <div
            key={i}
            className="w-1.5 rounded-sm transition-colors"
            style={{
              height: `${(i + 1) * 25}%`,
              background: value >= threshold ? color : 'rgba(255,255,255,0.12)',
            }}
          />
        ))}
      </div>
      <span className="text-[11.5px] font-mono" style={{ color }}>{value}%</span>
    </div>
  )
}

function BatteryBar({ value }) {
  const color = value >= 70 ? '#6ee2b9' : value >= 40 ? '#ffb38a' : '#ff6b6b'
  return (
    <div className="flex items-center gap-2">
      <div className="w-[32px] h-[13px] rounded-[3px] border relative"
        style={{ borderColor: 'rgba(255,255,255,0.18)' }}>
        <div
          className="absolute inset-[2px] rounded-[2px] transition-all"
          style={{ width: `calc(${value}% - 4px)`, background: color }}
        />
        <div className="absolute -right-[4px] top-[3px] w-[3px] h-[7px] rounded-r-sm"
          style={{ background: 'rgba(255,255,255,0.18)' }} />
      </div>
      <span className="text-[11.5px] font-mono" style={{ color }}>{value}%</span>
    </div>
  )
}

export default function NetworkHealthPanel({ onClose }) {
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

  const isVisible = entered && !leaving
  const degraded = diagnostics.filter(d => d.status === 'degraded').length

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 motion-safe:transition-opacity motion-safe:duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="network-panel-title"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[520px] flex flex-col overflow-hidden rounded-l-[16px] motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background: '#10141e', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 id="network-panel-title" className="m-0 text-[15px] font-bold text-ink-0">
                Network Health
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-ok/10 text-ok">
                Operational
              </span>
              {degraded > 0 && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-warn/10 text-warn">
                  {degraded} degraded
                </span>
              )}
            </div>
            <p className="text-ink-3 text-[12px] mt-0.5 m-0">All 4 sensors reporting · Last checked 2s ago</p>
          </div>
          <button
            ref={closeRef}
            onClick={handleClose}
            aria-label="Close network health panel"
            className="w-8 h-8 grid place-items-center rounded-lg text-ink-2 hover:text-ink-0 hover:bg-bg-2 transition-colors flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scroll-area px-6 py-5 flex flex-col gap-6">

          {/* Overall score */}
          <div className="rounded-[12px] px-5 py-4 flex items-center gap-5"
            style={{ background: 'rgba(110,226,185,0.07)', border: '1px solid rgba(110,226,255,0.15)' }}>
            <div className="text-[42px] font-bold tracking-tight text-ok leading-none">99.4<span className="text-[24px]">%</span></div>
            <div>
              <p className="m-0 text-[13px] font-semibold text-ink-0">Overall Health Score</p>
              <p className="m-0 mt-1 text-[12px] text-ink-3 leading-relaxed">
                4/4 sensors online · {diagnostics.length - degraded}/{diagnostics.length} systems operational
              </p>
            </div>
          </div>

          {/* Sensor status */}
          <section>
            <h3 className="m-0 mb-3 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-ink-3">
              Sensor Status
            </h3>
            <div className="flex flex-col gap-2.5">
              {sensors.map(s => (
                <div key={s.id} className="rounded-[10px] px-4 py-3.5 bg-bg-2 border border-line-soft">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-ok" aria-hidden="true" />
                      <span className="text-[13px] font-semibold text-ink-0">{s.label}</span>
                      <span className="font-mono text-[11px] text-ink-3">{s.id}</span>
                    </div>
                    <span className="font-mono text-[12px] text-ink-2">{s.temp}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                    <div>
                      <p className="m-0 text-[10.5px] text-ink-3 uppercase tracking-[0.06em] mb-1">Signal</p>
                      <SignalBar value={s.signal} />
                    </div>
                    <div>
                      <p className="m-0 text-[10.5px] text-ink-3 uppercase tracking-[0.06em] mb-1">Battery</p>
                      <BatteryBar value={s.battery} />
                    </div>
                    <div>
                      <p className="m-0 text-[10.5px] text-ink-3 uppercase tracking-[0.06em]">Uptime</p>
                      <p className="m-0 text-[12px] font-mono text-ink-1 mt-0.5">{s.uptime}</p>
                    </div>
                    <div>
                      <p className="m-0 text-[10.5px] text-ink-3 uppercase tracking-[0.06em]">Last Ping</p>
                      <p className="m-0 text-[12px] font-mono text-ink-1 mt-0.5">{s.lastPing}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* System diagnostics */}
          <section>
            <h3 className="m-0 mb-3 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-ink-3">
              System Diagnostics
            </h3>
            <div className="flex flex-col gap-2">
              {diagnostics.map(d => {
                const isOk = d.status === 'operational'
                return (
                  <div key={d.name} className="flex items-center justify-between px-4 py-2.5 rounded-[10px] bg-bg-2 border border-line-soft">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: isOk ? '#6ee2b9' : '#ffb38a' }} aria-hidden="true" />
                      <span className="text-[13px] text-ink-0">{d.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11.5px] text-ink-3">{d.latency}</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: isOk ? 'rgba(110,226,185,0.10)' : 'rgba(255,179,138,0.10)', color: isOk ? '#6ee2b9' : '#ffb38a' }}>
                        {isOk ? 'OK' : 'Degraded'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Event log */}
          <section>
            <h3 className="m-0 mb-3 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-ink-3">
              Recent Events
            </h3>
            <div className="flex flex-col gap-2">
              {events.map((e, i) => {
                const style = eventStyle[e.type]
                return (
                  <div key={i} className="flex gap-3 px-4 py-2.5 rounded-[10px]"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="font-mono text-[11px] text-ink-3 flex-shrink-0 mt-0.5 w-[60px]">{e.time}</span>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[5px]"
                      style={{ background: style.color }} aria-hidden="true" />
                    <p className="m-0 text-[12px] text-ink-2 leading-relaxed">{e.msg}</p>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </aside>
    </>
  )
}
