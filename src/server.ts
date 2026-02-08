
import express from 'express';
import cors from 'cors';
import path from 'path';
import * as taskStore from './taskStore';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await taskStore.getTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

app.post('/tasks', async (req, res) => {
  const { title } = req.body;

  if (typeof title !== 'string') {
    return res.status(400).json({ message: 'Invalid title format' });
  }

  // To check if title is empty or just a whitespace
  // if (title.trim().length === 0) {
  //     return res.status(400).json({ message: 'Title cannot be empty' });
  // }

  try {
    const newTask = await taskStore.addTask(title);

    if (!newTask) {
      return res.status(400).json({ message: 'Error creating task' });
    }

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task' });
  }
});

app.patch('/tasks/:id/toggle', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const updatedTask = await taskStore.toggleTask(id);

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const success = await taskStore.deleteTask(id);

    if (!success) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// Serve the frontend for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app; // Export for testing
