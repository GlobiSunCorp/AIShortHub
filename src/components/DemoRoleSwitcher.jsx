import { DEMO_ROLE_OPTIONS } from '../lib/roleDisplay';

export function DemoRoleSwitcher({ auth, compact = false, className = '' }) {
  const current = auth.demoRole;

  return (
    <div className={`role-switcher ${className}`.trim()}>
      <label className="small-text" htmlFor={compact ? 'demo-role-select-compact' : 'demo-role-select'}>
        Demo Role Switcher
      </label>
      <select
        id={compact ? 'demo-role-select-compact' : 'demo-role-select'}
        className="input"
        value={current}
        onChange={(event) => auth.switchDemoRole(event.target.value)}
      >
        {DEMO_ROLE_OPTIONS.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
