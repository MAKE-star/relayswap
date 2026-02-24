export default function StarLogo() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
      <circle cx="16" cy="16" r="15" fill="#5b21b6" />
      <g stroke="white" strokeWidth="1.5" strokeLinecap="round">
        <line x1="16" y1="6" x2="16" y2="26" />
        <line x1="6" y1="16" x2="26" y2="16" />
        <line x1="9.2" y1="9.2" x2="22.8" y2="22.8" />
        <line x1="22.8" y1="9.2" x2="9.2" y2="22.8" />
      </g>
    </svg>
  );
}
