const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    imageUrl: { type: String, },
    author: { type: String, required: true },
    pages: { type: String, },
    price: { type: Number, },
}, { timestamps: true })

const Book = mongoose.model('books', bookSchema)
Book.createIndexes()
module.exports = Book