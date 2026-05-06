import { FlaskIcon, ServerIcon, TrophyIcon, ZapIcon, CloudIcon, WrenchIcon, HomeIcon, UsersIcon } from './Icons.jsx'
import { departments as deptData } from './DepartmentalThresholdsPage.jsx'

const statusMap = {
  exceeded: { label: 'Exceeded', color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)', cls: 'bg-critical/10 text-critical' },
  stable:   { label: 'Stable',   color: '#7cc8ff', bg: 'rgba(124,200,255,0.1)', cls: 'bg-info/10 text-info' },
  nominal:  { label: 'Nominal',  color: '#6ee2b9', bg: 'rgba(110,226,185,0.1)', cls: 'bg-ok/10 text-ok' },
}

const departments = deptData.map(d => {
  const s = statusMap[d.status] || statusMap.nominal
  return {
    name:        d.name,
    sub:         `${d.zone} · ${d.currentTemp}°F · limit ${d.threshold}°F`,
    Icon:        d.Icon,
    iconColor:   s.color,
    iconBg:      s.bg,
    statusLabel: s.label,
    statusClass: s.cls,
  }
})


export default function SideRail({ setPage }) {
  return (
    <aside className="flex flex-col gap-3.5 h-full">
      {/* Thermal Load */}
      <Card>
        <CardHeader>
          <span>Campus Thermal Load</span>
          <span className="text-[11px] font-semibold bg-critical/10 text-critical px-[7px] py-0.5 rounded-full normal-case tracking-normal">
            ↑ 12%
          </span>
        </CardHeader>

        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-[30px] font-bold tracking-[-0.02em] text-critical leading-none">
            Critical
          </span>
          <span className="text-ink-2 text-xs">72 / 100</span>
        </div>

        <Sparkline />

        <div className="h-1.5 bg-bg-3 rounded-full overflow-hidden mt-3.5 relative">
          <div className="h-full progress-fill rounded-full" style={{ width: '72%' }} />
        </div>

        <div className="grid grid-cols-3 gap-3.5 mt-3.5 pt-3.5 border-t border-line-soft">
          <Stat label="Peak" value="104.2°F" />
          <Stat label="Mean" value="88.7°F" />
          <Stat label="Active" value="4 / 4" />
        </div>
      </Card>

      {/* Departmental Thresholds – stretches to bottom of map */}
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader>
          Departmental Thresholds
          <button
            onClick={() => setPage?.('thresholds')}
            className="text-[11px] font-semibold normal-case tracking-normal transition-colors"
            style={{ color: '#7cc8ff' }}
          >
            View all →
          </button>
        </CardHeader>
        <div className="flex flex-col gap-2.5 mt-3 overflow-y-auto scroll-area flex-1 min-h-0 pr-0.5">
          {departments.map((d) => (
            <DeptRow key={d.name} {...d} />
          ))}
        </div>
      </Card>
    </aside>
  )
}

function Card({ children, className = '' }) {
  return <div className={`bg-bg-1 border border-line rounded-card p-4 ${className}`}>{children}</div>
}

function CardHeader({ children }) {
  return (
    <h4 className="m-0 mb-1 text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-3 flex items-center justify-between">
      {children}
    </h4>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-[10.5px] text-ink-3 uppercase tracking-[0.06em]">{label}</div>
      <div className="font-mono text-sm text-ink-0 mt-0.5 font-medium">{value}</div>
    </div>
  )
}

function DeptRow({ name, sub, Icon, iconColor, iconBg, statusLabel, statusClass }) {
  return (
    <div className="grid grid-cols-[32px_1fr_auto] items-center gap-3 px-3 py-2.5 bg-bg-2 rounded-[10px] border border-line-soft">
      <div className="w-8 h-8 rounded-lg grid place-items-center" style={{ color: iconColor, background: iconBg }}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="font-medium text-[13px] text-ink-0">{name}</div>
        <div className="text-ink-3 text-[11.5px]">{sub}</div>
      </div>
      <div className={`text-[10.5px] uppercase tracking-[0.06em] font-semibold px-2.5 py-[3px] rounded-full ${statusClass}`}>
        {statusLabel}
      </div>
    </div>
  )
}

function Sparkline() {
  return (
    <svg className="w-full h-11 mt-2" viewBox="0 0 300 44" preserveAspectRatio="none"
      role="img" aria-label="Campus thermal load trend — rising, currently critical">
      <title>Campus thermal load trend</title>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,32 L25,30 L50,28 L75,26 L100,29 L125,24 L150,22 L175,18 L200,20 L225,14 L250,12 L275,10 L300,6 L300,44 L0,44 Z"
        fill="url(#sparkGrad)"
      />
      <path
        d="M0,32 L25,30 L50,28 L75,26 L100,29 L125,24 L150,22 L175,18 L200,20 L225,14 L250,12 L275,10 L300,6"
        stroke="#ff6b6b"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
