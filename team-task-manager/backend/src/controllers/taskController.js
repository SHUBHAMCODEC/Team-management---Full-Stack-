import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @route   GET /api/projects/:projectId/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    let query;

    if (req.params.projectId) {
      query = Task.find({ project: req.params.projectId });
    } else {
      // If Admin, see all. If Member, see assigned to them.
      if (req.user.role === 'ADMIN') {
        query = Task.find().populate('project', 'name');
      } else {
        query = Task.find({ assignedTo: req.user.id }).populate('project', 'name');
      }
    }

    const tasks = await query.populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Create new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    req.body.project = req.params.projectId;
    req.body.createdBy = req.user.id;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only Admins can add tasks
    if (req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Only administrators can create tasks' });
    }

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Authorization: Assigned user can update status, Admin/Creator can update anything
    if (task.assignedTo?.toString() !== req.user.id && task.createdBy.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(401).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get task stats for dashboard
// @route   GET /api/tasks/stats
// @access  Private
export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let query = {};
    if (role !== 'ADMIN') {
      query = { $or: [{ assignedTo: userId }, { createdBy: userId }] };
    }

    const tasks = await Task.find(query);
    const now = new Date();

    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'TODO').length,
      inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
      completed: tasks.filter(t => t.status === 'COMPLETED').length,
      overdue: tasks.filter(t => t.status !== 'COMPLETED' && t.dueDate && new Date(t.dueDate) < now).length,
      recentActivity: tasks
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5)
        .map(t => ({
          id: t._id,
          title: t.title,
          status: t.status,
          updatedAt: t.createdAt
        })),
      upcomingDeadlines: tasks
        .filter(t => t.status !== 'COMPLETED' && t.dueDate && new Date(t.dueDate) >= now)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 3)
        .map(t => ({
          id: t._id,
          title: t.title,
          dueDate: t.dueDate
        }))
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
