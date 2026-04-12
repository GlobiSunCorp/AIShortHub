import { FloatingCreatorToolbox } from '../components/FloatingCreatorToolbox';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export function AppLayout({ auth, platform, children }) {
  return (
    <div className="app-shell">
      <Header auth={auth} platform={platform} />
      <main className="container page-shell">{children}</main>
      <FloatingCreatorToolbox auth={auth} platform={platform} />
      <Footer />
    </div>
  );
}
