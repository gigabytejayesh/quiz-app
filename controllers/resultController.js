const express = require('express');
let router = express.Router();

const { getResultByIds, addResult, updateResult } = require("../services/resultService")
const { getQuizById } = require("../services/quizService");

router.post('/submit', (req, res) => {
    try {
        const { quiz_id, question_id, selected_option, user_id } = req.body;
        const quiz = getQuizById(quiz_id, true)
        if (!quiz) {
            return res.status(404).json({ error: 'No Quiz found' });
        }

        let question = quiz.questions.filter(item => item.id === question_id);
        if (question.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }
        const is_correct = question[0].correct_option === selected_option;
        let result = getResultByIds(quiz_id, user_id)
        if (!result) {
            let result_to_create = { quiz_id, user_id, score: 0, answers: [{ question_id, selected_option, is_correct }] }
            addResult(result_to_create)
        } else {
            result.answers = result.answers.map(item => {
                if (item.question_id === question_id) {
                    item = { question_id, selected_option, is_correct }
                }
                return item;
            })
            updateResult(quiz_id, user_id, result)
        }

        if (is_correct) {
            res.status(200).json({ message: 'Correct answer!', correct: is_correct });
        } else {
            res.status(200).json({ message: 'Incorrect answer!', correct: is_correct, correct_option: question.correct_option });
        }
    } catch (err) {
        console.error(err)
        res.status(500).send(`An error occurred: ${err.message}`)
    }
});

router.get('/:quiz_id/:user_id', (req, res) => {
    try {
        const { quiz_id, user_id } = req.params;
        const result = getResultByIds(quiz_id, user_id);
        if (!result) {
            return res.status(404).json({ error: 'Result not found' });
        }
        res.status(200).json({ score, answers: result.answers });
    } catch (err) {
        console.error(err)
        res.status(500).send(`An error occurred: ${err.message}`)
    }
});
module.exports = router;