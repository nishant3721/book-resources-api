const express = require("express")
const router = express.Router()
const Book = require("../models/Book")
const fetchUser = require("../middleware/fetchUser")

// ROUTE 1 : - Get book by _id : GET "/api/book/getBook/:id"  -> login required
router.get('/getBook/:id', fetchUser, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        res.json(book)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Something went wrong')
    }
})

// ROUTE 2 : - Fetching all books : GET "/api/book/getBooks"  -> login required
router.get('/getBooks', fetchUser, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user.id })
        res.json(books)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Something went wrong')
    }
})

// ROUTE 3 : - Add book : POST "/api/book/addBook"  -> login required
router.post('/addBook', fetchUser, async (req, res) => {
    const { name, imageUrl, author, pages, price } = req.body
    // Check if book already exists
    const bookInfo = await Book.findOne({ name })
    if (bookInfo) {
        return res.status(401).json({ error: "book already exists." })
    }
    try {
        const book = await Book.create({
            user: req.user.id,
            name, imageUrl, author, pages, price
        })
        res.json(book)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Something went wrong')
    }
})

// ROUTE 4 : -  Update book : POST "/api/book/updateBook/:id"  -> login required
router.put('/updateBook/:id', fetchUser, async (req, res) => {
    const { name, imageUrl, author, pages, price } = req.body
    try {
        const newBook = {}
        if (name) {
            newBook.name = name
        }

        if (imageUrl) {
            newBook.imageUrl = imageUrl
        }

        if (author) {
            newBook.author = author
        }

        if (pages) {
            newBook.pages = pages
        }

        if (price) {
            newBook.price = price
        }
        // Find the book that is going to be updated
        let book = await Book.findById(req.params.id)
        // Check if the book is available or not
        if (!book) {
            return res.status(404).send('Book Not found')
        }
        // Check the particular book belong to the loggedIn user or not
        if (book.user.toString() !== req.user.id) {
            return res.status(401).send('Unauthorized user')
        }
        // Find the book and update
        book = await Book.findByIdAndUpdate(
            req.params.id,
            { $set: newBook },
            { new: true }
        )
        res.json(book)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Something went wrong')
    }
})

// ROUTE 5 : -  Delete book : POST "/api/book/deleteBook/:id"  -> login required
router.delete('/deleteBook/:id', fetchUser, async (req, res) => {
    try {
        // Find the book that is going to be deleted
        let book = await Book.findById(req.params.id)
        // Check if that particular book is available or not
        if (!book) {
            return res.status(404).send('Book Not found')
        }
        // Check the particular book belong to the loggedIn user or not
        if (book.user.toString() !== req.user.id) {
            return res.status(401).send('Unauthorized user')
        }

        book = await Book.findByIdAndDelete(req.params.id)
        res.json({ success: true, message: 'Book has been deleted' })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Something went wrong')
    }
})


module.exports = router