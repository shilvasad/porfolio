const Todo = require('../models/Todo');

// @desc    Get all todos for the logged-in user
// @route   GET /api/todos
// @access  Private/Admin
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private/Admin
const createTodo = async (req, res) => {
  const { text } = req.body;
  try {
    const todo = new Todo({
      text,
      user: req.user._id,
    });
    const createdTodo = await todo.save();
    res.status(201).json(createdTodo);
  } catch (error) {
    res.status(400).json({ message: 'Error creating todo', error: error.message });
  }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private/Admin
const updateTodo = async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    // Check if the todo belongs to the user
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: 'Error updating todo', error: error.message });
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private/Admin
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    // Check if the todo belongs to the user
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await todo.remove();
    res.json({ message: 'Todo removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
