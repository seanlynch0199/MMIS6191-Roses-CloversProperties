import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="nav-bar">
      <span className="nav-brand">Roses &amp; Clovers Admin</span>
      <div className="nav-links">
        <NavLink to="/properties" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Properties</NavLink>
        <NavLink to="/tenants" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Tenants</NavLink>
        <NavLink to="/leases" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Leases</NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
