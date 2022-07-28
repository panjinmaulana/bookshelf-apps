let books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    const searchSubmit = document.getElementById('searchBook');

    searchSubmit.addEventListener('submit', function (event) {
        event.preventDefault();
        searchBook();
    });

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    };
});

document.addEventListener(RENDER_EVENT, function () {
    showBook();
});

function generateId() {
    return +new Date();
};

function generateBookToObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    };
};

function findBook(bookId) {
    const found = books.find((element) => element.id == bookId);

    return found;
};

function searchBook() {
    const titleBook = document.getElementById('searchBookTitle').value;

    const filteredBook = books.filter(bookItem => {
        if (titleBook) return bookItem.title == titleBook;
        return bookItem;
    });

    showBook(filteredBook);
};

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Your browser does not support local storage.');
        return false;
    };

    return true;
};

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    };
};

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        };
    };

    document.dispatchEvent(new Event(RENDER_EVENT));
};

function showBook(data) {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const bookItem of data ? data : books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) {
            incompleteBookshelfList.append(bookElement);
        } else {
            completeBookshelfList.append(bookElement);
        };
    };
};

function makeBook(bookObject) {
    const title = document.createElement('h3');
    title.innerText = bookObject.title;

    const author = document.createElement('p');
    author.innerText = `Penulis: ${bookObject.author}`;

    const year = document.createElement('p');
    year.innerText = `Tahun: ${bookObject.year}`;

    const action = document.createElement('div');
    action.classList.add('action');

    const article = document.createElement('article');
    article.classList.add('book_item');
    article.append(title, author, year, action);
    article.setAttribute('id', `book-${bookObject.id}`);

    const redoButton = document.createElement('button');
    const undoButton = document.createElement('button');

    if (bookObject.isComplete) {
        undoButton.classList.add('green');
        undoButton.innerText = 'Belum selesai dibaca';

        undoButton.addEventListener('click', function () {
            undoTask(bookObject.id);
        });
    } else {
        redoButton.classList.add('green');
        redoButton.innerText = 'Selesai dibaca';

        redoButton.addEventListener('click', function () {
            redoTask(bookObject.id);
        });
    };

    const trashButton = document.createElement('button');
    trashButton.classList.add('red');
    trashButton.innerText = 'Hapus buku';

    trashButton.addEventListener('click', function () {
        removeTask(bookObject.id);
    });

    action.append(bookObject.isComplete ? undoButton : redoButton, trashButton);

    return article;
};

function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isComplete = document.querySelector('#inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookObject = generateBookToObject(generatedID, title, author, year, isComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function redoTask(bookId) {
    const bookTarget = findBook(bookId);

    if (!bookTarget) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function undoTask(bookId) {
    const bookTarget = findBook(bookId);

    if (!bookTarget) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function removeTask(bookId) {
    const bookTarget = findBook(bookId);

    if (!bookTarget) return;

    for (const [index, value] of books.entries()) {
        if (value.id == bookTarget.id) books.splice(index, 1);
    };
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};