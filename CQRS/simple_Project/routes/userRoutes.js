const express = require('express');
const router = express.Router();
const command = require('../command/userCommandHandler');
const query = require('../query/userQueryHandler');

// Create user
router.post('/', async (req, res) => {
  const user = await command.createUser(req.body);
  res.json(user);
});

// Get profile
router.get('/:id/profile', async (req, res) => {
  const user = await query.getUserProfile(req.params.id);
  res.json(user);
});

module.exports = router;
