/*

Projekt zaliczeniowy kursu frontend developer, modułu JavaScript

Pierwsza część wytycznych
Szkielet projektu można znaleźć tutaj: https://github.com/heban/coderstrust-todo-schema
Zadaniem kursanta jest stworzenie prostej aplikacji typu Todo lista. Przykład takiej aplikacji można zobaczyć tutaj: http://todomvc.com/examples/vanillajs/

Aplikacja ma pozwalać na:
* Dodawanie nowego elementu listy
* Usuwanie istniejących elementów listy
* Oznaczanie elementów jako wykonanych
* Edycję istniejących elementów (zmiana nazwy)
* Na starcie aplikacji, lista powinna zawierać kilka stworzonych przez kursanta elementów todo
* Wygląd aplikacji nie jest ustalony i kursant może się pochwalić tutaj wiedzą z zakresu HTML/CSS aby ostylować aplikację w swój własny, unikalny sposób

Druga częśc wytycznych 
* Szkielet projektu jest identyczny jak w części 1, można go znaleźć tutaj: https://github.com/heban/coderstrust-todo-schema
* Zadaniem kursanta jest stworzenie prostej aplikacji typu TODO lista, która będzie komunikowała się z serwerem
* Wykorzystując wypisane wyżej endpointy, aplikacja ma umożliwiać:
* Pobieranie listy z serwera w momencie uruchomienia aplikacji
* Dodawanie nowych elementów do listy
* Usuwanie istniejących elementów
* Edycję istniejących elementów (zmianę nazwy elementu todo)
* Nieobowiązkową częścią jest oznaczanie na serwerze elementu listy jako wykonanego
* Wygląd aplikacji zależy tylko od kursanta

Endpointy serwera:
GET http://195.181.210.249:3000/todo/  - pobiera listę TODO
POST http://195.181.210.249:3000/todo/ - dodaje nowe TODO. Wymaganą daną jest parametr title, przykład: {"title":"Test"}
DELETE http://195.181.210.249:3000/todo/id  - usuwa TODO o podanym w URLu id
PUT http://195.181.210.249:3000/todo/id - aktualizuje TODO o podanym w URLu id. Aktualizacja wymaga przesłania parametru title w celu modyfikacji tytułu TODO, przykład: {"title":"test"}

*/

  // Zmienne globalne
let $list;
let input;
let form;
let modal;
let cancel;
let close;
let ok;
let currentId;

function main() {
  // Główna funkcja inicjalizująca najważniejsze elementy i wywołująca pobranie listy
  prepareDOMElements();
  prepareDOMEvents();
  getTodosFromServer();
}

function prepareDOMElements() {
  // Pobranie elementów z drzewa DOM i zapisanie ich w zmiennych
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
  cancel.addEventListener("click", cancelModal);
  ok.addEventListener("click", okModal);
}

function getTodosFromServer() {
  // Pobiera listę z serwera
  axios.get("http://195.181.210.249:3000/todo/")
    .then(function (response) {
      response.data.forEach(function (todo) {
        addNewElementToList(todo.title, todo.id);
        if (todo.extra === "done") {document.getElementById(todo.id).firstChild.className = "done"}; // Przekreślenie jeśli element był oznaczone jako "done"
      });
    });
}


function addNewTodoViaForm(e) {
  // Usuwa defaultowe przeładowywanie strony po submicie
  e.preventDefault();
  addNewTodo();
}

function addNewTodo() {
  // Sprawdza czy input jest nie pusty
  if (input.value.trim() !== "") {
    postTodoToServer();
  };
}

function postTodoToServer() {
  // Wrzuca na serwer nowy element, zwraca go, żeby dopisać id i dodaje do listy
  axios.post("http://195.181.210.249:3000/todo/", {
    title: input.value,
  }).then(() => {
    axios.get("http://195.181.210.249:3000/todo/")
    .then(function (response) {
      let lastElement = response.data.slice(-1)[0];
      addNewElementToList(lastElement.title, lastElement.id);
      input.value = "";
    });
  });
}

function addNewElementToList(title, id) {
  // Dodaje element do listy
  const newElement = createElement(title, id);
  $list.insertAdjacentHTML("beforeend", newElement);
}

function createElement(title, id) {
  // Tworzy element do dodania
  
  const newElementWhole = 
  `
  <li id="${id}">
    <span>${title}</span>
    <button class="delBtns">Delete</button>
    <button class="editBtns">Edit</button>
    <button class="markAsDone">Done</button>
  </li>
  `
  //usuwa w powyższym entery i spacje, żeby nie było pustych node'ów
  let newnew = newElementWhole.replace(/\n\s+/g, "");
  return newnew;
}

function listClickManager(event) {
  // Rozstrzyga co dokładnie zostało kliknięte i wywołuje odpowiednią funkcję
  currentId = event.target.parentElement.id;
  const clickedClass = event.target.className;
  if (clickedClass === "delBtns") {
    deleteTodo();
  } else if (clickedClass === "editBtns") {
    openModal();
  } else if (clickedClass === "markAsDone") {
    markAsDone();
  };
}

function deleteTodo() {
  // Usuwa element z listy
  axios.delete("http://195.181.210.249:3000/todo/" + currentId)
    .then(function (response) {
    document.getElementById(currentId).remove();
  });
}

function markAsDone() {
  // Oznacza jako zrobiony albo usuwa oznaczenie jeśli było i przesyła info do serwera
  const element = document.getElementById(currentId).firstChild;
  if (element.className === "") {
    element.classList.add("done");
    axios.put("http://195.181.210.249:3000/todo/" + currentId, {
      extra: "done",
    });
  } else if (element.className === "done") {
    element.classList.remove("done");
    axios.put("http://195.181.210.249:3000/todo/" + currentId, {
      extra: null,
    });
  };
}

function openModal() {
  // Otwiera modal z danymi z edytowanego elementu w inpucie
  let spanValue = document.getElementById(currentId).firstChild;
  let modalInput = document.getElementById("popupInput");
  modalInput.value = spanValue.innerHTML;
  modal.style.display = "block";
  modalInput.focus();
}

function closeModal() {
  // Zamyka modal i czyści go
  modal.style.display = "none";
  document.getElementById("popupInput").value = "";
}

function cancelModal() {
  // Przywraca pierwotną wartość do inputa
  document.getElementById("popupInput").value = document.getElementById(currentId).firstChild.innerHTML;
}

function okModal() {
  // Aktualizuje element, wysyła na serwer i zamyka modal
  let spanValue = document.getElementById(currentId).firstChild;
  let modalInput = document.getElementById("popupInput");
  spanValue.innerHTML = modalInput.value;
  axios.put("http://195.181.210.249:3000/todo/" + currentId, {
    title: modalInput.value
  }).then(() => { modal.style.display = "none" });
}

  // Inicjalizacja głównej funkcji
document.addEventListener("DOMContentLoaded", main);