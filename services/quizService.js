let Quiz = require('../models/quiz')

let getQuizById = (id, includeOption=false) => {
    let quiz = getAllQuiz(includeOption).filter(item => item.id === id)
    return quiz.length !== 0 ? quiz[0] : {} 
}

let getAllQuiz = (includeOption= false) => {
    return Quiz.map(q => {
        return {
            id: q.id,
            title: q.title,
            questions: q.questions.map(question => {
                if(includeOption){
                    return question
                }
                const { correct_option, ...rest } = question;
                return rest;
            })
        };
    })
}

let addQuiz = (quizData) =>{
    let {title, questions} = quizData;
    for(let i=0; i < questions.length ; i++){
        questions[i]["id"] = i+1;
    }
    let id = getNewQuizId()
    let newQuiz = {id, title, questions}
    Quiz.push(newQuiz)
    return newQuiz
}

let getNewQuizId = () => {
    if (Quiz.length === 0) {
        return 1;
    }
    const maxId = Math.max(...Quiz.map(q => q.id));
    return maxId + 1;
}

module.exports = { getQuizById, getAllQuiz, addQuiz }