// Deterministic 72-hour temperature forecast
// Combines NWS ambient forecast with TempCast sensor-based heat model
// Daily cycle peaks at ~3pm, troughs at ~5am

export const THRESHOLD = 95  // °F — departmental alert threshold

export const ZONE_META = [
  { id: 'SEN-01', label: 'U District',            shortLabel: 'U District', color: '#7cc8ff', pillBg: 'rgba(124,200,255,0.15)', base: 87, amp: 18 },
  { id: 'SEN-02', label: 'Red Square',             shortLabel: 'Red Square', color: '#ffb38a', pillBg: 'rgba(255,179,138,0.15)', base: 86, amp: 24 },
  { id: 'SEN-03', label: 'Col. of Environment',    shortLabel: 'Col. Env',   color: '#6ee2b9', pillBg: 'rgba(110,226,185,0.15)', base: 66, amp: 15 },
  { id: 'SEN-04', label: 'Stadium',                shortLabel: 'Stadium',    color: '#ff6b6b', pillBg: 'rgba(255,107,107,0.15)', base: 90, amp: 23 },
]

// NWS ambient conditions (Seattle, mocked from real NWS API shape)
export const NWS_CONDITIONS = {
  source: 'National Weather Service — Seattle/Tacoma',
  ambientTemp: 94,
  humidity: 38,
  windSpeed: 7,
  windDir: 'SW',
  uvIndex: 8,
  description: 'Sunny and extremely hot',
  heatIndex: 102,
}

function coolingTrend(h) {
  // Heat wave breaking gradually after 24h
  if (h < 24) return 0
  if (h < 48) return (h - 24) * 0.10
  return 2.4 + (h - 48) * 0.15
}

function rawTemp(h, base, amp) {
  // phase +2 shifts peak to ~3pm from anchor of 2pm (h=0)
  const cycle = Math.sin((h + 2) * (2 * Math.PI / 24))
  return base + amp * cycle - coolingTrend(h)
}

export const forecastZones = ZONE_META.map(z => {
  const points = Array.from({ length: 73 }, (_, h) => {
    const t = rawTemp(h, z.base, z.amp)
    // Confidence interval widens over time
    const margin = 0.5 + h * 0.115
    return {
      h,
      temp:  +t.toFixed(1),
      high: +(t + margin).toFixed(1),
      low:  +(t - margin).toFixed(1),
    }
  })

  // Peak across entire 72h window
  const peak = points.reduce((m, p) => p.temp > m.temp ? p : m, points[0])

  // First time temp drops below threshold (hot zones cooling down)
  const coolsBelowAt = points.findIndex((p, i) => i > 0 && p.temp < THRESHOLD && points[i - 1].temp >= THRESHOLD)

  // First time temp rises above threshold (zones not yet breached)
  const risesAboveAt = points.findIndex((p, i) => i > 0 && p.temp >= THRESHOLD && points[i - 1].temp < THRESHOLD)

  const currentTemp = points[0].temp
  const isBreached  = currentTemp >= THRESHOLD

  return { ...z, points, peak, coolsBelowAt, risesAboveAt, currentTemp, isBreached }
})

// Campus-level summary derived from zone data
export const campusSummary = (() => {
  const hotZones = forecastZones.filter(z => z.isBreached)
  const overallPeak = forecastZones.reduce(
    (m, z) => z.peak.temp > m.temp ? { temp: z.peak.temp, zone: z.label, h: z.peak.h } : m,
    { temp: 0, zone: '', h: 0 }
  )
  const earliestCool = forecastZones
    .filter(z => z.coolsBelowAt > 0)
    .reduce((m, z) => z.coolsBelowAt < m ? z.coolsBelowAt : m, Infinity)

  return {
    zonesBreached: hotZones.length,
    overallPeak,
    nextCooldownHour: earliestCool === Infinity ? null : earliestCool,
    riskLevel: hotZones.length >= 3 ? 'Critical' : hotZones.length >= 1 ? 'High' : 'Moderate',
  }
})()
