import express from 'express';
const router = express.Router();

import tCon from '../../controllers/thoughtController.js';

router
    .route('/')
    .get(tCon.getAllThoughts)
    .post(tCon.createThought);

router
    .route('/:thoughtId')
    .get(tCon.getThoughtById)
    .put(tCon.updateThought)
    .delete(tCon.deleteThought);

router
    .route('/:thoughtId/reactions')
    .post(tCon.addReaction);

router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(tCon.removeReaction);

export default router;