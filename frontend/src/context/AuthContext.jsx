import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null); // central store for token + role info

const storageKey = 'booking_app_auth';

export const AuthProvider = ({ children }) => {
  // Persist auth state to localStorage so refreshes keep the user signed in
  const [session, setSession] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : { token: null, username: null, role: null };
  });

  const saveSession = (nextSession) => { // keep React state and localStorage in sync
    setSession(nextSession);
    if (nextSession?.token) {
      localStorage.setItem(storageKey, JSON.stringify(nextSession));
    } else {
      localStorage.removeItem(storageKey);
    }
  };

  const logout = () => saveSession({ token: null, username: null, role: null });

  const value = useMemo(() => ({ // memoized value avoids unnecessary rerenders down the tree
    token: session.token,
    user: session.token ? { username: session.username, role: session.role } : null,
    isAuthenticated: Boolean(session.token),
    setSession: saveSession,
    logout
  }), [session]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => { // tiny hook so components can grab auth state in one line
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
