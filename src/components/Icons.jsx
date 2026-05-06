// Centralized SVG icon set. All icons inherit currentColor & size via className.
const iconProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
}

export const GridIcon = (p) => (
  <svg {...iconProps} {...p}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
)

export const PulseIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M3 12h4l3-9 4 18 3-9h4" />
  </svg>
)

export const ThermometerIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M14 4v10.5a4 4 0 1 1-4 0V4a2 2 0 1 1 4 0z" />
  </svg>
)

export const PinIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const FileIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

export const SettingsIcon = (p) => (
  <svg {...iconProps} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.65.27 1.09.81 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

export const AlertIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

export const SearchIcon = (p) => (
  <svg {...iconProps} {...p}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

export const BellIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

export const PlusIcon = (p) => (
  <svg {...iconProps} strokeWidth={2} {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export const MinusIcon = (p) => (
  <svg {...iconProps} strokeWidth={2} {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export const CrosshairIcon = (p) => (
  <svg {...iconProps} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </svg>
)

export const ChevronRightIcon = (p) => (
  <svg {...iconProps} {...p}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

export const FlaskIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M9 2v6L4 17a3 3 0 0 0 3 4h10a3 3 0 0 0 3-4l-5-9V2" />
    <line x1="9" y1="2" x2="15" y2="2" />
  </svg>
)

export const ServerIcon = (p) => (
  <svg {...iconProps} {...p}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
)

export const TrophyIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M6 4h12l-2 16H8z" />
    <path d="M9 8h6" />
  </svg>
)

export const LinkIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a7 7 0 0 1-9.8 9.8l-6.6 6.6a2.83 2.83 0 1 1-4-4l6.6-6.6a7 7 0 0 1 9.8-9.8l-3.8 3.8z" />
  </svg>
)

export const UsersIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

export const ActivityIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
)

export const ZapIcon = (p) => (
  <svg {...iconProps} {...p}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

export const CloudIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
)

export const WrenchIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
)

export const RadioIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M12 22V11" />
    <path d="M8.5 18.5L5 22" />
    <path d="M15.5 18.5L19 22" />
    <path d="M9 14a4.5 4.5 0 0 1 6 0" />
    <path d="M5.5 10.5a9 9 0 0 1 13 0" />
  </svg>
)

export const HomeIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
