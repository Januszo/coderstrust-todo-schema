// Tutaj dodacie zmienne globalne do przechowywania elementów takich jak np. lista czy input do wpisywania nowego todo
let $list;
let addButton;
let input;
let form;
const initialList = ["Kup mleko", "Wyczyść dywan"];

function main() {
  prepareDOMElements();
  prepareDOMEvents();
  prepareInitialList();
}

function prepareDOMElements() {
  // To będzie idealne miejsce do pobrania naszych elementów z drzewa DOM i zapisanie ich w zmiennych
  $list = document.querySelector("#list");
  addButton = document.querySelector("#addTodo");
  input = document.querySelector("#newTodo");
  form = document.querySelector("#formTodo");
}

function prepareDOMEvents() {
  // Przygotowanie listenerów
  $list.addEventListener("click", listClickManager);
  form.addEventListener("submit", addNewTodoViaForm);
}

function prepareInitialList() {
  // Tutaj utworzymy sobie początkowe todosy. Mogą pochodzić np. z tablicy
  initialList.forEach(todo => {
    addNewElementToList(todo);
  });
}

function addNewTodoViaForm(e) {
  e.preventDefault();
  addNewTodo();
}

function addNewTodo() {
  if (input.value.trim() !== "") {
    addNewElementToList(input.value);
    input.value = "";
  }
}

function addNewElementToList(title   /* Title, author, id */) {
  //obsługa dodawanie elementów do listy
  // $list.appendChild(createElement('nowy', 2))
  // title.preventDefault();
  // if (event.target.id === "form") { title = input.value }
  const newElement = createElement(title);
  $list.appendChild(newElement);
}

function createElement(title /* Title, author, id */) {
  // Tworzyc reprezentacje DOM elementu return newElement
  // return newElement
  // if (title === "") {title = "PUSTY_ELEMENT"};

  // template literals zrobić może ${}

  const newElement = document.createElement("li");
  const newSpan = document.createElement("span")
  newSpan.innerText = title;

  const delButton = document.createElement("button");
  delButton.innerText = "Delete";
  newElement.appendChild(newSpan);
  newElement.appendChild(delButton);

  return newElement;
}

function listClickManager(/* event- event.target */) {
  // Rozstrzygnięcie co dokładnie zostało kliknięte i wywołanie odpowiedniej funkcji
  // event.target.parentElement.id
  // if (event.target.className === "edit") { editListElement(id) }
}

function openPopup() {
  // Otwórz popup
}

function closePopup() {
  // Zamknij popup
}

document.addEventListener("DOMContentLoaded", main);
