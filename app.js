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

const person = {
	email: faker.internet.email(),
	created_at: faker.date.past()
};

connection.connect(function(err) {
	if (err) throw err.message;
	console.log('Connected!');
});

const allUsers = 'SELECT * FROM users';
const firstUser =
	'SELECT monthname(created_at) as month, count(*) as total FROM users group by month order by total desc';
const createUser = 'INSERT INTO users SET ? ';
const yahoUsers = 'SELECT  count(*) as Provider from users  group by email like "%@yahoo.com" ';

app.get('/', (req, res) => {
	connection.query(yahoUsers, function(error, result, fields) {
		if (error) throw error.sqlMessage;
		console.log(result.total);
		res.render('home', { result });
	});
});

app.get('/create', (req, res) => {
	connection.query(createUser, person, (err, res, fields) => {
		if (err) {
			throw err.sqlMessage;
		}
	});

	res.redirect('/');
});

app.listen(5000, () => {
	console.log('SERVER RUNNING PORT 5000');
});
