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
let loader;
let input;
let form;
let modal;
let cancel;
let close;
let ok;
let currentId;
let modalInput;

let main = () => {
  // Główna funkcja inicjalizująca najważniejsze elementy i wywołująca pobranie listy
  prepareDOMElements();
  prepareDOMEvents();
  getTodosFromServer();
}

let prepareDOMElements = () => {
  // Pobranie elementów z drzewa DOM i zapisanie ich w zmiennych
  $list = document.querySelector("#list");
  loader = document.querySelector("#loaderBox");
  input = document.querySelector("#newTodo");
  form = document.querySelector("#formTodo");
  modal = document.querySelector("#myModal");
  cancel = document.querySelector("#cancelModal");
  close = document.querySelector("#closeModal");
  ok = document.querySelector("#acceptModal");
  modalInput = document.querySelector("#popupInput");
}

let prepareDOMEvents = () => {
  // Przygotowanie listenerów
  $list.addEventListener("click", listClickManager);
  form.addEventListener("submit", addNewTodoViaForm);
  close.addEventListener("click", closeModal);
  cancel.addEventListener("click", cancelModal);
  ok.addEventListener("click", okModal);
}

let getTodosFromServer = () => {
  // Pobiera listę z serwera
  showLoader();
  axios.get("http://195.181.210.249:3000/todo/")
  .then(response => {
    response.data.forEach(todo => {
      addNewElementToList(todo.title, todo.id);
      if (todo.extra === "done") {document.getElementById(todo.id).className = "done"}; // Przekreślenie jeśli element był oznaczone jako "done"
    });
  })
  .catch(e => console.log(`Error ${e}`))
  .finally(() => {hideLoader()});
}

let showLoader = () => loader.classList.add("loader-box--show");

let hideLoader = () => loader.classList.remove("loader-box--show");

let addNewTodoViaForm = e => {
  // Usuwa defaultowe przeładowywanie strony po submicie
  e.preventDefault();
  addNewTodo();
}

let addNewTodo = () => {
  // Sprawdza czy input jest nie pusty
  if (input.value.trim() !== "") {
    postTodoToServer();
  };
}

let postTodoToServer = () => {
  axios.post("http://195.181.210.249:3000/todo/", {title: input.value,})
  .then(() => {
    $list.innerHTML = '';
    getTodosFromServer();
    input.value = "";
  });
}

let addNewElementToList = (title, id) => {
  // Dodaje element do listy
  const newElement = createElement(title, id);
  $list.insertAdjacentHTML("beforeend", newElement);
}

let createElement = (title, id) => {
  // Tworzy element do dodania
  const newElementWhole = 
  `<li id="${id}"><span>${title}</span>
      <span class="buttons">
        <button class="delBtns" title="delete">
          <i class="material-icons">delete_outline</i>
        </button>
        <button class="editBtns" title="edit">
          <i class="material-icons">text_format</i>
        </button>
        <button class="markAsDone" title="done">
          <i class="material-icons">done</i>
        </button>
      </span>
  </li>`
  //usuwa w powyższym entery i spacje, żeby nie było pustych node'ów
  let newnew = newElementWhole.replace(/\n\s+/g, "");
  return newnew;
}

let listClickManager = event => {
  // Rozstrzyga co dokładnie zostało kliknięte i wywołuje odpowiednią funkcję
  currentId = event.target.closest("li").id;
  const clickedClass = event.target.parentNode.className;
  if (clickedClass === "delBtns") {deleteTodo()} 
  else if (clickedClass === "editBtns") {openModal()} 
  else if (clickedClass === "markAsDone") {markAsDone()};
}

let deleteTodo = () => {
  // Usuwa element z listy
  showLoader();
  axios.delete("http://195.181.210.249:3000/todo/" + currentId)
  .then(response => document.getElementById(currentId).remove())
  .finally(() => {hideLoader()});
}

let markAsDone = () => {
  // Oznacza jako zrobiony albo usuwa oznaczenie jeśli było i przesyła info do serwera
  const element = document.getElementById(currentId);
  if (element.className === "") {
    element.classList.add("done");
    showLoader();
    axios.put("http://195.181.210.249:3000/todo/" + currentId, {extra: "done"})
    .finally(() => {hideLoader()});
  } else if (element.className === "done") {
    element.classList.remove("done");
    showLoader();
    axios.put("http://195.181.210.249:3000/todo/" + currentId, {extra: null})
    .finally(() => {hideLoader()});
  };
}

let openModal = () => {
  // Otwiera modal z danymi z edytowanego elementu w inpucie
  let spanValue = document.getElementById(currentId).firstChild;
  modalInput.value = spanValue.innerHTML;
  modal.style.display = "block";
  modalInput.focus();
}

let closeModal = () => {
  // Zamyka modal i czyści go
  modal.style.display = "none";
  document.getElementById("popupInput").value = "";
}

let cancelModal = () => {
  // Przywraca pierwotną wartość do inputa
  document.getElementById("popupInput").value = document.getElementById(currentId).firstChild.innerHTML;
}

let okModal = () => {
  // Aktualizuje element, wysyła na serwer i zamyka modal
  let spanValue = document.getElementById(currentId).firstChild;
  spanValue.innerHTML = modalInput.value;
  showLoader();
  axios.put("http://195.181.210.249:3000/todo/" + currentId, {title: modalInput.value})
  .then(() => { modal.style.display = "none" })
  .finally(() => {hideLoader()});
}

  // Inicjalizacja głównej funkcji
document.addEventListener("DOMContentLoaded", main);