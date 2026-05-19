import { useState, useEffect, useRef } from 'react'
import Sidebar, { SidebarInner } from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import AlertBanner from './components/AlertBanner.jsx'
import MapView from './components/MapView.jsx'
import SideRail from './components/SideRail.jsx'
import MiniCards from './components/MiniCards.jsx'
import TempCastPage from './components/TempCastPage.jsx'
import DepartmentalThresholdsPage, { departments } from './components/DepartmentalThresholdsPage.jsx'
import ResponseHubPage from './components/ResponseHubPage.jsx'
import ReportsPage from './components/ReportsPage.jsx'
import SettingsPage from './components/SettingsPage.jsx'
import SituationSummary from './components/SituationSummary.jsx'
import SpotlightTour from './components/SpotlightTour.jsx'
import { initialUnits } from './components/ResponseUnitsPanel.jsx'

function PageFade({ pageKey, children }) {
  const [visible, setVisible] = useState(false)
  const prev = useRef(pageKey)

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => { setVisible(true); prev.current = pageKey }, 80)
    return () => clearTimeout(t)
  }, [pageKey])

  return (
    <div className="motion-safe:transition-opacity motion-safe:duration-200"
      style={{ opacity: visible ? 1 : 0 }}>
      {children}
    </div>
  )
}

function MobileBlock() {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#07080f',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 32px', textAlign: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: 'white', zIndex: 9999,
    }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,#ff8a4c,#e8492a)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <img src="/xweather-logo.png" alt="XWeather" style={{ width: 28, height: 28, objectFit: 'contain', mixBlendMode: 'multiply' }} />
      </div>
      <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12, color: 'white' }}>
        XWeather Vigilant Lens
      </h1>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 280, margin: '0 0 32px' }}>
        This emergency operations dashboard is designed for desktop and tablet. Please open it on a larger screen for the full experience.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        <span>🖥</span> Best on desktop or tablet
      </div>
    </div>
  )
}

export default function App() {
  const [navOpen, setNavOpen]       = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('xw-onboarded'))

  function startTour() {
    localStorage.removeItem('xw-onboarded')
    setShowOnboarding(true)
  }
  const [page, setPage] = useState('dashboard')
  const [resolvedExceeded, setResolvedExceeded] = useState(new Set())
  const [units, setUnits] = useState(initialUnits)

  const exceededBadge = departments.filter(d =>
    d.status === 'exceeded' && !resolvedExceeded.has(d.id)
  ).length

  const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 640

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setNavOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {isMobileDevice && <MobileBlock />}
      {showOnboarding && (
        <SpotlightTour onDone={() => { setShowOnboarding(false); localStorage.setItem('xw-onboarded', '1') }} />
      )}
      {/* Tablet nav drawer (hidden on lg+) */}
      <div
        className={`fixed inset-0 z-50 lg:hidden motion-safe:transition-opacity motion-safe:duration-300 ${
          navOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setNavOpen(false)}
        />
        {/* Slide-in panel */}
        <aside
          className={`absolute top-0 left-0 bottom-0 w-[232px] bg-bg-1 border-r border-line-soft flex flex-col px-3.5 py-[18px] motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out ${
            navOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarInner onClose={() => setNavOpen(false)} page={page} setPage={p => { setPage(p); setNavOpen(false) }} exceededBadge={exceededBadge} onStartTour={startTour} />
        </aside>
      </div>

      <div className="grid grid-cols-[1fr] lg:grid-cols-[232px_1fr] grid-rows-[56px_1fr] h-screen w-screen">
        <Sidebar page={page} setPage={setPage} exceededBadge={exceededBadge} onStartTour={startTour} />
        <TopBar onMenuClick={() => setNavOpen(true)} page={page} setPage={setPage} />
        <main className="col-start-1 lg:col-start-2 overflow-auto scroll-area px-4 pt-4 pb-4 md:px-5 md:pt-5 md:pb-5 xl:px-6 xl:pt-6 xl:pb-6 main-bg">
          <PageFade pageKey={page}>
          {page === 'dashboard' && (
            <>
              <AlertBanner setPage={setPage} />
              <SituationSummary units={units} resolvedExceeded={resolvedExceeded} />
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] grid-rows-[360px] md:grid-rows-[480px] lg:grid-rows-[620px] gap-4 md:gap-5 xl:gap-6 items-stretch">
                <MapView setPage={setPage} />

                <SideRail setPage={setPage} />
              </div>
              <MiniCards units={units} setUnits={setUnits} />
            </>
          )}
          {page === 'tempcast'    && <TempCastPage />}
          {page === 'hub'        && <ResponseHubPage units={units} setUnits={setUnits} />}
          {page === 'reports'    && <ReportsPage units={units} resolvedExceeded={resolvedExceeded} />}
          {page === 'settings'   && <SettingsPage />}
          {page === 'thresholds' && (
            <DepartmentalThresholdsPage
              onResolved={id => setResolvedExceeded(s => new Set(s).add(id))}
            />
          )}
          </PageFade>
        </main>
      </div>
    </>
  )
}
