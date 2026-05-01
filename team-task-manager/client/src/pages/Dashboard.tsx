import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, ListTodo, AlertCircle, LayoutGrid } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import API from '../api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/tasks/stats');
        setStats(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (error) return <div style={{ color: 'var(--danger)', padding: '2rem', textAlign: 'center' }}>{error}</div>;

  const statCards = [
    { title: 'Total Tasks', value: stats?.total || 0, icon: LayoutGrid, color: '#6366f1' },
    { title: 'In Progress', value: stats?.inProgress || 0, icon: Clock, color: '#f59e0b' },
    { title: 'Completed', value: stats?.completed || 0, icon: CheckCircle2, color: '#10b981' },
    { title: 'Overdue', value: stats?.overdue || 0, icon: AlertCircle, color: '#ef4444' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Dashboard Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back! Here's what's happening with your projects today.</p>
      </div>

      <div className="grid grid-4 mb-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="card skeleton" style={{ height: '100px' }}></div>
          ))
        ) : (
          statCards.map((stat, i) => (
            <div key={i} className="card flex items-center gap-4">
              <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{stat.title}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-3">
        <div className="card grid-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2>Recent Activity</h2>
            <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '60px', width: '100%' }}></div>
              ))
            ) : (
              stats?.recentActivity?.map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between p-3" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: activity.status === 'COMPLETED' ? 'var(--success)' : 'var(--primary)' }}></div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{activity.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status changed to {activity.status}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatDistanceToNow(new Date(activity.updatedAt))} ago
                  </div>
                </div>
              ))
            )}
            {!loading && (!stats?.recentActivity || stats.recentActivity.length === 0) && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No recent activity.</div>
            )}
          </div>
        </div>
        <div className="card">
          <h3>Upcoming Deadlines</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '80px', width: '100%' }}></div>
              ))
            ) : (
              stats?.upcomingDeadlines?.map((task: any) => (
                <div key={task.id} className="p-3" style={{ borderLeft: '4px solid var(--warning)', backgroundColor: 'var(--bg-main)', borderRadius: '0 8px 8px 0' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{task.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>
                    Due {format(new Date(task.dueDate), 'MMM dd')}
                  </div>
                </div>
              ))
            )}
            {!loading && (!stats?.upcomingDeadlines || stats.upcomingDeadlines.length === 0) && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No urgent tasks found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
