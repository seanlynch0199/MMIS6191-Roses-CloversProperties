import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import PropertiesPage from './pages/PropertiesPage';
import TenantsPage from './pages/TenantsPage';
import LeasesPage from './pages/LeasesPage';
import NavBar from './components/NavBar';

function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/tenants" element={<TenantsPage />} />
        <Route path="/leases" element={<LeasesPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/properties" replace />} />
      <Route path="*" element={<Navigate to="/properties" replace />} />
    </Routes>
  );
}

export default App;
