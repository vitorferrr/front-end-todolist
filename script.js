document.addEventListener("DOMContentLoaded", function() {

    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

    const API_URL = 'https://todolist-engsoft.onrender.com/api/v1/tasks';

    addTaskBtn.addEventListener("click", addTask);
    taskList.addEventListener("click", handleTaskClick);

    loadTasks();


    async function loadTasks() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Erro ao carregar tarefas.");
            
            const tasks = await response.json();
            taskList.innerHTML = '';
            tasks.forEach(task => renderTaskOnScreen(task));
        } catch (error) {
            console.error("Erro em loadTasks:", error);
            alert("Não foi possível carregar as tarefas salvas.");
        }
    }


    async function addTask() {
        const taskText = taskInput.value.trim();

        if (taskText === "") {
            alert("Por favor, digite uma tarefa.");
            return;
        }

        const newTask = {
            text: taskText,
            completed: false
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            });

            if (!response.ok) throw new Error("Erro ao salvar a tarefa.");

            const savedTask = await response.json();

            renderTaskOnScreen(savedTask);
            taskInput.value = ""; // Limpa o input

        } catch (error) {
            console.error("Erro em addTask:", error);
            alert("Não foi possível salvar a tarefa.");
        }
    }


    async function handleTaskClick(event) {
        const clickedElement = event.target;
        const li = clickedElement.closest('li');
        if (!li) return;

        const taskId = li.dataset.id; 

        if (clickedElement.className === "delete-btn") {
            try {
                const response = await fetch(`${API_URL}/${taskId}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) throw new Error("Erro ao deletar na API.");

                taskList.removeChild(li);

            } catch (error) {
                console.error("Erro ao deletar:", error);
                alert("Não foi possível deletar a tarefa.");
            }
            return;
        }

        if (clickedElement.tagName === "SPAN" || clickedElement.tagName === "LI") {
            try {
                const newCompletedStatus = !li.classList.contains("completed");

                const response = await fetch(`${API_URL}/${taskId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ completed: newCompletedStatus })
                });

                if (!response.ok) throw new Error("Erro ao atualizar na API.");

                li.classList.toggle("completed", newCompletedStatus);

            } catch (error) {
                console.error("Erro ao atualizar:", error);
                alert("Não foi possível marcar a tarefa como concluída.");
            }
        }
    }

    /**
     * ADAPTADO (NOVA FUNÇÃO):
     * Peguei sua lógica de criar LI e a transformei em uma função.
     * Ela renderiza uma tarefa (vinda da API) na tela.
     * @param {object} task - O objeto da tarefa (ex: {id: 1, text: '...', completed: false})
     */
    function renderTaskOnScreen(task) {
        const li = document.createElement("li");

        li.dataset.id = task.id;

        if (task.completed) {
            li.classList.add("completed");
        }

        const taskSpan = document.createElement("span");
        taskSpan.textContent = task.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Excluir";
        deleteBtn.className = "delete-btn";

        li.appendChild(taskSpan);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    }

});