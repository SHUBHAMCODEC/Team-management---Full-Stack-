import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Settings, LogOut, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  closeSidebar?: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar, className }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Projects', icon: <FolderKanban size={20} />, path: '/projects' },
    { name: 'My Tasks', icon: <CheckSquare size={20} />, path: '/tasks' },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ name: 'Team', icon: <Users size={20} />, path: '/team' });
  }

  return (
    <aside className={`sidebar ${className || ''}`} style={{ 
      width: 'var(--sidebar-width)', 
      background: 'var(--bg-card)', 
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
        <div style={{ background: 'var(--primary)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <CheckSquare size={18} />
        </div>
        <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>TeamTask</span>
      </div>

      <div style={{ padding: '0.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          background: 'var(--primary)', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600
        }}>
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>{user?.name}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{user?.role}</div>
        </div>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path}
            onClick={closeSidebar}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius)',
              marginBottom: '0.5rem',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              background: isActive ? 'var(--bg-main)' : 'transparent',
              fontWeight: isActive ? 600 : 500,
              transition: 'all 0.2s'
            })}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
        <button 
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: 'var(--danger)',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
