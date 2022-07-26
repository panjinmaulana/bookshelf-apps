const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
});

document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
});

// document.addEventListener(SAVED_EVENT, function () {
//     console.log(localStorage.getItem(STORAGE_KEY));
// });

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
        document.dispatchEvent(new Event(SAVED_EVENT));
    };
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
}


function addTaskToFinishedReading(bookId) {
    // ...
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};


function removeTaskFromFinishedReading(bookId) {
    // ...
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};


function undoTaskFromFinishedReading(bookId) {
    // ...
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};