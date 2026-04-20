import { createContext, useContext } from 'react';

export const RouterContext = createContext({
  pathname: '/',
  navigate: () => {},
});

export function useRouter() {
  return useContext(RouterContext);
}

function notifyRouteChange(to) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('app:navigation'));
  if (typeof to === 'string' && to.includes('#')) {
    window.dispatchEvent(new Event('hashchange'));
  }
}

export function Link({ to, className, children, onClick }) {
  const { navigate } = useRouter();

  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    navigate(to);
    notifyRouteChange(to);
  };

  return (
    <a href={to} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
