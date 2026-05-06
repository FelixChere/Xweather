import { useState } from 'react'
import {
  GridIcon,
  PulseIcon,
  ThermometerIcon,
  RadioIcon,
  FileIcon,
  SettingsIcon,
  AlertIcon,
} from './Icons.jsx'
import EmergencyAlertModal from './EmergencyAlertModal.jsx'

const navItems = [
  { label: 'Command Center',          Icon: GridIcon,       pageKey: 'dashboard' },
  { label: 'Departmental Thresholds', Icon: PulseIcon,      pageKey: 'thresholds', badge: 1 },
  { label: 'TempCast Analytics',      Icon: ThermometerIcon, pageKey: 'tempcast' },
  { label: 'Response Hub',            Icon: RadioIcon,      pageKey: 'hub'       },
]

const workspaceItems = [
  { label: 'Reports', Icon: FileIcon, pageKey: 'reports' },
  { label: 'Settings', Icon: SettingsIcon, pageKey: 'settings' },
]

// Shared inner content — used by both the desktop rail and the tablet drawer
export function SidebarInner({ onClose, page, setPage, exceededBadge, onStartTour }) {
  const [modalOpen, setModalOpen]     = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [logoutOpen, setLogoutOpen]   = useState(false)
  return (
    <>
      <div className="flex items-center gap-2.5 px-2 pt-1.5 pb-[22px]">
        <div className="w-8 h-8 rounded-[9px] brand-mark-grad grid place-items-center overflow-hidden">
          <img src="/xweather-logo.png" alt="XWeather logo" className="w-5 h-5 object-contain" style={{ mixBlendMode: 'multiply' }} />
        </div>
        <div className="flex-1">
          <div className="font-semibold tracking-[-0.01em] text-[15px] leading-tight">UW XWeather</div>
          <div className="text-ink-3 text-[11px] tracking-[0.08em] uppercase mt-0.5">Vigilant Lens</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="w-7 h-7 grid place-items-center rounded-md text-ink-2 hover:text-ink-0 hover:bg-bg-2 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      <nav data-tour="nav" className="flex flex-col gap-0.5 mt-1">
        <SectionLabel>Operations</SectionLabel>
        {navItems.map((item) => (
          <NavItem key={item.label} {...item}
            active={item.pageKey === page}
            onClick={item.pageKey ? () => setPage?.(item.pageKey) : undefined}
            badge={item.pageKey === 'thresholds' ? (exceededBadge || null) : item.badge}
          />
        ))}
        <SectionLabel>Workspace</SectionLabel>
        {workspaceItems.map((item) => (
          <NavItem key={item.label} {...item}
            active={item.pageKey === page}
            onClick={item.pageKey ? () => setPage?.(item.pageKey) : undefined}
          />
        ))}
      </nav>

      {modalOpen && <EmergencyAlertModal onClose={() => setModalOpen(false)} />}

      <div data-tour="emergency-cta" className="mt-auto">
        <button
          onClick={() => setModalOpen(true)}
          data-tour="emergency-btn"
          className="w-full alert-btn-grad text-white px-3 py-[11px] rounded-[10px] font-semibold text-[13px] flex items-center justify-center gap-2 hover:brightness-110 transition"
        >
          <AlertIcon className="w-3.5 h-3.5" aria-hidden="true" />
          Trigger Emergency Alert
        </button>
        <div className="flex flex-col gap-1.5 px-2 text-ink-3 text-xs mt-4 pt-4 border-t border-line-soft">
          <button onClick={() => setSupportOpen(true)} className="text-left hover:text-ink-1 transition-colors">Support</button>
          <button onClick={() => setLogoutOpen(true)}  className="text-left hover:text-ink-1 transition-colors">Log out</button>
        </div>
      {supportOpen && <SupportModal onClose={() => setSupportOpen(false)} onStartTour={onStartTour} />}
      {logoutOpen  && <LogoutModal  onClose={() => setLogoutOpen(false)} />}
      </div>
    </>
  )
}

function SimpleModal({ title, onClose, children }) {
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[400px] rounded-[16px] overflow-hidden"
          style={{ background: '#10141e', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
          role="dialog" aria-modal="true">
          <div className="flex items-center justify-between px-6 py-5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <h2 className="m-0 text-[15px] font-bold text-ink-0">{title}</h2>
            <button onClick={onClose}
              className="w-7 h-7 grid place-items-center rounded-lg text-ink-2 hover:text-ink-0 hover:bg-bg-2 transition-colors">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div className="px-6 py-5">{children}</div>
        </div>
      </div>
    </>
  )
}

function SupportModal({ onClose, onStartTour }) {
  return (
    <SimpleModal title="Support" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="m-0 text-[13px] text-ink-1 leading-relaxed">
          For urgent issues during an active incident, contact the XWeather operations team directly.
        </p>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => { onClose(); onStartTour() }}
            className="flex items-center gap-3 px-4 py-3 rounded-[10px] bg-bg-2 border border-line hover:bg-bg-3 transition-colors w-full text-left">
            <span className="text-[13px] font-medium" style={{ color: '#7cc8ff' }}>👆 Restart dashboard tour</span>
          </button>
          <a href="mailto:support@xweather.uw.edu"
            className="flex items-center gap-3 px-4 py-3 rounded-[10px] bg-bg-2 border border-line hover:bg-bg-3 transition-colors">
            <span className="text-[13px] font-medium text-info">support@xweather.uw.edu</span>
          </a>
          <div className="flex items-center gap-3 px-4 py-3 rounded-[10px] bg-bg-2 border border-line">
            <span className="text-[13px] text-ink-1">Emergency Hotline</span>
            <span className="text-[13px] font-mono text-ink-0 ml-auto">206-555-0199</span>
          </div>
        </div>
        <button onClick={onClose}
          className="w-full py-2.5 rounded-[10px] text-[13px] font-semibold bg-bg-3 text-ink-0 border border-line hover:bg-bg-2 transition-colors mt-1">
          Close
        </button>
      </div>
    </SimpleModal>
  )
}

function LogoutModal({ onClose }) {
  return (
    <SimpleModal title="Log out" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="m-0 text-[13px] text-ink-1 leading-relaxed">
          Are you sure you want to log out? Any active incident monitoring will continue running in the background.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-[10px] text-[13px] font-semibold bg-bg-3 text-ink-0 border border-line hover:bg-bg-2 transition-colors">
            Cancel
          </button>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-[10px] text-[13px] font-semibold transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(180deg,#ff6b4c,#e8492a)', color: 'white', boxShadow: '0 4px 14px rgba(232,73,42,0.30)' }}>
            Log out
          </button>
        </div>
      </div>
    </SimpleModal>
  )
}

// Desktop rail — sits in the CSS grid, hidden on tablet
export default function Sidebar({ page, setPage, exceededBadge, onStartTour }) {
  return (
    <aside data-tour="sidebar" className="hidden lg:flex row-span-2 bg-bg-1 border-r border-line-soft flex-col px-3.5 py-[18px]">
      <SidebarInner page={page} setPage={setPage} exceededBadge={exceededBadge} onStartTour={onStartTour} />
    </aside>
  )
}

function SectionLabel({ children }) {
  return (
    <div className="text-ink-3 text-[10px] tracking-[0.1em] uppercase px-2.5 pt-3.5 pb-1.5">
      {children}
    </div>
  )
}

function NavItem({ label, Icon, active, badge, onClick }) {
  return (
    <button
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-2.5 h-[52px] rounded-lg text-[13.5px] font-medium transition-colors text-left ${
        active
          ? 'bg-bg-3 text-ink-0 sidebar-active'
          : onClick ? 'text-ink-1 hover:bg-bg-2' : 'text-ink-3 cursor-default'
      }`}
    >
      <Icon className="w-4 h-4 opacity-80" aria-hidden="true" />
      <span>{label}</span>
      {badge ? (
        <span
          className="ml-auto text-[10.5px] bg-critical/10 text-critical px-1.5 py-0.5 rounded-full font-semibold"
          aria-label={`${badge} notification`}
        >
          {badge}
        </span>
      ) : null}
    </button>
  )
}
