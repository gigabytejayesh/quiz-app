let Result = require('../models/results')
let { getQuizById } = require("../services/quizService")

let getAllResult = () => {
    return Result.map(r => {
        return {
            "quiz_id": r.quiz_id,
            "user_id": r.user_id,
            "score": calculateScore(r.quiz_id, r.answers),
            "answers": r.answers
        };
    })
}

let getResultByIds = (quiz_id, user_id) => {
    let result = getAllResult()
    result = result.filter(r => {
        if (quiz_id === r.quiz_id && user_id === r.user_id) {
            return r
        }
    })
    return result.length !== 0 ? result[0] : {}
}

let calculateScore = (quiz_id, answers) => {
    let { questions } = getQuizById(quiz_id, true)
    score = 0
    answers.map(item => {
        let question = questions.find(q => q.id === item.question_id);
        if (question) {
            if (item.selected_option === question.correct_option) {
                item.is_correct = true
                score++
            } else {
                item.is_correct = false
            }
        }
    })
    return score
}

let addResult = (resultData) => {
    resultData.score = calculateScore(resultData.quiz_id, resultData.answers)
    Result.push(resultData)
    return resultData
}

let updateResult = (quiz_id, user_id, resultData) => {
    resultData.score = calculateScore(resultData.quiz_id, resultData.answers)
    Result = getAllResult().map(r => {
        if (quiz_id === r.quiz_id && user_id === r.user_id) {
            r = resultData
        }
        return r
    })
}

module.exports = { getResultByIds, addResult, updateResult }