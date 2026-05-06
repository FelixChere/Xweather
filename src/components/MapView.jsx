import { useState, useEffect, useRef } from 'react'
import { PlusIcon, MinusIcon, CrosshairIcon } from './Icons.jsx'
import { forecastZones, THRESHOLD } from '../data/forecastData.js'

const baseSensors = [
  {
    id: 0, temp: 96.8, top: '14%', left: '23%', tier: 'warm', label: 'U District',
    feelsLike: 99.2, humidity: 44, wind: { speed: 7,  dir: 'NW' },
    pressure: 29.94, dewPoint: 71.4, uv: { value: 6, label: 'High' }, updated: 0,
  },
  {
    id: 1, temp: 98.2, top: '31%', left: '42%', tier: 'warm', label: 'Red Square',
    feelsLike: 102.4, humidity: 42, wind: { speed: 4,  dir: 'SW' },
    pressure: 29.91, dewPoint: 72.8, uv: { value: 7, label: 'High' }, updated: 0,
  },
  {
    id: 2, temp: 73.6, top: '66%', left: '32%', tier: 'cool', label: 'College of Environment',
    feelsLike: 71.8, humidity: 71, wind: { speed: 6,  dir: 'W'  },
    pressure: 29.93, dewPoint: 63.1, uv: { value: 2, label: 'Low' }, updated: 0,
  },
  {
    id: 3, temp: 101.4, top: '76%', left: '62%', tier: 'hot', label: 'Stadium',
    feelsLike: 106.2, humidity: 38, wind: { speed: 12, dir: 'SE' },
    pressure: 29.89, dewPoint: 74.5, uv: { value: 9, label: 'Very High' }, updated: 0,
  },
]

function drift(val, max = 0.4) {
  return +((val + (Math.random() - 0.5) * max * 2).toFixed(1))
}

function tierFor(temp) {
  return temp >= 100 ? 'hot' : temp >= 85 ? 'warm' : 'cool'
}

const tierStyles = {
  cool: { color: '#7cc8ff', pillBg: 'rgba(124,200,255,0.16)', pillText: '#b9e0ff', pillBorder: 'rgba(124,200,255,0.3)'  },
  warm: { color: '#ffb38a', pillBg: 'rgba(255,179,138,0.16)', pillText: '#ffd2b8', pillBorder: 'rgba(255,179,138,0.35)' },
  hot:  { color: '#ff6b6b', pillBg: 'rgba(255,107,107,0.18)', pillText: '#ffc0c0', pillBorder: 'rgba(255,107,107,0.4)'  },
}

const ZOOM_MIN = 1, ZOOM_MAX = 2.5, ZOOM_STEP = 0.35

export default function MapView({ setPage }) {
  const [activeId, setActiveId]       = useState(null)
  const [sensors, setSensors]         = useState(baseSensors)
  const [lastUpdated, setLastUpdated] = useState(0)
  const [zoom, setZoom]               = useState(1)

  useEffect(() => {
    const tick = setInterval(() => {
      setSensors(prev => prev.map(s => ({
        ...s,
        temp:      drift(s.temp, 0.3),
        feelsLike: drift(s.feelsLike, 0.4),
        humidity:  Math.max(20, Math.min(99, drift(s.humidity, 1))),
        tier:      tierFor(drift(s.temp, 0.3)),
        updated:   0,
      })))
      setLastUpdated(Date.now())
    }, 30000)
    return () => clearInterval(tick)
  }, [])

  function toggle(id) { setActiveId(prev => prev === id ? null : id) }

  return (
    <section
      data-tour="map"
      className="relative rounded-card overflow-hidden border border-line h-full"
      style={{ background: '#0c1118' }}
      onClick={() => setActiveId(null)}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.25s ease', width: '100%', height: '100%' }}>
          <img
            src="/uw-campus.png"
            alt="UW Seattle campus map"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
            draggable="false"
          />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(12,17,24,0.55) 100%)' }} />

      {/* Heat zone overlay — radial blobs per sensor, intensity = temp */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <defs>
          {sensors.map(s => {
            const intensity = Math.min(1, Math.max(0, (s.temp - 70) / 50))
            const color = s.temp >= 100 ? '255,80,80' : s.temp >= 85 ? '255,160,80' : '100,180,255'
            return (
              <radialGradient key={s.id} id={`heat-${s.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor={`rgb(${color})`} stopOpacity={intensity * 0.28} />
                <stop offset="100%" stopColor={`rgb(${color})`} stopOpacity="0" />
              </radialGradient>
            )
          })}
        </defs>
        {sensors.map(s => (
          <ellipse
            key={s.id}
            cx={s.left}
            cy={s.top}
            rx="18%"
            ry="14%"
            fill={`url(#heat-${s.id})`}
          />
        ))}
      </svg>

        <div className="absolute inset-0">
          {sensors.map(s => (
          <Marker
            key={s.id}
            sensor={s}
            isActive={activeId === s.id}
            onToggle={e => { e.stopPropagation(); toggle(s.id) }}
            setPage={setPage}
            lastUpdated={lastUpdated}
          />
          ))}
        </div>
        </div>
      </div>

      {/* Top bar */}
      <div data-tour="map-header" className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-start pointer-events-none">
        <div className="flex gap-3 items-center pointer-events-auto">
          <h3 className="m-0 text-[13px] font-semibold text-ink-0">Campus Sensor Network</h3>
        </div>
        <div
          className="border border-line rounded-[10px] px-3 py-2 flex gap-3.5 pointer-events-auto text-[11.5px] text-ink-1"
          style={{ background: 'rgba(17,21,29,0.78)', backdropFilter: 'blur(12px)' }}
        >
          <LegendDot color="#7cc8ff" label="< 80°F" />
          <LegendDot color="#ffb38a" label="80–99°F" />
          <LegendDot color="#ff6b6b" label="≥ 100°F" />
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute right-3.5 bottom-3.5 flex flex-col gap-1.5">
        <MapButton ariaLabel="Zoom in"  onClick={() => setZoom(z => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))}><PlusIcon className="w-3.5 h-3.5" /></MapButton>
        <MapButton ariaLabel="Zoom out" onClick={() => setZoom(z => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))}><MinusIcon className="w-3.5 h-3.5" /></MapButton>
        <MapButton ariaLabel="Recenter" onClick={() => setZoom(1)}><CrosshairIcon className="w-3.5 h-3.5" /></MapButton>
      </div>
    </section>
  )
}

function Marker({ sensor, isActive, onToggle, setPage, lastUpdated }) {
  const s = tierStyles[sensor.tier]
  const leftPct = parseFloat(sensor.left)
  const topPct  = parseFloat(sensor.top)
  const popupRight = leftPct <= 70
  const popupBelow = topPct  <= 35
  const popupAbove = topPct  >= 65

  return (
    <div
      className="absolute"
      style={{ top: sensor.top, left: sensor.left, transform: 'translate(-50%, -50%)', zIndex: isActive ? 50 : 10 }}
    >
      {/* Dot + pill */}
      <button
        className="flex flex-col items-center gap-1 select-none bg-transparent border-0 p-0 cursor-pointer rounded-lg"
        style={{ color: s.color }}
        onClick={onToggle}
        aria-label={`${sensor.label} sensor: ${sensor.temp.toFixed(1)}°F`}
        aria-expanded={isActive}
        aria-haspopup="dialog"
      >
        <span
          className="font-mono text-[11px] px-[7px] py-0.5 rounded-full font-medium border whitespace-nowrap transition-opacity"
          style={{ background: s.pillBg, color: s.pillText, borderColor: s.pillBorder,
                   boxShadow: isActive ? `0 0 0 3px ${s.pillBorder}` : 'none' }}
        >
          {sensor.temp.toFixed(1)}°F
        </span>
        <span
          aria-hidden="true"
          className="w-3.5 h-3.5 rounded-full border-2 border-bg-1 marker-ripple"
          style={{ background: s.color }}
        />
      </button>

      {/* Popup */}
      {isActive && (
        <SensorPopup
          sensor={sensor}
          popupRight={popupRight}
          popupBelow={popupBelow}
          popupAbove={popupAbove}
          onClose={onToggle}
          setPage={setPage}
          lastUpdated={lastUpdated}
        />
      )}
    </div>
  )
}

function SensorPopup({ sensor, popupRight, popupBelow, popupAbove, onClose, setPage, lastUpdated }) {
  const s = tierStyles[sensor.tier]
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const style = {
    position: 'absolute',
    width: '212px',
    ...(popupRight
      ? { left: '22px' }
      : { right: '22px' }),
    ...(popupAbove
      ? { bottom: '22px' }
      : popupBelow
      ? { top: '22px' }
      : { top: '50%', transform: 'translateY(-50%)' }),
  }

  return (
    <div
      role="dialog"
      aria-label={`${sensor.label} sensor details`}
      className="rounded-[12px] border text-[12px] overflow-hidden"
      style={{
        ...style,
        background: 'rgba(10,13,20,0.95)',
        borderColor: 'rgba(255,255,255,0.10)',
        backdropFilter: 'blur(18px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-3.5 pt-3 pb-2.5 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
          <span className="font-semibold text-ink-0 tracking-[-0.01em]">{sensor.label}</span>
        </div>
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close sensor details"
          className="text-ink-3 hover:text-ink-1 transition-colors leading-none text-[14px]"
        >×</button>
      </div>

      {/* Primary reading */}
      <div className="px-3.5 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-baseline gap-2">
          <span className="text-[26px] font-bold tracking-tight leading-none" style={{ color: s.color }}>
            {sensor.temp.toFixed(1)}°F
          </span>
          <span className="text-ink-3 text-[11px]">feels {sensor.feelsLike.toFixed(1)}°F</span>
        </div>
      </div>

      {/* Detail rows */}
      <div className="px-3.5 py-2.5 flex flex-col gap-[7px]" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Row label="Humidity"   value={`${sensor.humidity}%`} />
        <Row label="Wind"       value={`${sensor.wind.speed} mph ${sensor.wind.dir}`} />
        <Row label="Pressure"   value={`${sensor.pressure.toFixed(2)} inHg`} />
        <Row label="Dew point"  value={`${sensor.dewPoint.toFixed(1)}°F`} />
        <Row label="UV index"   value={`${sensor.uv.value} · ${sensor.uv.label}`} />
      </div>

      {/* Forecast section */}
      <ForecastRow sensorId={sensor.id} accentColor={s.color} setPage={setPage} />

      {/* Footer */}
      <div className="px-3.5 py-2 text-ink-3 text-[10.5px]">
        {lastUpdated ? 'Updated just now' : 'Live · updating every 30s'}
      </div>
    </div>
  )
}

function ForecastRow({ sensorId, accentColor, setPage }) {
  const zone = forecastZones[sensorId]
  if (!zone) return null

  const delta   = zone.points[3].temp - zone.points[0].temp
  const trend   = delta >  0.8 ? { arrow: '↑', label: 'Rising',  color: '#ff6b6b' }
                : delta < -0.8 ? { arrow: '↓', label: 'Cooling', color: '#6ee2b9' }
                :                { arrow: '→', label: 'Stable',  color: '#8893a8' }

  const breached  = zone.currentTemp >= THRESHOLD
  const coolsIn   = zone.coolsBelowAt > 0 ? zone.coolsBelowAt : null

  function hToTime(h) {
    const total = 14 + h
    const hour  = total % 24
    const ampm  = hour >= 12 ? 'pm' : 'am'
    const disp  = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${disp}${ampm}`
  }

  return (
    <div className="px-3.5 py-2.5 flex flex-col gap-[7px]"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Section label */}
      <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-ink-3">72h Forecast</span>
      {/* Trend */}
      <div className="flex justify-between items-center">
        <span className="text-ink-3 text-[12px]">Trend</span>
        <span className="font-medium text-[12px]" style={{ color: trend.color }}>
          {trend.arrow} {trend.label}
        </span>
      </div>
      {/* Peak */}
      <div className="flex justify-between items-center">
        <span className="text-ink-3 text-[12px]">Forecast peak</span>
        <span className="font-medium tabular-nums text-[12px]" style={{ color: accentColor }}>
          {zone.peak.temp}°F at {hToTime(zone.peak.h)}
        </span>
      </div>
      {/* Cooldown */}
      {breached && (
        <div className="flex justify-between items-center">
          <span className="text-ink-3 text-[12px]">Cools below 95°F</span>
          <span className="font-medium tabular-nums text-[12px] text-ink-1">
            {coolsIn ? `in ~${coolsIn}h` : 'Stays above 72h'}
          </span>
        </div>
      )}
      {/* Navigate to TempCast */}
      {setPage && (
        <button
          onClick={() => setPage('tempcast')}
          className="w-full text-left text-[11px] font-semibold mt-0.5 transition-colors"
          style={{ color: '#7cc8ff' }}
        >
          View full 72h forecast →
        </button>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-ink-3">{label}</span>
      <span className="text-ink-1 font-medium tabular-nums">{value}</span>
    </div>
  )
}

function MapButton({ children, ariaLabel, onClick }) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className="w-[34px] h-[34px] border border-line rounded-lg text-ink-1 grid place-items-center hover:bg-bg-3 hover:text-ink-0 transition-colors"
      style={{ background: 'rgba(17,21,29,0.85)', backdropFilter: 'blur(12px)' }}
    >
      {children}
    </button>
  )
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      {label}
    </div>
  )
}
