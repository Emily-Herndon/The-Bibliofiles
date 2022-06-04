# The Bibliofiles
---

## Are you an avid reader? Do you have trouble keeping track of the books you've read? Find a book you want to read later and need a central place to write it down? Then *The Bibliofiles* is for you!

---

## API
### [Open Library](https://openlibrary.org/developers/api)


### [Search Lord of the Rings](http://openlibrary.org/search.json?title=the+lord+of+the+rings)

---

## ERD

### ERD
![ERD](/images/ERD.png)

---

## RESTful Routing Chart

| VERB | URL pattern | Action \(CRUD\) | Description |
| :--- | :--- | :--- | :--- |
| GET | / | Show \(Read\) | render login form |
| POST | / | Show \(Read\) | autheticates user from form|
| GET | /users/new | New \(Read\) | render signup form |
| POST | /users/new |Create \(Create\) | create new user from form |
| GET | /users/logout | Show \(Read\) | remove cookies and redirect to home |
| GET | /users/profile | Show \(Read\) | shows user profile |
| POST | /users/profile | Create \(Create\) | saves a book to users profile from details page |
| DELETE | /users/profile | Destroy \(Delete\) | deletes the specific book from the user's saved books |
| GET | /books/results | Show \(Read\) | renders results from search |
| GET | /books/details/works/:id | Show \(Read\) | renders detailed info on specific book & allows it to be favorited|
| POST | /books/details | Create \(Create\) | allows users to create a new tag and apply to specific book|
| PUT | /books/details | Update \(Update\) | updates the user's tags on a specific book |

---

## User View Wireframes

### Sign Up
![signup](./images/Sign-Up%401x.png)

### Login
![login](./images/Login%401x.png)

### User Profile
![user profile](./images/User-Profile%401x.png)

### Search Results
![search results](./images/Search%20Results%401x.png)

### Book Details
![book details](./images/Book%20Details%401x.png)

### Save Book
![save book](./images/Save%20Book%20Modal%401x.png)

---

## User Stories
- As a user I want to search books by title
- As a user I want to save books for later
- As a user I want to see detailed info on the specific books
- As a user I want to keep track of which books I've read
- As a user I want to keep track of books I want to read
- As a user I want to tag books with my own notes

---

## MVP
- [X] Able to create a new user
- [X] User info encrypted
- [X] Password Hashed
- [X] Error messages for incorrect/invalid login info
- [X] Error messages for incorrect/invalid sign up info
- [X] User able to search books by title
- [X] User able to save books
- [X] User able to mark saved books as read/not read
- [X] User able to attach tags to saved books


---

## Stretch
- [X] Dark Mode 🌗
- [X] Edit tag form is modal
- [ ] Users able to create public comments on books
- [ ] Users able to publicly rate books
- [ ] Users able to see how many saves a book has
