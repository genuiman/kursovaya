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
                <span>${task.name} (${task.status})</span>
                <button onclick="deleteTask(${task.id})">Delete</button>
            `;
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

        // Анимация исчезновения
        const taskElement = document.querySelector(`.task[data-id="${id}"]`);
        if (taskElement) {
            taskElement.classList.add("fade-out");
            setTimeout(() => {
                loadTasks();
            }, 300); // Ждем, пока анимация завершится
        }
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

// Initialize
document.getElementById("task-form").addEventListener("submit", addTask);
loadTasks();
