const Todo = require('../models/todoModel');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

exports.createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;
        const imageUrl = req.file ? req.file.path : null;
        const todo = await Todo.create({ title, description, imageUrl });
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create todo' });
    }
};

// Define other controller methods (update, get, delete, createMultiple) similarly
