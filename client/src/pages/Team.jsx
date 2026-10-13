import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Plus, Trash2, UserPlus } from 'lucide-react';
import Header from '../components/layout/Header';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { localProjects } from '../services/localStore';
import { getInitials, formatRelativeTime } from '../utils/helpers';

const COLORS = ['#3B82F6', '#F59E0B', '#8B5CF6', '#22C55E'];

const Team = () => {
  const { openSidebar } = useOutletContext();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add member modal
  const [modalOpen, setModalOpen] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOwner = selectedProject && user && selectedProject.owner === user._id;

  const refresh = () => {
    const data = localProjects.getAll();
    setProjects(data);
    if (selectedProject) {
      const updated = data.find((p) => p._id === selectedProject._id) || data[0] || null;
      setSelectedProject(updated);
      if (updated) setStats(localProjects.getStats(updated._id));
    } else if (data.length > 0) {
      setSelectedProject(data[0]);
      setStats(localProjects.getStats(data[0]._id));
    }
  };

  useEffect(() => {
    const data = localProjects.getAll();
    setProjects(data);
    if (data.length > 0) {
      setSelectedProject(data[0]);
      setStats(localProjects.getStats(data[0]._id));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    setStats(localProjects.getStats(selectedProject._id));
  }, [selectedProject]);

  const handleAddMember = (e) => {
    e.preventDefault();
    setError('');
    if (!memberName.trim() || !memberEmail.trim()) {
      setError('Name and email are required');
      return;
    }
    setSubmitting(true);
    try {
      localProjects.addMember(
        selectedProject._id,
        { name: memberName.trim(), email: memberEmail.trim().toLowerCase() },
        user
      );
      setModalOpen(false);
      setMemberName('');
      setMemberEmail('');
      refresh();
    } catch (err) {
      setError(err.message || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = (memberId, memberName) => {
    if (!window.confirm(`Remove ${memberName} from the team?`)) return;
    try {
      localProjects.removeMember(selectedProject._id, memberId, user);
      refresh();
    } catch (err) {
      alert(err.message);
    }
  };

  const chartData = stats
    ? [
        { name: 'To Do', value: stats.tasksByStatus.todo, color: COLORS[0] },
        { name: 'In Progress', value: stats.tasksByStatus.inprogress, color: COLORS[1] },
        { name: 'Review', value: stats.tasksByStatus.review, color: COLORS[2] },
        { name: 'Done', value: stats.tasksByStatus.done, color: COLORS[3] },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <>
      <Header title="Team Dashboard" onMenuClick={openSidebar} />
      <div className="page-content">
        {projects.length > 1 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <select
              className="form-select"
              style={{ maxWidth: 280 }}
              value={selectedProject?._id || ''}
              onChange={(e) => {
                const p = projects.find((pr) => pr._id === e.target.value);
                setSelectedProject(p);
              }}
            >
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : !selectedProject ? (
          <div className="empty-state"><p>No project available</p></div>
        ) : (
          <div className="dashboard-grid">
            {/* Team Overview + Members List */}
            <div className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <div className="stat-label">Team Overview</div>
                  <div className="stat-value" style={{ fontSize: '1.25rem' }}>
                    {stats?.memberCount || 0} Members
                  </div>
                </div>
                {isOwner && (
                  <button className="btn btn-primary btn-sm" onClick={() => { setError(''); setModalOpen(true); }}>
                    <UserPlus size={16} /> Add Member
                  </button>
                )}
              </div>

              {/* Member list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
                {stats?.members?.map((m) => (
                  <div
                    key={m._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.6rem 0.75rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: 8,
                    }}
                  >
                    <div className="team-avatar" style={{ marginLeft: 0 }}>{getInitials(m.name)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                        {m.name}
                        {m._id === selectedProject.owner && (
                          <span style={{ marginLeft: 6, fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600 }}>OWNER</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {m.email}
                      </div>
                    </div>
                    {isOwner && m._id !== selectedProject.owner && (
                      <button
                        className="icon-btn"
                        title="Remove member"
                        onClick={() => handleRemoveMember(m._id, m.name)}
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Progress */}
            <div className="stat-card">
              <div className="stat-label">Overall Progress</div>
              <div className="stat-value">{stats?.progress || 0}%</div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${stats?.progress || 0}%` }} />
              </div>
            </div>

            {/* Tasks by Status Chart */}
            <div className="stat-card">
              <div className="stat-label" style={{ marginBottom: '1rem' }}>Tasks by Status</div>
              {chartData.length === 0 ? (
                <div className="empty-state" style={{ padding: '1.5rem' }}><p>No tasks yet</p></div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8, color: '#F8FAFC' }} />
                    <Legend verticalAlign="bottom" formatter={(value) => <span style={{ color: '#94A3B8', fontSize: 12 }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Recent Activity */}
            <div className="stat-card">
              <div className="stat-label" style={{ marginBottom: '1rem' }}>Recent Activity</div>
              {!stats?.recentActivity?.length ? (
                <div className="empty-state" style={{ padding: '1.5rem' }}><p>No recent activity</p></div>
              ) : (
                <div className="activity-list">
                  {stats.recentActivity.map((a) => (
                    <div key={a._id} className="activity-item">
                      <div className="activity-avatar">{getInitials(a.user?.name)}</div>
                      <div className="activity-content">
                        <div className="activity-text"><strong>{a.user?.name}</strong> {a.message}</div>
                        <div className="activity-time">{formatRelativeTime(a.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Team Member"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddMember} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Member'}
            </button>
          </>
        }
      >
        {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            className="form-input"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            placeholder="Sarah Chen"
            autoFocus
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            placeholder="sarah@example.com"
          />
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          If the email is new, a local account will be created with password <strong>password123</strong>.
        </p>
      </Modal>
    </>
  );
};

export default Team;