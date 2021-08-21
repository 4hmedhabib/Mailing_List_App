const express = require('express');
const app = express();
const path = require('path');
const faker = require('faker');
const mysql = require('mysql');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'joinus'
});

connection.connect(function(err) {
	if (err) throw err.message;
	console.log('Connected!');
});

app.get('/', (req, res) => {
	const q = 'SELECT COUNT(*) as total FROM users';
	connection.query(q, function(error, results, fields) {
		if (error) throw error.sqlMessage;
		const total = results[0].total;
		res.render('home', { total });
	});
});

app.post('/register', (req, res) => {
	const person = {
		email: req.body.email
	};

	const insertUser = 'INSERT INTO users SET ?';

	connection.query(insertUser, person, (err, result) => {
		if (err) throw err.sqlMessage;
		res.redirect('/');
	});
});

app.listen(5000, () => {
	console.log('SERVER RUNNING PORT 5000');
});
