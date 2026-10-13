import { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Header from '../components/layout/Header';
import TaskCard from '../components/ui/TaskCard';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { localProjects, localTasks } from '../services/localStore';

const COLUMNS = [
  { id: 'todo', label: 'To Do' },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

const Board = () => {
  const { openSidebar } = useOutletContext();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('board');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const data = localProjects.getAll();
    setProjects(data);
    const projectId = searchParams.get('project');
    if (projectId) {
      setSelectedProject(data.find((p) => p._id === projectId) || data[0] || null);
    } else {
      setSelectedProject(data[0] || null);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!selectedProject) {
      setLoading(false);
      return;
    }
    setTasks(localTasks.getByProject(selectedProject._id));
    setLoading(false);
  }, [selectedProject]);

  const openCreateModal = (status = 'todo') => {
    setEditingTask(null);
    setForm({ title: '', description: '', status, priority: 'medium', dueDate: '' });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      if (editingTask) {
        const updated = localTasks.update(editingTask._id, form, user);
        setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? updated : t)));
      } else {
        const created = localTasks.create(selectedProject._id, form, user);
        setTasks((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!editingTask) return;
    if (!window.confirm('Delete this task?')) return;
    localTasks.remove(editingTask._id);
    setTasks((prev) => prev.filter((t) => t._id !== editingTask._id));
    setModalOpen(false);
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updated = localTasks.update(taskId, { status: newStatus }, user);
    setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
  };

  const getColumnTasks = (status) => tasks.filter((t) => t.status === status);

  const tabs = [
    { id: 'board', label: 'Board' },
    { id: 'list', label: 'List' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'dashboard', label: 'Dashboard' },
  ];

  return (
    <>
      <Header
        title={selectedProject?.name || 'Kanban Board'}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onMenuClick={openSidebar}
      />

      <div className="page-content">
        {projects.length > 1 && (
          <div style={{ marginBottom: '1rem' }}>
            <select
              className="form-select"
              style={{ maxWidth: 280 }}
              value={selectedProject?._id || ''}
              onChange={(e) => setSelectedProject(projects.find((p) => p._id === e.target.value))}
            >
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}

        {!selectedProject ? (
          <div className="empty-state"><p>No project selected. Create a project first.</p></div>
        ) : loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : activeTab === 'board' ? (
          <div className="board-columns">
            {COLUMNS.map((col) => {
              const colTasks = getColumnTasks(col.id);
              return (
                <div key={col.id} className="board-column">
                  <div className="column-header">
                    <div className="column-title">
                      {col.label}
                      <span className="column-count">{colTasks.length}</span>
                    </div>
                  </div>
                  <div className="column-body">
                    {colTasks.map((task) => (
                      <TaskCard key={task._id} task={task} onClick={openEditModal} />
                    ))}
                  </div>
                  <button className="add-task-btn" onClick={() => openCreateModal(col.id)}>
                    <Plus size={16} /> Add Task
                  </button>
                </div>
              );
            })}
          </div>
        ) : activeTab === 'list' ? (
          <div className="card">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>Task</th>
                  <th style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>Status</th>
                  <th style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>Priority</th>
                  <th style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>Due</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t._id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => openEditModal(t)}>
                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{t.title}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <select
                        className="form-select"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.8125rem' }}
                        value={t.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(t._id, e.target.value)}
                      >
                        {COLUMNS.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`priority-badge priority-${t.priority}`}>{t.priority}</span>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tasks.length === 0 && <div className="empty-state">No tasks yet</div>}
          </div>
        ) : (
          <div className="empty-state">
            <p>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} view coming soon</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create Task'}
        footer={
          <>
            {editingTask && <button className="btn btn-danger" onClick={handleDelete}>Delete</button>}
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Saving...' : editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </>
        }
      >
        {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task title" autoFocus />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description..." />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {COLUMNS.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input type="date" className="form-input" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        </div>
      </Modal>
    </>
  );
};

export default Board;