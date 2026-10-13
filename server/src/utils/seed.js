require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB Connected for seeding...');
};

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    await Activity.deleteMany();

    // Create users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      {
        name: 'Alex Johnson',
        email: 'alex@taskflow.com',
        password: hashedPassword,
        avatar: '',
      },
      {
        name: 'Sarah Chen',
        email: 'sarah@taskflow.com',
        password: hashedPassword,
        avatar: '',
      },
      {
        name: 'Mike Rivera',
        email: 'mike@taskflow.com',
        password: hashedPassword,
        avatar: '',
      },
      {
        name: 'Emily Park',
        email: 'emily@taskflow.com',
        password: hashedPassword,
        avatar: '',
      },
      {
        name: 'David Kim',
        email: 'david@taskflow.com',
        password: hashedPassword,
        avatar: '',
      },
    ]);

    console.log('Users created');

    // Create project
    const project = await Project.create({
      name: 'Website Redesign',
      description: 'Complete redesign of the company website with modern UI/UX',
      owner: users[0]._id,
      members: users.map((u) => u._id),
      color: '#3B82F6',
    });

    console.log('Project created');

    // Create tasks matching the reference image
    const tasksData = [
      {
        title: 'Create wireframes',
        status: 'todo',
        priority: 'low',
        dueDate: new Date('2025-05-20'),
        assignees: [users[1]._id],
      },
      {
        title: 'Research competitors',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date('2025-05-21'),
        assignees: [users[2]._id],
      },
      {
        title: 'Define color palette',
        status: 'todo',
        priority: 'low',
        dueDate: new Date('2025-05-22'),
        assignees: [users[3]._id],
      },
      {
        title: 'Write user stories',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date('2025-05-23'),
        assignees: [users[0]._id],
      },
      {
        title: 'Design homepage',
        status: 'inprogress',
        priority: 'high',
        dueDate: new Date('2025-05-19'),
        assignees: [users[1]._id, users[3]._id],
      },
      {
        title: 'Build navigation',
        status: 'inprogress',
        priority: 'high',
        dueDate: new Date('2025-05-20'),
        assignees: [users[2]._id],
      },
      {
        title: 'Develop components',
        status: 'inprogress',
        priority: 'medium',
        dueDate: new Date('2025-05-22'),
        assignees: [users[4]._id],
      },
      {
        title: 'UI/UX review',
        status: 'review',
        priority: 'high',
        dueDate: new Date('2025-05-18'),
        assignees: [users[1]._id, users[0]._id],
      },
      {
        title: 'Code review',
        status: 'review',
        priority: 'medium',
        dueDate: new Date('2025-05-19'),
        assignees: [users[2]._id],
      },
      {
        title: 'Project setup',
        status: 'done',
        priority: 'high',
        dueDate: new Date('2025-05-10'),
        assignees: [users[0]._id],
      },
      {
        title: 'Setup repository',
        status: 'done',
        priority: 'medium',
        dueDate: new Date('2025-05-11'),
        assignees: [users[2]._id],
      },
      {
        title: 'Install dependencies',
        status: 'done',
        priority: 'low',
        dueDate: new Date('2025-05-12'),
        assignees: [users[4]._id],
      },
    ];

    const tasks = [];
    for (const t of tasksData) {
      const task = await Task.create({
        ...t,
        project: project._id,
        createdBy: users[0]._id,
      });
      tasks.push(task);
    }

    console.log('Tasks created');

    // Create activities
    await Activity.insertMany([
      {
        user: users[1]._id,
        project: project._id,
        task: tasks[4]._id,
        action: 'completed_task',
        message: 'completed Design homepage',
      },
      {
        user: users[2]._id,
        project: project._id,
        task: tasks[5]._id,
        action: 'updated_task',
        message: 'updated task Build navigation',
      },
      {
        user: users[3]._id,
        project: project._id,
        task: tasks[7]._id,
        action: 'added_comment',
        message: 'added a comment on UI/UX review',
      },
      {
        user: users[0]._id,
        project: project._id,
        action: 'created_project',
        message: 'created project "Website Redesign"',
      },
    ]);

    console.log('Activities created');
    console.log('\n✅ Seed completed successfully!');
    console.log('\nDemo accounts (password: password123):');
    console.log('  alex@taskflow.com');
    console.log('  sarah@taskflow.com');
    console.log('  mike@taskflow.com');
    console.log('  emily@taskflow.com');
    console.log('  david@taskflow.com');

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
