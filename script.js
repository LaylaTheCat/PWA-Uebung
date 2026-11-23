
// HTML-Elemente auswählen
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");

const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");

// Aufgaben aus dem Speicher laden
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Aufgaben speichern
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Aufgaben anzeigen
function renderTodos() {

    todoList.innerHTML = "";

    todos.forEach((todo) => {

        const li = document.createElement("li");
        li.className = "todo-item";

        if (todo.completed) {
            li.classList.add("completed");
        }

        // Checkbox erstellen
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.setAttribute("aria-label", "Aufgabe erledigt");

        checkbox.addEventListener("change", () => {
            todo.completed = checkbox.checked;
            saveTodos();
            renderTodos();
        });

        // Aufgabentext erstellen
        const span = document.createElement("span");
        span.className = "todo-text";
        span.textContent = todo.text;

        // Löschen-Button erstellen
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "✕";
        deleteButton.setAttribute("aria-label", "Aufgabe löschen");

        deleteButton.addEventListener("click", () => {
            todos = todos.filter(item => item.id !== todo.id);
            saveTodos();
            renderTodos();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);

        todoList.appendChild(li);
    });

    // Anzahl der Aufgaben anzeigen
    taskCount.textContent = `${todos.length} Aufgaben`;

    // Leere Liste anzeigen
    emptyMessage.style.display =
        todos.length === 0 ? "block" : "none";

    // Fortschritt berechnen
    const completedTasks = todos.filter(todo => todo.completed).length;

    const progress = todos.length === 0
        ? 0
        : Math.round((completedTasks / todos.length) * 100);

    progressText.textContent = progress + " %";
    progressFill.style.width = progress + "%";
}

// Neue Aufgabe hinzufügen
todoForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const taskText = todoInput.value.trim();

    if (taskText === "") {
        return;
    }

    const newTodo = {
        id: crypto.randomUUID(),
        text: taskText,
        completed: false
    };

    todos.push(newTodo);

    saveTodos();
    renderTodos();

    todoInput.value = "";
    todoInput.focus();
});

// App starten
renderTodos();

// Service Worker registrieren
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .catch(error => {
                console.error("Service Worker Fehler:", error);
            });
    });
}