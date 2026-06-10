import Task from "../models/taskModel.js";

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (PM & Admin only)
export const createTask = async (req, res) => {
  const { title, description, assignedTo } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: req.user._id, // Grabbed from our protect middleware payload
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks in the system
// @route   GET /api/tasks/all
// @access  Private (Admin only)
export const getAllTasks = async (req, res) => {
  try {
    // Populate allows us to pull details from linked User objects instead of just showing their IDs
    const tasks = await Task.find()
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tasks assigned to the logged-in developer
// @route   GET /api/tasks/my-tasks
// @access  Private (Any authenticated user)
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).populate(
      "createdBy",
      "name email",
    );
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task status
// @route   PUT /api/tasks/:id
// @access  Private (Any authenticated user, with data ownership rules)
export const updateTaskStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // --- DATA OWNERSHIP RULE ---
    // If the logged-in user is a Developer, they can ONLY update the task if it is assigned to them.
    if (
      req.user.role === "Developer" &&
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Access denied: This task is not assigned to you." });
    }

    task.status = status || task.status;
    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();
    res.json({ message: "Task removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
