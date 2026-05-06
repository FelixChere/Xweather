import { useState, useEffect } from 'react'
import AlertBanner from './AlertBanner.jsx'
import { FlaskIcon, ServerIcon, TrophyIcon, ZapIcon, CloudIcon, WrenchIcon, HomeIcon, UsersIcon } from './Icons.jsx'

export const departments = [
  { id: 1, name: 'UW Public Health Department',              Icon: FlaskIcon,  zone: 'Zone 4', currentTemp: 102.1, threshold: 95, status: 'exceeded', contact: { name: 'Dr. Sarah Chen',    email: 's.chen@uw.edu',           phone: '206-555-0142' }, notified: '12:19 PST', acknowledged: '12:23 PST', recommendation: 'Activate heat protocol HT-2 immediately. Restrict access to outdoor areas in Zone 4 and notify all field personnel to move indoors.' },
  { id: 4, name: 'UW Campus Energy, Utilities & Operations', Icon: ZapIcon,    zone: 'Zone 9', currentTemp: 88.5,  threshold: 85, status: 'exceeded', contact: { name: 'Kevin Park',         email: 'k.park@uw.edu',           phone: '206-555-0113' }, notified: '12:20 PST', acknowledged: '12:26 PST', recommendation: 'Increase HVAC output across Zone 9 immediately. Review power load capacity before activating additional cooling units.' },
  { id: 6, name: 'UW Facilities Services',                   Icon: WrenchIcon, zone: 'Zone 6', currentTemp: 91.4,  threshold: 88, status: 'exceeded', contact: { name: 'Tom Reyes',          email: 't.reyes@uw.edu',          phone: '206-555-0189' }, notified: '12:18 PST', acknowledged: '12:20 PST', recommendation: 'Deploy maintenance crews to address HVAC units offline in Zone 6. Prioritise Facilities A and B.' },
  { id: 3, name: 'UW Environmental Health & Safety',         Icon: TrophyIcon, zone: 'Zone 7', currentTemp: 81.2,  threshold: 90, status: 'nominal',  contact: { name: 'Maria Torres',       email: 'm.torres@uw.edu',         phone: '206-555-0167' }, notified: '12:19 PST', acknowledged: null,         recommendation: 'Zone 7 within safe range. Confirm no personnel operating in direct sun exposure.' },
  { id: 7, name: 'UW Housing & Food Services',               Icon: HomeIcon,   zone: 'Zone 5', currentTemp: 79.8,  threshold: 82, status: 'stable',   contact: { name: 'Angela Kim',         email: 'a.kim@uw.edu',            phone: '206-555-0176' }, notified: '12:19 PST', acknowledged: null,         recommendation: 'Zone 5 approaching threshold. Pre-cool common areas and set up hydration stations before afternoon peak.' },
  { id: 2, name: 'UW Medicine',                              Icon: ServerIcon, zone: 'Zone 2', currentTemp: 68.4,  threshold: 78, status: 'stable',   contact: { name: 'Dr. James Okafor',  email: 'j.okafor@uwmedicine.org', phone: '206-555-0198' }, notified: '12:19 PST', acknowledged: '12:21 PST', recommendation: 'No immediate action required. Pre-position cooling resources as a precaution.' },
  { id: 5, name: 'UW Dept. of Atmospheric Sciences',         Icon: CloudIcon,  zone: 'Zone 1', currentTemp: 74.2,  threshold: 90, status: 'nominal',  contact: { name: 'Prof. Linda Wu',     email: 'l.wu@atmos.uw.edu',       phone: '206-555-0154' }, notified: '12:19 PST', acknowledged: '12:22 PST', recommendation: 'No action required. Check field equipment for heat-related calibration drift.' },
  { id: 8, name: 'UW Office of Student Life',                Icon: UsersIcon,  zone: 'Zone 8', currentTemp: 73.1,  threshold: 85, status: 'nominal',  contact: { name: 'Rachel Nguyen',      email: 'r.nguyen@uw.edu',         phone: '206-555-0131' }, notified: '12:19 PST', acknowledged: '12:24 PST', recommendation: 'Issue heat advisory. Cancel or move scheduled outdoor events to indoor venues.' },
]

const notificationLog = [
  { time: '12:18 PST', type: 'alert', msg: 'Breach detected in Zone 4 and Zone 6. Automated notifications triggered.' },
  { time: '12:19 PST', type: 'sent',  msg: 'Alert dispatched to all 8 department leads.' },
  { time: '12:20 PST', type: 'ack',   msg: 'UW Facilities Services solved — Tom Reyes.' },
  { time: '12:21 PST', type: 'ack',   msg: 'UW Medicine solved — Dr. James Okafor.' },
  { time: '12:22 PST', type: 'ack',   msg: 'UW Atmospheric Sciences solved — Prof. Linda Wu.' },
  { time: '12:23 PST', type: 'ack',   msg: 'UW Public Health solved — Dr. Sarah Chen.' },
  { time: '12:24 PST', type: 'ack',   msg: 'UW Office of Student Life solved — Rachel Nguyen.' },
  { time: '12:26 PST', type: 'ack',   msg: 'UW Campus Energy solved — Kevin Park.' },
  { time: '12:28 PST', type: 'warn',  msg: 'UW Environmental Health & Safety — not yet solved.' },
  { time: '12:28 PST', type: 'warn',  msg: 'UW Housing & Food Services — not yet solved.' },
]

const statusConfig = {
  exceeded: { label: 'Exceeded', color: '#ff6b6b', bg: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.25)' },
  stable:   { label: 'Stable',   color: '#7cc8ff', bg: 'rgba(124,200,255,0.12)', border: 'rgba(124,200,255,0.25)' },
  nominal:  { label: 'Nominal',  color: '#6ee2b9', bg: 'rgba(110,226,185,0.12)', border: 'rgba(110,226,185,0.25)' },
}

const logStyle = { alert: '#ff6b6b', sent: '#7cc8ff', ack: '#6ee2b9', warn: '#ffb38a' }

export default function DepartmentalThresholdsPage({ onResolved }) {
  const [expandedId, setExpandedId]   = useState(null)
  const [logOpen, setLogOpen]         = useState(false)
  const [notified, setNotified]       = useState(new Set())
  const [escalated, setEscalated]     = useState(new Set())
  const [manualAck, setManualAck]     = useState(new Set())
  const [resent, setResent]           = useState(new Set())
  const [toast, setToast]             = useState(null)   // { message, type: 'ok'|'warn' }
  const [escalateTarget, setEscalateTarget] = useState(null) // dept object

  function showToast(message, type = 'ok') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const actionsTaken = id => notified.has(id) && escalated.has(id)

  // Notify parent when an exceeded dept is fully resolved
  function resolveIfDone(id, nextNotified, nextEscalated) {
    if (nextNotified.has(id) && nextEscalated.has(id)) onResolved?.(id)
  }
  const exceeded     = departments.filter(d => d.status === 'exceeded' && !actionsTaken(d.id))
  const pendingAck   = departments.filter(d => d.status !== 'exceeded' && !d.acknowledged && !manualAck.has(d.id))
  const underControl = departments.filter(d =>
    (d.status !== 'exceeded' && (!!d.acknowledged || manualAck.has(d.id))) ||
    (d.status === 'exceeded' && actionsTaken(d.id))
  )

  function toggle(id) { setExpandedId(prev => prev === id ? null : id) }

  function exceededActions(id) {
    const dept = departments.find(d => d.id === id)
    return [
      {
        label: notified.has(id) ? '✓ Notified' : 'Notify',
        done:  notified.has(id),
        color: '#7cc8ff',
        onClick: (e) => {
          e.stopPropagation()
          const next = new Set(notified).add(id)
          setNotified(next)
          resolveIfDone(id, next, escalated)
          showToast(`Alert resent to ${dept.contact.name}`, 'ok')
        },
      },
      {
        label: escalated.has(id) ? '✓ Escalated' : 'Escalate',
        done:  escalated.has(id),
        color: '#ff6b6b',
        onClick: (e) => {
          e.stopPropagation()
          if (!escalated.has(id)) setEscalateTarget(dept)
        },
      },
    ]
  }

  function pendingActions(id) {
    const dept = departments.find(d => d.id === id)
    return [
      {
        label: resent.has(id) ? '✓ Resent' : 'Resend Alert',
        done:  resent.has(id),
        color: '#7cc8ff',
        onClick: (e) => {
          e.stopPropagation()
          setResent(s => new Set(s).add(id))
          showToast(`Alert resent to ${dept.contact.name}`, 'ok')
        },
      },
      {
        label: 'Resolve',
        done:  false,
        color: '#6ee2b9',
        onClick: (e) => {
          e.stopPropagation()
          setManualAck(s => new Set(s).add(id))
          showToast(`${dept.name} marked as solved`, 'ok')
        },
      },
    ]
  }

  return (
    <div className="flex flex-col gap-4 md:gap-5 xl:gap-6">
      {toast && <Toast message={toast.message} type={toast.type} />}
      {escalateTarget && (
        <EscalateModal
          dept={escalateTarget}
          onConfirm={() => {
            const id = escalateTarget.id
            const dept = escalateTarget
            const next = new Set(escalated).add(id)
            setEscalated(next)
            resolveIfDone(id, notified, next)
            const alreadyNotified = notified.has(id)
            showToast(
              alreadyNotified
                ? `${dept.name} escalated — response dispatched`
                : `${dept.name} escalated to Level 3`,
              'warn'
            )
            setEscalateTarget(null)
          }}
          onClose={() => setEscalateTarget(null)}
        />
      )}
      <AlertBanner />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="m-0 text-[18px] font-bold text-ink-0 tracking-[-0.01em]">Departmental Thresholds</h1>
          <p className="m-0 mt-0.5 text-[12.5px] text-ink-3">8 departments monitored</p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <Chip value={exceeded.length}     label="Exceeded"    color="#ff6b6b" />
          <Chip value={departments.filter(d => d.status === 'stable').length}  label="Stable"   color="#7cc8ff" />
          <Chip value={departments.filter(d => d.status === 'nominal').length} label="Nominal"  color="#6ee2b9" />
          <Chip value={pendingAck.length}   label="Pending" color="#ffb38a" />
        </div>
      </div>

      {/* Threshold Exceeded */}
      {exceeded.length > 0 && (
        <section>
          <h2 className="m-0 mb-2.5 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-critical flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-critical inline-block" aria-hidden="true" />
            Threshold Exceeded · {exceeded.length}
          </h2>
          <div className="bg-bg-1 border border-line rounded-card overflow-hidden">
            {exceeded.map((d, i) => (
              <DeptRow key={d.id} dept={d} expanded={expandedId === d.id}
                onToggle={() => toggle(d.id)} isLast={i === exceeded.length - 1}
                actions={exceededActions(d.id)} />
            ))}
          </div>
        </section>
      )}

      {/* Pending */}
      {pendingAck.length > 0 && (
        <section>
          <h2 className="m-0 mb-2.5 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-warn flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-warn inline-block" aria-hidden="true" />
            Pending · {pendingAck.length}
          </h2>
          <div className="bg-bg-1 border border-line rounded-card overflow-hidden">
            {pendingAck.map((d, i) => (
              <DeptRow key={d.id} dept={d} expanded={expandedId === d.id}
                onToggle={() => toggle(d.id)} isLast={i === pendingAck.length - 1}
                actions={pendingActions(d.id)} />
            ))}
          </div>
        </section>
      )}

      {/* Under Control */}
      {underControl.length > 0 && (
        <section>
          <h2 className="m-0 mb-2.5 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-ok flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ok inline-block" aria-hidden="true" />
            Under Control · {underControl.length}
          </h2>
          <div className="bg-bg-1 border border-line rounded-card overflow-hidden">
            {underControl.map((d, i) => (
              <DeptRow key={d.id} dept={d} expanded={expandedId === d.id}
                onToggle={() => toggle(d.id)} isLast={i === underControl.length - 1} />
            ))}
          </div>
        </section>
      )}

      {/* Notification log */}
      <section>
        <button
          onClick={() => setLogOpen(o => !o)}
          className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-ink-3 hover:text-ink-1 transition-colors mb-2.5"
          aria-expanded={logOpen}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-info inline-block" aria-hidden="true" />
          Notification Log · {notificationLog.length} entries
          <span className="text-[12px] inline-block transition-transform"
            style={{ transform: logOpen ? 'rotate(90deg)' : 'none' }} aria-hidden="true">›</span>
        </button>
        {logOpen && (
          <div className="bg-bg-1 border border-line rounded-card p-4 md:p-5 flex flex-col gap-2.5">
            {notificationLog.map((entry, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="font-mono text-[11px] text-ink-3 flex-shrink-0 w-[72px] mt-0.5">{entry.time}</span>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[5px]"
                  style={{ background: logStyle[entry.type] }} aria-hidden="true" />
                <p className="m-0 text-[12.5px] text-ink-2 leading-snug">{entry.msg}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function Toast({ message, type }) {
  const color = type === 'ok' ? '#6ee2b9' : '#ffb38a'
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-[12px] text-[13px] font-medium text-ink-0"
      style={{ background: '#1a2540', border: `1px solid ${color}40`, boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${color}20` }}
      role="status"
      aria-live="polite"
    >
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} aria-hidden="true" />
      {message}
    </div>
  )
}

function EscalateModal({ dept, onConfirm, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-[420px] rounded-[16px] overflow-hidden"
          style={{ background: '#10141e', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
          role="dialog" aria-modal="true" aria-labelledby="escalate-title"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-[10px] grid place-items-center flex-shrink-0"
                style={{ background: 'rgba(255,107,107,0.15)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div>
                <h2 id="escalate-title" className="m-0 text-[15px] font-bold text-ink-0 leading-tight">Confirm Escalation</h2>
                <p className="m-0 mt-0.5 text-[12px] text-ink-3">This will escalate the alert level for this department.</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 flex flex-col gap-4">
            {/* Department */}
            <div className="rounded-[10px] px-4 py-3.5" style={{ background: 'rgba(255,107,107,0.07)', border: '1px solid rgba(255,107,107,0.20)' }}>
              <p className="m-0 text-[13px] font-semibold text-ink-0">{dept.name}</p>
              <p className="m-0 mt-0.5 text-[12px] text-ink-3">{dept.zone} · {dept.currentTemp}°F · {dept.contact.name}</p>
            </div>

            {/* Level change */}
            <div className="flex items-center gap-3">
              <div className="flex-1 text-center px-3 py-2.5 rounded-lg" style={{ background: 'rgba(255,179,138,0.10)', border: '1px solid rgba(255,179,138,0.25)' }}>
                <p className="m-0 text-[10px] uppercase tracking-[0.07em] text-ink-3">Current</p>
                <p className="m-0 mt-1 text-[14px] font-bold text-warn">Level 2</p>
              </div>
              <span className="text-ink-3 text-lg">→</span>
              <div className="flex-1 text-center px-3 py-2.5 rounded-lg" style={{ background: 'rgba(255,107,107,0.10)', border: '1px solid rgba(255,107,107,0.25)' }}>
                <p className="m-0 text-[10px] uppercase tracking-[0.07em] text-ink-3">Escalating to</p>
                <p className="m-0 mt-1 text-[14px] font-bold text-critical">Level 3</p>
              </div>
            </div>

            <p className="m-0 text-[12.5px] text-ink-3 leading-relaxed">
              Level 3 will trigger full emergency response protocols and notify external services including EMS and the City of Seattle.
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-[10px] text-[13px] font-semibold bg-bg-3 text-ink-0 border border-line hover:bg-bg-2 transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm}
              className="flex-1 py-2.5 rounded-[10px] text-[13px] font-semibold text-white transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(180deg,#ff6b4c,#e8492a)', boxShadow: '0 4px 14px rgba(232,73,42,0.35)' }}>
              Confirm Escalation
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function Chip({ value, label, color }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-2 border border-line">
      <span className="text-[14px] font-bold" style={{ color }}>{value}</span>
      <span className="text-[11.5px] text-ink-3">{label}</span>
    </div>
  )
}

function DeptRow({ dept, expanded, onToggle, isLast, actions = [] }) {
  const s    = statusConfig[dept.status]
  const diff = (dept.currentTemp - dept.threshold).toFixed(1)
  const over = dept.currentTemp > dept.threshold
  const { Icon } = dept

  return (
    <div style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3.5 flex items-center gap-3 hover:bg-bg-2 transition-colors"
        aria-expanded={expanded}
      >
        <div className="w-8 h-8 rounded-lg grid place-items-center flex-shrink-0"
          style={{ background: s.bg, color: s.color }}>
          <Icon className="w-3.5 h-3.5" aria-hidden="true" />
        </div>
        <span className="flex-1 min-w-0 text-[13px] font-medium text-ink-0 truncate">{dept.name}</span>
        <span className="font-mono text-[13px] font-semibold flex-shrink-0" style={{ color: s.color }}>
          {dept.currentTemp}°F{over && <span className="text-critical text-[11px] ml-1">+{diff}</span>}
        </span>
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 hidden sm:block"
          style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
          {s.label}
        </span>
        <span className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: dept.acknowledged ? '#6ee2b9' : '#ffb38a' }}
          aria-label={dept.acknowledged ? 'Solved' : 'Pending'} />
        <span className="text-ink-3 text-[14px] flex-shrink-0 transition-transform"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }} aria-hidden="true">›</span>
      </button>

      {expanded && (
        <div className="px-4 md:px-5 pb-5 pt-4 flex flex-col gap-4 ml-0 md:ml-11"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="rounded-[10px] px-4 py-3.5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="m-0 mb-1 text-[10px] font-semibold uppercase tracking-[0.09em] text-ink-3">AI Recommendation</p>
            <p className="m-0 text-[12.5px] text-ink-1 leading-relaxed">{dept.recommendation}</p>
          </div>
          <div className="flex items-center gap-8 flex-wrap justify-between">
            <div>
              <p className="m-0 text-[10px] uppercase tracking-[0.07em] text-ink-3">Contact</p>
              <p className="m-0 mt-0.5 text-[12.5px] font-medium text-ink-1">{dept.contact.name}</p>
            </div>
            <div>
              <p className="m-0 text-[10px] uppercase tracking-[0.07em] text-ink-3">Email</p>
              <p className="m-0 mt-0.5 text-[12.5px]" style={{ color: '#7cc8ff' }}>{dept.contact.email}</p>
            </div>
            <div>
              <p className="m-0 text-[10px] uppercase tracking-[0.07em] text-ink-3">Status</p>
              <p className="m-0 mt-0.5 text-[12.5px] font-medium"
                style={{ color: dept.acknowledged ? '#6ee2b9' : '#ffb38a' }}>
                {dept.acknowledged ? `✓ Solved ${dept.acknowledged}` : `Pending · notified ${dept.notified}`}
              </p>
            </div>
          {/* Quick actions — inline with contact row */}
          {actions.length > 0 && (
            <div className="flex items-center gap-2 ml-auto flex-shrink-0">
              {actions.map(a => (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  disabled={a.done}
                  className="text-[12px] font-semibold px-3.5 py-2 rounded-lg transition-all disabled:cursor-default"
                  style={a.done
                    ? { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.30)', border: '1px solid rgba(255,255,255,0.08)' }
                    : { background: a.color, color: '#0b0e14', border: `1px solid ${a.color}`, boxShadow: `0 2px 8px ${a.color}35` }
                  }
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  )
}
