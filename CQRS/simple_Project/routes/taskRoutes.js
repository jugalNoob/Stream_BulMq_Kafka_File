const express = require('express');
const router = express.Router();
const command = require('../command/taskCommandHandler');
const query = require('../query/taskQueryHandler');

// Commands
router.post('/', async (req, res) => {
  const task = await command.createTask(req.body);
  res.json(task);
});

router.put('/:id', async (req, res) => {
  const task = await command.updateTask(req.params.id, req.body);
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  await command.deleteTask(req.params.id);
  res.sendStatus(204);
});

// Queries
router.get('/', async (req, res) => {
  const tasks = await query.getAllTasks();
  res.json(tasks);
});

router.get('/:id', async (req, res) => {
  const task = await query.getTaskById(req.params.id);
  res.json(task);
});

module.exports = router;
