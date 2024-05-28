const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

//Sample in-memory configuration
// let todos = [];

//Connection mongoDB
mongoose.connect('mongodb://localhost:27017/mern-todos')
.then(() => {
    console.log('Connected to mongoDB');
})
.catch(err => {
    console.log(err);
});

//Create a todo schema
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true }
});

//Create a todo model
const todoModel = mongoose.model('Todo', todoSchema);

//Create a todo item
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    // const newToDo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newToDo);
    // console.log(todos);

    try {
        const newToDo = new todoModel({title, description});
        await newToDo.save();
        res.status(201).json(newToDo);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
});

app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const { title, description } = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true}
        )
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        } else {
            res.json(updatedTodo);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
});

const port = 8000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});