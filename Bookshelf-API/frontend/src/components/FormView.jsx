import React, { useState } from 'react';
import $ from 'jquery';

import '../stylesheets/FormView.css';

const FormView = (props) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(1);
  const [search, setSearch] = useState('');


  const submitBook = (event) => {
    event.preventDefault();
    $.ajax({
      url: '/books',
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        title: title,
        author: author,
        rating: rating,
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        document.getElementById("add-book-form").reset();
        return;
      },
      error: (error) => {
        alert('Unable to add book. Please try your request again')
        return;
      }
    })
  }

  const handleSearch = (event) => {
    event.preventDefault();
    props.searchBooks(search);
  }

  const handleChange = (event) => {
    event.target.name === 'title' ? 
      setTitle(event.target.value) : event.target.name === 'author' ? 
      setAuthor(event.target.value) : event.target.name === 'rating' ? 
      setRating(event.target.value) : setSearch(event.target.value);
  }

  return (
    <div id="form-view">
      <div className="search">
        <h2>Search</h2>
        <form className="FormView" id="search-form" onSubmit={handleSearch}>
          <input type="text" name="search" onChange={handleChange} />
          <input type="submit" className="button" value="Search" />
        </form>
      </div>
      <h2>Add a New Book</h2>
      <form className="FormView" id="add-book-form" onSubmit={submitBook}>
        <label>
          Title
          <input type="text" name="title" onChange={handleChange} />
        </label>
        <label>
          Author
          <input type="text" name="author" onChange={handleChange} />
        </label>
        <label>
          Rating
          <select name="rating" onChange={handleChange}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <input type="submit" className="button" value="Submit" />
      </form>
    </div>
  );
}

export default FormView;
