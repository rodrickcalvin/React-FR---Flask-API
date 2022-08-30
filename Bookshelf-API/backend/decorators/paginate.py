BOOKS_PER_SHELF = 9

def paginate_books(request, selection):
    page = request.args.get("page", 1, type=int)
    start = (page - 1) * BOOKS_PER_SHELF
    end = start + BOOKS_PER_SHELF

    formatted_books = [book.format() for book in selection]
    current_books = formatted_books[start:end]

    return current_books