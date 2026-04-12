import { useMemo, useState } from 'react';

export function useAuthMock() {
  const [user, setUser] = useState(null);

  const login = (email = 'demo@aishorthub.com') => {
    setUser({ name: 'Demo Viewer', email, avatar: 'DV' });
  };

  const logout = () => setUser(null);

  const authState = useMemo(
    () => ({
      isLoggedIn: Boolean(user),
      user,
      login,
      logout,
    }),
    [user]
  );

  return authState;
}
