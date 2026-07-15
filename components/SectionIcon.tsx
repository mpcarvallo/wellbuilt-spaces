/**
 * One simple line-icon per questionnaire module, purely decorative (aria-hidden).
 * Keeps icons monochrome/stroke-only so they read as a quiet accent, not chrome.
 */
type SectionIconProps = {
  module: string;
  className?: string;
};

const ICON_PATHS: Record<string, React.ReactNode> = {
  "Your goals": (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  "Your household": (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
      <circle cx="17" cy="9.5" r="2.2" />
      <path d="M14.8 20c0-2.6 1-4.3 2.8-4.3" />
    </>
  ),
  "Your home": (
    <>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9.5h12V10" />
    </>
  ),
  "Your capacity": (
    <>
      <line x1="4" y1="7" x2="20" y2="7" />
      <circle cx="9" cy="7" r="1.6" fill="currentColor" stroke="none" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="15" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <line x1="4" y1="17" x2="20" y2="17" />
      <circle cx="11" cy="17" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  "Air and kitchen": (
    <path d="M12 21c4 0 6-2.4 6-5.8 0-2.8-1.8-3.8-2.8-5.6 0 1.8-.9 2.8-1.8 2.8.4-2.8-.9-4.6-2.7-5.6 0 2.8-2.8 3.7-2.8 7.4 0 .9.3 1.7.6 2.3A3.7 3.7 0 0 0 12 21Z" />
  ),
  "Air and moisture": (
    <path d="M12 3.2c3.6 4.1 6.2 7.4 6.2 10.8a6.2 6.2 0 1 1-12.4 0c0-3.4 2.6-6.7 6.2-10.8Z" />
  ),
  "Air and systems": (
    <>
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <path d="M12 11c0-3.2 2-5.2 5.2-5.2" />
      <path d="M12 13c0 3.2-2 5.2-5.2 5.2" />
      <path d="M11 12c-3.2 0-5.2-2-5.2-5.2" />
    </>
  ),
  "Materials and routines": (
    <>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="M3 12l9 5 9-5" />
      <path d="M3 16l9 5 9-5" />
    </>
  ),
  Water: (
    <>
      <path d="M3 10.5c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M3 15.5c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </>
  ),
  "Light and sleep": <path d="M20 14.6A8.6 8.6 0 1 1 9.4 4a7.1 7.1 0 0 0 10.6 10.6Z" />,
  "Light and comfort": (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2.2M12 18.8V21M4.2 4.2l1.5 1.5M18.3 18.3l1.5 1.5M3 12h2.2M18.8 12H21M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5" />
    </>
  ),
  "Comfort and function": (
    <>
      <path d="M5.5 12.5V8.8a2.2 2.2 0 0 1 2.2-2.2h8.6a2.2 2.2 0 0 1 2.2 2.2v3.7" />
      <path d="M4 12.5h16v3.8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3.8Z" />
      <path d="M6.5 18.3v1.7M17.5 18.3v1.7" />
    </>
  ),
  Sustainability: (
    <>
      <path d="M5 20c0-8.3 4.2-14.2 14-14.2 0 10.3-6.2 14.2-14 14.2Z" />
      <path d="M5 20c3-3.1 6.2-6.5 9.4-11.3" />
    </>
  ),
  Maintenance: (
    <path d="M14.6 6.4a4 4 0 0 0-5.3 5.3L4 16.9l3.1 3.1 5.2-5.3a4 4 0 0 0 5.3-5.3l-2.8 2.8-2-2 2.8-2.8Z" />
  ),
  "Your starting point": (
    <>
      <path d="M6 21V4" />
      <path d="M6 4.5h11l-2.5 4 2.5 4H6" />
    </>
  ),
};

export default function SectionIcon({ module, className }: SectionIconProps) {
  const content = ICON_PATHS[module];
  if (!content) return null;
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "h-6 w-6 shrink-0 text-moss"}
    >
      {content}
    </svg>
  );
}
