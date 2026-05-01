import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, CheckCircle2, Clock, PlayCircle, MoreVertical, Users, Trash2 } from 'lucide-react';
import API from '../api';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedTo: '' });
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get(`/projects/${id}/tasks`)
      ]);
      setProject(projRes.data.data);
      setTasks(taskRes.data.data);
      
      if (user?.role === 'ADMIN') {
        const usersRes = await API.get('/auth/users');
        setAllUsers(usersRes.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddMember = async (memberId: string) => {
    try {
      const updatedMembers = [...(project.members.map((m: any) => m._id || m)), memberId];
      await API.put(`/projects/${id}`, { members: updatedMembers });
      fetchData();
      setShowMemberModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to remove this member from the project?')) return;
    try {
      const updatedMembers = project.members
        .filter((m: any) => (m._id || m) !== memberId)
        .map((m: any) => m._id || m);
      await API.put(`/projects/${id}`, { members: updatedMembers });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post(`/projects/${id}/tasks`, newTask);
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedTo: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/projects/${id}/tasks/${taskId}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (taskId: string, status: string) => {
    try {
      await API.put(`/tasks/${taskId}`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-6 flex-mobile-column">
        <div>
          {loading ? (
            <div className="skeleton" style={{ height: '2.5rem', width: '200px', marginBottom: '0.5rem' }}></div>
          ) : (
            <h1 style={{ marginBottom: '0.5rem' }}>{project?.name}</h1>
          )}
          {loading ? (
            <div className="skeleton" style={{ height: '1.5rem', width: '400px' }}></div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>{project?.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          {user?.role === 'ADMIN' && (
            <button className="btn btn-outline" onClick={() => setShowMemberModal(true)}>
              <Users size={20} />
              Manage Team
            </button>
          )}
          {user?.role === 'ADMIN' && (
            <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
              <Plus size={20} />
              Add Task
            </button>
          )}
        </div>
      </div>

      <div className="grid-sidebar">
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
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Priority</th>
                    <th style={{ padding: '1rem' }}>Assigned To</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task: any) => (
                    <tr key={task._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600 }}>{task.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</div>
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
                      <td style={{ padding: '1rem' }}>
                        <div className="flex items-center gap-2">
                          <div style={{ 
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '50%', 
                            background: 'var(--primary)', 
                            color: 'white', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '0.625rem', 
                            fontWeight: 600 
                          }}>
                            {task.assignedTo?.name?.charAt(0) || '?'}
                          </div>
                          <span style={{ fontSize: '0.875rem' }}>{task.assignedTo?.name || 'Unassigned'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button className="btn btn-outline" style={{ padding: '0.4rem', borderColor: 'transparent' }} onClick={() => handleDeleteTask(task._id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No tasks created yet.
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
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</div>
                      </div>
                      <button className="btn btn-outline" style={{ padding: '0.4rem', borderColor: 'transparent', width: 'auto' }} onClick={() => handleDeleteTask(task._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex gap-2 mb-3">
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

                    <div className="flex items-center justify-between" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                      <div className="flex items-center gap-2">
                        <div style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: '50%', 
                          background: 'var(--primary)', 
                          color: 'white', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '0.625rem', 
                          fontWeight: 600 
                        }}>
                          {task.assignedTo?.name?.charAt(0) || '?'}
                        </div>
                        <span style={{ fontSize: '0.875rem' }}>{task.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Member</div>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No tasks created yet.</div>
                )}
              </div>
            </div>
          </div>
          )}
        </div>

        <div className="card">
          <h3 className="mb-4">Project Members</h3>
          <div className="flex flex-column gap-4">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '50px', width: '100%' }}></div>
              ))
            ) : (
              project?.members?.map((member: any) => {
                const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
                const bgColor = member.name ? colors[member.name.length % colors.length] : 'var(--border)';
                return (
                  <div key={member._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        background: bgColor, 
                        color: 'white', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.75rem', 
                        fontWeight: 600 
                      }}>
                        {member.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{member.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.role}</div>
                      </div>
                    </div>
                    {user?.role === 'ADMIN' && member._id !== user.id && (
                      <button 
                        onClick={() => handleRemoveMember(member._id)}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {showMemberModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '400px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center mb-4">
              <h2>Add Team Member</h2>
              <button className="btn" onClick={() => setShowMemberModal(false)}>&times;</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {allUsers.filter(u => !project.members.some((m: any) => m._id === u._id)).map((u: any) => (
                <div key={u._id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem' }}>
                  <div className="flex items-center gap-3">
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: u.name ? ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][u.name.length % 6] : 'var(--border)', 
                      color: 'white',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </div>
                  </div>
                  <button className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleAddMember(u._id)}>
                    Add
                  </button>
                </div>
              ))}
              {allUsers.filter(u => !project.members.some((m: any) => m._id === u._id)).length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>No more users available to add.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '500px' }}>
            <h2>Add New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="input-group">
                <label>Task Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea 
                  className="input-field" 
                  rows={3}
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  required
                ></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label>Priority</label>
                  <select 
                    className="input-field"
                    value={newTask.priority}
                    onChange={e => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Due Date</label>
                  <input 
                    type="date" 
                    className="input-field"
                    value={newTask.dueDate}
                    onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Assign To</label>
                <select 
                  className="input-field"
                  value={newTask.assignedTo}
                  onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                >
                  <option value="">Unassigned</option>
                  {project?.members?.map((m: any) => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between gap-2 mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
