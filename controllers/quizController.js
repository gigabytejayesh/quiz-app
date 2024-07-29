const express = require('express');
let router = express.Router();

let { getQuizById, getAllQuiz, addQuiz } = require('../services/quizService');

router.get('/', (req, res) => {
    let data = {
        totalCount: 0,
        result: []
    };
    try {
        data.result = getAllQuiz()
        data.totalCount = data.result.length
        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send(`An error occurred: ${err.message}`);
    }
});

router.post('/', (req, res) => {
    try {
        const { questions } = req.body;
        if (questions.some(q => q.options.length !== 4)) {
            return res.status(400).json({ error: 'Invalid Request: Each question must have 4 options' });
        }
        let newQuiz = addQuiz(req.body)
        res.send(newQuiz)
    } catch (err) {
        console.error(err)
        res.status(500).send(`An error occurred: ${err.message}`)
    }
})

router.get('/:id', async (req, res) => {
    try {
        let quizId = parseInt(req.params.id)
        let quiz = getQuizById(quizId)
        return res.send(quiz)
    } catch (err) {
        res.status(500).send(`An error occurred: ${err.message}`)
    }
})

module.exports = router;