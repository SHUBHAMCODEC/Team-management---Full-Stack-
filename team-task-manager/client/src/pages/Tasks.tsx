import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, PlayCircle, Folder, Trash2 } from 'lucide-react';
import API from '../api';
import { format } from 'date-fns';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateStatus = async (taskId: string, status: string) => {
    try {
      await API.put(`/tasks/${taskId}`, { status });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>My Tasks</h1>
      
      <div className="card table-responsive" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="skeleton" style={{ height: '400px', width: '100%' }}></div>
        ) : (
          <div className="tasks-list-container">
            {/* Desktop Table View */}
            <div className="hide-on-mobile">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '1rem' }}>Task</th>
                    <th style={{ padding: '1rem' }}>Project</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Priority</th>
                    <th style={{ padding: '1rem' }}>Due Date</th>
                    <th style={{ padding: '1rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task: any) => (
                    <tr key={task._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600 }}>{task.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{task.description}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div className="flex items-center gap-2">
                          <Folder size={14} color="var(--text-muted)" />
                          <span style={{ fontSize: '0.875rem' }}>{task.project?.name || 'No Project'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge badge-${task.status.toLowerCase().replace('_', '')}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          color: task.priority === 'HIGH' ? 'var(--danger)' : task.priority === 'MEDIUM' ? 'var(--warning)' : 'var(--success)'
                        }}>
                          {task.priority}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div className="flex gap-2">
                          {task.status !== 'COMPLETED' && (
                            <button className="btn btn-outline" style={{ padding: '0.25rem' }} title="Mark as Completed" onClick={() => updateStatus(task._id, 'COMPLETED')}>
                              <CheckCircle2 size={18} color="var(--success)" />
                            </button>
                          )}
                          <button className="btn btn-outline" style={{ padding: '0.25rem' }} title="Delete Task" onClick={() => handleDeleteTask(task._id)}>
                            <Trash2 size={18} color="var(--danger)" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        You have no tasks assigned.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="show-on-mobile">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                {tasks.map((task: any) => (
                  <div key={task._id} className="card" style={{ padding: '1rem', marginBottom: 0 }}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1rem' }}>{task.title}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Folder size={12} color="var(--text-muted)" />
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{task.project?.name || 'No Project'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {task.status !== 'COMPLETED' && (
                          <button className="btn btn-outline" style={{ padding: '0.4rem', width: 'auto' }} onClick={() => updateStatus(task._id, 'COMPLETED')}>
                            <CheckCircle2 size={16} color="var(--success)" />
                          </button>
                        )}
                        <button className="btn btn-outline" style={{ padding: '0.4rem', width: 'auto' }} onClick={() => handleDeleteTask(task._id)}>
                          <Trash2 size={16} color="var(--danger)" />
                        </button>
                      </div>
                    </div>
                    
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{task.description}</p>

                    <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                      <div className="flex gap-2">
                        <span className={`badge badge-${task.status.toLowerCase().replace('_', '')}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          padding: '0.25rem 0.625rem',
                          borderRadius: '9999px',
                          background: task.priority === 'HIGH' ? '#fee2e2' : task.priority === 'MEDIUM' ? '#fef3c7' : '#dcfce7',
                          color: task.priority === 'HIGH' ? 'var(--danger)' : task.priority === 'MEDIUM' ? 'var(--warning)' : 'var(--success)'
                        }}>
                          {task.priority}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Due {format(new Date(task.dueDate), 'MMM dd')}
                      </div>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>You have no tasks assigned.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
