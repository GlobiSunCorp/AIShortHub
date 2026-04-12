import { useMemo, useState } from 'react';
import { DEMO_ROLE_OPTIONS } from '../lib/roleDisplay';

const presetUsers = {
  member: { id: 'u_viewer', name: 'Mia Member', email: 'mia@example.com', avatar: 'MM', role: 'member', tier: 'free' },
  creator: { id: 'u_creator', name: 'Luma Studio', email: 'creator@example.com', avatar: 'LS', role: 'creator', tier: 'pro_monthly' },
  admin: { id: 'u_admin', name: 'Ops Admin', email: 'admin@example.com', avatar: 'OA', role: 'admin', tier: 'pro_yearly' },
};

function inferRoleFromEmail(email = '') {
  if (email.includes('admin')) return 'admin';
  if (email.includes('creator')) return 'creator';
  return 'member';
}

function buildDemoUser(option, fallbackEmail) {
  if (option.role === 'guest') return null;
  const preset = presetUsers[option.role] || presetUsers.member;
  return {
    ...preset,
    email: fallbackEmail || preset.email,
    role: option.role,
    tier: option.tier || preset.tier,
  };
}

export function useAuthMock() {
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState('');
  const [demoRole, setDemoRole] = useState('guest');

  const switchDemoRole = (demoRoleValue) => {
    const option = DEMO_ROLE_OPTIONS.find((item) => item.value === demoRoleValue) || DEMO_ROLE_OPTIONS[0];
    setDemoRole(option.value);
    const switchedUser = buildDemoUser(option);
    setUser(switchedUser);
    setNotice(option.role === 'guest' ? '已切换为 Guest，体验访客流程。' : `已切换为 ${option.label} 测试状态。`);
  };

  const login = (email = 'mia@example.com', role) => {
    if (!email) return { ok: false, message: 'Email 不能为空。' };
    if (email.includes('fail')) return { ok: false, message: '模拟登录失败，请更换邮箱后重试。' };

    const inferredRole = role || inferRoleFromEmail(email);
    const presetByEmail = Object.values(presetUsers).find((item) => item.email === email);
    const preset = presetByEmail || presetUsers[inferredRole] || presetUsers.member;
    const loggedUser = { ...preset, email, role: inferredRole, tier: preset.tier || 'free' };
    setUser(loggedUser);

    const matchedDemo = DEMO_ROLE_OPTIONS.find((item) => item.role === loggedUser.role && (item.tier || 'free') === (loggedUser.tier || 'free'));
    setDemoRole(matchedDemo?.value || (loggedUser.role === 'member' ? 'member_free' : loggedUser.role));
    setNotice('');
    return { ok: true, message: '登录成功，欢迎回来。' };
  };

  const signup = ({ email, role = 'member' }) => {
    if (!email) return { ok: false, message: 'Email 不能为空。' };
    if (email.includes('fail')) return { ok: false, message: '模拟注册失败，请稍后重试。' };

    const fallback = presetUsers[role] || presetUsers.member;
    const handle = (email || 'new@aishorthub.com').split('@')[0] || 'new';
    const tier = role === 'member' ? 'pro_monthly' : role === 'creator' ? 'pro_monthly' : fallback.tier || 'pro_yearly';

    const nextUser = {
      id: `u_${handle.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12)}`,
      name: handle,
      email,
      avatar: handle.slice(0, 2).toUpperCase(),
      role,
      tier,
    };

    setUser(nextUser);
    setDemoRole(role === 'member' ? 'member_pro_monthly' : role);
    setNotice('');
    return { ok: true, message: '注册成功，已进入体验模式。' };
  };

  const requestPasswordReset = (email) => {
    setNotice(`Reset link has been mocked and sent to ${email}.`);
    return true;
  };

  const logout = () => {
    setUser(null);
    setDemoRole('guest');
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
      demoRole,
      switchDemoRole,
      login,
      signup,
      requestPasswordReset,
      logout,
    };
  }, [user, notice, demoRole]);
}
