import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Kanban,
  Users,
  CheckSquare,
  TrendingUp,
  Smartphone,
} from 'lucide-react';

const features = [
  {
    icon: Kanban,
    title: 'Kanban Boards',
    desc: 'Visualize work with drag-style columns: To Do, In Progress, Review, Done.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    desc: 'Assign tasks, see team members, and track who is working on what.',
  },
  {
    icon: CheckSquare,
    title: 'Task Prioritization',
    desc: 'Set Low, Medium, or High priority so the team focuses on what matters.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    desc: 'Live progress bars, pie charts, and recent activity keep everyone aligned.',
  },
  {
    icon: Smartphone,
    title: 'Responsive Design',
    desc: 'Works smoothly on desktop, tablet, and mobile with a clean dark theme.',
  },
];

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 2rem',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ClipboardList size={22} color="white" />
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 700 }}>
            Task<span style={{ color: 'var(--accent)' }}>Flow</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/login" className="btn btn-secondary">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '5rem 1.5rem 4rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            padding: '0.35rem 0.9rem',
            borderRadius: 999,
            fontSize: '0.8125rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
          }}
        >
          <ClipboardList size={14} /> Manage Your Projects
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em',
          }}
        >
          Organize work.
          <br />
          <span style={{ color: 'var(--accent)' }}>Ship faster.</span>
        </h1>

        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            maxWidth: 560,
            margin: '0 auto 2.5rem',
            lineHeight: 1.6,
          }}
        >
          TaskFlow is a modern project management tool with Kanban boards,
          team collaboration, priority tracking, and beautiful progress
          dashboards — all in a clean dark interface.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
            Start Free
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
            Sign In
          </Link>
        </div>

        <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Demo account: <strong style={{ color: 'var(--text-secondary)' }}>alex@taskflow.com</strong> / password123
        </p>
      </section>

      {/* Features */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '2rem 1.5rem 5rem',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: '1.75rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}
        >
          Everything you need
        </h2>
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            marginBottom: '3rem',
          }}
        >
          Built for teams that want clarity and speed.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="card"
              style={{ padding: '1.5rem' }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'var(--accent-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <f.icon size={22} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '1.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
        }}
      >
        TaskFlow — Manage Your Projects · Built with React
      </footer>
    </div>
  );
};

export default Home;