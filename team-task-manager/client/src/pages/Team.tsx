import React, { useEffect, useState } from 'react';
import { User, Mail, Shield, Trash2 } from 'lucide-react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const Team: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchUsers = async () => {
    if (user?.role !== 'ADMIN') {
      setLoading(false);
      return;
    }
    try {
      const res = await API.get('/auth/users');
      setUsers(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    try {
      await API.delete(`/auth/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Team Management</h1>
      <div className="card table-responsive" style={{ padding: 0 }}>
        {loading ? (
          <div className="skeleton" style={{ height: '400px', width: '100%' }}></div>
        ) : (
          <div className="team-list-container">
            {/* Desktop Table View */}
            <div className="hide-on-mobile">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>User</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div className="flex items-center gap-3">
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)20', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{u.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ padding: '0.25rem 0.5rem', background: '#dcfce7', color: '#15803d', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Active</span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        {user?.role === 'ADMIN' && u._id !== user.id && (
                          <button 
                            className="btn btn-outline" 
                            style={{ padding: '0.4rem', color: 'var(--danger)' }}
                            onClick={() => handleDeleteUser(u._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="show-on-mobile" style={{ display: 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                {users.map((u: any) => (
                  <div key={u._id} className="card" style={{ padding: '1rem', marginBottom: 0 }}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)20', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                        </div>
                      </div>
                      {user?.role === 'ADMIN' && u._id !== user.id && (
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '0.4rem', color: 'var(--danger)', width: 'auto' }}
                          onClick={() => handleDeleteUser(u._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                      <div style={{ fontSize: '0.875rem' }}>
                        <span style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}>Role:</span>
                        <span style={{ fontWeight: 600 }}>{u.role}</span>
                      </div>
                      <span style={{ padding: '0.25rem 0.5rem', background: '#dcfce7', color: '#15803d', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
