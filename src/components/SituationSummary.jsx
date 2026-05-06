import { departments } from './DepartmentalThresholdsPage.jsx'

const exceeded = departments.filter(d => d.status === 'exceeded')

export default function SituationSummary({ units = [], resolvedExceeded = new Set() }) {
  const activeExceeded  = exceeded.filter(d => !resolvedExceeded.has(d.id))
  const deployedUnits   = units.filter(u => u.status !== 'ready')
  const pendingDepts    = departments.filter(d => !d.acknowledged && !resolvedExceeded.has(d.id))

  function summary() {
    const parts = []
    if (activeExceeded.length > 0) {
      const names = activeExceeded.map(d => d.zone).join(' and ')
      parts.push(`${names} ${activeExceeded.length > 1 ? 'are' : 'is'} currently above the 95°F threshold`)
    }
    if (deployedUnits.length > 0) {
      parts.push(`${deployedUnits.length} response unit${deployedUnits.length > 1 ? 's are' : ' is'} deployed in the field`)
    }
    if (pendingDepts.length > 0) {
      parts.push(`${pendingDepts.length} department${pendingDepts.length > 1 ? 's have' : ' has'} not yet resolved`)
    }
    if (parts.length === 0) return 'All zones are within safe limits and all departments have responded. The situation is under control.'
    return parts.join(', ') + '. Immediate monitoring recommended.'
  }

  const riskLevel   = activeExceeded.length >= 3 ? 'Critical' : activeExceeded.length >= 1 ? 'High' : 'Stable'
  const riskColor   = riskLevel === 'Critical' ? '#ff6b6b' : riskLevel === 'High' ? '#ffb38a' : '#6ee2b9'

  return (
    <div className="rounded-card border border-line px-4 py-3.5 flex items-start gap-3.5 mb-4 md:mb-5 xl:mb-6"
      style={{ background: `${riskColor}07`, borderColor: `${riskColor}25` }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">Situation Summary</span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: `${riskColor}18`, color: riskColor }}>AI</span>
          <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${riskColor}18`, color: riskColor }}>
            {riskLevel}
          </span>
        </div>
        <p className="m-0 text-[13px] text-ink-1 leading-relaxed">{summary()}</p>
      </div>
    </div>
  )
}
