import { DEMO_ROLE_OPTIONS } from '../lib/roleDisplay';
import { DarkSelect } from './DarkSelect';

export function DemoRoleSwitcher({ auth, compact = false, className = '' }) {
  const current = auth.demoRole;

  return (
    <div className={`role-switcher ${className}`.trim()}>
      <DarkSelect
        id={compact ? 'demo-role-select-compact' : 'demo-role-select'}
        label={`Demo Role Switcher ${auth.mode === 'real' ? '(Demo only)' : ''}`}
        value={current}
        disabled={auth.mode === 'real'}
        options={DEMO_ROLE_OPTIONS.map((item) => ({ value: item.value, label: item.label }))}
        onChange={(next) => auth.switchDemoRole(next)}
      />
    </div>
  );
}
