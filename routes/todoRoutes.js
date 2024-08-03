const express = require('express');
const { createTodo, getTodos, updateTodo, deleteTodo } = require('../controllers/todoController');
const router = express.Router();

router.post('/todos', createTodo);
router.get('/todos', getTodos);
router.put('/todos/:id', updateTodo);
router.delete('/todos/:id', deleteTodo);

module.exports = router;
