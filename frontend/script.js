const API_URL = "/api/tasks"; // Относительный путь
const HISTORY_URL = "/api/history";

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
                    <button onclick="toggleStatusMenu(${task.id})">Change Status</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;

            const statusMenu = document.createElement("div");
            statusMenu.className = "status-menu hidden";
            statusMenu.setAttribute("id", `status-menu-${task.id}`);
            statusMenu.innerHTML = `
                <div onclick="updateTaskStatus(${task.id}, '(Not Started))')">Not Started</div>
                <div onclick="updateTaskStatus(${task.id}, '(Waiting)')">Waiting</div>
                <div onclick="updateTaskStatus(${task.id}, '(Completed)')">Completed</div>
            `;
            taskElement.appendChild(statusMenu);

            taskList.appendChild(taskElement);
        });
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

// Toggle status menu visibility
function toggleStatusMenu(taskId) {
    const statusMenu = document.getElementById(`status-menu-${taskId}`);
    if (statusMenu) {
        statusMenu.classList.toggle("hidden");
    }
}

// Update task status
async function updateTaskStatus(taskId, newStatus) {
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        if (!response.ok) throw new Error("Failed to update task status");

        loadTasks(); // Reload tasks to reflect changes
    } catch (error) {
        console.error("Error updating task status:", error);
    }
}

// Load history from API
async function loadHistory() {
    try {
        const response = await fetch(HISTORY_URL);
        if (!response.ok) throw new Error("Failed to fetch history");
        const history = await response.json();

        const historyList = document.getElementById("history-list");
        historyList.innerHTML = ""; // Очистить список перед обновлением

        history.forEach(record => {
            const recordElement = document.createElement("div");
            recordElement.className = "history-record";
            recordElement.textContent = `${record.timestamp} - ${record.action}`;
            historyList.appendChild(recordElement);
        });
    } catch (error) {
        console.error("Error loading history:", error);
    }
}

// Switch between tabs
function switchTab(event) {
    event.preventDefault();
    const mainSection = document.getElementById("main-section");
    const historySection = document.getElementById("history-section");
    const mainTab = document.getElementById("main-tab");
    const historyTab = document.getElementById("history-tab");

    if (event.target.id === "main-tab") {
        mainSection.classList.remove("hidden");
        historySection.classList.add("hidden");
        mainTab.classList.add("active");
        historyTab.classList.remove("active");
        loadTasks();
    } else {
        mainSection.classList.add("hidden");
        historySection.classList.remove("hidden");
        mainTab.classList.remove("active");
        historyTab.classList.add("active");
        loadHistory();
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
document.getElementById("main-tab").addEventListener("click", switchTab);
document.getElementById("history-tab").addEventListener("click", switchTab);
loadTasks();
