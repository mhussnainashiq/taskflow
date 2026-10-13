// Simple LocalStorage data layer for TaskFlow (no backend needed)

const KEYS = {
  user: 'taskflow_user',
  users: 'taskflow_users',
  projects: 'taskflow_projects',
  tasks: 'taskflow_tasks',
  activities: 'taskflow_activities',
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const read = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ---------- Seed demo data once ----------
export const seedIfEmpty = () => {
  if (localStorage.getItem('taskflow_seeded')) return;

  const users = [
    { _id: 'u1', name: 'Alex Johnson', email: 'alex@taskflow.com', password: 'password123' },
    { _id: 'u2', name: 'Sarah Chen', email: 'sarah@taskflow.com', password: 'password123' },
    { _id: 'u3', name: 'Mike Rivera', email: 'mike@taskflow.com', password: 'password123' },
    { _id: 'u4', name: 'Emily Park', email: 'emily@taskflow.com', password: 'password123' },
    { _id: 'u5', name: 'David Kim', email: 'david@taskflow.com', password: 'password123' },
  ];

  const project = {
    _id: 'p1',
    name: 'Website Redesign',
    description: 'Complete redesign of the company website with modern UI/UX',
    owner: 'u1',
    members: users.map((u) => ({ _id: u._id, name: u.name, email: u.email })),
    color: '#3B82F6',
    createdAt: new Date().toISOString(),
  };

  const tasks = [
    { _id: 't1', title: 'Create wireframes', status: 'todo', priority: 'low', dueDate: '2025-05-20', assignees: [{ _id: 'u2', name: 'Sarah Chen' }], project: 'p1', createdBy: 'u1' },
    { _id: 't2', title: 'Research competitors', status: 'todo', priority: 'medium', dueDate: '2025-05-21', assignees: [{ _id: 'u3', name: 'Mike Rivera' }], project: 'p1', createdBy: 'u1' },
    { _id: 't3', title: 'Define color palette', status: 'todo', priority: 'low', dueDate: '2025-05-22', assignees: [{ _id: 'u4', name: 'Emily Park' }], project: 'p1', createdBy: 'u1' },
    { _id: 't4', title: 'Write user stories', status: 'todo', priority: 'medium', dueDate: '2025-05-23', assignees: [{ _id: 'u1', name: 'Alex Johnson' }], project: 'p1', createdBy: 'u1' },
    { _id: 't5', title: 'Design homepage', status: 'inprogress', priority: 'high', dueDate: '2025-05-19', assignees: [{ _id: 'u2', name: 'Sarah Chen' }, { _id: 'u4', name: 'Emily Park' }], project: 'p1', createdBy: 'u1' },
    { _id: 't6', title: 'Build navigation', status: 'inprogress', priority: 'high', dueDate: '2025-05-20', assignees: [{ _id: 'u3', name: 'Mike Rivera' }], project: 'p1', createdBy: 'u1' },
    { _id: 't7', title: 'Develop components', status: 'inprogress', priority: 'medium', dueDate: '2025-05-22', assignees: [{ _id: 'u5', name: 'David Kim' }], project: 'p1', createdBy: 'u1' },
    { _id: 't8', title: 'UI/UX review', status: 'review', priority: 'high', dueDate: '2025-05-18', assignees: [{ _id: 'u2', name: 'Sarah Chen' }, { _id: 'u1', name: 'Alex Johnson' }], project: 'p1', createdBy: 'u1' },
    { _id: 't9', title: 'Code review', status: 'review', priority: 'medium', dueDate: '2025-05-19', assignees: [{ _id: 'u3', name: 'Mike Rivera' }], project: 'p1', createdBy: 'u1' },
    { _id: 't10', title: 'Project setup', status: 'done', priority: 'high', dueDate: '2025-05-10', assignees: [{ _id: 'u1', name: 'Alex Johnson' }], project: 'p1', createdBy: 'u1' },
    { _id: 't11', title: 'Setup repository', status: 'done', priority: 'medium', dueDate: '2025-05-11', assignees: [{ _id: 'u3', name: 'Mike Rivera' }], project: 'p1', createdBy: 'u1' },
    { _id: 't12', title: 'Install dependencies', status: 'done', priority: 'low', dueDate: '2025-05-12', assignees: [{ _id: 'u5', name: 'David Kim' }], project: 'p1', createdBy: 'u1' },
  ];

  const activities = [
    { _id: 'a1', user: { _id: 'u2', name: 'Sarah Chen' }, message: 'completed Design homepage', createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
    { _id: 'a2', user: { _id: 'u3', name: 'Mike Rivera' }, message: 'updated task Build navigation', createdAt: new Date(Date.now() - 4 * 3600000).toISOString() },
    { _id: 'a3', user: { _id: 'u4', name: 'Emily Park' }, message: 'added a comment on UI/UX review', createdAt: new Date(Date.now() - 6 * 3600000).toISOString() },
  ];

  write(KEYS.users, users);
  write(KEYS.projects, [project]);
  write(KEYS.tasks, tasks);
  write(KEYS.activities, activities);
  localStorage.setItem('taskflow_seeded', '1');
};

// ---------- Auth ----------
export const localAuth = {
  register: (name, email, password) => {
    const users = read(KEYS.users);
    if (users.find((u) => u.email === email)) {
      throw new Error('User already exists with this email');
    }
    const user = { _id: uid(), name, email, password };
    users.push(user);
    write(KEYS.users, users);
    const session = { _id: user._id, name: user.name, email: user.email };
    localStorage.setItem(KEYS.user, JSON.stringify(session));
    return session;
  },

  login: (email, password) => {
    const users = read(KEYS.users);
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    const session = { _id: user._id, name: user.name, email: user.email };
    localStorage.setItem(KEYS.user, JSON.stringify(session));
    return session;
  },

  logout: () => localStorage.removeItem(KEYS.user),

  getCurrentUser: () => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.user));
    } catch {
      return null;
    }
  },
};

// ---------- Projects ----------
export const localProjects = {
  getAll: () => read(KEYS.projects),

  create: (data, user) => {
    const projects = read(KEYS.projects);
    const project = {
      _id: uid(),
      name: data.name,
      description: data.description || '',
      color: data.color || '#3B82F6',
      owner: user._id,
      members: [{ _id: user._id, name: user.name, email: user.email }],
      createdAt: new Date().toISOString(),
    };
    projects.unshift(project);
    write(KEYS.projects, projects);
    return project;
  },

  getStats: (projectId) => {
    const projects = read(KEYS.projects);
    const project = projects.find((p) => p._id === projectId);
    const tasks = read(KEYS.tasks).filter((t) => t.project === projectId);
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const inprogress = tasks.filter((t) => t.status === 'inprogress').length;
    const review = tasks.filter((t) => t.status === 'review').length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const progress = total ? Math.round((done / total) * 100) : 0;

    return {
      members: project?.members || [],
      memberCount: project?.members?.length || 0,
      totalTasks: total,
      tasksByStatus: { todo, inprogress, review, done },
      progress,
      recentActivity: read(KEYS.activities).slice(0, 10),
    };
  },

  // ----- Team members -----
  addMember: (projectId, { name, email }, currentUser) => {
    const projects = read(KEYS.projects);
    const idx = projects.findIndex((p) => p._id === projectId);
    if (idx === -1) throw new Error('Project not found');

    const project = projects[idx];

    // Only owner can add
    if (project.owner !== currentUser._id) {
      throw new Error('Only the project owner can add members');
    }

    // Already a member?
    if (project.members.some((m) => m.email === email)) {
      throw new Error('This user is already a member');
    }

    // Create or find user
    let users = read(KEYS.users);
    let existing = users.find((u) => u.email === email);
    if (!existing) {
      existing = {
        _id: uid(),
        name,
        email,
        password: 'password123', // default password for invited users
      };
      users.push(existing);
      write(KEYS.users, users);
    }

    const member = { _id: existing._id, name: existing.name, email: existing.email };
    project.members.push(member);
    projects[idx] = project;
    write(KEYS.projects, projects);

    // Activity log
    const acts = read(KEYS.activities);
    acts.unshift({
      _id: uid(),
      user: { _id: currentUser._id, name: currentUser.name },
      message: `added ${name} to the team`,
      createdAt: new Date().toISOString(),
    });
    write(KEYS.activities, acts);

    return project;
  },

  removeMember: (projectId, memberId, currentUser) => {
    const projects = read(KEYS.projects);
    const idx = projects.findIndex((p) => p._id === projectId);
    if (idx === -1) throw new Error('Project not found');

    const project = projects[idx];

    if (project.owner !== currentUser._id) {
      throw new Error('Only the project owner can remove members');
    }

    if (memberId === project.owner) {
      throw new Error('Cannot remove the project owner');
    }

    project.members = project.members.filter((m) => m._id !== memberId);
    projects[idx] = project;
    write(KEYS.projects, projects);

    return project;
  },
};

// ---------- Tasks ----------
export const localTasks = {
  getByProject: (projectId) =>
    read(KEYS.tasks).filter((t) => t.project === projectId),

  create: (projectId, data, user) => {
    const tasks = read(KEYS.tasks);
    const task = {
      _id: uid(),
      title: data.title,
      description: data.description || '',
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      dueDate: data.dueDate || null,
      assignees: data.assignees || [],
      project: projectId,
      createdBy: user._id,
      createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    write(KEYS.tasks, tasks);

    // activity
    const acts = read(KEYS.activities);
    acts.unshift({
      _id: uid(),
      user: { _id: user._id, name: user.name },
      message: `created task "${task.title}"`,
      createdAt: new Date().toISOString(),
    });
    write(KEYS.activities, acts);

    return task;
  },

  update: (taskId, data, user) => {
    const tasks = read(KEYS.tasks);
    const idx = tasks.findIndex((t) => t._id === taskId);
    if (idx === -1) throw new Error('Task not found');

    const old = tasks[idx];
    tasks[idx] = { ...old, ...data };
    write(KEYS.tasks, tasks);

    if (data.status && data.status !== old.status) {
      const acts = read(KEYS.activities);
      acts.unshift({
        _id: uid(),
        user: { _id: user._id, name: user.name },
        message:
          data.status === 'done'
            ? `completed task "${tasks[idx].title}"`
            : `moved task "${tasks[idx].title}" to ${data.status}`,
        createdAt: new Date().toISOString(),
      });
      write(KEYS.activities, acts);
    }

    return tasks[idx];
  },

  remove: (taskId) => {
    write(
      KEYS.tasks,
      read(KEYS.tasks).filter((t) => t._id !== taskId)
    );
  },
};