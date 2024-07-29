const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');
var cors = require('cors')

const app = express();
app.use(cors())
app.use(express.json());

let quizController = require('./controllers/quizController')
let resultController = require('./controllers/resultController')

app.use('/api/quiz', quizController);
app.use('/api/results', resultController);
app.listen(3000, () => {
    console.log('Server is started at 3000 port');
})

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Quiz API',
            version: '1.0.0'
        },
        host: 'localhost:3000/',
    },
    apis: ['./docs/**/*.yaml']

}
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

const root = path.join(__dirname, 'dist');

app.get('*', function (req, res) {
    fs.stat(root + req.path, function (err) {
        if (err) {
            res.sendFile("index.html", { root });
        } else {
            res.sendFile(req.path, { root });
        }
    })
});