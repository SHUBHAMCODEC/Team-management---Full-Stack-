import React, { useEffect, useState } from 'react';
import { Plus, Folder, Users, ChevronRight, Trash2 } from 'lucide-react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const { user } = useAuth();

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects');
      setProjects(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/projects', newProject);
      setNewProject({ name: '', description: '' });
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8 flex-mobile-column">
        <div>
          <h1>Projects</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage and track all your team projects in one place.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            New Project
          </button>
        )}
      </div>

      <div className="grid grid-3">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="card skeleton" style={{ height: '200px' }}></div>
          ))
        ) : (
          projects.map((project: any) => (
            <div key={project._id} className="card project-card flex flex-column justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div style={{ padding: '0.5rem', background: 'var(--primary)15', borderRadius: '8px', color: 'var(--primary)' }}>
                    <Folder size={24} />
                  </div>
                  {user?.role === 'ADMIN' && (
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '0.25rem', color: 'var(--danger)', borderColor: 'transparent' }}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteProject(project._id); }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <h3 style={{ marginBottom: '0.5rem' }}>{project.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {project.description}
                </p>
              </div>
              
              <div className="flex justify-between items-center" style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <div className="flex -space-x-2">
                  {project.members?.slice(0, 3).map((m: any, i: number) => {
                    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
                    const bgColor = m.name ? colors[m.name.length % colors.length] : 'var(--border)';
                    return (
                      <div 
                        key={i} 
                        title={m.name}
                        style={{ 
                          width: '28px', 
                          height: '28px', 
                          borderRadius: '50%', 
                          background: bgColor, 
                          border: '2px solid white', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '0.625rem', 
                          fontWeight: 600,
                          color: 'white'
                        }}
                      >
                        {m.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                    );
                  })}
                  {project.members?.length > 3 && (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-main)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
                <Link to={`/projects/${project._id}`} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '500px' }}>
            <h2>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="input-group">
                <label>Project Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea 
                  className="input-field" 
                  rows={4}
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                  required
                ></textarea>
              </div>
              <div className="flex justify-between gap-2 mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
