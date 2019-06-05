const express = require('express');
const router = express.Router();

router.get('/iCheckupStart', (req, res) => {
	res.render('quiz/iCheckup/iCheckupStart')
});

router.get('/iCheckupQn', (req, res) => {
	res.render('quiz/iCheckup/iCheckupQn')
});

router.get('/iCheckupComplete', (req, res) => {
	res.render('quiz/iCheckup/iCheckupComplete')
});

router.get('/checkupStart', (req, res) => {
	res.render('quiz/checkup/checkupStart')
});

router.get('/checkupQn', (req, res) => {
	res.render('quiz/checkup/checkupQn')
});

router.get('/checkupReport', (req, res) => {
	res.render('quiz/checkup/checkupReport')
});

router.get('/anxietyHelp', (req, res) => {
	res.render('quiz/checkup/anxietyHelp')
});

router.get('/graphDisplay', (req, res) => {
	res.render('quiz/checkup/graphDisplay')
});

router.get('/quiz', (req, res) => {
	res.render('quiz/quizzes/quiz')
});

router.get('/quizStart', (req, res) => {
	res.render('quiz/quizzes/quizStart')
});

router.get('/quizQn', (req, res) => {
	res.render('quiz/quizzes/quizQn')
});

router.get('/quizComplete', (req, res) => {
	res.render('quiz/quizzes/quizComplete')
});

router.get('/quizCorrectAnswer', (req, res) => {
	res.render('quiz/quizzes/quizCorrectAnswer')
});

router.get('/quizWrongAnswer', (req, res) => {
	res.render('quiz/quizzes/quizWrongAnswer')
});

router.get('/addQuiz', (req, res) => {
	res.render('quiz/admin/addQuiz')
});

router.get('/editQuiz', (req, res) => {
	res.render('quiz/admin/editQuiz')
});

router.get('/adminQuizList', (req, res) => {
	res.render('quiz/admin/adminQuizList')
});

module.exports = router;