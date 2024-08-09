import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const inputRef = useRef();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        if (user) {
          const response = await axios.get(`http://localhost:3002/todos?userId=${user.id}`);
          setTodos(response.data);
        }
      } catch (error) {
        setError('Failed to fetch todos.');
        console.error('Failed to fetch todos:', error);
      }
    };

    fetchTodos();
  }, [user]);

  const handleAdd = async () => {
    const task = inputRef.current.value.trim();
    if (!task) return;
    const newItem = { completed: false, task, userId: user.id };
    try {
      const response = await axios.post('http://localhost:3002/todos', newItem);
      setTodos([...todos, response.data]);
      inputRef.current.value = '';
    } catch (error) {
      setError('Failed to add todo.');
      console.error('Failed to add todo:', error);
    }
  };

  const handleDone = async (index) => {
    const newTodos = [...todos];
    const updatedItem = { ...newTodos[index], completed: !newTodos[index].completed };
    try {
      await axios.put(`http://localhost:3002/todos/${updatedItem.id}`, updatedItem);
      newTodos[index] = updatedItem;
      setTodos(newTodos);
    } catch (error) {
      setError('Failed to update todo.');
      console.error('Failed to update todo:', error);
    }
  };

  const handleDel = async (index) => {
    const newTodos = [...todos];
    try {
      await axios.delete(`http://localhost:3002/todos/${newTodos[index].id}`);
      newTodos.splice(index, 1);
      setTodos(newTodos);
    } catch (error) {
      setError('Failed to delete todo.');
      console.error('Failed to delete todo:', error);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>To-Do List</h1>
        <button onClick={logout}>Logout</button>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="notebook">
        <ul>
          {todos.map(({ task, completed, id }, index) => (
            <div key={id}>
              <li className={completed ? 'done' : ''} onClick={() => handleDone(index)}>
                {task}
              </li>
              <button onClick={() => handleDel(index)}>X</button>
            </div>
          ))}
        </ul>
        <input type="text" ref={inputRef} placeholder='Add new task' />
        <button onClick={handleAdd}>Add</button>
      </div>
      <button className="btn btn-primary" onClick={() => navigate('/users')}>View Users</button> {/* Add this button */}
    </div>
  );
}
