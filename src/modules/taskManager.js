import storage from './storage.js';

class TaskManager {
  constructor(taskListId, taskInputId) {
    this.taskList = document.getElementById(taskListId);
    this.taskInput = document.getElementById(taskInputId);
    this.loadTasks();
    this.setupEventListeners();
  }

  createTaskElement(task) {
    const li = document.createElement('li');
    li.setAttribute('draggable', 'true');
    li.addEventListener('click', this.saveTasks);
    // li.addEventListener('click', this.saveTasks);
    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
      <span class="task-text" contenteditable="false">${task.text}</span>
      <div class="button-container">
        <button class="edit-btn">&#9998;</button>
        <button class="delete-btn">&#128465;</button>
      </div>
    `;
    return li;
  }

  loadTasks() {
    const tasks = storage.loadTasks();
    tasks.forEach((task) => {
      this.taskList.appendChild(this.createTaskElement(task));
    });
  }

  saveTasks() {
    const tasks = Array.from(this.taskList.children).map((li) => ({
      text: li.querySelector('.task-text').textContent,
      completed: li.querySelector('.task-checkbox').checked,
    }));
    storage.saveTasks(tasks);
  }

  setupEventListeners() {
    this.taskList.addEventListener('click', this.handleTaskListClick.bind(this));
    this.setupDragAndDrop();
  }

  handleTaskListClick(e) {
    if (e.target.classList.contains('edit-btn')) {
      this.handleEdit(e.target);
    } else if (e.target.classList.contains('delete-btn')) {
      this.handleDelete(e.target);
    }
  }

  handleEdit(button) {
    const li = button.closest('li');
    const taskText = li.querySelector('.task-text');

    if (taskText.contentEditable === 'false') {
      taskText.contentEditable = 'true';
      taskText.focus();
      button.innerHTML = '&#1000a4;';
    } else {
      taskText.contentEditable = 'false';
      button.innerHTML = '&#9998;';
      this.saveTasks();
    }
  }

  handleDelete(button) {
    const li = button.closest('li');
    this.taskList.removeChild(li);
    this.saveTasks();
  }

  setupDragAndDrop() {
    this.taskList.addEventListener('dragstart', (e) => {
      if (e.target.tagName === 'LI') {
        e.dataTransfer.setData('text', e.target.innerHTML);
      }
    });

    this.taskList.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (e.target.tagName === 'LI') {
        e.target.classList.add('over');
      }
    });

    this.taskList.addEventListener('dragleave', (e) => {
      if (e.target.tagName === 'LI') {
        e.target.classList.remove('over');
      }
    });

    this.taskList.addEventListener('drop', this.handleDrop.bind(this));
  }

  handleDrop(e) {
    e.preventDefault();
    if (e.target.tagName === 'LI') {
      const { target } = e;
      const draggedItem = this.taskList.querySelector('li[draggable]');
      if (target !== draggedItem) {
        const items = Array.from(this.taskList.children);
        const targetIndex = items.indexOf(target);
        const draggedIndex = items.indexOf(draggedItem);

        if (targetIndex > draggedIndex) {
          target.after(draggedItem);
        } else {
          target.before(draggedItem);
        }
      }
      target.classList.remove('over');
      this.saveTasks();
    }
  }

  addTask(text) {
    if (text.trim()) {
      const task = { text: text.trim(), completed: false };
      this.taskList.appendChild(this.createTaskElement(task));
      this.saveTasks();
    }
  }

  clearCompleted() {
    const completedTasks = this.taskList.querySelectorAll('.task-checkbox:checked');
    completedTasks.forEach((checkbox) => {
      const li = checkbox.closest('li');
      if (li) this.taskList.removeChild(li);
    });
    this.saveTasks();
  }
}
export default TaskManager;