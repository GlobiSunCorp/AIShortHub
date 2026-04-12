import { useMemo, useState } from 'react';

const presetUsers = {
  member: { id: 'u_viewer', name: 'Mia Member', email: 'mia@example.com', avatar: 'MM', role: 'member' },
  creator: { id: 'u_creator', name: 'Luma Studio', email: 'creator@example.com', avatar: 'LS', role: 'creator' },
  admin: { id: 'u_admin', name: 'Ops Admin', email: 'admin@example.com', avatar: 'OA', role: 'admin' },
};

function inferRoleFromEmail(email = '') {
  if (email.includes('admin')) return 'admin';
  if (email.includes('creator')) return 'creator';
  return 'member';
}

export function useAuthMock() {
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState('');

  const login = (email = 'mia@example.com', role) => {
    const inferredRole = role || inferRoleFromEmail(email);
    const presetByEmail = Object.values(presetUsers).find((item) => item.email === email);
    const preset = presetByEmail || presetUsers[inferredRole] || presetUsers.member;
    setUser({ ...preset, email });
    setNotice('');
  };

  const signup = ({ email, role = 'member' }) => {
    const fallback = presetUsers[role] || presetUsers.member;
    const handle = (email || 'new@aishorthub.com').split('@')[0] || 'new';
    setUser({
      id: `u_${handle.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12)}`,
      name: handle,
      email: email || 'new@aishorthub.com',
      avatar: handle.slice(0, 2).toUpperCase(),
      role,
      tier: role === 'member' ? 'pro_monthly' : fallback.role === 'creator' ? 'pro_monthly' : 'pro_yearly',
    });
    setNotice('');
  };

  const requestPasswordReset = (email) => {
    setNotice(`Reset link has been mocked and sent to ${email}.`);
    return true;
  };

  const logout = () => {
    setUser(null);
    setNotice('');
  };

  return useMemo(() => {
    const userState = user?.role || 'guest';
    return {
      isLoggedIn: Boolean(user),
      isMember: ['member', 'creator', 'admin'].includes(userState),
      userState,
      user,
      notice,
      login,
      signup,
      requestPasswordReset,
      logout,
    };
  }, [user, notice]);
}
