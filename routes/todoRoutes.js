const express = require('express');
const { createTodo } = require('../controllers/todocontroller');
const { validateTodo } = require('../middlewares/validaterequest');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/todos', upload.single('image'), validateTodo, createTodo);

// Define other routes (update, get, delete, createMultiple) similarly

module.exports = router;
