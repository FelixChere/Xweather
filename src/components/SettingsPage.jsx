import { useState } from 'react'

const SECTIONS = ['Profile', 'Alert Thresholds', 'Notifications', 'Sensors']

// ── Helpers ───────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 bg-transparent border-0 p-0 cursor-pointer text-left"
    >
      <span
        className="relative w-10 h-6 rounded-full transition-colors flex-shrink-0"
        style={{ background: checked ? '#7cc8ff' : 'rgba(255,255,255,0.15)' }}
      >
        <span
          className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
          style={{ transform: checked ? 'translateX(20px)' : 'translateX(4px)' }}
        />
      </span>
      {label && <span className="text-[13px] text-ink-1">{label}</span>}
    </button>
  )
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">{label}</label>
      {children}
      {hint && <p className="m-0 text-[11.5px] text-ink-3">{hint}</p>}
    </div>
  )
}

function Input({ value, onChange, type = 'text', ...props }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-bg-3 border border-line rounded-lg px-3 py-2.5 text-[13px] text-ink-0 outline-none focus-visible:border-info/50 transition-colors"
      {...props}
    />
  )
}

function SaveBar({ onSave, saved }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4"
      style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      {saved && <span className="text-[12.5px] text-ok">✓ Saved</span>}
      <button
        onClick={onSave}
        className="px-5 py-2 rounded-lg text-[13px] font-semibold transition-all hover:brightness-110"
        style={{ background: 'linear-gradient(180deg,#7cc8ff,#5ab0f0)', color: '#0b1520' }}
      >
        Save Changes
      </button>
    </div>
  )
}

// ── Section: Profile ──────────────────────────────────────────────────────────

function ProfileSection() {
  const [name, setName]   = useState('Jordan Martinez')
  const [role, setRole]   = useState('Emergency Operations Manager')
  const [email, setEmail] = useState('j.martinez@uw.edu')
  const [phone, setPhone] = useState('206-555-0101')
  const [saved, setSaved] = useState(false)

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full avatar-grad grid place-items-center text-white font-bold text-xl flex-shrink-0">
          JM
        </div>
        <div>
          <p className="m-0 text-[15px] font-bold text-ink-0">{name}</p>
          <p className="m-0 text-[13px] text-ink-3 mt-0.5">{role}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Full Name">
          <Input value={name} onChange={setName} />
        </Field>
        <Field label="Role">
          <Input value={role} onChange={setRole} />
        </Field>
        <Field label="Email">
          <Input value={email} onChange={setEmail} type="email" />
        </Field>
        <Field label="Phone">
          <Input value={phone} onChange={setPhone} type="tel" />
        </Field>
      </div>
      <SaveBar onSave={save} saved={saved} />
    </div>
  )
}

// ── Section: Alert Thresholds ─────────────────────────────────────────────────

function AlertThresholdsSection() {
  const [globalLimit, setGlobalLimit] = useState(95)
  const [l1Temp, setL1Temp]           = useState(88)
  const [l2Temp, setL2Temp]           = useState(95)
  const [l3Temp, setL3Temp]           = useState(102)
  const [l1Dur, setL1Dur]             = useState(30)
  const [l2Dur, setL2Dur]             = useState(60)
  const [l3Dur, setL3Dur]             = useState(90)
  const [saved, setSaved]             = useState(false)

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const levels = [
    { num: 1, color: '#6ee2b9', label: 'Precautionary', temp: l1Temp, setTemp: setL1Temp, dur: l1Dur, setDur: setL1Dur },
    { num: 2, color: '#ffb38a', label: 'Active',        temp: l2Temp, setTemp: setL2Temp, dur: l2Dur, setDur: setL2Dur },
    { num: 3, color: '#ff6b6b', label: 'Critical',      temp: l3Temp, setTemp: setL3Temp, dur: l3Dur, setDur: setL3Dur },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Field label="Global Temperature Limit (°F)"
        hint="The default threshold across all zones. Individual departments can override this.">
        <div className="flex items-center gap-4">
          <input type="range" min={70} max={115} value={globalLimit}
            onChange={e => setGlobalLimit(Number(e.target.value))}
            className="flex-1 accent-info" />
          <span className="font-mono text-[16px] font-bold text-info w-16 text-right">{globalLimit}°F</span>
        </div>
      </Field>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20 }}>
        <p className="m-0 mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">Alert Level Triggers</p>
        <div className="flex flex-col gap-3">
          {levels.map(l => (
            <div key={l.num} className="rounded-[12px] px-4 py-4 flex flex-col gap-3"
              style={{ background: `${l.color}08`, border: `1px solid ${l.color}25` }}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} aria-hidden="true" />
                <span className="text-[13px] font-semibold" style={{ color: l.color }}>
                  Level {l.num} — {l.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Temp threshold (°F)">
                  <Input value={l.temp} onChange={v => l.setTemp(Number(v))} type="number" min={70} max={120} />
                </Field>
                <Field label="Duration (min)" hint="Time above threshold before triggering">
                  <Input value={l.dur} onChange={v => l.setDur(Number(v))} type="number" min={1} max={240} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SaveBar onSave={save} saved={saved} />
    </div>
  )
}

// ── Section: Notifications ────────────────────────────────────────────────────

const LEVEL_COLORS = { 1: '#6ee2b9', 2: '#ffb38a', 3: '#ff6b6b' }

function LevelBadge({ level, active, onClick }) {
  const color = LEVEL_COLORS[level]
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="w-7 h-7 rounded-full text-[11px] font-bold transition-all"
      style={{
        background: active ? `${color}25` : 'rgba(255,255,255,0.06)',
        color: active ? color : 'rgba(255,255,255,0.25)',
        border: `1px solid ${active ? `${color}50` : 'rgba(255,255,255,0.10)'}`,
      }}
    >
      {level}
    </button>
  )
}

function NotificationsSection() {
  const [channels, setChannels] = useState([
    { id: 'email', label: 'Email',         detail: 'j.martinez@uw.edu',  enabled: true,  levels: [1,2,3] },
    { id: 'sms',   label: 'SMS',           detail: '206-555-0101',        enabled: true,  levels: [2,3]   },
    { id: 'push',  label: 'Browser Push',  detail: 'This device',         enabled: false, levels: [3]     },
  ])
  const [recipients, setRecipients] = useState([
    { id: 1, name: 'Jordan Martinez',  contact: 'j.martinez@uw.edu',  levels: [1,2,3] },
    { id: 2, name: 'Emergency Ops',    contact: 'emergency@uw.edu',   levels: [2,3]   },
    { id: 3, name: 'Operations Team',  contact: 'ops-team@uw.edu',    levels: [3]     },
  ])
  const [newName, setNewName]       = useState('')
  const [newContact, setNewContact] = useState('')
  const [saved, setSaved]           = useState(false)

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  function toggleChannel(id) {
    setChannels(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c))
  }

  function toggleChannelLevel(id, level) {
    setChannels(prev => prev.map(c => {
      if (c.id !== id) return c
      const levels = c.levels.includes(level) ? c.levels.filter(l => l !== level) : [...c.levels, level].sort()
      return { ...c, levels }
    }))
  }

  function updateChannelDetail(id, val) {
    setChannels(prev => prev.map(c => c.id === id ? { ...c, detail: val } : c))
  }

  function toggleRecipientLevel(id, level) {
    setRecipients(prev => prev.map(r => {
      if (r.id !== id) return r
      const levels = r.levels.includes(level) ? r.levels.filter(l => l !== level) : [...r.levels, level].sort()
      return { ...r, levels }
    }))
  }

  function removeRecipient(id) {
    setRecipients(prev => prev.filter(r => r.id !== id))
  }

  function addRecipient() {
    if (!newName.trim() || !newContact.trim()) return
    setRecipients(prev => [...prev, { id: Date.now(), name: newName.trim(), contact: newContact.trim(), levels: [2,3] }])
    setNewName('')
    setNewContact('')
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Channels */}
      <div>
        <p className="m-0 mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">Channels</p>
        <div className="flex flex-col gap-2.5">
          {channels.map(c => (
            <div key={c.id} className="rounded-[12px] px-4 py-3.5 flex items-center gap-4 flex-wrap"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Toggle checked={c.enabled} onChange={() => toggleChannel(c.id)} label="" />
              <div className="flex-1 min-w-0">
                <p className="m-0 text-[13px] font-semibold text-ink-0">{c.label}</p>
                <input
                  value={c.detail}
                  onChange={e => updateChannelDetail(c.id, e.target.value)}
                  disabled={!c.enabled}
                  className="mt-0.5 bg-transparent border-0 p-0 text-[12px] text-ink-3 outline-none w-full disabled:opacity-40"
                />
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[11px] text-ink-3 mr-1">Levels:</span>
                {[1,2,3].map(l => (
                  <LevelBadge key={l} level={l}
                    active={c.enabled && c.levels.includes(l)}
                    onClick={() => c.enabled && toggleChannelLevel(c.id, l)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipients */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24 }}>
        <p className="m-0 mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">
          Recipients
          <span className="ml-2 normal-case font-normal tracking-normal text-ink-3">· Levels indicate which alert levels trigger a notification</span>
        </p>

        <div className="flex flex-col gap-2 mb-3">
          {recipients.map(r => (
            <div key={r.id} className="flex items-center gap-3 px-4 py-3 rounded-[10px] bg-bg-2 border border-line-soft flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="m-0 text-[13px] font-medium text-ink-0">{r.name}</p>
                <p className="m-0 text-[11.5px] text-ink-3">{r.contact}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {[1,2,3].map(l => (
                  <LevelBadge key={l} level={l}
                    active={r.levels.includes(l)}
                    onClick={() => toggleRecipientLevel(r.id, l)}
                  />
                ))}
              </div>
              <button
                onClick={() => removeRecipient(r.id)}
                aria-label={`Remove ${r.name}`}
                className="w-7 h-7 grid place-items-center rounded-lg text-ink-3 hover:text-ink-0 hover:bg-bg-3 transition-colors flex-shrink-0"
              >×</button>
            </div>
          ))}
        </div>

        {/* Add recipient */}
        <div className="flex gap-2 flex-wrap">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Name"
            className="flex-1 min-w-[120px] bg-bg-3 border border-line rounded-lg px-3 py-2 text-[12.5px] text-ink-0 placeholder:text-ink-3 outline-none focus-visible:border-info/50 transition-colors"
          />
          <input
            value={newContact}
            onChange={e => setNewContact(e.target.value)}
            placeholder="Email or phone"
            onKeyDown={e => e.key === 'Enter' && addRecipient()}
            className="flex-1 min-w-[160px] bg-bg-3 border border-line rounded-lg px-3 py-2 text-[12.5px] text-ink-0 placeholder:text-ink-3 outline-none focus-visible:border-info/50 transition-colors"
          />
          <button
            onClick={addRecipient}
            className="px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-colors"
            style={{ background: 'rgba(124,200,255,0.12)', color: '#7cc8ff', border: '1px solid rgba(124,200,255,0.25)' }}
          >
            + Add
          </button>
        </div>
      </div>

      <SaveBar onSave={save} saved={saved} />
    </div>
  )
}

// ── Section: Sensors ──────────────────────────────────────────────────────────

function SensorsSection() {
  const [interval, setInterval] = useState(30)
  const [sensors, setSensors]   = useState([
    { id: 'SEN-01', label: 'U District',             location: 'U District, near 15th Ave NE' },
    { id: 'SEN-02', label: 'Red Square',              location: 'Red Square, Central Campus' },
    { id: 'SEN-03', label: 'College of Environment', location: 'College of Environment, SW Campus' },
    { id: 'SEN-04', label: 'Stadium',                 location: 'Husky Stadium, SE Campus' },
  ])
  const [saved, setSaved] = useState(false)

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  function update(id, field, value) {
    setSensors(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  return (
    <div className="flex flex-col gap-5">
      <Field label="Polling Interval (seconds)"
        hint="How often each sensor reports a new reading. Current value applies during normal operation; MONITOR-2 protocol overrides to 30s.">
        <div className="flex items-center gap-4">
          <input type="range" min={10} max={300} step={10} value={interval}
            onChange={e => setInterval(Number(e.target.value))}
            className="flex-1 accent-info" />
          <span className="font-mono text-[16px] font-bold text-info w-16 text-right">{interval}s</span>
        </div>
      </Field>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20 }}>
        <p className="m-0 mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">
          Sensor Configuration — {sensors.length} deployed
        </p>
        <div className="flex flex-col gap-3">
          {sensors.map(s => (
            <div key={s.id} className="rounded-[12px] px-4 py-4 bg-bg-2 border border-line-soft flex flex-col gap-3">
              <span className="font-mono text-[11.5px] font-bold text-info">{s.id}</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Display Name">
                  <Input value={s.label} onChange={v => update(s.id, 'label', v)} />
                </Field>
                <Field label="Location Description">
                  <Input value={s.location} onChange={v => update(s.id, 'location', v)} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SaveBar onSave={save} saved={saved} />
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('Profile')

  const content = {
    'Profile':           <ProfileSection />,
    'Alert Thresholds':  <AlertThresholdsSection />,
    'Notifications':     <NotificationsSection />,
    'Sensors':           <SensorsSection />,
  }

  return (
    <div className="flex flex-col gap-4 md:gap-5 xl:gap-6">
      <div>
        <h1 className="m-0 text-[18px] font-bold text-ink-0 tracking-[-0.01em]">Settings</h1>
        <p className="m-0 mt-0.5 text-[12.5px] text-ink-3">Configure your dashboard, alerts, and sensor network</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-line">
        {SECTIONS.map(s => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className="px-4 py-2.5 text-[13px] font-medium transition-colors relative"
            style={{ color: activeSection === s ? '#f3f5f9' : '#7b8499' }}
            aria-current={activeSection === s ? 'page' : undefined}
          >
            {s}
            {activeSection === s && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-info" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-bg-1 border border-line rounded-card p-5 xl:p-6">
        {content[activeSection]}
      </div>
    </div>
  )
}
