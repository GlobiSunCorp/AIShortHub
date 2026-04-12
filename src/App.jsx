import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminPage from "./pages/AdminPage";
import BrowsePage from "./pages/BrowsePage";
import CreatorDashboardPage from "./pages/CreatorDashboardPage";
import HomePage from "./pages/HomePage";
import PricingPage from "./pages/PricingPage";
import SeriesDetailPage from "./pages/SeriesDetailPage";
import SubmitPage from "./pages/SubmitPage";
import WatchPage from "./pages/WatchPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="browse" element={<BrowsePage />} />
          <Route path="series/:id" element={<SeriesDetailPage />} />
          <Route path="watch/:id/:episode" element={<WatchPage />} />
          <Route path="submit" element={<SubmitPage />} />
          <Route path="creator" element={<CreatorDashboardPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
