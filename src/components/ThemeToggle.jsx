export default function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === 'dark';

  return (
    <button
      className="theme-toggle-btn"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="tt-icon">{isDark ? '🌙' : '☀️'}</span>
      <div className={`tt-track ${isDark ? '' : 'on'}`}>
        <div className="tt-knob" />
      </div>
    </button>
  );
}
