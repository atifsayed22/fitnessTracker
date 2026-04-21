import express from 'express';
import {
  getExamples,
  getExampleById,
  createExample,
  updateExample,
  deleteExample
} from '../controllers/exampleController.js';

const router = express.Router();

// GET all examples
router.get('/', getExamples);

// GET a single example
router.get('/:id', getExampleById);

// POST a new example
router.post('/', createExample);

// PUT (update) an example
router.put('/:id', updateExample);

// DELETE an example
router.delete('/:id', deleteExample);

export default router;