import { useMemo, useState } from 'react';

const mockUsers = {
  viewer: { id: 'u_viewer', name: 'Mia Viewer', email: 'mia@example.com', avatar: 'MV', role: 'viewer' },
  creator: { id: 'u_creator', name: 'Luma Studio', email: 'creator@example.com', avatar: 'LS', role: 'creator' },
  admin: { id: 'u_admin', name: 'Ops Admin', email: 'admin@example.com', avatar: 'OA', role: 'admin' },
};

export function useAuthMock() {
  const [user, setUser] = useState(null);

  const login = (email = 'mia@example.com', role = 'viewer') => {
    const preset = Object.values(mockUsers).find((item) => item.email === email) || mockUsers[role] || mockUsers.viewer;
    setUser(preset);
  };

  const logout = () => setUser(null);

  return useMemo(
    () => ({
      isLoggedIn: Boolean(user),
      isMember: user ? ['creator', 'admin'].includes(user.role) || user.id === 'u_viewer' : false,
      user,
      login,
      logout,
    }),
    [user]
  );
}
