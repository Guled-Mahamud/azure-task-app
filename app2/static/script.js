document.addEventListener("DOMContentLoaded", () => {
  const taskContainer = document.getElementById("task-container");
  const addTaskForm = document.getElementById("add-task-form");
  const titleInput = document.getElementById("task-title");
  const descInput = document.getElementById("task-description");

  async function loadTasks() {
    taskContainer.innerHTML = "";
    const res = await fetch("/tasks");
    const tasks = await res.json();

    if (tasks.length === 0) {
      taskContainer.innerHTML = "<p>No tasks yet. Add one!</p>";
      return;
    }

    tasks.forEach(task => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task";

      taskDiv.innerHTML = `
        <p><strong>${escapeHTML(task.title)}</strong></p>
        <p>${escapeHTML(task.description || "")}</p>
        <p>Status: ${task.completed ? "✅ Completed" : "❌ Incomplete"}</p>
        <button onclick="updateTask(${task.id}, ${!task.completed})">
          Mark as ${task.completed ? "Incomplete" : "Complete"}
        </button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      `;
      taskContainer.appendChild(taskDiv);
    });
  }

  addTaskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    if (!title) return;

    await fetch("/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description })
    });

    titleInput.value = "";
    descInput.value = "";
    loadTasks();
  });

  window.updateTask = async (id, completed) => {
    await fetch(`/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed })
    });
    loadTasks();
  };

  window.deleteTask = async (id) => {
    await fetch(`/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  };

  function escapeHTML(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  loadTasks();
});
