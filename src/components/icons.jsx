const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

const Icon = ({ size = 20, children, ...rest }) => (
  <svg {...base} width={size} height={size} {...rest}>
    {children}
  </svg>
)

export const Play = (p) => (
  <Icon {...p}>
    <path d="M7 4.5v15l12-7.5-12-7.5z" fill="currentColor" stroke="none" />
  </Icon>
)

export const Pause = (p) => (
  <Icon {...p}>
    <rect x="6.5" y="4.5" width="4" height="15" rx="1.4" fill="currentColor" stroke="none" />
    <rect x="13.5" y="4.5" width="4" height="15" rx="1.4" fill="currentColor" stroke="none" />
  </Icon>
)

export const SkipForward = (p) => (
  <Icon {...p}>
    <path d="M5 5.5v13l9-6.5-9-6.5z" fill="currentColor" stroke="none" />
    <path d="M18 5v14" />
  </Icon>
)

export const SkipBack = (p) => (
  <Icon {...p}>
    <path d="M19 5.5v13l-9-6.5 9-6.5z" fill="currentColor" stroke="none" />
    <path d="M6 5v14" />
  </Icon>
)

export const Rotate = (p) => (
  <Icon {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </Icon>
)

export const Gear = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9h-.2a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.4 8a1.7 1.7 0 0 0-.4-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 2.9-1.2V2a2 2 0 1 1 4 0v.1A1.7 1.7 0 0 0 16 3.7a1.7 1.7 0 0 0 1.9-.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1.1z" />
  </Icon>
)

export const Sun = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
)

export const Moon = (p) => (
  <Icon {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
  </Icon>
)

export const Monitor = (p) => (
  <Icon {...p}>
    <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
    <path d="M8.5 20.5h7M12 16.5v4" />
  </Icon>
)

export const Music = (p) => (
  <Icon {...p}>
    <path d="M9 18V6l11-2v12" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="17" cy="16" r="3" />
  </Icon>
)

export const Close = (p) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
)

export const Check = (p) => (
  <Icon {...p}>
    <path d="M4 12.5l5 5L20 6.5" />
  </Icon>
)

export const Flame = (p) => (
  <Icon {...p}>
    <path d="M12 2s5 4.5 5 9a5 5 0 0 1-10 0c0-1.6.7-3 1.5-4 .2 1.2.9 2 1.8 2 1.2 0 1.7-1.2 1.7-3 0-1.6-.5-3-.5-4z" />
    <path d="M7 13a5 5 0 0 0 10 0" opacity="0" />
  </Icon>
)

export const Coffee = (p) => (
  <Icon {...p}>
    <path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z" />
    <path d="M17 10.5h1.5a2.5 2.5 0 0 1 0 5H17" />
    <path d="M7 2.5v3M11 2.5v3" />
  </Icon>
)

export const Palm = (p) => (
  <Icon {...p}>
    <path d="M12 21c0-5 .6-8.5 1.5-11" />
    <path d="M13.5 10c-1.8-2.2-4.6-2.6-6.5-1M13.5 10c2.4-1.4 5.2-.8 6.6 1M13.5 10c-.6-2.7.5-5.2 2.4-6.3M13.5 10c-2.3-1.1-5-.6-6.4 1.3" />
  </Icon>
)
