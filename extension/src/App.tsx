import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { user, loading, signOut, openLogin, refresh } = useAuth();

  if (loading) {
    return (
      <div className="popup-container">
        <div className="popup-card">
          <h1 className="popup-title">Pokebrowser</h1>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="popup-container">
        <div className="popup-card">
          <div className="pokeball-icon">
            <svg viewBox="0 0 100 100" width="64" height="64">
              <circle cx="50" cy="50" r="48" stroke="#3a5a00" strokeWidth="4" fill="none" />
              <path d="M 2 50 L 98 50" stroke="#3a5a00" strokeWidth="4" />
              <circle cx="50" cy="50" r="14" stroke="#3a5a00" strokeWidth="4" fill="none" />
              <circle cx="50" cy="50" r="6" fill="#3a5a00" />
              <path d="M 2 50 A 48 48 0 0 1 98 50 Z" fill="#3a5a00" opacity="0.15" />
            </svg>
          </div>

          <h1 className="popup-title">Pokebrowser</h1>
          <p className="popup-subtitle">Gotta catch 'em all!</p>

          <button className="btn-primary" onClick={openLogin}>
            Login / Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <div className="popup-card">
        <div className="pokeball-icon">
          <svg viewBox="0 0 100 100" width="48" height="48">
            <circle cx="50" cy="50" r="48" stroke="#3a5a00" strokeWidth="4" fill="none" />
            <path d="M 2 50 L 98 50" stroke="#3a5a00" strokeWidth="4" />
            <circle cx="50" cy="50" r="14" stroke="#3a5a00" strokeWidth="4" fill="none" />
            <circle cx="50" cy="50" r="6" fill="#3a5a00" />
            <path d="M 2 50 A 48 48 0 0 1 98 50 Z" fill="#3a5a00" opacity="0.15" />
          </svg>
        </div>

        <h1 className="popup-title popup-title--sm">Pokebrowser</h1>

        <div className="user-info">
          <div className="user-avatar">
            {(user.email?.[0] ?? "T").toUpperCase()}
          </div>
          <p className="user-email">{user.email}</p>
        </div>

        <div className="btn-group">
          <button className="btn-secondary" onClick={refresh}>
            ↻ Refresh
          </button>
          <button className="btn-danger" onClick={signOut}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
