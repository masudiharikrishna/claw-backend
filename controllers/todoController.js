const Todo = require('../models/Todo');

const createTodo = async (req, res) => {
  try {
    const { title, description, text } = req.body;
    const userId = req.user.id;

    const newTodo = new Todo({
      userId,
      title,
      description,
      text
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getTodos = async (req, res) => {
  const todos = await Todo.find({ userId: req.user.id });
  res.status(200).json({ todos });
};

const updateTodo = async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({ message: 'Todo updated successfully', todo });
};

const deleteTodo = async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.status(200).json({ message: 'Todo deleted successfully' });
};

module.exports = {deleteTodo, updateTodo, createTodo, getTodos}