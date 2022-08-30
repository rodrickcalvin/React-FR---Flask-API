import React, { useEffect, useState } from "react";
import $ from "jquery";

import "./stylesheets/App.css";
import FormView from "./components/FormView";
import Book from "./components/Book";


const App = () => {
  const [page, setPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [books, setBooks] = useState([]);

  const getBooks = () => {
    $.ajax({
      url: `/books?page=${page}`,
      type: "GET",
      success: (result) => {
        setTotalBooks(result.total_books);
        setBooks(result.books);
        return;
      },
      error: (error) => {
        alert("Unable to load books. Please try your request again");
        return;
      },
    });
  };

  const deleteBook = (id) => {
    if (window.confirm("Are you sure you want to delete the book?")) {
      $.ajax({
        url: `/books/${id}`, //TODO: update request URL
        type: "DELETE",
        success: (result) => {
          getBooks();
        },
        error: (error) => {
          alert("Unable to delete the book.");
          return;
        },
      });
    }
  };

  const changeRating = (id, rating) => {
    let booksList = [...books];
    let targetBook = booksList.find((book) => book.id === id);

    $.ajax({
      url: `/books/${id}`,
      type: "PATCH",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({ rating: rating }),
      success: (result) => {
        targetBook.rating = rating;
        setBooks(booksList);
      },
      error: (error) => {
        alert("Unable to update the rating.");
        return;
      },
    });
  };

  const searchBooks = (search) => {
    $.ajax({
      url: "/books",
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({ search: search }),
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      success: (result) => {
        setTotalBooks(result.total_books)
        setBooks(result.books)
        setPage(1)

        document.getElementById("search-form").reset();
        return;
      },
      error: (error) => {
        alert("Unable to complete search. Please try your request again");
        return;
      },
    });
  };

  useEffect(() => {
    getBooks();
  },[page])

  const selectPage = (num) => {
    setPage(num)
    getBooks()
  };

  const createPagination = () => {
    let pageNumbers = [];
    let maxPage = Math.ceil(totalBooks / 9);
    for (let i = 1; i <= maxPage; i++) {
      pageNumbers.push(
        <div
          key={i}
          className={`page-num ${i === page ? "active" : ""}`}
          onClick={() => {
            selectPage(i);
          }}
        >
          {i}
        </div>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="App">
      <div id="main-view">
        <div className="bookshelf-container">
          {books.map((book) => (
            <Book
              key={book.id}
              deleteBook={deleteBook}
              changeRating={changeRating}
              {...book}
            />
          ))}
        </div>
        <div className="pagination-menu">{createPagination}</div>
      </div>
      <FormView searchBooks={searchBooks} />
    </div>
  );
};

export default App;
