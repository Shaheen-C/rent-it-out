const express = require("express");
const router = express.Router();

let todos = [{ id: 1, task: "Learn Express", completed: false }];

// GET all todos
router.get("/", (req, res) => {
  res.json(todos);
});

// POST a new todo
router.post("/", (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    task: req.body.task,
    completed: req.body.completed,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

module.exports = router;
