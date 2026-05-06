import { useState, useEffect, useRef } from 'react'
import { SearchIcon, BellIcon } from './Icons.jsx'

const PAGE_LABELS = {
  dashboard:  'Command Center',
  tempcast:   'TempCast Analytics',
  thresholds: 'Departmental Thresholds',
  hub:        'Response Hub',
  reports:    'Reports',
  settings:   'Settings',
}

const NOTIFICATIONS = [
  { id: 1, type: 'critical', msg: 'Stadium sensor exceeded 101°F — threshold breach active.',  time: '12:17 PST', read: false },
  { id: 2, type: 'warn',     msg: 'UW Housing & Food Services has not yet resolved their alert.', time: '12:28 PST', read: false },
  { id: 3, type: 'warn',     msg: 'UW Environmental Health & Safety has not yet resolved.',       time: '12:28 PST', read: false },
  { id: 4, type: 'ok',       msg: 'RU-02 dispatched to Zone 4 — Red Square.',                    time: '12:18 PST', read: true  },
  { id: 5, type: 'ok',       msg: 'UW Public Health Department resolved.',                       time: '12:23 PST', read: true  },
]

const typeColor = { critical: '#ff6b6b', warn: '#ffb38a', ok: '#6ee2b9', info: '#7cc8ff' }

function useLiveClock() {
  const [time, setTime] = useState(() => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZoneName: 'short' })
  })
  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZoneName: 'short' }))
    }, 1000)
    return () => clearInterval(t)
  }, [])
  return time
}

export default function TopBar({ onMenuClick, page = 'dashboard', setPage }) {
  const [bellOpen, setBellOpen]       = useState(false)
  const [notifications, setNotifs]    = useState(NOTIFICATIONS)
  const dropRef                       = useRef(null)
  const unread                        = notifications.filter(n => !n.read).length
  const clock                         = useLiveClock()

  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setBellOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  function markRead(id) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <header className="col-start-1 lg:col-start-2 bg-bg-1 border-b border-line-soft flex items-center px-4 md:px-5 xl:px-6 gap-4 md:gap-5 xl:gap-6">
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="lg:hidden w-8 h-8 grid place-items-center rounded-lg text-ink-1 hover:bg-bg-2 hover:text-ink-0 transition-colors flex-shrink-0"
      >
        <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
          <path d="M0 1h16M0 7h16M0 13h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        </svg>
      </button>

      <div className="text-ink-2 text-[13px]">
        Operations / <strong className="text-ink-0 font-semibold">{PAGE_LABELS[page] ?? page}</strong>
      </div>

      <div className="flex-1 max-w-[460px] mx-auto bg-bg-2 border border-line rounded-lg px-3 py-[7px] flex items-center gap-2.5 text-ink-2 text-[13px] focus-within:border-info/50 focus-within:ring-1 focus-within:ring-info/20 transition-colors">
        <SearchIcon className="w-3.5 h-3.5 text-ink-3" aria-hidden="true" />
        <input
          placeholder="Search campus map, sensors, zones…"
          aria-label="Search campus map, sensors, and zones"
          className="bg-transparent border-0 outline-none focus:outline-none text-ink-0 flex-1 text-[13px] placeholder:text-ink-3"
        />
        <span className="font-mono text-[11px] bg-bg-3 px-1.5 py-0.5 rounded text-ink-2 border border-line">⌘K</span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span className="hidden md:inline-flex items-center gap-2 px-2.5 py-[5px] rounded-full text-xs font-medium bg-ok/10 text-ok border border-ok/20">
          <span className="w-1.5 h-1.5 rounded-full bg-current live-dot" />
          System Live · <span className="font-mono">{clock}</span>
        </span>

        {/* Bell with dropdown */}
        <div ref={dropRef} className="relative">
          <button
            aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
            aria-expanded={bellOpen}
            onClick={() => setBellOpen(o => !o)}
            className="relative w-[34px] h-[34px] rounded-lg grid place-items-center bg-transparent text-ink-1 border border-transparent hover:bg-bg-2 hover:border-line transition-colors"
          >
            <BellIcon className="w-[18px] h-[18px]" />
            {unread > 0 && (
              <span className="absolute top-[6px] right-[6px] w-[8px] h-[8px] rounded-full bg-critical border-2 border-bg-1" aria-hidden="true" />
            )}
          </button>

          {bellOpen && (
            <div
              className="absolute right-0 top-[calc(100%+8px)] z-50 w-[340px] rounded-[14px] overflow-hidden"
              style={{ background: '#10141e', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}
              role="menu"
            >
              <div className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="text-[13px] font-semibold text-ink-0">
                  Notifications {unread > 0 && <span className="ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full bg-critical/15 text-critical">{unread} new</span>}
                </span>
                {unread > 0 && (
                  <button onClick={markAllRead}
                    className="text-[11.5px] text-info hover:text-ink-0 transition-colors">
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[320px] overflow-y-auto">
                {notifications.map(n => (
                  <button
                    key={n.id}
                    role="menuitem"
                    onClick={() => markRead(n.id)}
                    className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-bg-2 transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: n.read ? 0.55 : 1 }}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                      style={{ background: n.read ? 'rgba(255,255,255,0.2)' : typeColor[n.type] }} aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className="m-0 text-[12.5px] text-ink-1 leading-snug">{n.msg}</p>
                      <p className="m-0 mt-0.5 text-[11px] text-ink-3">{n.time}</p>
                    </div>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-info flex-shrink-0 mt-1.5" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-8 h-8 rounded-full avatar-grad text-white font-semibold text-xs grid place-items-center ml-1">
          JM
        </div>
      </div>
    </header>
  )
}

function IconButton({ children, ariaLabel, onClick }) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className="relative w-[34px] h-[34px] rounded-lg grid place-items-center bg-transparent text-ink-1 border border-transparent hover:bg-bg-2 hover:border-line transition-colors"
    >
      {children}
    </button>
  )
}
