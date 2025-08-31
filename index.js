const addForm = document.querySelector('.add');
const list = document.querySelector('.todos');
const search = document.querySelector('.search input');

// hämta från localStorage eller skapa default
let todos = JSON.parse(localStorage.getItem("todos"));
if (!todos || todos.length === 0) {
  todos = [
    { id: Date.now() + 1, text: "Buy popcorn and candy", date: new Date().toLocaleString(), done: false },
    { id: Date.now() + 2, text: "Make popcorn", date: new Date().toLocaleString(), done: false },
    { id: Date.now() + 3, text: "Watch movie", date: new Date().toLocaleString(), done: false },
  ];
  localStorage.setItem("todos", JSON.stringify(todos));
}

// skapa en todo som HTML
const generateTemplate = (todoObj) => {
  return `
    <li class="list-group-item d-flex justify-content-between align-items-center ${todoObj.done ? "done" : ""}" data-id="${todoObj.id}">
      <span>${todoObj.text}</span>
      <div>
        <small class="text-muted mr-2">${todoObj.date}</small>
        <i class="fas fa-arrow-up text-success move-up mr-2"></i>
        <i class="fas fa-arrow-down text-warning move-down mr-2"></i>
        <i class="far fa-trash-alt text-danger delete"></i>
      </div>
    </li>
  `;
};

// rendera alla todos
const renderTodos = () => {
  list.innerHTML = "";  // rensa först
  const html = todos.map(todo => generateTemplate(todo)).join("");
  list.insertAdjacentHTML("beforeend", html);
  localStorage.setItem("todos", JSON.stringify(todos));
};


// lägg till ny todo
addForm.addEventListener('submit', e => {
  e.preventDefault();
  const todoText = addForm.add.value.trim();

  if(todoText.length){
    const newTodo = {
      id: Date.now(),
      text: todoText,
      date: new Date().toLocaleString(),
      done: false
    };
    todos.push(newTodo);
    renderTodos();
    addForm.reset();
  }
});

// klick-events för delete, move, markera klar
list.addEventListener('click', e => {
  const target = e.target;
  const li = target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);
  const index = todos.findIndex(t => t.id === id);

  // TA BORT
  if (target.classList.contains('delete')) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
    return;
  }

  // FLYTTA UPP
  if (target.classList.contains('move-up') && index > 0) {
    [todos[index-1], todos[index]] = [todos[index], todos[index-1]];
    renderTodos();
    return;
  }

  // FLYTTA NER
  if (target.classList.contains('move-down') && index < todos.length - 1) {
    [todos[index+1], todos[index]] = [todos[index], todos[index+1]];
    renderTodos();
    return;
  }

  // MARKERA KLAR (när man klickar på span-texten)
  if (target.tagName === 'SPAN') {
    if (index !== -1) {
      todos[index].done = !todos[index].done;
      renderTodos();                 // rerender för att sätta li.done och spara i localStorage
    } else {
      // fallback: toggle DOM-klass om todo inte finns i arrayen
      li.classList.toggle('done');
    }
    return;
  }
});

// filtera todos
const filterTodos = (term) => {
  Array.from(list.children).forEach((todo) => {
    const match = todo.textContent.toLowerCase().includes(term);
    todo.style.display = match ? "flex" : "none";
  });
};

search.addEventListener('keyup', () => {
  const term = search.value.trim().toLowerCase();
  filterTodos(term);
});

// första render
renderTodos();
