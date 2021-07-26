const express = require('express');
const app = express();
const cors = require('cors');
const pool = require("./db");
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());

// Global variables
const PORT = process.env.PORT || 7000;
// process.env.NODE_ENV 


if ( process.env.NODE_ENV === 'production' ){
// Server Static Content
    app.use(express.static(path.join(__dirname, 'client/build')))
}

// ********* Routes *********
// CREATE a todo
app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]);
        
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.log(err.message)
    }
})

// GET all todos
app.get("/todos", async(req, res) => {
    try{
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch(err) {
        console.err(err.message)
    }
});

// GET a todo
app.get("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);

        res.json(todo.rows[0])
    } catch (err) {
        console.err(err.message)
    }
})

// UPDATE a todo
app.put("/todos/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const {description} = req.body;
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id])

        res.json("Todo updated!")
    } catch (err) {
        console.error(err.message)
    }
})

// DELETE a todo
app.delete("/todos/:id", async( req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id])
        res.json("Todo Deleted!")
    } catch(err) {
        console.error(err.message)
    }
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'))
})

app.listen(PORT, () => {
    console.log(`server has started listening on port ${PORT}`);
})