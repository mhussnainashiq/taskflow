const Task = require('../models/Task');
const Project = require('../models/Project');
const Activity = require('../models/Activity');

// Helper to check project access
const checkProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;

  const isMember =
    project.owner.toString() === userId ||
    project.members.some((m) => m.toString() === userId);

  return isMember ? project : false;
};

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const access = await checkProjectAccess(req.params.projectId, req.user.id);
    if (access === null) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    if (access === false) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignees', 'name email avatar')
      .populate('createdBy', 'name avatar')
      .sort('order createdAt');

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    const access = await checkProjectAccess(req.params.projectId, req.user.id);
    if (access === null) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    if (access === false) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const { title, description, status, priority, dueDate, assignees } = req.body;

    const task = await Task.create({
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate,
      assignees: assignees || [],
      project: req.params.projectId,
      createdBy: req.user.id,
    });

    // Log activity
    await Activity.create({
      user: req.user.id,
      project: req.params.projectId,
      task: task._id,
      action: 'created_task',
      message: `created task "${title}"`,
    });

    const populated = await Task.findById(task._id)
      .populate('assignees', 'name email avatar')
      .populate('createdBy', 'name avatar');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    const access = await checkProjectAccess(task.project.toString(), req.user.id);
    if (!access) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized',
      });
    }

    const oldStatus = task.status;

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('assignees', 'name email avatar')
      .populate('createdBy', 'name avatar');

    // Log activity for status change
    if (req.body.status && req.body.status !== oldStatus) {
      const action =
        req.body.status === 'done' ? 'completed_task' : 'moved_task';
      await Activity.create({
        user: req.user.id,
        project: task.project,
        task: task._id,
        action,
        message:
          req.body.status === 'done'
            ? `completed task "${task.title}"`
            : `moved task "${task.title}" to ${req.body.status}`,
      });
    } else if (req.body.title || req.body.description || req.body.priority) {
      await Activity.create({
        user: req.user.id,
        project: task.project,
        task: task._id,
        action: 'updated_task',
        message: `updated task "${task.title}"`,
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    const access = await checkProjectAccess(task.project.toString(), req.user.id);
    if (!access) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized',
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
