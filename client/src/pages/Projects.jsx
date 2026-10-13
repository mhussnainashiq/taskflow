import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plus, FolderKanban } from 'lucide-react';
import Header from '../components/layout/Header';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { localProjects } from '../services/localStore';
import { getInitials } from '../utils/helpers';

const Projects = () => {
  const { openSidebar } = useOutletContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setProjects(localProjects.getAll());
    setLoading(false);
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const project = localProjects.create({ name, description }, user);
      setProjects([project, ...projects]);
      setModalOpen(false);
      setName('');
      setDescription('');
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header title="Projects" onMenuClick={openSidebar} />
      <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and organize your projects</p>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={18} /> New Project
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <FolderKanban size={48} />
            <p>No projects yet</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={() => setModalOpen(true)}>
              Create your first project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((p) => (
              <div key={p._id} className="project-card" onClick={() => navigate(`/board?project=${p._id}`)}>
                <div className="project-card-header">
                  <div className="project-name">{p.name}</div>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: p.color || '#3B82F6' }} />
                </div>
                {p.description && <div className="project-desc">{p.description}</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="team-avatars">
                    {p.members?.slice(0, 4).map((m) => (
                      <div key={m._id} className="team-avatar" title={m.name}>{getInitials(m.name)}</div>
                    ))}
                    {p.members?.length > 4 && <div className="team-more">+{p.members.length - 4}</div>}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.members?.length || 0} members</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setError(''); }}
        title="Create Project"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Project'}
            </button>
          </>
        }
      >
        {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        <div className="form-group">
          <label className="form-label">Project Name</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Website Redesign" autoFocus />
        </div>
        <div className="form-group">
          <label className="form-label">Description (optional)</label>
          <textarea className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." />
        </div>
      </Modal>
    </>
  );
};

export default Projects;