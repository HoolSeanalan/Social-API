import { Thought, User } from '../models/index.js';

const thoughtController = {
    getAllThoughts( { params }, res) {
        Thought.findAll({
            where: {
                userId: params.userId
            }
        })
            .populate({ path: 'reactions', select: '-__v' })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            }
        );
    },

    getThoughtById({ params }, res) {
        Thought.findOne({
            where: {
                _id: params.thoughtId
            }
        })
            .populate({ path: 'reactions', select: '-__v' })
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            }
        );
    },

    createThought({ body, params }, res) {
        Thought.create(body)
            .then(dbThoughtData => {
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { thoughts: dbThoughtData._id } },
                    { new: true });
            })
            .then(dbUserData => {
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            }
        );
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            body,
            { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then(dbThoughtData => {
                return User.findOneAndUpdate(
                    { _id: dbThoughtData.userId },
                    { $pull: { thoughts: dbThoughtData._id } },
                    { new: true });
            }
            )
            .then(dbUserData => {
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body.reactionId } },
            { new: true })
            .populate({ path: 'reactions', select: '-__v' })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id' });
                    return;
                }
                res.json(dbThoughtData);
            }
            )
            .catch(err => res.json(err));
    },

    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: params.reactionId } },
            { new: true })
            .populate({ path: 'reactions', select: '-__v' })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id' });
                    return;
                }
                res.json(dbThoughtData);
            }
            )
            .catch(err => res.json(err));
    }
};

export default thoughtController;