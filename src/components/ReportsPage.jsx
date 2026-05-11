import { useState } from 'react'
import AlertBanner from './AlertBanner.jsx'
import { departments } from './DepartmentalThresholdsPage.jsx'

// ── Mock past incidents ───────────────────────────────────────────────────────

const pastIncidents = [
  { id: 'INC-2025-041', date: 'Apr 14, 2025', type: 'Heat Advisory',  level: 2, duration: '3h 12m', zones: 'Zone 4, Zone 9',      status: 'Closed', units: 4, depts: 6 },
  { id: 'INC-2025-029', date: 'Mar 28, 2025', type: 'Heat Advisory',  level: 1, duration: '1h 48m', zones: 'Zone 7',              status: 'Closed', units: 2, depts: 3 },
  { id: 'INC-2024-118', date: 'Sep 2, 2024',  type: 'Heat Emergency', level: 3, duration: '6h 05m', zones: 'Zone 2, 4, 6, 9',    status: 'Closed', units: 6, depts: 8 },
  { id: 'INC-2024-089', date: 'Jul 17, 2024', type: 'Heat Advisory',  level: 2, duration: '2h 33m', zones: 'Zone 4, Zone 6',     status: 'Closed', units: 3, depts: 5 },
]

const sensors = [
  { id: 'SEN-01', label: 'U District',           temp: 96.8,  threshold: 95, status: 'exceeded' },
  { id: 'SEN-02', label: 'Red Square',            temp: 98.2,  threshold: 95, status: 'exceeded' },
  { id: 'SEN-03', label: 'College of Environment',temp: 73.6,  threshold: 95, status: 'normal'   },
  { id: 'SEN-04', label: 'Stadium',               temp: 101.4, threshold: 95, status: 'exceeded' },
]

const timeline = [
  { time: '12:17 PST', icon: '●', color: '#ff6b6b', title: 'Threshold breach detected',     body: 'SEN-01 (U District) and SEN-04 (Stadium) crossed 95°F threshold. Automated monitoring escalated.' },
  { time: '12:18 PST', icon: '●', color: '#ffb38a', title: 'Heat Advisory Level 2 declared', body: 'XWeather system automatically declared Heat Advisory Level 2. Protocol HEAT-2A activated.' },
  { time: '12:18 PST', icon: '●', color: '#7cc8ff', title: 'Department notifications sent',  body: 'All 8 department leads notified via automated alert system.' },
  { time: '12:18 PST', icon: '●', color: '#7cc8ff', title: 'RU-02 dispatched',               body: 'Facilities Response Team dispatched to Zone 4 — Red Square.' },
  { time: '12:19 PST', icon: '●', color: '#7cc8ff', title: 'RU-03 dispatched',               body: 'Campus Safety Unit en route to Zone 9 — Stadium.' },
  { time: '12:20 PST', icon: '●', color: '#6ee2b9', title: 'UW Facilities Services resolved',body: 'Tom Reyes confirmed receipt and activated Zone 6 cooling protocol.' },
  { time: '12:21 PST', icon: '●', color: '#6ee2b9', title: 'UW Medicine resolved',           body: 'Dr. James Okafor confirmed — Zone 2 pre-cooling underway.' },
  { time: '12:22 PST', icon: '●', color: '#6ee2b9', title: 'UW Atmospheric Sciences resolved',body: 'Prof. Linda Wu confirmed — field equipment check initiated.' },
  { time: '12:23 PST', icon: '●', color: '#6ee2b9', title: 'UW Public Health resolved',      body: 'Dr. Sarah Chen confirmed — outdoor access restrictions in Zone 4 enforced.' },
  { time: '12:26 PST', icon: '●', color: '#6ee2b9', title: 'UW Campus Energy resolved',      body: 'Kevin Park confirmed — HVAC override active across Zone 9.' },
]

const levelColor = { 1: '#6ee2b9', 2: '#ffb38a', 3: '#ff6b6b' }

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ReportsPage({ units = [], resolvedExceeded = new Set() }) {
  const [exported, setExported]   = useState(false)
  const [expandedInc, setExpandedInc] = useState(null)

  const exceededCount = departments.filter(d => d.status === 'exceeded' && !resolvedExceeded.has(d.id)).length
  const resolvedCount = departments.filter(d => d.acknowledged || resolvedExceeded.has(d.id)).length
  const deployedUnits = units.filter(u => u.status !== 'ready')

  function handleExport() {
    setExported(true)
    setTimeout(() => setExported(false), 3000)
  }

  return (
    <div className="flex flex-col gap-4 md:gap-5 xl:gap-6">
      {exported && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-[12px] text-[13px] font-medium text-ink-0"
          style={{ background: '#1a2540', border: '1px solid rgba(110,226,185,0.35)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
          role="status" aria-live="polite">
          <span className="w-2 h-2 rounded-full bg-ok flex-shrink-0" aria-hidden="true" />
          Report exported as PDF
        </div>
      )}

      <AlertBanner />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="m-0 text-[18px] font-bold text-ink-0 tracking-[-0.01em]">Reports</h1>
          <p className="m-0 mt-0.5 text-[12.5px] text-ink-3">Incident documentation and history</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-semibold transition-all hover:brightness-110"
          style={{ background: 'linear-gradient(180deg,#7cc8ff,#5ab0f0)', color: '#0b1520', boxShadow: '0 4px 12px rgba(124,200,255,0.25)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export Report
        </button>
      </div>

      {/* Current incident report */}
      <div className="bg-bg-1 border border-line rounded-card overflow-hidden">

        {/* Report header */}
        <div className="px-6 py-5 flex items-start justify-between gap-4 flex-wrap"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(90deg, rgba(255,138,76,0.07), transparent 60%)' }}>
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-warn"
                style={{ background: 'rgba(255,179,138,0.15)', border: '1px solid rgba(255,179,138,0.30)' }}>
                ● Active
              </span>
              <span className="text-[11px] text-ink-3 font-mono">INC-2025-042</span>
            </div>
            <h2 className="m-0 text-[16px] font-bold text-ink-0">Heat Advisory — Level 2</h2>
            <p className="m-0 mt-1 text-[12.5px] text-ink-3">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · Initiated 12:17 PST · Active for 23 min · Protocol HEAT-2A
            </p>
          </div>
          <div className="flex flex-col gap-1.5 text-right">
            <Stat label="Zones affected" value="Zone 4, Zone 9" />
            <Stat label="Sensors exceeded" value={`${sensors.filter(s => s.status === 'exceeded').length} / ${sensors.length}`} />
            <Stat label="Departments notified" value={`${departments.length}`} />
          </div>
        </div>

        <div className="divide-y" style={{ '--tw-divide-opacity': 0.07 }}>

          {/* Executive summary */}
          <Section title="Executive Summary">
            <p className="m-0 text-[13px] text-ink-1 leading-[1.75]">
              At 12:17 PST on May 4, 2025, the XWeather sensor network detected heat threshold breaches at
              U District (96.8°F) and Stadium (101.4°F), both exceeding the 95°F departmental limit.
              A Level 2 Heat Advisory was automatically declared and Protocol HEAT-2A was activated.
              All {departments.length} department leads were notified within 60 seconds.{' '}
              {deployedUnits.length > 0
                ? `${deployedUnits.length} response unit${deployedUnits.length > 1 ? 's are' : ' is'} currently deployed in the field.`
                : 'All response units are currently on standby.'
              }{' '}
              As of the time of this report, {resolvedCount} of {departments.length} departments
              have confirmed receipt and {exceededCount > 0 ? `${exceededCount} zone${exceededCount > 1 ? 's remain' : ' remains'} above threshold.` : 'all zones are within threshold.'}
            </p>
          </Section>

          {/* Sensor readings */}
          <Section title="Sensor Readings at Time of Incident">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sensors.map(s => {
                const over  = s.temp > s.threshold
                const color = s.temp >= 100 ? '#ff6b6b' : s.temp >= 95 ? '#ffb38a' : '#6ee2b9'
                return (
                  <div key={s.id} className="rounded-[10px] px-4 py-3"
                    style={{ background: `${color}0d`, border: `1px solid ${color}25` }}>
                    <p className="m-0 text-[10px] uppercase tracking-[0.07em] text-ink-3 font-semibold">{s.id}</p>
                    <p className="m-0 mt-0.5 text-[12px] font-medium text-ink-1 leading-snug">{s.label}</p>
                    <p className="m-0 mt-2 text-[22px] font-bold leading-none" style={{ color }}>{s.temp}°F</p>
                    <p className="m-0 mt-1 text-[11px]" style={{ color: over ? '#ff6b6b' : '#6ee2b9' }}>
                      {over ? `+${(s.temp - s.threshold).toFixed(1)}°F over limit` : 'Within limit'}
                    </p>
                  </div>
                )
              })}
            </div>
          </Section>

          {/* Timeline */}
          <Section title="Incident Timeline">
            <div className="flex flex-col gap-0">
              {timeline.map((e, i) => (
                <div key={i} className="flex gap-4 relative">
                  {/* Spine line */}
                  {i < timeline.length - 1 && (
                    <div className="absolute left-[5px] top-5 bottom-0 w-[1px]"
                      style={{ background: 'rgba(255,255,255,0.08)' }} />
                  )}
                  <div className="flex flex-col items-center pt-1 flex-shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 z-10"
                      style={{ background: e.color }} aria-hidden="true" />
                  </div>
                  <div className="pb-5 flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-0.5">
                      <span className="font-mono text-[11px] text-ink-3 flex-shrink-0">{e.time}</span>
                      <span className="text-[13px] font-semibold text-ink-0">{e.title}</span>
                    </div>
                    <p className="m-0 text-[12.5px] text-ink-3 leading-relaxed">{e.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Departmental response */}
          <Section title="Departmental Response Summary">
            <div className="flex flex-col gap-2">
              {departments.map(d => {
                const exceeded = d.status === 'exceeded'
                const solved   = !!d.acknowledged
                const color    = exceeded ? '#ff6b6b' : solved ? '#6ee2b9' : '#ffb38a'
                return (
                  <div key={d.id} className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-[10px] bg-bg-2 border border-line-soft">
                    <span className="text-[12.5px] text-ink-1 truncate">{d.name}</span>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-mono text-[12px] text-ink-3">{d.zone} · {d.currentTemp}°F</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                        {exceeded ? 'Exceeded' : solved ? 'Solved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Section>

        </div>
      </div>

      {/* Incident history */}
      <section>
        <h2 className="m-0 mb-3 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-ink-3">
          Incident History
        </h2>
        <div className="bg-bg-1 border border-line rounded-card overflow-hidden">
          {pastIncidents.map((inc, i) => {
            const expanded = expandedInc === inc.id
            const color = levelColor[inc.level]
            return (
              <div key={inc.id} style={{ borderBottom: i < pastIncidents.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <button
                  onClick={() => setExpandedInc(expanded ? null : inc.id)}
                  className="w-full text-left flex items-center gap-4 px-5 py-3.5 hover:bg-bg-2 transition-colors flex-wrap"
                  aria-expanded={expanded}
                >
                  <span className="font-mono text-[11.5px] text-ink-3 flex-shrink-0">{inc.id}</span>
                  <span className="text-[12.5px] text-ink-3 flex-shrink-0">{inc.date}</span>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-[12.5px] font-medium text-ink-1 truncate">{inc.type}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                      Level {inc.level}
                    </span>
                  </div>
                  <span className="text-[12px] text-ink-3 flex-shrink-0">{inc.duration}</span>
                  <span className="text-[12px] text-ink-3 flex-shrink-0 hidden lg:block">{inc.zones}</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 bg-ok/10 text-ok">{inc.status}</span>
                  <span className="text-ink-3 text-[14px] transition-transform flex-shrink-0"
                    style={{ transform: expanded ? 'rotate(90deg)' : 'none' }} aria-hidden="true">›</span>
                </button>
                {expanded && (
                  <div className="px-5 pb-4 pt-1 grid grid-cols-2 md:grid-cols-4 gap-3"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                    {[
                      { label: 'Zones Affected', value: inc.zones },
                      { label: 'Duration',        value: inc.duration },
                      { label: 'Units Deployed',  value: `${inc.units} units` },
                      { label: 'Depts Notified',  value: `${inc.depts} departments` },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="m-0 text-[10px] uppercase tracking-[0.07em] text-ink-3">{label}</p>
                        <p className="m-0 mt-0.5 text-[13px] font-medium text-ink-1">{value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="px-6 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <h3 className="m-0 mb-4 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-ink-3">{title}</h3>
      {children}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="flex items-center gap-2 justify-end">
      <span className="text-[11.5px] text-ink-3">{label}</span>
      <span className="text-[12px] font-semibold text-ink-1">{value}</span>
    </div>
  )
}
