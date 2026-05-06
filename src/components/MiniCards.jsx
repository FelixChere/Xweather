import { useState } from 'react'
import { LinkIcon, UsersIcon, ActivityIcon, ChevronRightIcon } from './Icons.jsx'
import ActiveProtocolsPanel, { initialProtocols } from './ActiveProtocolsPanel.jsx'
import ResponseUnitsPanel, { initialUnits } from './ResponseUnitsPanel.jsx'
import NetworkHealthPanel from './NetworkHealthPanel.jsx'

const toneClass = {
  warm: 'bg-warn/10 text-warn',
  ok:   'bg-ok/10 text-ok',
  info: 'bg-info/10 text-info',
}

export default function MiniCards({ units, setUnits }) {
  const [openPanel, setOpenPanel] = useState(null)
  const [protocols, setProtocols] = useState(initialProtocols)

  const readyCount    = units.filter(u => u.status === 'ready').length
  const deployedCount = units.filter(u => u.status !== 'ready').length
  const pendingCount  = protocols.filter(p => p.status === 'pending').length

  const cards = [
    {
      label: 'Active Protocols',
      value: String(protocols.length).padStart(2, '0'),
      unit: 'actions',
      sub: pendingCount > 0 ? `${pendingCount} awaiting approval` : 'All protocols approved',
      Icon: LinkIcon,
      tone: 'warm',
      panelKey: 'protocols',
    },
    {
      label: 'Response Units',
      value: String(readyCount),
      unit: 'ready',
      sub: (() => {
        const deployed = units.filter(u => u.status !== 'ready' && u.eta)
        if (deployed.length === 0) return 'All units on standby'
        const etaNums = deployed.map(u => parseInt(u.eta)).filter(n => !isNaN(n))
        const avgEta = etaNums.length ? Math.round(etaNums.reduce((a,b) => a+b,0) / etaNums.length) : null
        return avgEta ? `${deployed.length} deployed · Avg ETA ${avgEta} min` : `${deployed.length} deployed`
      })(),
      Icon: UsersIcon,
      tone: 'ok',
      panelKey: 'response',
    },
    {
      label: 'Network Health',
      value: '99.4',
      unit: '%',
      sub: 'All sensors reporting',
      Icon: ActivityIcon,
      tone: 'info',
      panelKey: 'network',
    },
  ]

  return (
    <div data-tour="minicards">
      {openPanel === 'protocols' && (
        <ActiveProtocolsPanel
          protocols={protocols}
          setProtocols={setProtocols}
          onClose={() => setOpenPanel(null)}
        />
      )}
      {openPanel === 'response' && (
        <ResponseUnitsPanel
          units={units}
          setUnits={setUnits}
          onClose={() => setOpenPanel(null)}
        />
      )}
      {openPanel === 'network' && (
        <NetworkHealthPanel onClose={() => setOpenPanel(null)} />
      )}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 xl:gap-6 mt-4 md:mt-5 xl:mt-6">
        {cards.map((c) => (
          <MiniCard
            key={c.label}
            {...c}
            onChevronClick={c.panelKey ? () => setOpenPanel(c.panelKey) : undefined}
          />
        ))}
      </div>
    </div>
  )
}

function MiniCard({ label, value, unit, sub, Icon, tone, onChevronClick }) {
  const Tag = onChevronClick ? 'button' : 'div'
  return (
    <Tag
      className={`w-full text-left bg-bg-1 border border-line rounded-card px-4 py-3.5 flex items-center gap-3.5 transition-colors ${onChevronClick ? 'hover:bg-bg-2 cursor-pointer' : ''}`}
      onClick={onChevronClick}
      aria-label={onChevronClick ? `View ${label} details` : undefined}
    >
      <div className={`w-10 h-10 rounded-[10px] grid place-items-center flex-shrink-0 ${toneClass[tone]}`}>
        <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
      </div>
      <div>
        <div className="text-[11px] text-ink-3 uppercase tracking-[0.07em] font-semibold">{label}</div>
        <div className="text-[22px] font-bold tracking-[-0.02em] mt-0.5">
          {value} <span className="text-[13px] text-ink-2 font-medium">{unit}</span>
        </div>
        <div className="text-[11.5px] text-ink-2 mt-0.5">{sub}</div>
      </div>
      <ChevronRightIcon className="w-[18px] h-[18px] ml-auto text-ink-2 flex-shrink-0" aria-hidden="true" />
    </Tag>
  )
}
