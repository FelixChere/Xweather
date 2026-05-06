import { forecastZones, THRESHOLD } from '../data/forecastData.js'

function getTrend(zone) {
  const now  = zone.points[0].temp
  const in3h = zone.points[3].temp
  const delta = in3h - now
  if (delta >  0.8) return { arrow: '↑', label: 'Rising',  color: '#ff6b6b' }
  if (delta < -0.8) return { arrow: '↓', label: 'Cooling', color: '#6ee2b9' }
  return               { arrow: '→', label: 'Stable',  color: '#8893a8' }
}

function hToTime(h) {
  const total = 14 + h
  const hour  = total % 24
  const ampm  = hour >= 12 ? 'pm' : 'am'
  const disp  = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${disp}${ampm}`
}

export default function ForecastStrip() {
  return (
    <div className="mb-4 md:mb-5 xl:mb-6">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-3">72h Forecast</span>
        <span className="text-[10.5px] px-2 py-0.5 rounded font-semibold"
          style={{ background: 'rgba(124,200,255,0.10)', color: '#7cc8ff', border: '1px solid rgba(124,200,255,0.20)' }}>
          NWS + TempCast
        </span>
        <span className="text-[11px] text-ink-3">· Next peak predictions per zone</span>
      </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
      {forecastZones.map(zone => {
        const trend      = getTrend(zone)
        const breached   = zone.currentTemp >= THRESHOLD
        const coolsIn    = zone.coolsBelowAt > 0 ? zone.coolsBelowAt : null
        const hoursToP   = zone.peak.h

        return (
          <div
            key={zone.id}
            className="bg-bg-1 border border-line rounded-card px-4 py-3 flex items-center gap-3"
          >
            {/* Colored left indicator */}
            <div
              className="w-1 self-stretch rounded-full flex-shrink-0"
              style={{ background: zone.color }}
              aria-hidden="true"
            />

            {/* Zone info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-ink-3 uppercase tracking-[0.07em] truncate">
                  {zone.shortLabel}
                </span>
                <span
                  className="text-[11px] font-semibold flex-shrink-0"
                  style={{ color: trend.color }}
                >
                  {trend.arrow} {trend.label}
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-2 mt-0.5">
                <span
                  className="text-[20px] font-bold tracking-tight leading-none"
                  style={{ color: zone.color }}
                >
                  {zone.currentTemp.toFixed(1)}°
                </span>
                <span className="text-[11px] text-ink-3 text-right leading-snug">
                  {breached && coolsIn
                    ? <>Cools ~{coolsIn}h · <span style={{ color: zone.color }}>Peak {zone.peak.temp}°F</span></>
                    : hoursToP > 0
                    ? <>Peak <span style={{ color: zone.color }}>{zone.peak.temp}°F</span> at {hToTime(hoursToP)}</>
                    : <span style={{ color: zone.color }}>At peak</span>
                  }
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
    </div>
  )
}
