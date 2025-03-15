import TaskManager from './modules/taskManager.js';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const taskManager = new TaskManager('task-list', 'task-input');

  // Add task button handler
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskInput = document.getElementById('task-input');

  addTaskBtn?.addEventListener('click', () => {
    taskManager.addTask(taskInput.value);
    taskInput.value = '';
  });

  // Clear completed handler
  const clearCompletedBtn = document.querySelector('.Clear');
  clearCompletedBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    taskManager.clearCompleted();
  });
});