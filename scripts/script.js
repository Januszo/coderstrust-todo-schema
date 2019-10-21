// Tutaj dodacie zmienne globalne do przechowywania elementów takich jak np. lista czy input do wpisywania nowego todo
let $list;
let $addButton;
let $input;
const initialList = ["Kup mleko", "Wyczyść dywan"];

function main() {
  prepareDOMElements();
  prepareDOMEvents();
  prepareInitialList();
}

function prepareDOMElements() {
  // To będzie idealne miejsce do pobrania naszych elementów z drzewa DOM i zapisanie ich w zmiennych
  $list = document.getElementById("list");
  $addButton = document.getElementById("addTodo");
  $input = document.getElementById("newTodo");
}

function prepareDOMEvents() {
  // Przygotowanie listenerów
  $list.addEventListener("click", listClickManager);
  $addButton.addEventListener("click", addNewElementToList);
}

function prepareInitialList() {
  // Tutaj utworzymy sobie początkowe todosy. Mogą pochodzić np. z tablicy
  initialList.forEach(todo => {
    addNewElementToList(todo);
  });
}

function addNewElementToList(title   /* Title, author, id */) {
  //obsługa dodawanie elementów do listy
  // $list.appendChild(createElement('nowy', 2))
  // if ($input.value !== "") { title = $input.value };
  if (event.target.id === "addTodo") { title = $input.value }
  const newElement = createElement(title);
  $list.appendChild(newElement);
}

function createElement(title /* Title, author, id */) {
  // Tworzyc reprezentacje DOM elementu return newElement
  // return newElement
  if (title === "") {title = "PUSTY_ELEMENT"};
  const newElement = document.createElement("li");
  newElement.innerText = title;

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
