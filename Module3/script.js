const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const taskCount = document.getElementById("taskCount");
const filterBtns = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

function saveTodos(){
    localStorage.setItem(
        "todos",
        JSON.stringify(todos)
    );
}

function renderTodos(){

    todoList.innerHTML = "";

    let filteredTodos = todos.filter(todo => {

        if(currentFilter === "active"){
            return !todo.completed;
        }

        if(currentFilter === "completed"){
            return todo.completed;
        }

        return true;
    });

    filteredTodos.forEach(todo => {

        const li = document.createElement("li");

        li.classList.add("todo-item");

        li.innerHTML = `
            <div class="todo-left">

                <input
                    type="checkbox"
                    class="toggle"
                    data-id="${todo.id}"
                    ${todo.completed ? "checked" : ""}
                >

                <span class="${todo.completed ? "completed" : ""}">
                    ${todo.text}
                </span>

            </div>

            <div class="actions">

                <button
                    class="edit"
                    data-id="${todo.id}">
                    Edit
                </button>

                <button
                    class="delete"
                    data-id="${todo.id}">
                    Delete
                </button>

            </div>
        `;

        todoList.appendChild(li);
    });

    updateCount();
}

function updateCount(){

    const activeTasks = todos.filter(
        todo => !todo.completed
    ).length;

    taskCount.textContent =
        `${activeTasks} Tasks Left`;
}

function addTodo(){

    const text = todoInput.value.trim();

    if(text === "") return;

    todos.push({
        id: Date.now(),
        text,
        completed:false
    });

    saveTodos();
    renderTodos();

    todoInput.value = "";
}

addBtn.addEventListener(
    "click",
    addTodo
);

todoInput.addEventListener(
    "keypress",
    (e)=>{
        if(e.key==="Enter"){
            addTodo();
        }
    }
);

todoList.addEventListener(
    "click",
    (e)=>{

        const id = Number(
            e.target.dataset.id
        );

        if(e.target.classList.contains("delete")){

            todos = todos.filter(
                todo => todo.id !== id
            );

            saveTodos();
            renderTodos();
        }

        if(e.target.classList.contains("edit")){

            const todo = todos.find(
                todo => todo.id === id
            );

            const newText = prompt(
                "Edit Task",
                todo.text
            );

            if(newText){

                todo.text = newText.trim();

                saveTodos();
                renderTodos();
            }
        }
    }
);

todoList.addEventListener(
    "change",
    (e)=>{

        if(e.target.classList.contains("toggle")){

            const id = Number(
                e.target.dataset.id
            );

            const todo = todos.find(
                todo => todo.id === id
            );

            todo.completed =
                e.target.checked;

            saveTodos();
            renderTodos();
        }
    }
);

filterBtns.forEach(btn => {

    btn.addEventListener(
        "click",
        ()=>{

            filterBtns.forEach(
                b => b.classList.remove("active")
            );

            btn.classList.add("active");

            currentFilter =
                btn.dataset.filter;

            renderTodos();
        }
    );
});

renderTodos();