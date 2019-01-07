class Book {
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}

	save() {
		const book = localStorage.getItem(`book#${this.isbn}`);
		if (!book) {
			localStorage.setItem(`book#${this.isbn}`, JSON.stringify(this));
		} else {
			throw new Error('Book with that ISBN already exists!');
		}
	}

	static deleteBook(isbn) {
		localStorage.removeItem(`book#${isbn}`);
	}

	static getBooks() {
		const books = Object.keys(localStorage)
			.filter(key => key.indexOf('book#') >= 0)
			.map(key => JSON.parse(localStorage.getItem(key)));
		return books;
	}
}

const addBookForm = document.querySelector('.book-form');
const formInputs = addBookForm.querySelectorAll('input[type="text"]');
const bookTableRows = document.querySelector('.book-table-rows');
const alert = document.querySelector('.alert');

const inputOnChange = event => {
	const error = event.target.parentNode.querySelector('.error');
	if (!event.target.value || event.target.value.trim().length === 0) {
		error.innerText = `This field can't be empty.`;
		error.classList.add('show');
		event.target.classList.add('input-error');
	} else {
		error.classList.remove('show');
		event.target.classList.remove('input-error');
	}
	if (event.target.name === 'isbn') {
		if (isNaN(event.target.value)) {
			error.innerText = `This field must be a number.`;
			error.classList.add('show');
			event.target.classList.add('input-error');
		} else {
			error.classList.remove('show');
			event.target.classList.remove('input-error');
		}
	}
};

formInputs.forEach(input => input.addEventListener('keyup', inputOnChange));

const bookDeleteHandler = event => {
	Book.deleteBook(event.target.parentNode.querySelector('.isbn').innerText);
	getBookList();
};

const setDeleteHandlers = () => {
	document
		.querySelectorAll('.delete')
		.forEach(deleteButton =>
			deleteButton.addEventListener('click', bookDeleteHandler)
		);
};

setDeleteHandlers();

const getBookList = () => {
	bookTableRows.innerHTML = Book.getBooks()
		.map(
			book => `<div class="book-table-row">
						<p class="title">${book.title}</p>
						<p class="author">${book.author}</p>
						<p class="isbn">${book.isbn}</p>
						<p class="delete">X</p>
					</div>`
		)
		.join('');
	setDeleteHandlers();
};

const clearForm = () => {
	formInputs.forEach(input => (input.value = ''));
};

getBookList();

const addBook = event => {
	event.preventDefault();
	const bookDetails = Array.from(formInputs).map(input => input.value);
	const book = new Book(bookDetails[0], bookDetails[1], bookDetails[2]);
	try {
		book.save();
		clearForm();
		getBookList();
		alert.innerText = 'Book added successfully!';
		alert.classList.add('success');
		setTimeout(() => {
			alert.classList.remove('success');
		}, 3000);
	} catch (err) {
		alert.innerText = err.message;
		alert.classList.add('fail');
		setTimeout(() => {
			alert.classList.remove('fail');
		}, 3000);
	}
};

addBookForm.addEventListener('submit', addBook);
