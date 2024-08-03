const Todo = require('../models/Todo');

exports.createTodo = async (req, res) => {
  const { text } = req.body;
  const todo = new Todo({
    text,
    userId: req.user.id
  });
  await todo.save();
  res.status(201).json({ message: 'Todo created successfully', todo });
};

exports.getTodos = async (req, res) => {
  const todos = await Todo.find({ userId: req.user.id });
  res.status(200).json({ todos });
};

exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({ message: 'Todo updated successfully', todo });
};

exports.deleteTodo = async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.status(200).json({ message: 'Todo deleted successfully' });
};
