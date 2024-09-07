import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Todo = () => {
    const [todos, setTodos] = useState([]); // State to hold the list of todos
    const [title, setTitle] = useState(''); // State for the input field
    const [editingId, setEditingId] = useState(null); // State to track which todo is being edited

    // Fetch todos from the backend
    const fetchTodos = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/api/todos`);
        setTodos(response.data); // Update state with fetched todos
    };

    useEffect(() => {
        fetchTodos(); // Fetch todos on component mount
    }, []);

    // Add or update a todo
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        if (!title) return; // Prevent empty titles

        if (editingId) {
            // If editing, update the existing todo
            await axios.patch(`${process.env.REACT_APP_BACKEND_URI}/api/todos/${editingId}`, { title });
            setEditingId(null); // Reset editing state
        } else {
            // If adding, create a new todo
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/api/todos`, { title });
            setTodos([...todos, response.data]); // Update state with new todo
        }
        setTitle(''); // Clear input
    };

    // Edit a todo
    const editTodo = (todo) => {
        setTitle(todo.title); // Set the title in the input field
        setEditingId(todo._id); // Set the ID of the todo being edited
    };

    // Delete a todo
    const deleteTodo = async (id) => {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URI}/api/todos/${id}`);
        setTodos(todos.filter(todo => todo._id !== id)); // Update state
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Todo App</h1>
            <form onSubmit={handleSubmit} className="flex mb-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a new todo"
                    className="border border-gray-300 rounded-l px-4 py-2 flex-grow"
                />
                <button type="submit" className="bg-blue-500 text-white rounded-r px-4 py-2">
                    {editingId ? 'Update' : 'Add'} Todo
                </button>
            </form>
            <ul className="list-none">
                {todos.map(todo => (
                    <li key={todo._id} className="flex justify-between items-center mb-2 p-2 border border-gray-300 rounded">
                        <span>{todo.title}</span>
                        <div>
                            <button onClick={() => editTodo(todo)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                                Edit
                            </button>
                            <button onClick={() => deleteTodo(todo._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Todo;
