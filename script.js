// --- 1. GLOBAL RETURN FUNCTION (Must be outside to be accessible by HTML buttons) ---
window.returnBook = function (index) {
  if (!confirm("Confirm return of this book?")) return;

  // We must re-fetch data here because this function runs outside the main scope
  const issued = JSON.parse(localStorage.getItem('issuedBooks')) || [];
  const books = JSON.parse(localStorage.getItem('libraryBooks')) || [];
  const history = JSON.parse(localStorage.getItem('returnedHistory')) || [];

  const record = issued[index];

  if (!record) {
    alert("Error: Record not found. Try refreshing the page.");
    return;
  }

  // 1. Restore Stock
  const bookIndex = books.findIndex(b => b.id === record.bookId);
  if (bookIndex !== -1) {
    books[bookIndex].qty += 1;
    localStorage.setItem('libraryBooks', JSON.stringify(books));
  }

  // 2. Add to History (Returned Books Page)
  const historyRecord = {
    ...record,
    actualReturnDate: new Date().toISOString().split('T')[0] // Today's Date
  };
  history.push(historyRecord);
  localStorage.setItem('returnedHistory', JSON.stringify(history));

  // 3. Remove from Issued List
  issued.splice(index, 1);
  localStorage.setItem('issuedBooks', JSON.stringify(issued));

  // 4. Refresh to show changes
  window.location.reload();
};

// --- 2. MAIN APP LOGIC ---
document.addEventListener('DOMContentLoaded', () => {

  // --- GLOBAL UTILS ---
  const getBooks = () => JSON.parse(localStorage.getItem('libraryBooks')) || [];
  const saveBooks = (books) => localStorage.setItem('libraryBooks', JSON.stringify(books));

  const getIssued = () => JSON.parse(localStorage.getItem('issuedBooks')) || [];
  const saveIssued = (data) => localStorage.setItem('issuedBooks', JSON.stringify(data));

  const getHistory = () => JSON.parse(localStorage.getItem('returnedHistory')) || [];
  const getUsers = () => JSON.parse(localStorage.getItem('libraryUsers')) || [];

  // --- INITIALIZE DEFAULT DATA ---

  // Initialize Users
  if (!localStorage.getItem('libraryUsers')) {
    const defaultUsers = [
      { id: "101", name: "Jay Hadiya" },
      { id: "102", name: "Jaymin Sarvaiya" },
      { id: "103", name: "Dip Nakum" },
      { id: "104", name: "Varun Katariya" },
      { id: "105", name: "Nikunj Patel" },
      { id: "106", name: "Rahul Sharma" },
      { id: "107", name: "Priya Singh" },
      { id: "108", name: "Amit Verma" }
    ];
    localStorage.setItem('libraryUsers', JSON.stringify(defaultUsers));
  }

  // Initialize Books
  if (!localStorage.getItem('libraryBooks')) {
    const defaultBooks = [
      // --- CLASSICS & FICTION ---
      { id: "9780451524935", title: "1984", author: "George Orwell", desc: "A dystopian social science fiction novel.", price: "320", qty: 15, img: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg" },
      { id: "9780743273565", title: "The Great Gatsby", author: "F. Scott Fitzgerald", desc: "The story of the mysteriously wealthy Jay Gatsby.", price: "350", qty: 12, img: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg" },
      { id: "9780061120084", title: "To Kill a Mockingbird", author: "Harper Lee", desc: "A novel about serious issues of rape and racial inequality.", price: "410", qty: 10, img: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg" },
      { id: "9780316769480", title: "The Catcher in the Rye", author: "J.D. Salinger", desc: "A story about adolescent alienation.", price: "299", qty: 8, img: "https://covers.openlibrary.org/b/isbn/9780316769480-L.jpg" },
      { id: "9780618640157", title: "The Lord of the Rings", author: "J.R.R. Tolkien", desc: "An epic high-fantasy novel.", price: "899", qty: 5, img: "https://covers.openlibrary.org/b/isbn/9780618640157-L.jpg" },
      { id: "9780590353427", title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", desc: "The first novel in the Harry Potter series.", price: "450", qty: 20, img: "https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg" },
      { id: "9780439064873", title: "Harry Potter and the Chamber of Secrets", author: "J.K. Rowling", desc: "The second novel in the Harry Potter series.", price: "450", qty: 18, img: "https://covers.openlibrary.org/b/isbn/9780439064873-L.jpg" },
      { id: "9780141439518", title: "Pride and Prejudice", author: "Jane Austen", desc: "A romantic novel of manners.", price: "250", qty: 14, img: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg" },
      { id: "9780553213119", title: "Moby Dick", author: "Herman Melville", desc: "The quest of Ahab.", price: "300", qty: 6, img: "https://covers.openlibrary.org/b/isbn/9780553213119-L.jpg" },
      { id: "9780140283334", title: "Animal Farm", author: "George Orwell", desc: "A beast fable.", price: "199", qty: 25, img: "https://covers.openlibrary.org/b/isbn/9780140283334-L.jpg" },
      { id: "9780060850524", title: "Brave New World", author: "Aldous Huxley", desc: "A dystopian social science fiction novel.", price: "340", qty: 9, img: "https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg" },

      // --- SELF HELP & NON-FICTION ---
      { id: "9781847941831", title: "Atomic Habits", author: "James Clear", desc: "Build good habits & break bad ones.", price: "550", qty: 30, img: "https://covers.openlibrary.org/b/isbn/9781847941831-L.jpg" },
      { id: "9780143130727", title: "Ikigai", author: "Héctor García", desc: "The Japanese secret to a long and happy life.", price: "450", qty: 22, img: "https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg" },
      { id: "9780062312686", title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", desc: "A counterintuitive approach.", price: "399", qty: 15, img: "https://covers.openlibrary.org/b/isbn/9780062312686-L.jpg" },
      { id: "9781501111105", title: "Think Like a Monk", author: "Jay Shetty", desc: "Train your mind for peace.", price: "499", qty: 10, img: "https://covers.openlibrary.org/b/isbn/9781501111105-L.jpg" },
      { id: "9781476753188", title: "Ugly Love", author: "Colleen Hoover", desc: "A romance novel.", price: "350", qty: 20, img: "https://covers.openlibrary.org/b/isbn/9781476753188-L.jpg" },
      { id: "9781501110368", title: "It Ends with Us", author: "Colleen Hoover", desc: "A romance novel.", price: "400", qty: 25, img: "https://covers.openlibrary.org/b/isbn/9781501110368-L.jpg" },
      { id: "9780735211292", title: "Atomic Habits (Hardcover)", author: "James Clear", desc: "Tiny Changes, Remarkable Results.", price: "600", qty: 10, img: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg" },
      { id: "9780062457714", title: "The Alchemist", author: "Paulo Coelho", desc: "A fable about following your dream.", price: "299", qty: 40, img: "https://covers.openlibrary.org/b/isbn/9780062457714-L.jpg" },

      // --- THRILLERS ---
      { id: "9780307588371", title: "Gone Girl", author: "Gillian Flynn", desc: "A psychological thriller.", price: "380", qty: 12, img: "https://covers.openlibrary.org/b/isbn/9780307588371-L.jpg" },
      { id: "9780307743657", title: "The Shining", author: "Stephen King", desc: "A horror novel.", price: "420", qty: 8, img: "https://covers.openlibrary.org/b/isbn/9780307743657-L.jpg" },
      { id: "9780307277671", title: "The Da Vinci Code", author: "Dan Brown", desc: "A mystery thriller novel.", price: "350", qty: 14, img: "https://covers.openlibrary.org/b/isbn/9780307277671-L.jpg" },

      // --- MORE CLASSICS ---
      { id: "9780141439600", title: "Jane Eyre", author: "Charlotte Brontë", desc: "A novel about the eponymous heroine.", price: "220", qty: 10, img: "https://covers.openlibrary.org/b/isbn/9780141439600-L.jpg" },
      { id: "9780141439471", title: "Frankenstein", author: "Mary Shelley", desc: "Victor Frankenstein and his monster.", price: "200", qty: 12, img: "https://covers.openlibrary.org/b/isbn/9780141439471-L.jpg" },
      { id: "9780140449136", title: "The Odyssey", author: "Homer", desc: "Epic poem about Odysseus.", price: "300", qty: 7, img: "https://covers.openlibrary.org/b/isbn/9780140449136-L.jpg" },
      { id: "9780142437209", title: "East of Eden", author: "John Steinbeck", desc: "Intricate details of two families.", price: "400", qty: 8, img: "https://covers.openlibrary.org/b/isbn/9780142437209-L.jpg" },
      { id: "9780684801469", title: "A Farewell to Arms", author: "Ernest Hemingway", desc: "World War I novel.", price: "320", qty: 9, img: "https://covers.openlibrary.org/b/isbn/9780684801469-L.jpg" },
      { id: "9780385490818", title: "The Handmaid's Tale", author: "Margaret Atwood", desc: "Dystopian novel.", price: "350", qty: 14, img: "https://covers.openlibrary.org/b/isbn/9780385490818-L.jpg" },
      { id: "9781400033416", title: "Beloved", author: "Toni Morrison", desc: "A novel about a former slave's memories.", price: "360", qty: 6, img: "https://covers.openlibrary.org/b/isbn/9781400033416-L.jpg" },
      { id: "9780307269751", title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", desc: "Psychological thriller.", price: "380", qty: 11, img: "https://covers.openlibrary.org/b/isbn/9780307269751-L.jpg" },
      { id: "9780439023481", title: "The Hunger Games", author: "Suzanne Collins", desc: "Dystopian novel.", price: "300", qty: 25, img: "https://covers.openlibrary.org/b/isbn/9780439023481-L.jpg" },
      { id: "9780553103540", title: "A Game of Thrones", author: "George R.R. Martin", desc: "High fantasy.", price: "600", qty: 8, img: "https://covers.openlibrary.org/b/isbn/9780553103540-L.jpg" },
      { id: "9780140177398", title: "Of Mice and Men", author: "John Steinbeck", desc: "Two displaced ranch workers.", price: "200", qty: 15, img: "https://covers.openlibrary.org/b/isbn/9780140177398-L.jpg" },
      { id: "9780743477116", title: "Romeo and Juliet", author: "William Shakespeare", desc: "Tragedy about star-crossed lovers.", price: "150", qty: 20, img: "https://covers.openlibrary.org/b/isbn/9780743477116-L.jpg" },
      { id: "9780553210798", title: "Adventures of Huckleberry Finn", author: "Mark Twain", desc: "Adventures on the Mississippi River.", price: "220", qty: 12, img: "https://covers.openlibrary.org/b/isbn/9780553210798-L.jpg" }
    ];
    localStorage.setItem('libraryBooks', JSON.stringify(defaultBooks));
  }

  // --- DASHBOARD ---
  const dashBooks = document.getElementById('dash-total-books');
  if (dashBooks) {
    dashBooks.innerText = getBooks().length;
    document.getElementById('dash-total-issued').innerText = getIssued().length;
    document.getElementById('dash-total-users').innerText = getUsers().length;
  }

  // --- RETURNED HISTORY ---
  const historyContainer = document.getElementById('returned-books-container');
  if (historyContainer) {
    const history = getHistory();
    if (history.length === 0) {
      historyContainer.innerHTML = '<h2 style="color:white; text-align:center; width:100%;">No returned books history yet.</h2>';
    } else {
      historyContainer.innerHTML = history.reverse().map(record => `
                <div class="card">
                    <div class="img-part">
                        <img src="${record.bookImg}" onerror="this.src='https://via.placeholder.com/150'">
                    </div>
                    <div class="contant-part">
                        <div class="details"><div class="details-question">Book: <span>${record.bookTitle}</span></div></div>
                        <div class="details"><div class="details-question">Student: <span>${record.studentName}</span></div></div>
                        <div class="details"><div class="details-question">Return Date: <span>${record.actualReturnDate}</span></div></div>
                        <div class="status-badge">RETURNED</div>
                    </div>
                </div>
            `).join('');
    }
  }

  // --- AUTHORS LIST ---
  const authorContainer = document.querySelector('.author-list');
  if (authorContainer) {
    const books = getBooks();
    const uniqueAuthors = [...new Set(books.map(book => book.author))];

    if (uniqueAuthors.length === 0) {
      authorContainer.innerHTML = '<h2 style="color:white;">No authors found.</h2>';
    } else {
      authorContainer.innerHTML = uniqueAuthors.map(authorName => {
        const book = books.find(b => b.author === authorName);
        return `
                <div class="author">
                    <div class="img-part">
                        <img src="${book.img}" alt="book-img"/>
                    </div>
                    <div class="author-name">${authorName}</div>
                </div>`;
      }).join('');
    }
  }

  // --- ADD BOOK ---
  const addBookBtn = document.getElementById('add-book-btn');
  if (addBookBtn) {
    addBookBtn.addEventListener('click', () => {
      const title = document.getElementById('Book-name').value;
      const id = document.getElementById('book-id').value;
      const author = document.getElementById('Author-name').value;
      const qty = document.getElementById('Quantity').value;
      const img = document.getElementById('img-url').value || 'https://via.placeholder.com/150';
      const desc = document.getElementById('desc').value;
      const price = document.getElementById('price').value;

      if (!title || !id || !qty) {
        alert("Name, ID, and Quantity are required!");
        return;
      }

      const books = getBooks();
      if (books.some(b => b.id === id)) {
        alert("Book ID already exists!");
        return;
      }

      books.push({ title, id, author, qty: parseInt(qty), img, desc, price });
      saveBooks(books);

      alert('Book Added Successfully!');
      window.location.href = 'book-list.html';
    });
  }

  // --- LIST BOOKS ---
  const bookContainer = document.getElementById('book-card-box');
  if (bookContainer) {
    const books = getBooks();
    if (books.length === 0) {
      bookContainer.innerHTML = '<h2 style="color:white;">No books in library. Add some!</h2>';
    } else {
      bookContainer.innerHTML = books.map(book => `
            <div class="book-card">
                <div class="book-card1">
                    <img src="${book.img}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/150'">
                </div>
                <div class="book-card2">
                    <div class="book-name">${book.title}</div>
                    <div class="book-author">by ${book.author}</div>
                    <div class="book-id">ID: ${book.id}</div>
                    <div class="book-qty">Qty: ${book.qty}</div>
                    <div class="book-desc">${book.desc}</div>
                </div>
            </div>
        `).join('');
    }

    // Search Logic
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.book-card');

        cards.forEach(card => {
          const title = card.querySelector('.book-name').innerText.toLowerCase();
          const idText = card.querySelector('.book-id').innerText.toLowerCase();

          if (title.includes(term) || idText.includes(term)) {
            card.style.display = "flex";
          } else {
            card.style.display = "none";
          }
        });
      });
    }
  }

  // --- ISSUE BOOK ---
  const issueBtn = document.getElementById('Issue-book-btn');
  if (issueBtn) {
    issueBtn.addEventListener('click', () => {
      const studentName = document.getElementById('student-name').value;
      const studentId = document.getElementById('student-id').value;
      const bookId = document.getElementById('book-id').value;
      const issueDate = document.getElementById('issue-date').value;
      const returnDate = document.getElementById('return-date').value;

      if (!studentName || !bookId || !issueDate) {
        alert("Please fill all details");
        return;
      }

      const books = getBooks();
      const bookIndex = books.findIndex(b => b.id === bookId);

      if (bookIndex === -1) {
        alert("Book ID not found!");
        return;
      }
      if (books[bookIndex].qty < 1) {
        alert("Book is out of stock!");
        return;
      }

      books[bookIndex].qty -= 1;
      saveBooks(books);

      const issued = getIssued();
      issued.push({
        studentName, studentId, bookId, issueDate, returnDate,
        bookTitle: books[bookIndex].title,
        bookImg: books[bookIndex].img
      });
      saveIssued(issued);

      alert("Book Issued Successfully!");
      window.location.href = 'index.html';
    });
  }

  // --- RENDER ISSUED BOOKS (With Return Button) ---
  const issuedContainer = document.getElementById('issued-books-container');
  if (issuedContainer) {
    const issued = getIssued();

    if (issued.length === 0) {
      issuedContainer.innerHTML = '<h2 style="color:white; width:100%; text-align:center; padding-top:20px;">No Books Currently Issued</h2>';
    } else {
     
      issuedContainer.innerHTML = issued.map((record, index) => `
            <div class="card">
                <div class="img-part">
                    <img src="${record.bookImg}" onerror="this.src='https://via.placeholder.com/150'">
                </div>
                <div class="contant-part">
                    <div class="details"><div class="details-question">Book ID: <span>${record.bookId}</span></div></div>
                    <div class="details"><div class="details-question">Title: <span>${record.bookTitle}</span></div></div>
                    <div class="details"><div class="details-question">Student: <span>${record.studentName}</span></div></div>
                    <div class="details"><div class="details-question">Return Date: <span>${record.returnDate}</span></div></div>
                    <div class="details-btn">
                        <button onclick="window.returnBook(${index})" class="btn" style="width:100%">Return</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
  }

  // --- REGISTERED USERS ---
  const userContainer = document.querySelector('.student-name-list');
  if (userContainer) {
    const users = getUsers();
    userContainer.innerHTML = users.map(user => `
            <div class="student-name">
                <i class="fa-solid fa-user" style="color: blue; margin-right: 10px;"></i>
                <span><strong>ID:</strong> ${user.id}</span>
                <span style="margin-left: 10px;"><strong>Name:</strong> ${user.name}</span>
            </div>
        `).join('');
  }
});