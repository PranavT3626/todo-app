const express = require('express');
const dotenv = require('dotenv');
const todoRoutes = require('./routes/todoRoutes');
const sequelize = require('./config/db');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/todos', todoRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
