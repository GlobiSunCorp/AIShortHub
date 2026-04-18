import { ErrorBoundary } from '../components/ErrorBoundary';
import { FloatingCreatorToolbox } from '../components/FloatingCreatorToolbox';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { StickyUpgradeRail } from '../components/StickyUpgradeRail';

function SilentFallback() {
  return null;
}

export function AppLayout({ auth, platform, children }) {
  return (
    <div className="app-shell">
      <ErrorBoundary>
        <Header auth={auth} platform={platform} />
      </ErrorBoundary>
      <main className="container page-shell">{children}</main>
      <ErrorBoundary>
        <FloatingCreatorToolbox auth={auth} platform={platform} />
      </ErrorBoundary>
      <ErrorBoundary>
        <StickyUpgradeRail auth={auth} platform={platform} />
      </ErrorBoundary>
      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
    </div>
  );
}
