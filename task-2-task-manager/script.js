const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskStatusSelect = document.getElementById('task-status');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');

const countPending = document.getElementById('count-pending');
const countOngoing = document.getElementById('count-ongoing');
const countCompleted = document.getElementById('count-completed');

let tasks = JSON.parse(localStorage.getItem('everyday_tasks')) || [];
let currentFilter = 'all';

function saveAndRender() {
    localStorage.setItem('everyday_tasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';

    const filtered = tasks.filter(task => {
        if (currentFilter === 'all') return true;
        return task.status === currentFilter;
    });

    if (filtered.length === 0) {
        taskList.innerHTML = `<li class="empty-msg">No tasks found for this view.</li>`;
    }

    filtered.forEach(task => {
        const originalIndex = tasks.indexOf(task);
        const li = document.createElement('li');
        li.className = `task-card-item status-${task.status}`;
        li.innerHTML = `
            <div class="task-details">
                <h4>${escapeHTML(task.title)}</h4>
                <div class="task-dates">
                    <span><i class="fa-regular fa-calendar-plus"></i> Start: ${task.startDate || 'N/A'}</span>
                    <span><i class="fa-regular fa-calendar-check"></i> Due: ${task.endDate || 'N/A'}</span>
                </div>
            </div>
            <div class="task-actions">
                <select onchange="updateStatus(${originalIndex}, this.value)" class="status-badge ${task.status}">
                    <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Ongoing" ${task.status === 'Ongoing' ? 'selected' : ''}>Ongoing</option>
                    <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
                <button class="delete-btn" onclick="deleteTask(${originalIndex})" title="Delete Task">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });

    updateStats();
}

function updateStats() {
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const ongoing = tasks.filter(t => t.status === 'Ongoing').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;

    countPending.textContent = pending;
    countOngoing.textContent = ongoing;
    countCompleted.textContent = completed;
}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskTitleInput.value.trim();
    if (!title) return;

    tasks.push({
        title: title,
        status: taskStatusSelect.value,
        startDate: startDateInput.value,
        endDate: endDateInput.value
    });

    taskTitleInput.value = '';
    startDateInput.value = '';
    endDateInput.value = '';
    taskStatusSelect.value = 'Pending';
    saveAndRender();
});

window.updateStatus = function(index, newStatus) {
    tasks[index].status = newStatus;
    saveAndRender();
};

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    saveAndRender();
};

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Initial Render
renderTasks();