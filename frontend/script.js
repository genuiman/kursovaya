const API_URL = "/api/tasks"; // Относительный путь

// Load tasks from API
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const tasks = await response.json();

        const taskList = document.getElementById("task-list");
        taskList.innerHTML = ""; // Очистить список перед обновлением

        tasks.forEach(task => {
            const taskElement = document.createElement("div");
            taskElement.className = "task";
            taskElement.setAttribute("data-id", task.id);
            taskElement.innerHTML = `
                <span>${task.name} <span class="status ${task.status.toLowerCase()}">${task.status}</span></span>
                <div class="task-buttons">
                    <button onclick="showStatusMenu(${task.id})">Change Status</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;

            const statusMenu = document.createElement("div");
            statusMenu.className = "status-menu hidden";
            statusMenu.innerHTML = `
                <div onclick="updateTaskStatus(${task.id}, 'Pending')">Not Started</div>
                <div onclick="updateTaskStatus(${task.id}, 'In Progress')">In Progress</div>
                <div onclick="updateTaskStatus(${task.id}, 'Completed')">Completed</div>
            `;
            taskElement.appendChild(statusMenu);

            taskList.appendChild(taskElement);
        });
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

// Add a new task
async function addTask(event) {
    event.preventDefault();
    const taskName = document.getElementById("task-name").value;

    if (taskName.trim() === "") return;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: taskName }),
        });
        if (!response.ok) throw new Error("Failed to add task");

        document.getElementById("task-name").value = "";
        loadTasks();
    } catch (error) {
        console.error("Error adding task:", error);
    }
}

// Delete a task
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete task");

        const taskElement = document.querySelector(`.task[data-id="${id}"]`);
        if (taskElement) {
            taskElement.classList.add("fade-out");
            setTimeout(() => {
                loadTasks();
            }, 300);
        }
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

// Update task status
async function updateTaskStatus(id, status) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) throw new Error("Failed to update task status");

        loadTasks();
    } catch (error) {
        console.error("Error updating task status:", error);
    }
}

// Show status menu
function showStatusMenu(id) {
    const taskElement = document.querySelector(`.task[data-id="${id}"]`);
    const statusMenu = taskElement.querySelector(".status-menu");
    statusMenu.classList.toggle("hidden");
}

// Initialize
document.getElementById("task-form").addEventListener("submit", addTask);
loadTasks();
