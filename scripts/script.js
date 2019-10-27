/*
Endpointy serwera:
GET http://195.181.210.249:3000/todo/  - pobiera listę TODO
POST http://195.181.210.249:3000/todo/ - dodaje nowe TODO. Wymaganą daną jest parametr title, przykład: {"title":"Test"}
DELETE http://195.181.210.249:3000/todo/id  - usuwa TODO o podanym w URLu id
PUT http://195.181.210.249:3000/todo/id - aktualizuje TODO o podanym w URLu id. Aktualizacja wymaga przesłania parametru title w celu modyfikacji tytułu TODO, przykład: {"title":"test"}

Szkielet projektu jest identyczny jak w części 1, można go znaleźć tutaj: https://github.com/heban/coderstrust-todo-schema
Zadaniem kursanta jest stworzenie prostej aplikacji typu TODO lista, która będzie komunikowała się z serwerem
Wykorzystując wypisane wyżej endpointy, aplikacja ma umożliwiać:
Pobieranie listy z serwera w momencie uruchomienia aplikacji
Dodawanie nowych elementów do listy
Usuwanie istniejących elementów
Edycję istniejących elementów (zmianę nazwy elementu todo)
Nieobowiązkową częścią jest oznaczanie na serwerze elementu listy jako wykonanego
Wygląd aplikacji zależy tylko od kursanta

!!!!!Pierwsza część wytycznych
Szkielet projektu można znaleźć tutaj: https://github.com/heban/coderstrust-todo-schema
Zadaniem kursanta jest stworzenie prostej aplikacji typu Todo lista. Przykład takiej aplikacji można zobaczyć tutaj: http://todomvc.com/examples/vanillajs/
Aplikacja ma pozwalać na:
Dodawanie nowego elementu listy
Usuwanie istniejących elementów listy
Oznaczanie elementów jako wykonanych
Edycję istniejących elementów (zmiana nazwy)
Na starcie aplikacji, lista powinna zawierać kilka stworzonych przez kursanta elementów todo
Wygląd aplikacji nie jest ustalony i kursant może się pochwalić tutaj wiedzą z zakresu HTML/CSS aby ostylować aplikację w swój własny, unikalny sposób

*/

// Tutaj  zmienne globalne do przechowywania elementów takich jak np. lista czy input
let $list;
let input;
let form;
let modal;
let cancel;
let close;
let ok;

function main() {
  prepareDOMElements();
  prepareDOMEvents();
  getTodosFromServer();
}

function prepareDOMElements() {
  // To będzie idealne miejsce do pobrania naszych elementów z drzewa DOM i zapisanie ich w zmiennych
  $list = document.querySelector("#list");
  input = document.querySelector("#newTodo");
  form = document.querySelector("#formTodo");
  modal = document.querySelector("#myModal");
  cancel = document.querySelector("#cancelModal");
  close = document.querySelector("#closeModal");
  ok = document.querySelector("#acceptModal");
}

function prepareDOMEvents() {
  // Przygotowanie listenerów
  $list.addEventListener("click", listClickManager);
  form.addEventListener("submit", addNewTodoViaForm);
  close.addEventListener("click", closeModal);
}

function getTodosFromServer() {
  axios.get("http://195.181.210.249:3000/todo/")
    .then(function (response) {
      response.data.forEach(function (todo) {
        addNewElementToList(todo.title, todo.id);
        if (todo.extra === "done") {document.getElementById(todo.id).firstChild.className = "done"}
      });
    });
}

function addNewTodoViaForm(e) {
  e.preventDefault();
  addNewTodo();
}

function addNewTodo() {
  if (input.value.trim() !== "") {
    postTodoToServer();
    setTimeout(() => {
    axios.get("http://195.181.210.249:3000/todo/")
      .then(function (response) {
        let justAddedId = response.data.slice(-1);
        addNewElementToList(input.value, justAddedId[0].id);
        input.value = "";
      })}, 100);
  };
}

function postTodoToServer() {
  axios.post("http://195.181.210.249:3000/todo/", {
    title: input.value,
  });
}

function addNewElementToList(title, id) {
  //obsługa dodawania elementów do listy
  const newElement = createElement(title, id);
  $list.insertAdjacentHTML("beforeend", newElement);
}

function createElement(title, id) {
  // Tworzyc reprezentacje DOM elementu return newElement
  
  const newElementWhole = 
  `<li id="${id}"><span>${title}</span>
  <button class="delBtns">Delete</button>
  <button class="editBtns">Edit</button>
  <button class="markAsDone">Done</button>
  </li>`

  return newElementWhole;
}

function listClickManager(event) {
  // Rozstrzygnięcie co dokładnie zostało kliknięte i wywołanie odpowiedniej funkcji
  const clickedId = event.target.parentElement.id;
  const clickedClass = event.target.className;
  if (clickedClass === "delBtns") {
    deleteTodo(clickedId);
  } else if (clickedClass === "editBtns") {
    openModal(clickedId);
  } else if (clickedClass === "markAsDone") {
    markAsDone(clickedId);
  };
}

function deleteTodo(id) {
  axios.delete("http://195.181.210.249:3000/todo/" + id)
    .then(function (response) {
    document.getElementById(id).remove();
  });
}

function markAsDone(id) {
  const element = document.getElementById(id).firstChild;
  if (element.className === "") {
    element.classList.add("done");
    axios.put("http://195.181.210.249:3000/todo/" + id, {
      extra: "done",
    });
  } else if (element.className === "done") {
    element.classList.remove("done");
    axios.put("http://195.181.210.249:3000/todo/" + id, {
      extra: null,
    });
  };
}

function openModal(id) {
  let spanValue = document.getElementById(id).firstChild;
  let modalInput = document.getElementById("popupInput");
  modalInput.value = spanValue.innerHTML;
  modal.style.display = "block";
  modalInput.focus();
  
  let cancelModal = () => document.getElementById("popupInput").value = spanValue.innerHTML;
  cancel.addEventListener("click", cancelModal);

  let okModal = () => {
    spanValue.innerHTML = modalInput.value;
    axios.put("http://195.181.210.249:3000/todo/" + id, {
      title: modalInput.value
    }).then(() => { modal.style.display = "none" });
  };
  ok.addEventListener("click", okModal);
}

function closeModal() {
  modal.style.display = "none";
}

// document.querySelector(".modal").style.display = "none";


document.addEventListener("DOMContentLoaded", main);
