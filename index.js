//Get a list of books & render them
const bookURL = "http://localhost:3000/books";

function main() {
  fetchBooks();
  clickListener();
}

function fetchBooks() {
  fetch(bookURL)
    .then((resp) => resp.json())
    .then((books) => {
      books.forEach(renderBook);
    });
}

function renderBook(book) {
  //grab the ul
  //create an Li for each book
  //append the li into the ul
  const ul = document.querySelector("#list");
  const bookLi = document.createElement("li");
  bookLi.setAttribute("data-id", book.id);
  bookLi.innerText = `${book.title}`;
  ul.append(bookLi);
}

function clickListener() {
  const mainUL = document.querySelector("#list");
  mainUL.addEventListener("click", function (event) {
    const bookID = event.target.dataset.id;
    fetch(`http://localhost:3000/books/${bookID}`)
      .then((resp) => resp.json())
      .then((bookData) => {
        const showPanel = document.querySelector("#show-panel");
        showPanel.innerHTML = "";
        const showDiv = document.createElement("div");
        showDiv.id = "show-div";
        showDiv.innerHTML = `<h3>${bookData.title}</h3>
                                    <img src=${bookData.img_url} alt="">
                                    <p>${bookData.description}</p>
                                    <button id="read-btn" data-id=${bookData.id}>read</button>`;
        const userUl = document.createElement("ul");
        userUl.id = "ul-id";
        if (bookData.users) {
          bookData.users.forEach((user) => {
            const userList = document.createElement("li");
            userList.innerText = `${user.username}`;
            userUl.append(userList);
          });
          showDiv.append(userUl);
        }
        showPanel.append(showDiv);
        readListener(bookData.users);
      });
  });
}

function readListener(users) {
  const bookUsers = [...users];
  bookUsers.push({ id: 1, username: "pouros" });
  const readBtn = document.querySelector("#read-btn");
  readBtn.addEventListener("click", function (event) {
    const bookID = event.target.dataset.id;
    const showDiv = document.querySelector("#show-div");
    const userUl = document.querySelector("#ul-id");
    userUl.innerHTML = "";

    const reqObj = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ users: bookUsers }),
    };
    fetch(`http://localhost:3000/books/${bookID}`, reqObj)
      .then((resp) => resp.json())
      .then((wholeBook) => {
        wholeBook.users.forEach((user) => {
          const showPanel = document.querySelector("#show-panel");
          const userList = document.createElement("li");
          userList.innerText = `${user.username}`;
          userUl.append(userList);
          showDiv.append(userUl);
          showPanel.append(showDiv);
        });
      });
  });
}

main();
