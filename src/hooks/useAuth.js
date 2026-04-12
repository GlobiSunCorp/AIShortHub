import { useEffect, useMemo, useState } from 'react';
import { DEMO_ROLE_OPTIONS } from '../lib/roleDisplay';
import { authRequest, fetchTable, getStoredSession, hasSupabase, insertTable, saveSession } from '../lib/supabaseClient';
import { useAuthMock } from './useAuthMock';

function profileToUser(profile, fallbackEmail) {
  return {
    id: profile.id,
    name: profile.name || profile.display_name || fallbackEmail?.split('@')[0] || 'User',
    email: profile.email || fallbackEmail,
    role: profile.role || 'member',
    tier: profile.viewer_plan || 'free',
    creatorPlan: profile.creator_plan || null,
    avatar: (profile.name || 'U').slice(0, 2).toUpperCase(),
  };
}

async function ensureProfile(session, role = 'member') {
  const user = session?.user;
  if (!user) return { user: null, error: 'No user' };

  const query = `id=eq.${user.id}&select=*`;
  const profileResp = await fetchTable('profiles', query, session.access_token);
  if (profileResp.data?.length) return { user: profileToUser(profileResp.data[0], user.email), error: null };

  const payload = {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || user.email?.split('@')[0],
    role,
    viewer_plan: 'free',
    creator_plan: role === 'creator' ? 'creator_basic' : null,
  };
  const created = await insertTable('profiles', payload, session.access_token);
  if (created.error) return { user: null, error: created.error };
  return { user: profileToUser(created.data?.[0] || payload, user.email), error: null };
}

export function useAuth() {
  const mock = useAuthMock();
  const [session, setSession] = useState(() => getStoredSession());
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(hasSupabase);

  useEffect(() => {
    let mounted = true;
    async function bootstrap() {
      if (!hasSupabase || !session?.access_token) {
        setLoading(false);
        return;
      }
      const ensured = await ensureProfile(session);
      if (mounted) {
        setUser(ensured.user);
        setNotice(ensured.error ? `Profile sync warning: ${ensured.error}` : '');
        setLoading(false);
      }
    }
    bootstrap();
    return () => {
      mounted = false;
    };
  }, [session]);

  const login = async (email, password) => {
    if (!hasSupabase) return mock.login(email);
    const result = await authRequest('token?grant_type=password', { email, password });
    if (result.error) return { ok: false, message: result.error };
    saveSession(result.data);
    setSession(result.data);
    const ensured = await ensureProfile(result.data);
    setUser(ensured.user);
    return { ok: true, message: '登录成功。' };
  };

  const signup = async ({ email, password, role }) => {
    if (!hasSupabase) return mock.signup({ email, role });
    const result = await authRequest('signup', { email, password, data: { role } });
    if (result.error) return { ok: false, message: result.error };
    if (result.data?.access_token) {
      saveSession(result.data);
      setSession(result.data);
      const ensured = await ensureProfile(result.data, role);
      setUser(ensured.user);
    }
    return { ok: true, message: '注册成功，请检查邮箱验证状态。' };
  };

  const requestPasswordReset = async (email) => {
    if (!hasSupabase) return mock.requestPasswordReset(email);
    const redirectTo = `${window.location.origin}/login`;
    const result = await authRequest('recover', { email, redirect_to: redirectTo });
    if (result.error) return { ok: false, message: result.error };
    return { ok: true, message: `已发送重置链接到 ${email}` };
  };

  const logout = async () => {
    if (!hasSupabase) return mock.logout();
    saveSession(null);
    setSession(null);
    setUser(null);
  };

  const switchDemoRole = (value) => {
    if (!hasSupabase) return mock.switchDemoRole(value);
    const option = DEMO_ROLE_OPTIONS.find((item) => item.value === value);
    if (!option) return;
    setNotice('Demo Role Switcher 仅用于演示模式，真实登录态不会变更。');
  };

  if (!hasSupabase) return { ...mock, mode: 'mock', isDemoMode: true, loading: false };

  const userState = user?.role || 'guest';
  return useMemo(
    () => ({
      isLoggedIn: Boolean(user),
      isMember: ['member', 'creator', 'admin'].includes(userState),
      userState,
      user,
      session,
      notice,
      loading,
      demoRole: 'guest',
      mode: 'real',
      isDemoMode: false,
      switchDemoRole,
      login,
      signup,
      requestPasswordReset,
      logout,
    }),
    [user, session, notice, loading]
  );
}
