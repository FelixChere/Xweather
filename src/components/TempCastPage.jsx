import { useState, useRef, useCallback } from 'react'
import AlertBanner from './AlertBanner.jsx'
import { forecastZones, campusSummary, NWS_CONDITIONS, THRESHOLD } from '../data/forecastData.js'

const RANGES = [24, 48, 72]

// ── Helpers ──────────────────────────────────────────────────────────────────

function hourLabel(h) {
  if (h === 0) return 'Now'
  if (h % 24 === 0) return `Day ${h / 24 + 1}`
  return `+${h}h`
}

function hToTime(h) {
  // Anchor: now = 14:00
  const total = 14 + h
  const hour  = total % 24
  const ampm  = hour >= 12 ? 'pm' : 'am'
  const disp  = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${disp}${ampm}`
}

function riskColor(level) {
  if (level === 'Critical') return { color: '#ff6b6b', bg: 'rgba(255,107,107,0.12)' }
  if (level === 'High')     return { color: '#ffb38a', bg: 'rgba(255,179,138,0.12)' }
  return                           { color: '#6ee2b9', bg: 'rgba(110,226,185,0.12)' }
}

// ── Forecast chart ────────────────────────────────────────────────────────────

const XOFF = 52, YOFF = 14, PLOT_W = 728, PLOT_H = 260, TMIN = 35, TMAX = 120, XLAB_H = 36

function toX(h, range)  { return XOFF + (h / range) * PLOT_W }
function toY(t)         { return YOFF + PLOT_H - ((t - TMIN) / (TMAX - TMIN)) * PLOT_H }

function makeLine(points, range) {
  return points
    .filter(p => p.h <= range)
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.h, range).toFixed(1)},${toY(p.temp).toFixed(1)}`)
    .join(' ')
}

function makeBand(points, range) {
  const pts = points.filter(p => p.h <= range)
  const top = pts.map(p => `${toX(p.h, range).toFixed(1)},${toY(p.high).toFixed(1)}`).join(' L ')
  const bot = [...pts].reverse().map(p => `${toX(p.h, range).toFixed(1)},${toY(p.low).toFixed(1)}`).join(' L ')
  return `M ${top} L ${bot} Z`
}

function ForecastChart({ range, visible }) {
  const [hoverH, setHoverH] = useState(null)
  const svgRef = useRef(null)

  const handleMove = useCallback(e => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const svgX = (e.clientX - rect.left) * (XOFF * 2 + PLOT_W) / rect.width
    const h = Math.round(((svgX - XOFF) / PLOT_W) * range)
    setHoverH(Math.max(0, Math.min(range, h)))
  }, [range])

  const yThreshold = toY(THRESHOLD)
  const xTicks = Array.from({ length: range / 12 + 1 }, (_, i) => i * 12)
  const yTicks = [40, 50, 60, 70, 80, 90, 95, 100, 110]

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${XOFF * 2 + PLOT_W} ${YOFF + PLOT_H + XLAB_H}`}
      width="100%"
      onMouseMove={handleMove}
      onMouseLeave={() => setHoverH(null)}
      role="img"
      aria-label="72-hour campus temperature forecast chart"
    >
      {/* Grid */}
      {yTicks.map(t => (
        <line key={t}
          x1={XOFF} y1={toY(t)} x2={XOFF + PLOT_W} y2={toY(t)}
          stroke={t === THRESHOLD ? 'rgba(255,107,107,0.35)' : 'rgba(255,255,255,0.05)'}
          strokeWidth={t === THRESHOLD ? 1.5 : 1}
          strokeDasharray={t === THRESHOLD ? '4 4' : undefined}
        />
      ))}

      {/* Day separators */}
      {[24, 48].filter(h => h < range).map(h => (
        <line key={h}
          x1={toX(h, range)} y1={YOFF} x2={toX(h, range)} y2={YOFF + PLOT_H}
          stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4"
        />
      ))}

      {/* Clip path — constrains bands and lines to the plot area */}
      <defs>
        <clipPath id="plot-clip">
          <rect x={XOFF} y={YOFF} width={PLOT_W} height={PLOT_H} />
        </clipPath>
      </defs>

      <g clipPath="url(#plot-clip)">
        {/* Confidence bands */}
        {forecastZones.filter(z => visible[z.id]).map(z => (
          <path key={`band-${z.id}`}
            d={makeBand(z.points, range)}
            fill={z.color} fillOpacity={0.07}
          />
        ))}

        {/* Zone lines */}
        {forecastZones.filter(z => visible[z.id]).map(z => (
          <path key={`line-${z.id}`}
            d={makeLine(z.points, range)}
            fill="none" stroke={z.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          />
        ))}
      </g>

      {/* Threshold label */}
      <text x={XOFF + PLOT_W + 4} y={yThreshold + 4}
        fill="rgba(255,107,107,0.7)" fontSize="9" fontFamily="system-ui">95°F</text>

      {/* Y-axis labels */}
      {yTicks.filter(t => t !== THRESHOLD).map(t => (
        <text key={t} x={XOFF - 6} y={toY(t) + 4}
          textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">{t}</text>
      ))}

      {/* X-axis labels */}
      {xTicks.map(h => (
        <text key={h} x={toX(h, range)} y={YOFF + PLOT_H + 28}
          textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="system-ui">
          {hourLabel(h)}
        </text>
      ))}

      {/* Hover line */}
      {hoverH !== null && (
        <>
          <line
            x1={toX(hoverH, range)} y1={YOFF}
            x2={toX(hoverH, range)} y2={YOFF + PLOT_H}
            stroke="rgba(255,255,255,0.25)" strokeWidth="1"
          />
          {/* Hover tooltip */}
          {(() => {
            const tx = toX(hoverH, range)
            const boxW = 138, boxH = forecastZones.filter(z => visible[z.id]).length * 18 + 28
            const bx = tx + 10 + boxW > XOFF + PLOT_W ? tx - boxW - 10 : tx + 10
            const by = YOFF + 10
            return (
              <g>
                <rect x={bx} y={by} width={boxW} height={boxH} rx="6"
                  fill="rgba(10,13,20,0.92)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
                <text x={bx + 10} y={by + 14}
                  fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="system-ui">{hToTime(hoverH)} · {hourLabel(hoverH)}</text>
                {forecastZones.filter(z => visible[z.id]).map((z, i) => {
                  const pt = z.points[Math.min(hoverH, 72)]
                  return pt ? (
                    <g key={z.id}>
                      <circle cx={bx + 13} cy={by + 26 + i * 18} r="4" fill={z.color} />
                      <text x={bx + 22} y={by + 30 + i * 18}
                        fill="rgba(255,255,255,0.75)" fontSize="10" fontFamily="system-ui">{z.shortLabel}</text>
                      <text x={bx + boxW - 10} y={by + 30 + i * 18}
                        textAnchor="end" fill={z.color} fontSize="10" fontFamily="monospace" fontWeight="600">{pt.temp}°F</text>
                    </g>
                  ) : null
                })}
              </g>
            )
          })()}
          {/* Dots on lines */}
          {forecastZones.filter(z => visible[z.id]).map(z => {
            const pt = z.points[Math.min(hoverH, 72)]
            return pt ? (
              <circle key={z.id} cx={toX(hoverH, range)} cy={toY(pt.temp)}
                r="4" fill={z.color} stroke="rgba(10,13,20,0.9)" strokeWidth="2" />
            ) : null
          })}
        </>
      )}
    </svg>
  )
}

// ── Zone card ─────────────────────────────────────────────────────────────────

function ZoneCard({ zone }) {
  const breached = zone.isBreached
  const coolsIn  = zone.coolsBelowAt > 0 ? zone.coolsBelowAt : null
  const riskLevel = zone.currentTemp >= 100 ? 'Critical' : zone.currentTemp >= THRESHOLD ? 'High' : 'Stable'
  const { color, bg } = riskColor(riskLevel)

  // Mini sparkline: next 24h of points
  const spark = zone.points.slice(0, 25)
  const sMin = Math.min(...spark.map(p => p.low))
  const sMax = Math.max(...spark.map(p => p.high))
  const sRange = sMax - sMin || 1
  const sparkPath = spark
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${(i / 24 * 100).toFixed(1)},${(30 - ((p.temp - sMin) / sRange) * 28).toFixed(1)}`)
    .join(' ')

  return (
    <div className="bg-bg-1 border border-line rounded-card p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="m-0 text-[12px] text-ink-3 font-semibold uppercase tracking-[0.07em]">{zone.id}</p>
          <p className="m-0 text-[14px] font-bold text-ink-0 leading-tight mt-0.5">{zone.label}</p>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ background: bg, color }}>
          {riskLevel}
        </span>
      </div>

      {/* Current temp */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-[28px] font-bold tracking-tight leading-none" style={{ color }}>
          {zone.currentTemp.toFixed(1)}
        </span>
        <span className="text-[14px] text-ink-3">°F</span>
        <span className="text-[12px] text-ink-3 ml-1">now</span>
      </div>

      {/* Sparkline */}
      <div className="relative h-8">
        <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
          {/* Threshold line */}
          {THRESHOLD >= sMin && THRESHOLD <= sMax && (
            <line x1="0" y1={(30 - ((THRESHOLD - sMin) / sRange) * 28).toFixed(1)}
              x2="100" y2={(30 - ((THRESHOLD - sMin) / sRange) * 28).toFixed(1)}
              stroke="rgba(255,107,107,0.4)" strokeWidth="0.8" strokeDasharray="2 2" />
          )}
          <path d={sparkPath} fill="none" stroke={zone.color} strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div>
          <p className="m-0 text-[10px] uppercase tracking-[0.07em] text-ink-3">Peak forecast</p>
          <p className="m-0 mt-0.5 text-[13px] font-semibold" style={{ color }}>
            {zone.peak.temp}°F
            <span className="text-ink-3 font-normal text-[11px] ml-1">at {hToTime(zone.peak.h)}</span>
          </p>
        </div>
        <div>
          <p className="m-0 text-[10px] uppercase tracking-[0.07em] text-ink-3">
            {breached ? 'Cools below 95°F' : 'Stays below 95°F'}
          </p>
          <p className="m-0 mt-0.5 text-[13px] font-semibold text-ink-1">
            {breached && coolsIn
              ? `in ~${coolsIn}h`
              : breached
              ? 'Stays above 72h'
              : 'Throughout'}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Summary card ──────────────────────────────────────────────────────────────

function SummaryCard({ label, value, sub, color, bg }) {
  return (
    <div className="bg-bg-1 border border-line rounded-card px-4 py-3.5 flex flex-col gap-1">
      <p className="m-0 text-[10.5px] text-ink-3 uppercase tracking-[0.08em] font-semibold">{label}</p>
      <p className="m-0 text-[22px] font-bold tracking-tight leading-none" style={{ color }}>{value}</p>
      <p className="m-0 text-[12px] text-ink-3">{sub}</p>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TempCastPage() {
  const [range, setRange]     = useState(72)
  const [visible, setVisible] = useState(
    Object.fromEntries(forecastZones.map(z => [z.id, true]))
  )

  function toggleZone(id) {
    setVisible(prev => {
      const next = { ...prev, [id]: !prev[id] }
      // Keep at least one visible
      if (Object.values(next).every(v => !v)) return prev
      return next
    })
  }

  const { overallPeak, nextCooldownHour, riskLevel, zonesBreached } = campusSummary
  const riskC = riskColor(riskLevel)

  return (
    <div className="flex flex-col gap-4 md:gap-5 xl:gap-6">
      <AlertBanner />

      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="m-0 text-[18px] font-bold text-ink-0 tracking-[-0.01em]">TempCast Analytics</h1>
          <p className="m-0 mt-0.5 text-[12.5px] text-ink-3">
            72-hour campus heat forecast · NWS + sensor fusion
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-ink-3 flex-shrink-0"
          style={{ background: 'rgba(124,200,255,0.08)', border: '1px solid rgba(124,200,255,0.20)', borderRadius: 8, padding: '6px 12px' }}>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(124,200,255,0.20)', color: '#7cc8ff' }}>NWS</span>
          <span>Seattle · {NWS_CONDITIONS.description}</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
        <SummaryCard
          label="Campus Risk Level"
          value={riskLevel}
          sub={`${zonesBreached} of 4 zones above 95°F`}
          color={riskC.color}
          bg={riskC.bg}
        />
        <SummaryCard
          label="Forecast Peak"
          value={`${overallPeak.temp}°F`}
          sub={`${overallPeak.zone} · at ${hToTime(overallPeak.h)}`}
          color="#ff6b6b"
        />
        <SummaryCard
          label="First Cooldown"
          value={nextCooldownHour ? `+${nextCooldownHour}h` : '—'}
          sub={nextCooldownHour ? `First zone drops below 95°F` : 'All zones stay elevated'}
          color="#ffb38a"
        />
        <SummaryCard
          label="NWS Conditions"
          value={`${NWS_CONDITIONS.ambientTemp}°F`}
          sub={`Humidity ${NWS_CONDITIONS.humidity}% · UV ${NWS_CONDITIONS.uvIndex} · Wind ${NWS_CONDITIONS.windSpeed} mph ${NWS_CONDITIONS.windDir}`}
          color="#7cc8ff"
        />
      </div>

      {/* Chart card */}
      <div className="bg-bg-1 border border-line rounded-card p-4 md:p-5">
        {/* Chart header */}
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <h2 className="m-0 text-[13px] font-semibold text-ink-0">Temperature Forecast</h2>
            <span className="text-[10.5px] text-ink-3 px-2 py-0.5 rounded"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              Dashed red line = 95°F threshold
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Zone toggles */}
            <div className="flex gap-1.5">
              {forecastZones.map(z => (
                <button
                  key={z.id}
                  onClick={() => toggleZone(z.id)}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full transition-opacity"
                  style={{
                    background: visible[z.id] ? z.pillBg : 'rgba(255,255,255,0.05)',
                    color: visible[z.id] ? z.color : 'rgba(255,255,255,0.3)',
                    border: `1px solid ${visible[z.id] ? z.color + '50' : 'rgba(255,255,255,0.08)'}`,
                  }}
                  aria-pressed={visible[z.id]}
                >
                  {z.shortLabel}
                </button>
              ))}
            </div>
            {/* Range toggle */}
            <div className="flex rounded-lg overflow-hidden border border-line">
              {RANGES.map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`text-[11.5px] font-semibold px-3 py-1.5 transition-colors ${range === r ? 'bg-bg-3 text-ink-0' : 'bg-bg-2 text-ink-3 hover:text-ink-1'}`}
                  aria-pressed={range === r}
                >
                  {r}h
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <ForecastChart range={range} visible={visible} />
      </div>

      {/* Zone breakdown */}
      <div>
        <h2 className="m-0 mb-3 text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-3">
          Per-Zone Breakdown
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
          {forecastZones.map(z => <ZoneCard key={z.id} zone={z} />)}
        </div>
      </div>
    </div>
  )
}
