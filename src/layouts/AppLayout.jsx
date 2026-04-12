import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export function AppLayout({ auth, children }) {
  return (
    <div className="app-shell">
      <Header auth={auth} />
      <main className="container page-shell">{children}</main>
      <Footer />
    </div>
  );
}
