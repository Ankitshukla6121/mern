import express from 'express';
import mongoose from 'mongoose';
import { Book } from '../models/bookModels.js';

const router = express.Router();

// Middleware for validating MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid book ID format.' });
  }
  next();
};

// Create a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, publishYear } = req.body;

    if (!title || !author || !publishYear) {
      return res.status(400).send({
        message: 'Please provide all required fields: title, author, publishYear.',
      });
    }

    const newBook = { title, author, publishYear };
    const book = await Book.create(newBook);
    return res.status(201).send(book);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({});
    return res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Get a book by ID
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).send({ message: 'Book not found.' });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Update a book by ID
router.put('/:id', validateObjectId, async (req, res) => {
  try {
    const { title, author, publishYear } = req.body;

    if (!title || !author || !publishYear) {
      return res.status(400).send({
        message: 'Please provide all required fields: title, author, publishYear.',
      });
    }

    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, publishYear },
      { new: true } // Return the updated document
    );

    if (!updatedBook) {
      return res.status(404).send({ message: 'Book not found.' });
    }

    return res.status(200).send({
      message: 'Book updated successfully.',
      data: updatedBook,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Delete a book by ID
router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).send({ message: 'Book not found.' });
    }

    return res.status(200).send({ message: 'Book deleted successfully.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;
